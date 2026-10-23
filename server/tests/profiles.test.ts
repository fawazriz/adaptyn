import request from "supertest";
import { app, asUser, database, databaseErrors } from "./test-utils";

const ownProfile = { id: "user-a", name: "User A", headline: "Engineer", location: "Toronto", bio: "Hello" };
const otherProfile = { id: "user-b", name: "User B" };

describe("profiles", () => {
  it("retrieves only the authenticated user's profile", async () => {
    database.profiles.push({ ...ownProfile }, { ...otherProfile });
    const response = await request(app).get("/api/profiles?id=user-b").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual(ownProfile);
  });

  it("returns null when the authenticated user has no profile", async () => {
    database.profiles.push({ ...otherProfile });
    const response = await request(app).get("/api/profiles").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toBeNull();
  });

  it("updates all supported fields and returns the updated profile", async () => {
    database.profiles.push({ ...ownProfile }, { ...otherProfile });
    const updates = { name: "New Name", headline: "Senior Engineer", location: "Ottawa", bio: "New bio" };
    const response = await request(app).put("/api/profiles").set(asUser())
      .send({ ...updates, id: "user-b", email: "ignored@example.com" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ ...ownProfile, ...updates });
    expect(database.profiles).toEqual([response.body, otherProfile]);
  });

  it.each([{}, { name: "", headline: null, location: false, bio: "" }, { id: "user-b", unknown: "ignored" }])(
    "ignores empty, falsy, and unsupported update fields: %j", async (body) => {
      database.profiles.push({ ...ownProfile });
      const response = await request(app).put("/api/profiles").set(asUser()).send(body);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(ownProfile);
      expect(database.profiles).toEqual([ownProfile]);
    },
  );

  it("returns 404 when updating a missing profile, without modifying another user", async () => {
    database.profiles.push({ ...otherProfile });
    const response = await request(app).put("/api/profiles").set(asUser())
      .send({ id: "user-b", name: "Changed" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Profile not found" });
    expect(database.profiles).toEqual([otherProfile]);
  });

  it("deletes only the authenticated user's profile and returns confirmation", async () => {
    database.profiles.push({ ...ownProfile }, { ...otherProfile });
    const response = await request(app).delete("/api/profiles?id=user-b").set(asUser());
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Profile deleted successfully" });
    expect(database.profiles).toEqual([otherProfile]);
  });

  it("returns 404 when deleting a missing profile, without deleting another user", async () => {
    database.profiles.push({ ...otherProfile });
    const response = await request(app).delete("/api/profiles").set(asUser()).send({ id: "user-b" });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ error: "Profile not found" });
    expect(database.profiles).toEqual([otherProfile]);
  });

  it.each([
    ["get", "select"], ["put", "update"], ["delete", "delete"],
  ] as const)("handles %s database failures without mutation", async (method, operation) => {
    database.profiles.push({ ...ownProfile }, { ...otherProfile });
    databaseErrors[`profiles:${operation}`] = "Database unavailable";
    const response = await request(app)[method]("/api/profiles").set(asUser()).send({ name: "Changed" });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Database unavailable" });
    expect(database.profiles).toEqual([ownProfile, otherProfile]);
  });
});
