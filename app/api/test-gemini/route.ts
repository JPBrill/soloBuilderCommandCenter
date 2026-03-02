import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    
    // Note: In this specific AI Studio environment, it is recommended to call Gemini 
    // from the client side using NEXT_PUBLIC_GEMINI_API_KEY.
    // However, for a standard Next.js app, server-side calls are perfectly fine 
    // and often preferred for security (hiding the key).
    const apiKey = process.env.GEMINI_API_KEY; 
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY is not set in environment variables." }, 
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    
    // Using the new @google/genai SDK syntax
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt || "Hello from the server!",
    });
    
    return NextResponse.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
