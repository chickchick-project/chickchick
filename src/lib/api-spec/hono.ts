import { OpenAPIHono } from "@hono/zod-openapi";
// import { swaggerUI } from "@hono/swagger-ui";
import usersApi from "@/lib/routes/v1/users.handler";
import perfumesApi from "@/lib/routes/v1/perfumes.handler";
import searchApi from "@/lib/routes/v1/search.handler";

const app = new OpenAPIHono().basePath("/api");

if (process.env.NODE_ENV === "development") {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "내 프로젝트 API",
      description: "Hono API 문서",
    },
  });
}

app.route("/v1", usersApi);
app.route("/v1", perfumesApi);
app.route("/v1", searchApi);
// app.get("/ui", swaggerUI({ url: "/api/v1/doc" }));

export default app;
