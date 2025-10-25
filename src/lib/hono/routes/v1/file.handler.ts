import { createRoute, OpenAPIHono, z } from "@hono/zod-openapi";
import type { AppContext } from "@/lib/hono/app";
import { authMiddleware } from "@/lib/hono/middleware/auth.middleware";
import { createStandardApiResponses } from "../../utils/openapi.schema";
import {
  apiBadRequest,
  apiInternalError,
  apiSuccess,
} from "../../utils/api.utils";
import { getAuthenticatedUser } from "@/lib/hono/utils/service.utils";
import * as FileServices from "@/lib/hono/services/file.service";

const fileApi = new OpenAPIHono<AppContext>();
fileApi.use("*", authMiddleware);

const UploadedImageInfoSchema = z.object({
  imageUrl: z.string().url(),
  width: z.number(),
  height: z.number(),
  format: z.string(),
});

const uploadRoute = createRoute({
  method: "post",
  path: "/upload",
  summary: "파일 업로드",
  requestBody: {
    content: {
      "multipart/form-data": {
        schema: {
          type: "object",
          properties: {
            file: { type: "string", format: "binary" },
            bucketName: { type: "string" },
          },
          required: ["file", "bucketName"],
        },
      },
    },
  },
  responses: createStandardApiResponses({
    schema: UploadedImageInfoSchema,
  }),
  tags: ["File"],
});

fileApi.openapi(uploadRoute, async (c) => {
  const user = getAuthenticatedUser(c);
  const formData = await c.req.formData();
  const file = formData.get("file");
  const bucketName = formData.get("bucketName");

  if (!file || !(file instanceof File)) {
    return apiBadRequest(c, "업로드할 파일이 필요합니다.");
  }

  if (!bucketName || typeof bucketName !== "string") {
    return apiBadRequest(c, "버킷 이름이 필요합니다.");
  }

  const uploadResult = await FileServices.uploadImage(
    bucketName,
    file,
    user.id
  );

  if (!uploadResult.success) {
    return apiInternalError(c, uploadResult.message);
  }

  return apiSuccess(c, uploadResult.data);
});

export default fileApi;
