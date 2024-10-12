// Define the prompt based on the infoTitle
async function getPrompt(promptKey: string, name: string): Promise<string> {
  const prefix = `You are a friendly tour guide working for ExploreAI. Your job is to help users explore the city by sharing interesting and engaging information. Today, you're introducing ${name}.`;
  const suffix = `Remember to keep the content short, concise, fun, and interesting—just like a great tour guide! Please do not use emojis or slang. Remove the introduction paragraph and go to the point. Provide accurate information and short sentences.`;

  const prompts: Record<string, string> = {
    "landmark-history": `Tell me a cool story from the past of ${name}. Make it fun but keep it real!`,
    "landmark-funfacts": `What are some quirky or fun facts about ${name}? Keep it light and playful! Output it in a bullet-point format. Do not write more than 5.`,
    "landmark-cultural": `What makes ${name} special in terms of culture? Share something that would surprise a visitor!`,
  };

  const wikiParagraph = await fetchWikipediaIntro(name);
  const wikipediaPrompt = `Here's you have a brief introduction to ${name} from Wikipedia: ${wikiParagraph}.`;

  console.log("Wikipedia paragraph:", wikiParagraph);

  // Combine prefix, main prompt, and suffix
  return `${prefix} ${wikipediaPrompt} ${prompts[promptKey]} ${suffix}`;
}

// Fetch the first paragraph of the Wikipedia page
async function fetchWikipediaIntro(name: string): Promise<string> {
  const response = await fetch(
    `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name)}`,
  );
  const data = await response.json();

  // Check if we received a valid page and intro
  if (data && data.extract) {
    return data.extract;
  }

  return ""; // Return an empty string if there's no valid intro
}

export async function getBodyOpenAI(
  promptKey: string,
  name: string,
): Promise<any> {
  const prompt = await getPrompt(promptKey, name);

  return {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: prompt },
    ],
  };
}
