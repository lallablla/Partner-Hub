import { Router } from "express";
import { openai } from "@workspace/integrations-openai-ai-server";
import { logger } from "../lib/logger";

const router = Router();

router.post("/ai/parse-tasks", async (req, res) => {
  try {
    const { input, context } = req.body as { input: string; context?: string };

    if (!input) {
      res.status(400).json({ error: "input is required" });
      return;
    }

    const systemPrompt = `당신은 마케팅 업무 관리 도우미입니다. 사용자가 자연어로 입력한 업무 내용을 분석하여 구조화된 태스크 목록으로 변환해 주세요.

피자설기 런칭 프로젝트의 3단계 구조:
- 1단계(인프라): 채널 개설, 리뉴얼, 스마트스토어/쿠팡 키워드 리서치, 시장분석
- 2단계(상세페이지): 촬영, 카피, 디자인, 업로드
- 3단계(마케팅): 쇼츠 제작, 라이브, 성과 리포트

반드시 JSON 형식으로만 응답하세요:
{
  "tasks": [
    { "title": "태스크 제목", "phase": "1단계(인프라)|2단계(상세페이지)|3단계(마케팅)|기타" }
  ],
  "message": "친절한 안내 메시지 (한국어)"
}

사용자 입력을 실제 실행 가능한 단위 업무로 분리하고, 적절한 단계에 배치해 주세요.${context ? `\n추가 맥락: ${context}` : ""}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input },
      ],
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      res.status(500).json({ error: "AI response was empty" });
      return;
    }

    const parsed = JSON.parse(content);
    res.json(parsed);
  } catch (err) {
    logger.error({ err }, "Error parsing tasks with AI");
    res.status(500).json({ error: "Failed to parse tasks" });
  }
});

export default router;
