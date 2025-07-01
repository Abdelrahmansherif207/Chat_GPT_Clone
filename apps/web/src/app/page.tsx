"use client";
import { useState, useRef } from "react";

interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function Home() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const sendMessage = async () => {
        if (!input.trim() && !file && !image) return;
        setLoading(true);
        let response = "";
        if (image) {
            const formData = new FormData();
            formData.append("image", image);
            formData.append("message", input);
            const res = await fetch("/api/chat/image", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            response = data.response;
            setImage(null);
            if (imageInputRef.current) imageInputRef.current.value = "";
        } else if (file) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("question", input);
            const res = await fetch("/api/chat/file", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            response = data.response;
            setFile(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        } else {
            const res = await fetch("/api/chat/text", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });
            const data = await res.json();
            response = data.response;
        }
        setMessages((msgs) => [
            ...msgs,
            {
                role: "user",
                content: input + (file ? ` (file: ${file.name})` : ""),
            },
            { role: "assistant", content: response },
        ]);
        setInput("");
        setLoading(false);
    };

    return (
        <div className="flex flex-col min-h-screen items-center p-4 bg-gray-50 dark:bg-black">
            <main className="w-full max-w-xl flex-1 flex flex-col gap-4 mt-8">
                <div className="flex flex-col gap-2 bg-white dark:bg-gray-900 rounded-lg p-4 shadow min-h-[400px]">
                    {messages.length === 0 && (
                        <div className="text-gray-400 text-center">
                            Start chatting with AI...
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div
                            key={i}
                            className={
                                msg.role === "user" ? "text-right" : "text-left"
                            }
                        >
                            <span
                                className={
                                    msg.role === "user"
                                        ? "font-semibold text-blue-600"
                                        : "font-semibold text-green-600"
                                }
                            >
                                {msg.role === "user" ? "You" : "AI"}:
                            </span>{" "}
                            <span>{msg.content}</span>
                            {msg.role === "user" &&
                                msg.content.startsWith("[image]") && (
                                    <img
                                        src={msg.content.slice(7)}
                                        alt="uploaded"
                                        className="max-w-xs mt-2 rounded"
                                    />
                                )}
                        </div>
                    ))}
                </div>
                <div className="flex gap-2 mt-4">
                    <input
                        className="flex-1 rounded border px-3 py-2 text-black dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:outline-none"
                        type="text"
                        placeholder="Type your message..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                        disabled={loading}
                    />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.txt,.docx"
                        className="rounded border px-2 py-2 text-black dark:text-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        disabled={loading}
                    />
                    <label className="cursor-pointer flex items-center justify-center bg-gray-200 dark:bg-gray-700 rounded px-2 py-2 hover:bg-gray-300 dark:hover:bg-gray-600 transition">
                        <span
                            role="img"
                            aria-label="Upload Image"
                            className="text-xl mr-1"
                        >
                            🖼️
                        </span>
                        <input
                            ref={imageInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                                setImage(e.target.files?.[0] || null)
                            }
                            disabled={loading}
                        />
                    </label>
                    <button
                        className="rounded bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
                        onClick={sendMessage}
                        disabled={loading || (!input.trim() && !file && !image)}
                    >
                        {loading ? "..." : "Send"}
                    </button>
                </div>
            </main>
            <footer className="mt-8 text-gray-400 text-xs">
                ChatGPT Clone &copy; 2025
            </footer>
        </div>
    );
}
