import { NextRequest, NextResponse } from "next/server";

// Mock data for testing when backend is offline
const MOCK_BANNERS = {
  HOME: [
    {
      id: "1",
      title: "Your Banner Title Here",
      subtitle: "Your banner subtitle will appear here",
      image: "/uploads/banners/aef8afa6-cbb1-4be1-a055-a85da468df4f.jpeg",
      link: "/products",
      isActive: true,
      sortOrder: 0,
      position: "HOME",
    },
  ],
};

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

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 });
    }
  } catch (error) {
    console.error("Banners API error:", error);
  }

  // Return mock data if backend is offline
  const mockData = MOCK_BANNERS[position as keyof typeof MOCK_BANNERS] || [];
  return NextResponse.json(mockData, { status: 200 });
}
