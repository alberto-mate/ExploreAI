import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);

    // Get cityId and clerk_id (user ID) from the query parameters
    const url = new URL(request.url);
    const cityId = url.searchParams.get("cityId");
    const clerkId = url.searchParams.get("clerkId");

    if (!cityId) {
      return Response.json({ error: "City ID is required" }, { status: 400 });
    }

    if (!clerkId) {
      return Response.json(
        { error: "User ID (clerk_id) is required" },
        { status: 400 },
      );
    }

    // Fetch landmarks with their unlocked status based on the user
    const response = await sql`
      SELECT 
        l.id, 
        l.city_id AS "cityId", 
        l.name, 
        l.latitude, 
        l.longitude, 
        l.address, 
        l.image, 
        COALESCE(ul.is_unlocked, FALSE) AS "isUnlocked"
      FROM landmarks l
      LEFT JOIN userLandmarks ul 
        ON l.id = ul.landmark_id 
        AND ul.clerk_id = ${clerkId}
      WHERE l.city_id = ${cityId};
    `;

    return Response.json({ data: response });
  } catch (error) {
    console.error("Error fetching landmarks:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
