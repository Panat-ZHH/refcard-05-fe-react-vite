import {render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import {WishlistProvider} from "./components/wishlistContext.jsx";

const trips = [
  {id: 1, title: "BT01", description: "San Francisco", startTrip: "2026-02-13T00:00:00", endTrip: "2026-02-15T16:56:00"},
];

function mockBackend({tripsStatus = 200} = {}) {
  globalThis.fetch = vi.fn((url) => {
    if (String(url).endsWith("actuator/info")) {
      return Promise.resolve({ok: true, json: () => Promise.resolve({build: {version: "1.2.3"}})});
    }
    if (tripsStatus === 204) return Promise.resolve({ok: true, status: 204, json: () => Promise.reject()});
    return Promise.resolve({ok: true, status: 200, json: () => Promise.resolve(trips)});
  });
}

function renderApp() {
  render(
    <WishlistProvider>
      <App/>
    </WishlistProvider>
  );
}

test("renders without crashing", () => {
  mockBackend();
  renderApp();
  expect(screen.getByText(/Business Trips - Frontend Development/i)).toBeInTheDocument();
});

test("trip images are loaded from the backend (S3)", async () => {
  mockBackend();
  renderApp();
  const img = await screen.findByAltText("BT01");
  expect(img.getAttribute("src")).toMatch(/v1\/trips\/1\/image$/);
  expect(img.dataset.source).toBe("backend");
});

test("shows backend version from actuator in footer", async () => {
  mockBackend();
  renderApp();
  await waitFor(() => expect(screen.getByTestId("versions")).toHaveTextContent("Backend 1.2.3"));
});

test("handles 204 No Content from the backend", async () => {
  mockBackend({tripsStatus: 204});
  renderApp();
  expect(await screen.findByText(/No business trips available/i)).toBeInTheDocument();
});
