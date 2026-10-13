import OpenAI from "openai";

const MAX_MESSAGES = 20;
const MAX_MESSAGE_LENGTH = 4000;
const allowedRoles = new Set(["user", "assistant"]);

function normalizeMessages(value) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new Error("메시지를 입력해 주세요.");
  }

  return value.slice(-MAX_MESSAGES).map((message) => {
    const role = message?.role;
    const content = typeof message?.content === "string"
      ? message.content.trim().slice(0, MAX_MESSAGE_LENGTH)
      : "";

    if (!allowedRoles.has(role) || !content) {
      throw new Error("올바르지 않은 대화 형식입니다.");
    }

    return { role, content };
  });
}

export async function createChatReply(messages) {
  if (!process.env.OPENAI_API_KEY) {
    const error = new Error("서버에 OPENAI_API_KEY가 설정되지 않았습니다.");
    error.status = 500;
    throw error;
  }

  const input = normalizeMessages(messages);
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.responses.create({
    model: "gpt-4o-mini",
    instructions: "당신은 친절하고 정확한 한국어 AI 도우미입니다. 사용자의 언어에 맞춰 답하고, 모르는 내용은 솔직하게 말하세요.",
    input,
    max_output_tokens: 800
  });

  const reply = response.output_text?.trim();
  if (!reply) {
    throw new Error("AI 응답을 생성하지 못했습니다.");
  }

  return reply;
}

export async function chatHandler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "POST 요청만 허용됩니다." });
  }

  try {
    const reply = await createChatReply(req.body?.messages);
    return res.status(200).json({ reply });
  } catch (error) {
    console.error("Chat API error:", error?.message);
    const status = error?.status || (error?.message?.includes("형식") || error?.message?.includes("입력") ? 400 : 500);
    return res.status(status).json({
      error: status === 500 ? "답변을 생성하는 중 문제가 발생했습니다." : error.message
    });
  }
}
