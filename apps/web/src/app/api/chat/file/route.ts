import { NextRequest, NextResponse } from "next/server";

export const config = {
    api: {
        bodyParser: false,
    },
};

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("file");
    const question = formData.get("question");
    if (!file || typeof question !== "string") {
        return NextResponse.json(
            { error: "Missing file or question" },
            { status: 400 }
        );
    }
    // Forward to backend API
    const backendRes = await fetch(
        `${
            process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
        }/chat/file`,
        {
            method: "POST",
            body: formData,
        }
    );
    const data = await backendRes.json();
    return NextResponse.json(data);
}
