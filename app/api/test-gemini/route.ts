import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'GEMINI_API_KEY not set in environment variables' 
        },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = 'Solo Builder Command Center test: respond with "AI integration working perfectly!"';
    const result = await model.generateContent(prompt);
    const response = await result.response.text();

    return NextResponse.json({
      success: true,
      message: response.trim()
    });

  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Gemini API error. Check logs.' 
      },
      { status: 500 }
    );
  }
}
