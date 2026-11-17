import request from "supertest";
import { app, asUser, database, mockCreateSupabaseClient, mockSupabase } from "./test-utils";

const protectedEndpoints = [
  ["get", "/api/applications"], ["get", "/api/applications/a-1"],
  ["get", "/api/applications/category/engineering"], ["post", "/api/applications"],
  ["put", "/api/applications/a-1"], ["delete", "/api/applications/a-1"],
  ["get", "/api/profiles"], ["put", "/api/profiles"], ["delete", "/api/profiles"],
  ["get", "/api/resumes"], ["get", "/api/resumes/r-a"],
  ["post", "/api/resumes"], ["put", "/api/resumes/r-a"], ["delete", "/api/resumes/r-a"],
] as const;

describe("authentication middleware", () => {
  beforeEach(() => {
    database.applications.push({ id: "a-1", user_id: "user-a", company: "Acme", role: "Engineer" });
    database.profiles.push({ id: "user-a", name: "User A" });
    database.resumes.push({ id: "r-a", user_id: "user-a", name: "Private", content: {} });
  });

  describe.each([
    ["missing", undefined, "Missing token"],
    ["invalid", "invalid-token", "Invalid token"],
  ] as const)("%s cookie", (_label, token, error) => {
    it.each(protectedEndpoints)("blocks %s %s without reading or mutating data", async (method, url) => {
      const before = structuredClone(database);
      const pending = request(app)[method](url).send({ company: "Changed", role: "Engineer", name: "Changed" });
      if (token) pending.set(asUser(token));
      const response = await pending;
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error });
      expect(mockSupabase.from).not.toHaveBeenCalled();
      expect(database).toEqual(before);
      if (!token) expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
    });
  });

  it("rejects an empty cookie without calling Supabase", async () => {
    const response = await request(app).get("/api/profiles").set(asUser(""));
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Missing token" });
    expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("requires the implemented cookie authentication even with a Bearer header", async () => {
    const response = await request(app).get("/api/profiles").set("Authorization", "Bearer token-user-a");
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Missing token" });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("attaches the identity returned by Supabase to the request", async () => {
    database.profiles.push({ id: "user-b", name: "User B" });
    const response = await request(app).get("/api/profiles").set(asUser("token-user-b"));
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: "user-b", name: "User B" });
    expect(mockSupabase.auth.getUser).toHaveBeenCalledWith("token-user-b");
    expect(mockCreateSupabaseClient).toHaveBeenCalledWith("token-user-b");
  });

  it("rejects a successful token lookup that has no user", async () => {
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    const response = await request(app).get("/api/profiles").set(asUser());
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid token" });
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("rejects auth service errors even if a user is included", async () => {
    const before = structuredClone(database);
    mockSupabase.auth.getUser.mockResolvedValueOnce({ data: { user: { id: "user-a" } }, error: { message: "Auth unavailable" } });
    const response = await request(app).put("/api/profiles").set(asUser()).send({ name: "Changed" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid token" });
    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(database).toEqual(before);
  });

  it("passes rejected auth lookups to Express error handling without hanging or mutating data", async () => {
    const before = structuredClone(database);
    mockSupabase.auth.getUser.mockRejectedValueOnce(new Error("Auth transport failed"));
    const response = await request(app).put("/api/profiles").set(asUser()).send({ name: "Changed" });
    expect(response.status).toBe(500);
    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(database).toEqual(before);
  });
});

describe("registration", () => {
  it("forwards credentials and full name metadata and confirms registration", async () => {
    const response = await request(app).post("/api/auth/register")
      .send({ email: "new@example.com", password: "secret123", fullName: "New User" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "User registered successfully" });
    expect(mockSupabase.auth.signUp).toHaveBeenCalledWith({
      email: "new@example.com", password: "secret123", options: { data: { full_name: "New User" } },
    });
    expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
  });

  it.each([
    [{ email: "invalid", password: "short" }, "Invalid credentials"],
    [{ email: "used@example.com", password: "secret123" }, "User already registered"],
  ])("returns the auth provider's registration error for %j", async (body, error) => {
    mockSupabase.auth.signUp.mockResolvedValueOnce({ error: { message: error } });
    const response = await request(app).post("/api/auth/register").send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error });
    expect(mockSupabase.auth.signUp).toHaveBeenCalledTimes(1);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("rejects missing credentials before calling Supabase", async () => {
    await request(app).post("/api/auth/register").send({}).expect(400);
    expect(mockSupabase.auth.signUp).not.toHaveBeenCalled();
  });
});

describe("login", () => {
  it("sets a private, HTTP-only cookie without returning a token in the body", async () => {
    const body = { email: "a@example.com", password: "secret123" };
    const response = await request(app).post("/api/auth/login").send(body);
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(response.headers["cache-control"]).toBe("private, no-store");
    expect(response.headers["set-cookie"]).toEqual([
      expect.stringMatching(/^adaptyn-session=token-user-a; Max-Age=900; Path=\/; Expires=.*; HttpOnly; SameSite=Lax$/),
    ]);
    expect(mockSupabase.auth.signInWithPassword).toHaveBeenCalledWith(body);
    expect(mockSupabase.auth.getUser).not.toHaveBeenCalled();
  });

  it("returns the provider's credential error", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({ data: { session: null }, error: { message: "Invalid credentials" } });
    const response = await request(app).post("/api/auth/login").send({ email: "a@example.com", password: "wrong" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Invalid credentials" });
    expect(response.headers["set-cookie"]).toBeUndefined();
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it.each([{}, { email: "a@example.com" }])("rejects incomplete credentials for %j", async (body) => {
    await request(app).post("/api/auth/login").send(body).expect(401);
    expect(mockSupabase.auth.signInWithPassword).not.toHaveBeenCalled();
  });

  it("returns a fallback when the provider supplies neither a session nor an error", async () => {
    mockSupabase.auth.signInWithPassword.mockResolvedValueOnce({
      data: { session: null }, error: null,
    });
    const response = await request(app).post("/api/auth/login").send({ email: "a@example.com", password: "secret123" });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ error: "Login failed" });
  });
});

describe("dashboard session and logout", () => {
  it("validates the dashboard session before issuing a success response", async () => {
    await request(app).get("/api/auth/session").set(asUser("forged")).expect(401);
    await request(app).get("/api/auth/session").set(asUser()).expect(204);
    expect(mockSupabase.from).not.toHaveBeenCalled();
  });

  it("clears the browser cookie and signs out the current Supabase session", async () => {
    const response = await request(app).post("/api/auth/logout").set(asUser()).expect(303);
    expect(response.headers.location).toBe("/login");
    expect(response.headers["set-cookie"]).toEqual([
      expect.stringMatching(/^adaptyn-session=; Path=\/; Expires=Thu, 01 Jan 1970.*; HttpOnly; SameSite=Lax$/),
    ]);
    expect(mockSupabase.auth.admin.signOut).toHaveBeenCalledWith("token-user-a", "local");
  });

  it("blocks cross-origin browser writes before touching the session", async () => {
    await request(app).post("/api/auth/logout").set(asUser())
      .set("Origin", "https://untrusted.example").expect(403);
    expect(mockSupabase.auth.admin.signOut).not.toHaveBeenCalled();
  });
});
