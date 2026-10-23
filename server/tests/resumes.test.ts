import request from "supertest";
import { app, asUser, database, databaseErrors, mockSupabase } from "./test-utils";

const ownResume = { id: "r-a", user_id: "user-a", name: "Engineering", content: { skills: ["TypeScript"] } };
const otherResume = { id: "r-b", user_id: "user-b", name: "Private", content: { skills: ["SQL"] } };

describe("resume database API", () => {
  it("creates and persists resume content with the authenticated owner", async () => {
    const body = {
      name: "Engineering", target_role: "Engineer", content: { skills: ["TypeScript"] },
      pdf_url: "https://example.com/resume.pdf", status: "draft",
    };
    const response = await request(app).post("/api/resumes").set(asUser())
      .send({ ...body, user_id: "user-b", id: "hijack" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "resumes-1", user_id: "user-a", ...body });
    expect(database.resumes).toEqual([response.body]);
  });

  it("accepts a name and content without optional API fields", async () => {
    const response = await request(app).post("/api/resumes").set(asUser())
      .send({ name: "Minimal", content: {} });
    expect(response.status).toBe(201);
    expect(response.body).toMatchObject({ user_id: "user-a", name: "Minimal", content: {} });
    expect(database.resumes).toEqual([response.body]);
  });

  it.each([{}, { target_role: "Engineer" }, { name: "" }, { name: null }, { name: false }])(
    "rejects missing or falsy names: %j", async (body) => {
      const response = await request(app).post("/api/resumes").set(asUser()).send(body);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Name is required" });
      expect(mockSupabase.from).not.toHaveBeenCalled();
      expect(database.resumes).toEqual([]);
    },
  );

  it("lists only owned resumes", async () => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const response = await request(app).get("/api/resumes").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([ownResume]);
  });

  it("returns an empty list for a user with no resumes", async () => {
    const response = await request(app).get("/api/resumes").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("retrieves an owned resume", async () => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const response = await request(app).get("/api/resumes/r-a").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(ownResume);
  });

  it.each(["missing", "r-b"])("hides missing or foreign resume %s", async (id) => {
    database.resumes.push(structuredClone(otherResume));
    const response = await request(app).get(`/api/resumes/${id}`).set(asUser());
    expect(response.status).toBe(404);
    // Existing response wording is preserved.
    expect(response.body).toEqual({ error: "Application not found" });
    expect(database.resumes).toEqual([otherResume]);
  });

  it("updates supported database fields without changing ownership", async () => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const updates = { name: "Updated", target_role: "Senior Engineer", content: { skills: ["Go"] },
      pdf_url: "https://example.com/new.pdf", status: "active" };
    const response = await request(app).put("/api/resumes/r-a").set(asUser())
      .send({ ...updates, user_id: "user-b", id: "hijack", unknown: "ignored" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...ownResume, ...updates });
    expect(database.resumes).toEqual([response.body, otherResume]);
  });

  it("updates a stored source string as an opaque database field", async () => {
    database.resumes.push(structuredClone(ownResume));
    const response = await request(app).put("/api/resumes/r-a").set(asUser())
      .send({ latex_source: "opaque stored text" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...ownResume, latex_source: "opaque stored text" });
    expect(database.resumes).toEqual([response.body]);
  });

  it.each([{}, { name: "", target_role: null, content: null, latex_source: "", pdf_url: false, status: "" }])(
    "leaves fields unchanged for empty or falsy updates: %j", async (body) => {
      database.resumes.push(structuredClone(ownResume));
      const response = await request(app).put("/api/resumes/r-a").set(asUser()).send(body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ownResume);
      expect(database.resumes).toEqual([ownResume]);
    },
  );

  it.each(["missing", "r-b"])("does not update missing or foreign resume %s", async (id) => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const response = await request(app).put(`/api/resumes/${id}`).set(asUser()).send({ name: "Changed" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Resume not found" });
    expect(database.resumes).toEqual([ownResume, otherResume]);
  });

  it("deletes only the owned resume", async () => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const response = await request(app).delete("/api/resumes/r-a").set(asUser());
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(database.resumes).toEqual([otherResume]);
  });

  it.each(["missing", "r-b"])("safely returns 204 deleting missing or foreign resume %s", async (id) => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    const response = await request(app).delete(`/api/resumes/${id}`).set(asUser());
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(database.resumes).toEqual([ownResume, otherResume]);
  });

  it.each([
    ["get", "/api/resumes", "select", 500, "Database unavailable"],
    ["get", "/api/resumes/r-a", "select", 404, "Application not found"],
    ["post", "/api/resumes", "insert", 400, "Database unavailable"],
    ["put", "/api/resumes/r-a", "update", 400, "Database unavailable"],
    ["delete", "/api/resumes/r-a", "delete", 400, "Database unavailable"],
  ] as const)("handles %s %s database failures", async (method, url, operation, status, error) => {
    database.resumes.push(structuredClone(ownResume), structuredClone(otherResume));
    databaseErrors[`resumes:${operation}`] = "Database unavailable";
    const response = await request(app)[method](url).set(asUser()).send({ name: "Changed", content: {} });
    expect(response.status).toBe(status);
    expect(response.body).toEqual({ error });
    expect(database.resumes).toEqual([ownResume, otherResume]);
  });

  it.each([
    ["post", { name: "Missing content" }, "insert", "null value in column content violates not-null constraint"],
    ["post", { name: "Bad status", content: {}, status: "invalid" }, "insert", "violates check constraint"],
    ["put", { status: "invalid" }, "update", "violates check constraint"],
  ] as const)("surfaces database validation for %s %j", async (method, body, operation, error) => {
    database.resumes.push(structuredClone(ownResume));
    databaseErrors[`resumes:${operation}`] = error;
    const response = await request(app)[method](method === "post" ? "/api/resumes" : "/api/resumes/r-a")
      .set(asUser()).send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error });
    expect(database.resumes).toEqual([ownResume]);
  });
});
