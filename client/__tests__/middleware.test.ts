/** @jest-environment node */
import { NextRequest } from "next/server"
import { middleware } from "../src/middleware"

const fetchMock = jest.spyOn(globalThis, "fetch")

afterAll(() => {
  fetchMock.mockRestore()
})

function dashboardRequest(cookie?: string) {
  return new NextRequest("https://app.example.test/dashboard/resumes", {
    headers: cookie ? { Cookie: cookie } : undefined,
  })
}

it("redirects requests without a session", async () => {
  const response = await middleware(dashboardRequest())
  expect(response.headers.get("location")).toBe("https://app.example.test/login?from=%2Fdashboard%2Fresumes")
  expect(fetchMock).not.toHaveBeenCalled()
})

it("rejects a nonempty cookie when the API cannot verify it", async () => {
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 401 }))
  const response = await middleware(dashboardRequest("adaptyn-session=forged"))
  expect(response.status).toBe(307)
  expect(fetchMock).toHaveBeenCalledWith(expect.objectContaining({ pathname: "/api/auth/session" }), {
    headers: { Cookie: "adaptyn-session=forged" },
    cache: "no-store",
    redirect: "error",
  })
})

it("allows dashboard access after the API verifies the session", async () => {
  fetchMock.mockResolvedValueOnce(new Response(null, { status: 204 }))
  const response = await middleware(dashboardRequest("adaptyn-session=verified"))
  expect(response.headers.get("x-middleware-next")).toBe("1")
  expect(response.headers.get("cache-control")).toBe("private, no-store")
})

it("fails closed when the authentication service is unreachable", async () => {
  fetchMock.mockRejectedValueOnce(new Error("Network unavailable"))
  const response = await middleware(dashboardRequest("adaptyn-session=unverified"))
  expect(response.status).toBe(503)
})
