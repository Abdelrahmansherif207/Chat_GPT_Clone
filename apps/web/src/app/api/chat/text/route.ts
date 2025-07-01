import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { message } = await req.json();
    const backendRes = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/chat/text`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        }
    );
    const data = await backendRes.json();
    return NextResponse.json(data);
}
