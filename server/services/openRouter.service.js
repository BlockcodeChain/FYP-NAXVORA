import axios from "axios";

export const askai = async (messages) => {
  try {
    // VALIDATION
    if (
      !messages ||
      !Array.isArray(messages) ||
      messages.length === 0
    ) {
      throw new Error("Messages array is empty.");
    }

    // API CALL
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // RESPONSE
    const content =
      response?.data?.choices?.[0]?.message?.content;

    // EMPTY CHECK
    if (!content || !content.trim()) {
      throw new Error("AI returned empty response");
    }

    return content;

  } catch (error) {
    console.log(
      "AI ERROR:",
      error?.response?.data || error.message
    );

    return "Something went wrong while generating AI response.";
  }
};