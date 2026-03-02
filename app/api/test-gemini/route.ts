import { NextResponse } from 'next/server';

// Simple GET endpoint for browser testing
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

    // Import Gemini dynamically
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent('Solo Builder Command Center test: respond with "AI integration working perfectly!"');
    const response = result.response.text();

    return NextResponse.json({
      success: true,
      message: response
    });

  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Gemini API error' 
      },
      { status: 500 }
    );
  }
}
