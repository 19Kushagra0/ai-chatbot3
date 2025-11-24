import { NextResponse } from "next/server";

// ✅ NEW: we import the MongoDB connection file
import { connectDB } from "@/lib/mongodb";

// ✅ NEW: we import the Message model to save/read chat messages
import Message from "@/models/Message";

// ⭐ POST — user sends message → AI responds → both get saved
export async function POST(req) {
  try {
    // ✅ NEW: Connect to the database (but only once)
    await connectDB();

    // ------------------------
    // YOUR ORIGINAL CODE
    // ------------------------
    const body = await req.json();
    const message = body.message;
    const apiKey = process.env.GEMINI_API_KEY;
    // ------------------------

    // ⭐ NEW: Save the user's message BEFORE calling AI
    await Message.create({
      role: "user",
      text: message,
    });

    // ------------------------
    // YOUR ORIGINAL GEMINI REQUEST
    // ------------------------
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      }
    );

    const data = await response.json();

    const replyText =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from model";
    // ------------------------

    // ⭐ NEW: Save AI reply to the database
    await Message.create({
      role: "ai",
      text: replyText,
    });

    // ⭐ Return AI reply to frontend
    return NextResponse.json({ reply: replyText });
  } catch (err) {
    console.error("Error in POST /api/chat:", err);

    // Better error handling
    return NextResponse.json(
      { error: "Server error while processing chat" },
      { status: 500 }
    );
  }
}

// ⭐ NEW: GET — allows your frontend to load FULL chat history
export async function GET() {
  try {
    // Connect to DB
    await connectDB();

    // Load all messages sorted oldest → newest
    const messages = await Message.find().sort({ createdAt: 1 });

    return NextResponse.json({ messages });
  } catch (err) {
    console.error("Error in GET /api/chat:", err);

    return NextResponse.json(
      { error: "Server error while fetching messages" },
      { status: 500 }
    );
  }
}
