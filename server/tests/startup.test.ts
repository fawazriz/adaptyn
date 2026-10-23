// Exercise the entry point without opening a listening server.
const mockListen = jest.fn((_port: string | number, callback: () => void) => callback());
jest.mock("../src/app", () => ({ __esModule: true, default: { listen: mockListen } }));
const originalPort = process.env.PORT;

afterEach(() => {
  if (originalPort === undefined) delete process.env.PORT;
  else process.env.PORT = originalPort;
  jest.restoreAllMocks();
});

it.each([
  [undefined, 3005], ["", 3005], ["4010", "4010"],
])("starts on the expected port when PORT=%s", (configuredPort, expectedPort) => {
  if (configuredPort === undefined) delete process.env.PORT;
  else process.env.PORT = configuredPort;
  mockListen.mockClear();
  const log = jest.spyOn(console, "log").mockImplementation(() => {});
  jest.isolateModules(() => require("../src/index"));
  expect(mockListen).toHaveBeenCalledWith(expectedPort, expect.any(Function));
  expect(mockListen).toHaveBeenCalledTimes(1);
  expect(log).toHaveBeenCalledWith(`Server running on port ${expectedPort}`);
});
