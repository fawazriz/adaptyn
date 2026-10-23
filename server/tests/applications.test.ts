import request from "supertest";
import { app, asUser, database, databaseErrors, mockSupabase } from "./test-utils";

const ownApplication = { id: "a-1", user_id: "user-a", company: "Acme", role: "Engineer", status: "saved" };
const otherApplication = { id: "b-1", user_id: "user-b", company: "Other", role: "Engineer", status: "saved" };

describe("job applications", () => {
  it("creates an application with defaults and uses the authenticated owner", async () => {
    const response = await request(app).post("/api/applications").set(asUser())
      .send({ company: "Acme", role: "Engineer", user_id: "user-b", id: "spoofed" });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      id: "applications-1", user_id: "user-a", company: "Acme", role: "Engineer",
      job_url: null, status: "saved", applied_date: null, salary_min: null,
      salary_max: null, location: null, source: "other", resume_version_id: null, notes: null,
    });
    expect(database.applications).toEqual([response.body]);
  });

  it("persists all supported optional creation fields", async () => {
    const body = {
      company: "Acme", role: "Engineer", job_url: "https://example.com/job",
      status: "applied", applied_date: "2026-10-01", salary_min: 80000, salary_max: 100000,
      location: "Toronto", source: "referral", resume_version_id: "resume-1", notes: "Contact recruiter",
    };
    const response = await request(app).post("/api/applications").set(asUser()).send(body);
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ id: "applications-1", user_id: "user-a", ...body });
    expect(database.applications).toEqual([response.body]);
  });

  it.each([
    {}, { role: "Engineer" }, { company: "Acme" },
    { company: "", role: "Engineer" }, { company: "Acme", role: "" },
    { company: null, role: "Engineer" }, { company: "Acme", role: false },
  ])("rejects missing or falsy required fields: %j", async (body) => {
    const response = await request(app).post("/api/applications").set(asUser()).send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Company and role are required" });
    expect(mockSupabase.from).not.toHaveBeenCalled();
    expect(database.applications).toEqual([]);
  });

  it("returns only the authenticated user's applications", async () => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    const response = await request(app).get("/api/applications").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([ownApplication]);
  });

  it("returns an empty list when the user has no applications", async () => {
    const response = await request(app).get("/api/applications").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("retrieves an owned application by id", async () => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    const response = await request(app).get("/api/applications/a-1").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(ownApplication);
  });

  it.each(["missing", "b-1"])("hides missing or foreign application %s", async (id) => {
    database.applications.push({ ...otherApplication });
    const response = await request(app).get(`/api/applications/${id}`).set(asUser());
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Application not found" });
    expect(database.applications).toEqual([otherApplication]);
  });

  // This exercises the existing category query contract. The fake is not a
  // schema emulator; see README.md for the missing category migration.
  it("filters category results by both category and authenticated owner", async () => {
    const match = { ...ownApplication, category: "engineering" };
    database.applications.push(match, { ...otherApplication, category: "engineering" },
      { ...ownApplication, id: "a-2", category: "design" });
    const response = await request(app).get("/api/applications/category/engineering").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([match]);
  });

  it("returns an empty list for an unmatched category", async () => {
    const response = await request(app).get("/api/applications/category/unknown").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it("updates every supported field without changing ownership or unrelated data", async () => {
    database.applications.push({ ...ownApplication, notes: "Keep" }, { ...otherApplication });
    const updates = { company: "New Co", role: "Senior Engineer", job_url: "https://example.com/new",
      status: "interview", applied_date: "2026-10-02" };
    const response = await request(app).put("/api/applications/a-1").set(asUser())
      .send({ ...updates, user_id: "user-b", id: "hijack", notes: "Ignored" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...ownApplication, notes: "Keep", ...updates });
    expect(database.applications).toEqual([response.body, otherApplication]);
  });

  it.each([{}, { company: "", role: null, job_url: false, status: "", applied_date: null }])(
    "ignores empty or falsy update fields: %j", async (updates) => {
      database.applications.push({ ...ownApplication });
      const response = await request(app).put("/api/applications/a-1").set(asUser()).send(updates);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ownApplication);
      expect(database.applications).toEqual([ownApplication]);
    },
  );

  it.each(["missing", "b-1"])("does not update missing or foreign application %s", async (id) => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    const response = await request(app).put(`/api/applications/${id}`).set(asUser()).send({ company: "Changed" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Application not found" });
    expect(database.applications).toEqual([ownApplication, otherApplication]);
  });

  it("deletes only the owned application", async () => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    const response = await request(app).delete("/api/applications/a-1").set(asUser());
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(database.applications).toEqual([otherApplication]);
  });

  it.each(["missing", "b-1"])("safely returns 204 deleting missing or foreign application %s", async (id) => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    const response = await request(app).delete(`/api/applications/${id}`).set(asUser());
    expect(response.status).toBe(204);
    expect(response.text).toBe("");
    expect(database.applications).toEqual([ownApplication, otherApplication]);
  });

  it.each([
    ["get", "/api/applications", "select", 500, "Database unavailable"],
    ["get", "/api/applications/a-1", "select", 404, "Application not found"],
    ["get", "/api/applications/category/engineering", "select", 500, "Database unavailable"],
    ["post", "/api/applications", "insert", 400, "Database unavailable"],
    ["put", "/api/applications/a-1", "update", 400, "Database unavailable"],
    ["delete", "/api/applications/a-1", "delete", 400, "Database unavailable"],
  ] as const)("handles %s %s database failures", async (method, url, operation, status, error) => {
    database.applications.push({ ...ownApplication }, { ...otherApplication });
    databaseErrors[`applications:${operation}`] = "Database unavailable";
    const response = await request(app)[method](url).set(asUser()).send({ company: "Changed", role: "Engineer" });
    expect(response.status).toBe(status);
    expect(response.body).toEqual({ error });
    expect(database.applications).toEqual([ownApplication, otherApplication]);
  });

  it.each([
    ["post", { company: "Acme", role: "Engineer", status: "invalid" }, "insert"],
    ["post", { company: "Acme", role: "Engineer", source: "invalid" }, "insert"],
    ["put", { status: "invalid" }, "update"],
  ] as const)("surfaces database validation for %s %j", async (method, body, operation) => {
    database.applications.push({ ...ownApplication });
    databaseErrors[`applications:${operation}`] = "violates check constraint";
    const response = await request(app)[method](method === "post" ? "/api/applications" : "/api/applications/a-1")
      .set(asUser()).send(body);
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "violates check constraint" });
    expect(database.applications).toEqual([ownApplication]);
  });
});
