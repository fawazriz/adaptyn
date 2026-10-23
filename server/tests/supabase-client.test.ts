// Exercise configuration without loading a real SDK client or reading .env files.
const mockCreateClient = jest.fn(() => ({ marker: "mock-client" }));
jest.mock("@supabase/supabase-js", () => ({ createClient: mockCreateClient }));
jest.mock("dotenv", () => ({ __esModule: true, default: { config: jest.fn() } }));

const originalEnvironment = { ...process.env };

beforeEach(() => {
  jest.clearAllMocks();
  delete process.env.NEXT_PUBLIC_SUPABASE_URL;
  delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
});
afterEach(() => {
  process.env = { ...originalEnvironment };
});

describe("Supabase client configuration", () => {
  it.each([
    [undefined, undefined], [undefined, "test-key"], ["https://example.supabase.co", undefined],
    ["", "test-key"], ["https://example.supabase.co", ""],
  ])("rejects missing or empty URL/key (%s, %s) before creating a client", (url, key) => {
    if (url !== undefined) process.env.NEXT_PUBLIC_SUPABASE_URL = url;
    if (key !== undefined) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = key;
    expect(() => jest.isolateModules(() => require("../src/db/supabase-client")))
      .toThrow("Missing Supabase environment variables");
    expect(mockCreateClient).not.toHaveBeenCalled();
  });

  it("exports the client created with the configured URL and key", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key";
    jest.isolateModules(() => {
      const client = require("../src/db/supabase-client").default;
      expect(client).toEqual({ marker: "mock-client" });
    });
    expect(mockCreateClient).toHaveBeenCalledWith("https://example.supabase.co", "test-key");
    expect(mockCreateClient).toHaveBeenCalledTimes(1);
  });
});
