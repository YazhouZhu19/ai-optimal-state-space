import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(fileURLToPath(new URL("..", import.meta.url)));
const port = Number.parseInt(process.env.PORT || "4173", 10);

const types = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".js", "text/javascript; charset=utf-8"],
  [".mjs", "text/javascript; charset=utf-8"],
  [".json", "application/json; charset=utf-8"],
  [".md", "text/markdown; charset=utf-8"],
  [".txt", "text/plain; charset=utf-8"],
  [".xml", "application/xml; charset=utf-8"],
  [".svg", "image/svg+xml"],
  [".png", "image/png"],
  [".pdf", "application/pdf"]
]);

function contained(pathname) {
  const filePath = resolve(root, pathname === "/" ? "index.html" : pathname.slice(1));
  if (filePath === root) {
    return filePath;
  }
  return filePath.startsWith(`${root}${sep}`) ? filePath : null;
}

// Directories answer with their own index.html, the way a static host does.
// Without this, /garden/ and /gym/agents/ 404 while the deployed site serves them.
async function locate(pathname) {
  const filePath = contained(pathname);
  if (!filePath) {
    return { status: 403 };
  }
  const info = await stat(filePath).catch(() => null);
  if (!info) {
    return { status: 404 };
  }
  if (info.isFile()) {
    return { status: 200, filePath };
  }
  if (info.isDirectory()) {
    const indexPath = join(filePath, "index.html");
    const indexInfo = await stat(indexPath).catch(() => null);
    if (indexInfo?.isFile()) {
      return { status: 200, filePath: indexPath, directory: true };
    }
  }
  return { status: 404 };
}

const server = createServer(async (request, response) => {
  try {
    const url = new URL(request.url || "/", "http://localhost");
    const pathname = decodeURIComponent(url.pathname);
    const found = await locate(pathname);

    if (found.status !== 200) {
      const message = found.status === 403 ? "Forbidden" : "Not found";
      response.writeHead(found.status, { "Content-Type": "text/plain; charset=utf-8" });
      response.end(message);
      return;
    }

    // A directory needs its trailing slash so relative links inside it resolve.
    if (found.directory && !pathname.endsWith("/")) {
      response.writeHead(301, { Location: `${pathname}/${url.search}` });
      response.end();
      return;
    }

    const headers = {
      "Cache-Control": "no-store",
      "Content-Type": types.get(extname(found.filePath)) || "application/octet-stream"
    };

    if (request.method === "HEAD") {
      response.writeHead(200, headers);
      response.end();
      return;
    }

    response.writeHead(200, headers);
    createReadStream(found.filePath).pipe(response);
  } catch {
    response.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Bad request");
  }
});

server.listen(port, "127.0.0.1", () => {
  console.log(`AI Optimal State Space: http://localhost:${port}`);
  console.log("Press Ctrl+C to stop.");
});
