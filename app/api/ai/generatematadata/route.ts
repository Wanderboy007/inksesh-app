import { NextRequest, NextResponse } from "next/server";
import { openai } from "@/lib/ai/openai";
import { prisma } from "@/lib/db/prisma";
import { z } from "zod";
import { zodResponseFormat } from "openai/helpers/zod";

const TattooAnalysisSchema = z.object({
  analysis: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      caption: z.string(),
      gender: z.enum(["MALE", "FEMALE", "UNISEX"]),
      size: z.enum(["SMALL", "MEDIUM", "LARGE", "EXTRA_LARGE", "FULL_COVERAGE"]),
      bodyPart: z.string(),
      style: z.array(z.string()),
      themes: z.array(z.string()),
    })
  ),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, designIds } = body;

    if (!userId || !designIds) {
      return NextResponse.json({ error: "Missing inputs" }, { status: 400 });
    }

    const idsArray = designIds.split(",").filter(Boolean);

    const designs = await prisma.design.findMany({
      where: {
        id: { in: idsArray },
        userId: userId,
      },
      select: { id: true, imageUrl: true },
    });

    if (designs.length === 0) {
      return NextResponse.json({ error: "No designs found" }, { status: 404 });
    }

    const contentPayload: any[] = [
      {
        type: "text",
        text: `Analyze these tattoo images. Return a JSON object with the metadata. 
        For 'id', use the exact Image ID provided.`,
      },
    ];

    designs.forEach((design) => {
      contentPayload.push({ type: "text", text: `Image ID: ${design.id}` });
      contentPayload.push({
        type: "image_url",
        image_url: { url: design.imageUrl, detail: "low" },
      });
    });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content: "You are an expert Tattoo Archivist. Analyze the images strictly.",
        },
        { role: "user", content: contentPayload },
      ],
      response_format: zodResponseFormat(TattooAnalysisSchema, "tattoo_analysis"),
    });

    const message = completion.choices[0].message as any;

    let result: z.infer<typeof TattooAnalysisSchema> | null = null;

    if (message.refusal) {
      throw new Error(`AI Refusal: ${message.refusal}`);
    }

    if (message.parsed) {
      result = message.parsed as any;
    } else if (message.content) {
      try {
        result = JSON.parse(message.content);
      } catch (e) {
        throw new Error("Failed to parse JSON from AI content");
      }
    }

    if (!result || !result.analysis) {
      throw new Error("AI returned invalid structure");
    }

    await prisma.$transaction(
      result.analysis.map((item) => 
        prisma.design.update({
          where: { id: item.id },
          data: {
            title: item.title.slice(0, 20), 
            caption: item.caption.slice(0, 280),
            
            gender: item.gender,
            size: item.size,
            bodyPart: item.bodyPart,
            styles: item.style, 
            themes: item.themes, 
          }
        })
      )
    );


    return NextResponse.json({ success: true, count: result.analysis.length });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 }
    );
  }
}