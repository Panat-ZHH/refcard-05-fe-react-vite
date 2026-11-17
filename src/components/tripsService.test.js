import {tripImageUrl, uploadTripImage, baseUrl} from "./tripsService.js";

test("base url always ends with a slash", () => {
  expect(baseUrl.endsWith("/")).toBe(true);
});

test("image url with cache buster", () => {
  expect(tripImageUrl(3)).toBe(`${baseUrl}v1/trips/3/image`);
  expect(tripImageUrl(3, 42)).toBe(`${baseUrl}v1/trips/3/image?v=42`);
});

test("upload sends multipart PUT and reports problem details on error", async () => {
  globalThis.fetch = vi.fn(() =>
    Promise.resolve({ok: false, status: 503, json: () => Promise.resolve({detail: "Zugriff verweigert: s3:PutObject"})})
  );
  const file = new File(["x"], "x.jpg", {type: "image/jpeg"});
  await expect(uploadTripImage(1, file)).rejects.toThrow("s3:PutObject");
  const [url, init] = globalThis.fetch.mock.calls[0];
  expect(url).toBe(`${baseUrl}v1/trips/1/image`);
  expect(init.method).toBe("PUT");
  expect(init.body).toBeInstanceOf(FormData);
});
