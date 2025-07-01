export const config = {
    api: {
        bodyParser: false,
        sizeLimit: "10mb",
    },
};

export async function POST(req: Request) {
    // Proxy the image upload to the backend NestJS API
    const formData = await req.formData();
    const image = formData.get("image");
    const message = formData.get("message");

    if (!(image instanceof File)) {
        return new Response(JSON.stringify({ error: "No image uploaded" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    const backendRes = await fetch("http://localhost:3000/chat/image", {
        method: "POST",
        body: (() => {
            const fd = new FormData();
            fd.append("image", image, image.name);
            if (message) fd.append("message", message.toString());
            return fd;
        })(),
    });

    const data = await backendRes.text();
    return new Response(data, {
        status: backendRes.status,
        headers: {
            "Content-Type":
                backendRes.headers.get("content-type") || "application/json",
        },
    });
}
