import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// 1. Setup Gemini
// PASTE YOUR API KEY HERE OR USE PROCESS.ENV
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "YOUR_ACTUAL_API_KEY_HERE");

export async function POST(req) {
  try {
    const { images } = await req.json(); // Receive base64 images from frontend

    if (!images || images.length === 0) {
      return NextResponse.json({ error: "No images provided" }, { status: 400 });
    }

    // 2. Prepare the model (Gemini 1.5 Flash is fast and good for vision)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // 3. Construct the prompt
    const prompt = `
      You are a Food Rescue AI. Analyze these images of food.
      For EACH image, provide:
      1. Precise Name (e.g., "Red Apple", "Banana").
      2. Quantity (Estimate count or weight).
      3. Freshness Score (0-100%). Be strict. If it looks rotten, moldy, or bruised, give a low score (<50).
      4. Shelf Life (Estimate in days).

      Return ONLY a raw JSON object (no markdown, no backticks) with this structure:
      {
        "detected_items": [
          { "name": "Item Name", "quantity": "est quantity", "freshness": 85, "shelf_life": "3 days" }
        ]
      }
    `;

    // 4. Convert base64 strings to Gemini format
    const imageParts = images.map((base64String) => ({
      inlineData: {
        data: base64String.split(",")[1], // Remove the "data:image/jpeg;base64," prefix
        mimeType: "image/jpeg",
      },
    }));

    // 5. Call Gemini
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // 6. Clean and Parse JSON
    const cleanedText = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(cleanedText);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ error: "Failed to analyze images" }, { status: 500 });
  }
}