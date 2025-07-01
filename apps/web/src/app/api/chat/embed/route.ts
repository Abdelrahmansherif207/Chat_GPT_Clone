import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { text } = await req.json();
    const backendRes = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/chat/embed`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
        }
    );
    const data = await backendRes.json();
    return NextResponse.json(data);
}
