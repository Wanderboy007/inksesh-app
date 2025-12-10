import { NextRequest, NextResponse } from "next/server";
import { ApifyClient } from "apify-client";

// Initialize client (Ensure APIFY_API_TOKEN is in your .env)
const client = new ApifyClient({
  token: process.env.APIFY_API_TOKEN,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let { inputUrl } = body;

    if (!inputUrl) {
      return NextResponse.json(
        { error: "Instagram Username or URL is required" },
        { status: 400 }
      );
    }

    // Prepare Actor Input
    const actorInput = {
      username: [inputUrl], 
      resultsLimit: 5,
      searchType: "hashtag",
      searchLimit: 1,
    };

    console.log("🚀 Starting Apify Scraper for:", inputUrl);

    // Run the Actor
    const run = await client.actor("nH2AHrwxeTRJoN5hX").call(actorInput);

    // Fetch results from dataset
    const { items } = await client.dataset(run.defaultDatasetId).listItems();


    if (!items || items.length === 0) {
      return NextResponse.json({ error: "No posts found or profile is private." }, { status: 404 });
    }
    
    // Remove type filtering - check what the actual data structure is
    const normalizedPosts = items
      .map((item: any) => {
       
        return {
          id: item.id,
          url: item.displayUrl || item.images?.[0] || item.url,
          caption: item.caption || "Tattoo Image",
          permalink: item.url
        };
      })
      .filter((post: any) => post.url); // Only keep posts with URLs
    
  
    return NextResponse.json({ posts: normalizedPosts }, { status: 200 });

  } catch (error) {
    console.error("❌ Apify Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Instagram posts", details: String(error) },
      { status: 500 }
    );
  }
}