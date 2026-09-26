/// <reference types="vitest/globals" />

const request = require("supertest");
const app = require("./app.ts");

describe("API Backend", () => {
  it("responde correctamente en GET /", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend is working!");
  });
});