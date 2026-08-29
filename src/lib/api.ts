import { NextResponse } from "next/server";
import { ZodError } from "zod";
import {
  type ApiErrorCode,
  type ApiResponse,
  HTTP_STATUS_BY_CODE,
} from "@/types/api";

export function ok<T>(data: T, message?: string) {
  return NextResponse.json<ApiResponse<T>>({ success: true, data, message });
}

export function fail(code: ApiErrorCode, message: string) {
  return NextResponse.json<ApiResponse<never>>(
    { success: false, error: { code, message } },
    { status: HTTP_STATUS_BY_CODE[code] },
  );
}

/** Route Handler 공통 에러 처리 래퍼 */
export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return fail("BAD_REQUEST", error.issues.map((i) => i.message).join(", "));
  }
  console.error("[API] Unhandled error:", error);
  return fail("INTERNAL_ERROR", "Something went wrong while processing the request.");
}
