import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.split('Bearer ')[1] : null;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: missing token' }, { status: 401 });
    }

    try {
      await adminAuth.verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Unauthorized: invalid token' }, { status: 401 });
    }

    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
      }

    const apiKey = process.env.GEMINI_API_KEY;
    const fallbackDescription = `A professional ${name.toLowerCase()} service designed to give you great results and leave you feeling refreshed.`;

    if (!apiKey) {
      return NextResponse.json({ description: fallbackDescription });
    }

    const prompt = `Write a simple, clear, and easy-to-understand 2-sentence description for a salon service named "${name}". Use plain and friendly language so every customer can easily understand what it is. Do not use quotes.`;

    const models = ['gemini-2.0-flash', 'gemini-1.5-flash'];

    for (const model of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
            }),
          }
        );

        const data = await response.json();

        if (response.ok && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          const description = data.candidates[0].content.parts[0].text.trim();
          return NextResponse.json({ description });
        }
      } catch {
        continue;
      }
    }

    return NextResponse.json({ description: fallbackDescription });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}