import { neon } from "@neondatabase/serverless";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const url = new URL(request.url);
    const landmarkId = url.searchParams.get("landmarkId");
    const clerkId = url.searchParams.get("clerkId");

    if (!landmarkId) {
      return Response.json(
        { error: "Landmark ID is required" },
        { status: 400 },
      );
    }

    if (!clerkId) {
      return Response.json(
        { error: "User ID (clerk_id) is required" },
        { status: 400 },
      );
    }

    // Fetch the specific landmark with unlocked status based on the user
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
      WHERE l.id = ${landmarkId};
    `;

    if (response.length === 0) {
      return Response.json({ error: "Landmark not found" }, { status: 404 });
    }

    // Return the landmark information matching the LandmarkProps interface
    return Response.json({ data: response[0] });
  } catch (error) {
    console.error("Error fetching landmark:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// Update the unlock state of a landmark for a user
export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { landmarkId, clerkId, isUnlocked } = await request.json();

    if (!landmarkId || !clerkId || typeof isUnlocked === "undefined") {
      return Response.json(
        {
          error: "Missing required fields: landmarkId, clerkId, or isUnlocked",
        },
        { status: 400 },
      );
    }

    const response = await sql`
      INSERT INTO userLandmarks (landmark_id, clerk_id, is_unlocked)
      VALUES (${landmarkId}, ${clerkId}, ${isUnlocked})
      ON CONFLICT (landmark_id, clerk_id)
      DO UPDATE SET is_unlocked = EXCLUDED.is_unlocked;
    `;

    return new Response(JSON.stringify({ data: response[0] }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating landmark unlock state:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
