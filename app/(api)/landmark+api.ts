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

    console.log("Landmark ID:", landmarkId); // Log the landmark ID to check the output
    console.log("Clerk ID:", clerkId); // Log the clerk ID to check the output

    // Fixed query with proper table references
    const response = await sql`
      SELECT 
        landmarks.id, 
        landmarks.city_id AS "cityId", 
        landmarks.name, 
        landmarks.latitude, 
        landmarks.longitude, 
        landmarks.address, 
        landmarks.image, 
        COALESCE(userLandmarks.is_unlocked, FALSE) AS "isUnlocked",
        CASE 
          WHEN userLandmarks.unlocked_date IS NOT NULL 
          THEN TO_CHAR(userLandmarks.unlocked_date, 'DD Mon. YYYY')
          ELSE NULL 
        END AS "unlockedDate"
      FROM landmarks
      LEFT JOIN userLandmarks 
        ON landmarks.id = userLandmarks.landmark_id 
        AND userLandmarks.clerk_id = ${clerkId}
      WHERE landmarks.id = ${landmarkId};
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

    // Get the current date in DD/MM/YYYY format
    const currentDate = new Date();
    // 1999-01-08	ISO 8601; January 8 in any mode (recommended format)
    const unlockedDate = currentDate.toISOString().split("T")[0];

    const response = await sql`
      INSERT INTO userLandmarks (landmark_id, clerk_id, is_unlocked, unlocked_date)
      VALUES (${landmarkId}, ${clerkId}, ${isUnlocked}, ${unlockedDate})
      ON CONFLICT (landmark_id, clerk_id)
      DO UPDATE SET is_unlocked = EXCLUDED.is_unlocked, unlocked_date = EXCLUDED.unlocked_date;
    `;

    return new Response(JSON.stringify({ data: response[0] }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error updating landmark unlock state:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
