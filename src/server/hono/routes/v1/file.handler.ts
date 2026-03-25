import { createRoute } from "@hono/zod-openapi";
import { UploadedImageInfoSchema } from "@/server/hono/schemas/common.schema";
import * as FileServices from "@/server/hono/services/file.service";
import {
  apiBadRequest,
  apiInternalError,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";


const routers = createDomainRouters();

/**
 * @method POST
 * @path /upload
 * @summary 파일 업로드
 * @description 이미지 파일을 지정된 버킷에 업로드합니다 (인증 필요)
 */
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

routers.authenticated.openapi(uploadRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
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

export default routers.merge();
