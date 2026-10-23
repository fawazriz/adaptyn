import request from "supertest";
import { app } from "./test-utils";

describe("health endpoint", () => {
  it("returns HTTP 200 and the expected response", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Hello, world!");
  });
});
