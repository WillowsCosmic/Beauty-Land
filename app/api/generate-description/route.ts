import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'Gemini API key is not configured' }, { status: 500 });
    }

    const prompt = `Write a luxurious, alluring, and elegant 2-sentence description for a salon service named "${name}". Do not use quotes around the output, keep it modern, sophisticated, and enticing for high-end clients.`;

    // Direct REST call to Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      // Fallback attempt with gemini-1.5-flash if 2.5 is not available on this key
      const fallbackResponse = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (!fallbackResponse.ok) {
        const errorData = await fallbackResponse.json();
        console.error('Gemini API Error:', errorData);
        return NextResponse.json(
          { error: errorData.error?.message || 'Failed to generate description' },
          { status: fallbackResponse.status }
        );
      }

      const data = await fallbackResponse.json();
      const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';
      return NextResponse.json({ description });
    }

    const data = await response.json();
    const description = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || '';

    return NextResponse.json({ description });
  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
