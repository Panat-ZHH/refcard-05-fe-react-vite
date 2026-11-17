// Backend-URL wird beim Build gesetzt (VITE_API_BASE_URL):
//   lokal:  http://localhost:8080/          (.env bzw. docker-compose-local)
//   AWS:    http://<ALB-DNS>/               (GitHub-Repository-Variable -> Docker build-arg)
export const baseUrl = withTrailingSlash(import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/");

function withTrailingSlash(url) {
  return url.endsWith("/") ? url : `${url}/`;
}

export async function getBusinessTrips() {
  const response = await fetch(`${baseUrl}v1/trips`);
  if (response.status === 204) return [];
  if (response.ok) return response.json();
  throw response;
}

export const getWishlistItems = getBusinessTrips;

/** Bild eines Trips - kommt vom Backend, das es aus S3 (AWS) bzw. MinIO/Volume (lokal) liest. */
export function tripImageUrl(id, cacheBuster) {
  const url = `${baseUrl}v1/trips/${id}/image`;
  return cacheBuster ? `${url}?v=${cacheBuster}` : url;
}

/** Laedt ein Bild fuer einen Trip hoch (PUT multipart) - landet im S3-Bucket. */
export async function uploadTripImage(id, file) {
  const body = new FormData();
  body.append("file", file);
  const response = await fetch(`${baseUrl}v1/trips/${id}/image`, {method: "PUT", body});
  if (response.ok) return response.json();
  let detail = `${response.status}`;
  try {
    const problem = await response.json();
    detail = problem.detail || problem.title || detail;
  } catch {
    // keine JSON-Antwort
  }
  throw new Error(`Upload fehlgeschlagen: ${detail}`);
}

/** Version des Backends (Spring Boot Actuator /actuator/info) fuer die Versionsanzeige im Footer. */
export async function getBackendInfo() {
  const response = await fetch(`${baseUrl}actuator/info`);
  if (!response.ok) throw response;
  return response.json();
}
