import { neon } from "@neondatabase/serverless";

import { CityProgress } from "@/types";

export async function GET(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const url = new URL(request.url);
    const clerkId = url.searchParams.get("clerkId");

    if (!clerkId) {
      return Response.json(
        { error: "User ID (clerk_id) is required" },
        { status: 400 },
      );
    }

    console.log("Fetching city progress for clerk:", clerkId);

    // Query to get the number of unlocked landmarks and total landmarks per city for the given user
    const response = await sql`
      SELECT
        c.id AS "cityId",
        c.name AS "cityName",
        COUNT(l.id) AS "totalLandmarks",
        COUNT(ul.landmark_id) AS "unlockedLandmarks"
      FROM cities c
      LEFT JOIN landmarks l ON c.id = l.city_id
      LEFT JOIN userLandmarks ul ON l.id = ul.landmark_id AND ul.clerk_id = ${clerkId} AND ul.is_unlocked = TRUE
      GROUP BY c.id
      ORDER BY c.id;
    `;

    // Build the dictionary format for city progress
    const cityProgress: CityProgress = {};
    response.forEach((city: any) => {
      const totalLandmarks = parseInt(city.totalLandmarks, 10);
      const unlockedLandmarks = parseInt(city.unlockedLandmarks, 10);
      cityProgress[city.cityId] = {
        cityName: city.cityName,
        totalLandmarks: totalLandmarks,
        unlockedLandmarks: unlockedLandmarks,
        lockedLandmarks: totalLandmarks - unlockedLandmarks,
        progress:
          totalLandmarks === 0 ? 0 : (unlockedLandmarks / totalLandmarks) * 100,
      };
    });

    return Response.json({ data: cityProgress });
  } catch (error) {
    console.error("Error fetching city progress:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
