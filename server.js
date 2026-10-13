import "dotenv/config";
import express from "express";
import { chatHandler } from "./lib/chat.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: "100kb" }));
app.use(express.static("public"));
app.post("/api/chat", chatHandler);

if (process.env.VERCEL !== "1") {
  app.listen(port, "127.0.0.1", () => {
    console.log(`AI 챗봇이 http://localhost:${port} 에서 실행 중입니다.`);
  });
}

export default app;
