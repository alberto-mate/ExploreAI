// import OpenAI from "openai";

export async function GET(request: Request) {
  // const openai = new OpenAI({
  //   apiKey: process.env.EXPO_PUBLIC_OPENAI_KEY,
  // });
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const infoTitle = searchParams.get("infoTitle");

    if (!name || !infoTitle) {
      return Response.json(
        { error: "Missing name or infoTitle" },
        { status: 400 },
      );
    }

    // Define the prompt based on the infoTitle
    const prompts: Record<string, string> = {
      History: `Provide a detailed historical description of the landmark named ${name}.`,
      "Fun Facts": `Share some fun facts about the landmark named ${name}.`,
      "Cultural Insights": `Give some cultural insights on the landmark named ${name}.`,
    };

    const prompt = prompts[infoTitle];

    if (!prompt) {
      return Response.json({ error: "Invalid infoTitle" }, { status: 400 });
    }

    // Call OpenAI API to generate the content
    // const completion = await openai.chat.completions.create({
    //   model: "gpt-4o-mini",
    //   messages: [
    //     { role: "system", content: "You are a helpful assistant." },
    //     { role: "user", content: prompt },
    //   ],
    // });

    const completion = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.EXPO_PUBLIC_OPENAI_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: prompt },
          ],
        }),
      },
    ).then((response) => response.json());

    const responseText = completion.choices[0].message.content;

    return Response.json({ data: responseText });
  } catch (error) {
    console.error("Error fetching landmark info:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
