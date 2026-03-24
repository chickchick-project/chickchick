import app from "@/server/hono/app";
import { handle } from "hono/vercel";

// export const runtime = "edge";

if (process.env.NODE_ENV !== "production") {
  try {
    const { swaggerUI } = await import("@hono/swagger-ui");
    app.get("/swagger-ui", swaggerUI({ url: "/api/doc" }));
  } catch (_) {
    console.warn(
      "Swagger UI dependencies not found in production environment.",
      _,
    );
  }
}

export const GET = handle(app);
export const POST = handle(app);
export const PUT = handle(app);
export const DELETE = handle(app);
export const PATCH = handle(app);
export const OPTIONS = handle(app);
export const HEAD = handle(app);
