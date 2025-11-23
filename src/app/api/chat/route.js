import { NextResponse } from "next/server";
// 1)
export async function POST(req) {
  try {
    // 2)

    const body = await req.json();
    const message = body.message;

    const apiKey = process.env.GEMINI_API_KEY;

    // 3)

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: message }],
            },
          ],
        }),
      }
    );
    // 4) Parse response JSON
    const data = await response.json();

    // 5) Extract text safely (first candidate)
    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";

    // 6) Return JSON to frontend
    return NextResponse.json({ reply: replyText });
  } catch (error) {
    return NextResponse.json({ reply: "error from gemini api" });
  }
}
