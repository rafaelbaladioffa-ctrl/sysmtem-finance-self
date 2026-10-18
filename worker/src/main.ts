import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import postgres from "postgres";

const port = Number(process.env.WORKER_PORT ?? 3001);
const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is required to start the worker");
}

const database = postgres(databaseUrl, { max: 1, prepare: false });
let stopping = false;

const server = createServer(async (request: IncomingMessage, response: ServerResponse) => {
  if (request.url === "/health/live") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify({ status: "ok" }));
    return;
  }

  if (request.url === "/health/ready") {
    try {
      await database`select 1`;
      response.writeHead(200, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "ok", checks: { database: "ok" } }));
    } catch {
      response.writeHead(503, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "unavailable", checks: { database: "unavailable" } }));
    }
    return;
  }

  response.writeHead(404);
  response.end();
});

server.listen(port, "0.0.0.0");

const shutdown = async () => {
  if (stopping) return;
  stopping = true;
  server.close();
  await database.end({ timeout: 5 });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
