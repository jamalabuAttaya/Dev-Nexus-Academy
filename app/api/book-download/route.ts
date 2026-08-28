const allowedHosts = ["archive.org"];

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const source = requestUrl.searchParams.get("url");
  const requestedName =
    requestUrl.searchParams.get("filename") ?? "dev-nexus-free-book";
  if (!source) return new Response("Missing download URL", { status: 400 });
  let url: URL;
  try {
    url = new URL(source);
  } catch {
    return new Response("Invalid download URL", { status: 400 });
  }
  const allowed =
    url.protocol === "https:" &&
    allowedHosts.some(
      (host) => url.hostname === host || url.hostname.endsWith(`.${host}`),
    );
  if (!allowed)
    return new Response("Download source is not allowed", { status: 403 });
  const response = await fetch(url, {
    redirect: "follow",
    headers: { "User-Agent": "Dev-Nexus-Academy/1.0" },
  });
  if (!response.ok || !response.body)
    return new Response("Book download is temporarily unavailable", {
      status: 502,
    });
  const finalUrl = new URL(response.url);
  if (
    !allowedHosts.some(
      (host) =>
        finalUrl.hostname === host || finalUrl.hostname.endsWith(`.${host}`),
    )
  )
    return new Response("Unexpected download redirect", { status: 502 });
  const filename = requestedName
    .replace(/[^\p{L}\p{N}._ -]/gu, "-")
    .slice(0, 120);
  return new Response(response.body, {
    headers: {
      "Content-Type":
        response.headers.get("content-type") ?? "application/octet-stream",
      "Content-Disposition": `attachment; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "Cache-Control": "private, max-age=0",
    },
  });
}
