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

    const systemPrompt = `당신은 마케팅 업무 관리 도우미입니다. 사용자가 자연어로 입력한 업무를 분석하여 두 가지 카테고리로 분류하세요.

【카테고리 구분 기준】
- "파트너 관리" (partnerTasks): 외부 업체 유얼스(유얼스마케팅)에 시킬 업무. 홍보 원고, 바이럴, 체험단, 블로그 포스팅, 맘카페 마케팅, 커뮤니티 홍보 등 외주·위탁 작업.
- "My Task" (tasks): 파트너(나)가 직접 할 업무. 콘텐츠 기획, 촬영, 상세페이지 제작, SNS 운영, 광고 세팅 등 직접 수행 업무.

피자설기 런칭 프로젝트 3단계 구조 (My Task용):
- 1단계(인프라): 채널 개설, 리뉴얼, 스마트스토어/쿠팡 세팅, 시장분석
- 2단계(상세페이지): 촬영, 카피, 디자인, 업로드
- 3단계(마케팅): 쇼츠 제작, 라이브, 광고, 성과 리포트

반드시 아래 JSON 형식으로만 응답하세요:
{
  "tasks": [
    { "title": "업무 제목", "phase": "1단계(인프라)|2단계(상세페이지)|3단계(마케팅)" }
  ],
  "partnerTasks": [
    { "title": "유얼스에 지시할 업무 제목", "total": 숫자, "unit": "개|건|명|회" }
  ],
  "message": "친절한 안내 메시지 (한국어, 어떤 카테고리에 몇 개 넣었는지 설명)"
}

partnerTasks의 total은 목표 수량(예: 원고 30개이면 30), unit은 개/건/명/회 중 적절한 것.
외부 업체 관련 업무는 반드시 partnerTasks에만 넣고 tasks에 넣지 마세요.${context ? `\n추가 맥락: ${context}` : ""}`;

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
