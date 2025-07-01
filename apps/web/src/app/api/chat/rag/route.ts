import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { query } = await req.json();
    const backendRes = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/chat/rag`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ query }),
        }
    );
    const data = await backendRes.json();
    return NextResponse.json(data);
}
