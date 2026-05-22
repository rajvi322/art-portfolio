export const runtime = "nodejs";

import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import fs from "fs/promises";
import path from "path";

// Initialize Groq
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! });

export async function POST(req: Request) {
  try {
    const { imageUrl, medium } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: "No image provided" },
        { status: 400 },
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { success: false, error: "Groq API key not configured" },
        { status: 500 },
      );
    }

    // Resolve image to base64
    let base64Image: string;
    let mimeType = "image/jpeg";

    if (imageUrl.startsWith("data:")) {
      // Extract mime type and base64 data from data URL
      const matches = imageUrl.match(/^data:([^;]+);base64,(.+)$/);
      if (!matches) throw new Error("Invalid data URL format");
      mimeType = matches[1];
      base64Image = matches[2];
    } else if (imageUrl.startsWith("/")) {
      const filePath = path.join(process.cwd(), "public", imageUrl);
      const imageBuffer = await fs.readFile(filePath);
      base64Image = imageBuffer.toString("base64");
      // Infer mime type from extension
      const ext = path.extname(imageUrl).toLowerCase();
      if (ext === ".png") mimeType = "image/png";
      else if (ext === ".webp") mimeType = "image/webp";
    } else {
      const imageResponse = await fetch(imageUrl);
      if (!imageResponse.ok) throw new Error("Failed to fetch image");
      const contentType = imageResponse.headers.get("content-type");
      if (contentType) mimeType = contentType.split(";")[0];
      const arrayBuffer = await imageResponse.arrayBuffer();
      base64Image = Buffer.from(arrayBuffer).toString("base64");
    }

    // Call Groq Vision
    const result = await groq.chat.completions.create({
      model: "meta-llama/llama-4-scout-17b-16e-instruct",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
            {
              type: "text",
              text: `Generate:
1. A short artistic title (1-4 words)
2. A short artistic description

Rules:
- Focus on the main subject/artwork
- Keep it elegant and creative
- Return ONLY valid JSON, no markdown, no code blocks

Example:
{"title": "Golden Horizon", "description": "A serene watercolor sunset landscape."}`,
            },
          ],
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    const text = result.choices[0]?.message?.content?.trim() ?? "";

    console.log("Groq Raw:", text);

    // Clean JSON if model wraps it in code fences
    const cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: { title?: string; description?: string };

    try {
      parsed = JSON.parse(cleanedText);
    } catch {
      parsed = {
        title: "Untitled Artwork",
        description: cleanedText,
      };
    }

    let title = parsed.title || "Untitled Artwork";
    let description = parsed.description || "An artistic visual composition.";

    if (medium) {
      description += ` Executed in ${medium}.`;
    }

    return NextResponse.json({
      success: true,
      title: title.slice(0, 50),
      description,
    });
  } catch (error: any) {
    console.error("Groq Metadata Error:", error);

    return NextResponse.json(
      { success: false, error: error.message || "Metadata generation failed" },
      { status: 500 },
    );
  }
}
