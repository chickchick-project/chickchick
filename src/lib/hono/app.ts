import { OpenAPIHono } from "@hono/zod-openapi";
import type { Session, User } from "next-auth";

import perfumesApi from "./routes/v1/perfume.handler";
import searchApi from "./routes/v1/search.handler";
import reviewsApi from "./routes/v1/review.handler";
import communityApi from "./routes/v1/community.handler";
import meApi from "./routes/v1/me.handler";
import usersApi from "./routes/v1/user.handler";
import commentsApi from "./routes/v1/comment.handler";
import brandsApi from "./routes/v1/brand.handler";
import fileApi from "./routes/v1/file.handler";
import filterApi from "./routes/v1/filter.handler";
import pointApi from "./routes/v1/point.handler";
import { handleApiError } from "./utils/api.utils";

export type AuthenticatedUser = User;

export type AppContext = {
  Variables: {
    user?: AuthenticatedUser;
    session?: Session;
  };
};

const app = new OpenAPIHono<AppContext>().basePath("/api");
app.onError(handleApiError);

if (process.env.NODE_ENV === "development") {
  app.doc("/doc", {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "내 프로젝트 API",
      description: "Hono API 문서",
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  });
}

const v1 = new OpenAPIHono<AppContext>();
v1.route("/perfumes", perfumesApi);
v1.route("/brands", brandsApi);
v1.route("/search", searchApi);
v1.route("/filters", filterApi);
v1.route("/reviews", reviewsApi);
v1.route("/community", communityApi);
v1.route("/comments", commentsApi);
v1.route("/me", meApi);
v1.route("/users", usersApi);
v1.route("/file", fileApi);
v1.route("/points", pointApi);

app.route("/v1", v1);

export default app;
