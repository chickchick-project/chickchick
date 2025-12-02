// app/api/brands/[name]/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    // Next.js 15: params를 await
    const { name } = await params;

    const searchParams = request.nextUrl.searchParams;
    const x = searchParams.get("x");
    const y = searchParams.get("y");

    if (!name) {
      return NextResponse.json(
        { error: "Brand name is required" },
        { status: 400 }
      );
    }

    if (!process.env.NAVER_CLIENT_ID || !process.env.NAVER_CLIENT_SECRET) {
      return NextResponse.json(
        {
          error: "Server configuration error",
          details: "Naver API credentials are missing in .env.local",
        },
        { status: 500 }
      );
    }

    // API URL 구성
    const apiUrl = `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(
      name
    )}&display=20&sort=random`;

    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        "X-Naver-Client-Id": process.env.NAVER_CLIENT_ID!,
        "X-Naver-Client-Secret": process.env.NAVER_CLIENT_SECRET!,
      },
    });

    // 에러 응답 상세 처리
    if (!response.ok) {
      const errorBody = await response.text();

      // 네이버 API 에러 메시지 파싱 시도
      let errorMessage = `Naver API error: ${response.status}`;
      let errorDetails = errorBody;

      try {
        const errorJson = JSON.parse(errorBody);
        errorMessage = errorJson.errorMessage || errorMessage;
        errorDetails = errorJson.errorCode
          ? `${errorJson.errorCode}: ${errorJson.errorMessage}`
          : errorBody;
      } catch (e) {
        // JSON 파싱 실패 시 원본 텍스트 사용
      }

      // 상태 코드별 구체적인 에러 메시지
      if (response.status === 400) {
        return NextResponse.json(
          {
            error: "Bad Request",
            details: "Invalid request parameters",
            naverError: errorDetails,
          },
          { status: 400 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          {
            error: "Authentication Failed",
            details:
              "Invalid Naver API credentials. Please check your Client ID and Secret in .env.local",
            naverError: errorDetails,
          },
          { status: 401 }
        );
      } else if (response.status === 403) {
        return NextResponse.json(
          {
            error: "Forbidden",
            details:
              "API access denied. Check if the Search API is enabled in your Naver app",
            naverError: errorDetails,
          },
          { status: 403 }
        );
      } else if (response.status === 429) {
        return NextResponse.json(
          {
            error: "Rate Limit Exceeded",
            details: "Too many requests. Please try again later",
            naverError: errorDetails,
          },
          { status: 429 }
        );
      } else {
        return NextResponse.json(
          {
            error: errorMessage,
            details: errorDetails,
            status: response.status,
          },
          { status: response.status }
        );
      }
    }

    // 성공 응답 처리
    const data = await response.json();

    // 데이터가 없는 경우
    if (!data.items || data.items.length === 0) {
      return NextResponse.json({
        success: true,
        stores: [],
        total: 0,
        message: `No stores found for "${name}"`,
      });
    }

    // 데이터 정제
    const stores = data.items.map((item: any, index: number) => {
      console.log(`    - Item ${index + 1}:`, item.title?.substring(0, 30));
      return {
        name: item.title?.replace(/<[^>]*>/g, "") || "Unknown",
        address: item.address || "",
        roadAddress: item.roadAddress || "",
        telephone: item.telephone || "",
        x: item.mapx || "0",
        y: item.mapy || "0",
        category: item.category || "",
        link: item.link || "",
      };
    });

    // 거리 계산
    if (x && y) {
      const userLat = parseFloat(y);
      const userLng = parseFloat(x);

      stores.forEach((store: any) => {
        const storeLat = parseInt(store.y) / 10000000;
        const storeLng = parseInt(store.x) / 10000000;

        const R = 6371; // km
        const dLat = ((storeLat - userLat) * Math.PI) / 180;
        const dLng = ((storeLng - userLng) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((userLat * Math.PI) / 180) *
            Math.cos((storeLat * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        store.distance = Math.round(R * c * 1000); // meters
      });

      stores.sort((a: any, b: any) => (a.distance || 0) - (b.distance || 0));
    }

    return NextResponse.json({
      success: true,
      stores,
      total: data.total,
    });
  } catch (error) {
    console.error("=== API Route Error ===");
    console.error(
      "Error type:",
      error instanceof Error ? error.constructor.name : typeof error
    );
    console.error(
      "Error message:",
      error instanceof Error ? error.message : String(error)
    );
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack"
    );
    console.error("=======================");

    return NextResponse.json(
      {
        error: "Internal server error",
        message: error instanceof Error ? error.message : "Unknown error",
        type: error instanceof Error ? error.constructor.name : typeof error,
      },
      { status: 500 }
    );
  }
}
