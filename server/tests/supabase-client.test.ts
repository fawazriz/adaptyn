// Exercise configuration without loading a real SDK client or reading .env files.
type ClientOptions = {
  auth: { persistSession: boolean; autoRefreshToken: boolean; detectSessionInUrl: boolean };
  accessToken?: () => Promise<string>;
};
const createClient: (url: string, key: string, options: ClientOptions) => object = () => ({ marker: "mock-client" });
const mockCreateClient = jest.fn(createClient);
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

  it("creates isolated clients with the configured URL and key", async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "test-key";
    await jest.isolateModulesAsync(async () => {
      const { createSupabaseClient } = require("../src/db/supabase-client");
      const auth = { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false };
      expect(createSupabaseClient()).toEqual({ marker: "mock-client" });
      expect(mockCreateClient).toHaveBeenLastCalledWith("https://example.supabase.co", "test-key", { auth });

      createSupabaseClient("alice-token");
      createSupabaseClient("bob-token");
      const [, aliceCall, bobCall] = mockCreateClient.mock.calls;
      expect(await aliceCall?.[2].accessToken?.()).toBe("alice-token");
      expect(await bobCall?.[2].accessToken?.()).toBe("bob-token");
    });
  });
});
