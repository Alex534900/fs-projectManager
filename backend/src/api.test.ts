import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "./app";


describe("API Backend", () => {

  it("responde correctamente en GET /", async () => {

    const response = await request(app)
      .get("/");

    expect(response.status).toBe(200);
    expect(response.text).toBe("Backend is working!");

  });

});