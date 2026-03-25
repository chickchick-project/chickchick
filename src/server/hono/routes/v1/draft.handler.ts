import { createRoute } from "@hono/zod-openapi";
import { z } from "zod";
import * as DraftSchemas from "@/server/hono/schemas/draft.schema";
import * as DraftServices from "@/server/hono/services/draft.service";
import {
  apiBadRequest,
  apiCreated,
  apiForbidden,
  apiInternalError,
  apiNotFound,
  apiSuccess,
} from "@/server/hono/utils/api.utils";
import { createStandardApiResponses } from "@/server/hono/utils/openapi.schema";
import { createDomainRouters } from "@/server/hono/utils/router";


const routers = createDomainRouters();

// ========== POST /drafts - 임시 저장 생성/업데이트 ==========
const createOrUpdateDraftRoute = createRoute({
  method: "post",
  path: "/",
  summary: "임시 저장 생성/업데이트 (Upsert)",
  description:
    "새 게시글 또는 기존 게시글 수정을 위한 임시 저장을 생성하거나 업데이트합니다.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: DraftSchemas.CreateDraftBodySchema,
        },
      },
    },
  },
  responses: createStandardApiResponses(
    {
      schema: DraftSchemas.ApiDraftResponseSchema,
      description: "생성/업데이트된 임시 저장",
    },
    ["400", "401", "404"]
  ),
  tags: ["Draft"],
});

routers.authenticated.openapi(createOrUpdateDraftRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");
  const body = c.req.valid("json");

  const payload: DraftSchemas.CreateDraftPayload = {
    ...body,
    userId: user.id,
  };

  const result = await DraftServices.createOrUpdateDraftService(payload);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    if (result.error === "BAD_REQUEST") {
      return apiBadRequest(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiCreated(c, result.data, "임시 저장을 성공적으로 저장했습니다.");
});

// ========== GET /drafts - 임시 저장 목록 조회 ==========
const listDraftsRoute = createRoute({
  method: "get",
  path: "/",
  summary: "내 임시 저장 목록 조회",
  description: "현재 사용자의 모든 임시 저장 목록을 조회합니다.",
  responses: createStandardApiResponses(
    {
      schema: DraftSchemas.ApiDraftListResponseSchema,
      description: "임시 저장 목록",
    },
    ["401"]
  ),
  tags: ["Draft"],
});

routers.authenticated.openapi(listDraftsRoute, async (c) => {
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

  const result = await DraftServices.listDraftsService(user.id);

  if (!result.success) {
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "임시 저장 목록을 성공적으로 조회했습니다.");
});

// ========== GET /drafts/:id - 특정 임시 저장 조회 ==========
const getDraftRoute = createRoute({
  method: "get",
  path: "/{id}",
  summary: "임시 저장 단일 조회",
  description: "특정 임시 저장을 조회합니다. 소유권을 확인합니다.",
  request: {
    params: DraftSchemas.DraftIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: DraftSchemas.ApiDraftResponseSchema,
      description: "임시 저장",
    },
    ["401", "403", "404"]
  ),
  tags: ["Draft"],
});

routers.authenticated.openapi(getDraftRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

  const result = await DraftServices.getDraftService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    if (result.error === "FORBIDDEN") {
      return apiForbidden(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "임시 저장을 성공적으로 조회했습니다.");
});

// ========== DELETE /drafts/:id - 임시 저장 삭제 ==========
const deleteDraftRoute = createRoute({
  method: "delete",
  path: "/{id}",
  summary: "임시 저장 삭제",
  description: "특정 임시 저장을 삭제합니다. 소유권을 확인합니다.",
  request: {
    params: DraftSchemas.DraftIdParamSchema,
  },
  responses: createStandardApiResponses(
    {
      schema: z.object({ message: z.string() }),
      description: "삭제 결과",
    },
    ["401", "403", "404"]
  ),
  tags: ["Draft"],
});

routers.authenticated.openapi(deleteDraftRoute, async (c) => {
  const { id } = c.req.valid("param");
  const user = c.get("user");
  if (!user?.id) throw new Error("인증되지 않은 사용자입니다.");

  const result = await DraftServices.deleteDraftService(id, user.id);

  if (!result.success) {
    if (result.error === "NOT_FOUND") {
      return apiNotFound(c, result.message);
    }
    if (result.error === "FORBIDDEN") {
      return apiForbidden(c, result.message);
    }
    return apiInternalError(c, result.message);
  }

  return apiSuccess(c, result.data, "임시 저장을 성공적으로 삭제했습니다.");
});

export default routers.merge();
