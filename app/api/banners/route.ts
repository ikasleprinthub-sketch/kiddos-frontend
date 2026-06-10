import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const position = searchParams.get("position") || "HOME";

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    const response = await fetch(`${backendUrl}/api/banners?position=${position}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json([], { status: 200 }); // Return empty array instead of error
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Banners API error:", error);
    // Return empty array as fallback
    return NextResponse.json([], { status: 200 });
  }
}
