import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import axios from "axios";
import { http } from "./http";

const TOKEN = "test-token";

vi.mock("./auth", () => ({
  getToken: vi.fn(() => TOKEN),
}));

describe("http interceptor", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_API_AUTH_PREFIX", "Bearer");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("should add Authorization header with Bearer prefix", () => {
    const authHandler = (
      http.interceptors.request as unknown as {
        handlers: { fulfilled: (config: unknown) => unknown }[];
      }
    ).handlers[0].fulfilled;

    const config = { headers: new axios.AxiosHeaders() };
    const result = authHandler(config) as {
      headers: { get: (name: string) => string | undefined };
    };

    expect(result.headers.get("Authorization")).toBe(`Bearer ${TOKEN}`);
  });
});
