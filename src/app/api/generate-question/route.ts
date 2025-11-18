import { NextRequest, NextResponse } from 'next/server';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

// 통계 방법별 프롬프트 파일 매핑
const promptMapping: Record<string, string> = {
  // 다중선형회귀
  'OLS()': 'improved_prompt_multiple_regression.md',
  'LinearRegression()': 'improved_prompt_multiple_regression.md',

  // 로지스틱회귀
  'Logit()': 'improved_prompt_logistic.md',
  'LogisticRegression()': 'improved_prompt_logistic.md',

  // t검정
  'ttest_ind()': 'improved_prompt_ttest.md',
  'ttest_rel()': 'improved_prompt_ttest.md',
  'ttest_1samp()': 'improved_prompt_ttest.md',
  'mannwhitneyu()': 'improved_prompt_ttest.md',
  'wilcoxon()': 'improved_prompt_ttest.md',

  // ANOVA + Tukey
  'f_oneway()': 'improved_prompt_anova_tukey.md',
  'kruskal()': 'improved_prompt_anova_tukey.md',

  // 카이제곱
  'chi2_contingency()': 'improved_prompt_chisquare.md',
  'chisquare()': 'improved_prompt_chisquare.md',
  'fisher_exact()': 'improved_prompt_chisquare.md',

  // 상관분석
  'pearsonr()': 'improved_prompt_correlation.md',
  'spearmanr()': 'improved_prompt_correlation.md',
  'kendalltau()': 'improved_prompt_correlation.md',

  // F-검정 및 합동분산추정량
  'F = var1/var2': 'improved_prompt_f_test_pooled_variance.md',
  's²_p = ((n₁-1)s₁²+(n₂-1)s₂²)/(n₁+n₂-2)': 'improved_prompt_f_test_pooled_variance.md',
};

function getImprovedPrompt(functionName: string): string | null {
  const promptFile = promptMapping[functionName];
  if (!promptFile) return null;

  // 프롬프트 파일 경로 (프로젝트 루트 기준)
  const promptPath = join(process.cwd(), '@docs', 'prompt', promptFile);

  if (!existsSync(promptPath)) {
    console.warn(`Prompt file not found: ${promptPath}`);
    return null;
  }

  try {
    return readFileSync(promptPath, 'utf-8');
  } catch (error) {
    console.error(`Error reading prompt file: ${promptPath}`, error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { methodName, library, note, sampleCode } = body;

    console.log('Received request:', { methodName, library, note });
    console.log('Current working directory:', process.cwd());

    // API 키 확인
    if (!process.env.GEMINI_API_KEY) {
      console.error('GEMINI_API_KEY is not set');
      return NextResponse.json(
        { error: 'API key not configured. Please set GEMINI_API_KEY in .env.local' },
        { status: 500 }
      );
    }

    // 개선된 프롬프트 파일이 있는지 확인
    const improvedPrompt = getImprovedPrompt(methodName);
    console.log('Using improved prompt:', !!improvedPrompt);

    let prompt: string;

    if (improvedPrompt) {
      // 개선된 프롬프트 사용
      prompt = `${improvedPrompt}

---

# 🚨 중요: 문제 생성 요청

위 프롬프트의 지침을 정확히 따라서, 다음 통계 방법에 대한 예상 문제를 1개 생성해주세요.

메서드명: ${methodName}
라이브러리: ${library}
설명: ${note}

지금 바로 위 형식에 맞게 문제를 생성하세요.
`;
    } else {
      // 기본 프롬프트 사용
      prompt = `
당신은 빅데이터 분석기사 실기 시험의 3유형 문제를 출제하는 전문가입니다.

다음 통계 분석 방법에 대한 예상 문제를 1개 생성해주세요:

메서드명: ${methodName}
라이브러리: ${library}
설명: ${note}
샘플 코드:
${sampleCode}

문제 형식:
1. 문제 상황 설명
2. 주어진 데이터 설명
3. 구체적인 질문 (수치 답변 요구)
4. 예상 답안과 풀이 과정

실제 시험 형식에 맞게 작성해주세요.
`;
    }

    // 시스템 프롬프트: 출력 형식을 강제하는 핵심 규칙
    const systemPrompt = `당신은 빅데이터분석기사 실기시험 출제위원입니다.
문제를 생성할 때 반드시 다음 형식을 따라야 합니다:

## ❓ 질문

Q1. [구체적인 첫 번째 질문] (출력: 소수점 X자리)
Q2. [구체적인 두 번째 질문] (출력: 소수점 X자리)
Q3. [구체적인 세 번째 질문] (출력: 예/아니오)
Q4. [구체적인 네 번째 질문] (출력: 소수점 X자리)

⚠️ 절대 규칙:
- 반드시 "## ❓ 질문" 헤더를 포함하세요
- 각 질문은 Q1. Q2. Q3. Q4. Q5. 형식으로 번호를 매기세요 (최소 3개, 최대 7개)
- 질문 끝에 (출력: ...) 형식으로 출력 형식을 명시하세요
- 한 줄에 하나의 질문만 작성하세요
- "분석하시오", "검정하시오" 같은 모호한 표현 금지
- **1)**, **2)** 같은 다른 번호 형식 절대 사용 금지`;

    // Gemini API 직접 호출
    const fullPrompt = `${systemPrompt}\n\n---\n\n${prompt}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: improvedPrompt ? 8000 : 2000,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', response.status, errorData);
      return NextResponse.json(
        { error: `Gemini API error: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Gemini response received:', JSON.stringify(data, null, 2).slice(0, 500));
    const question = data.candidates?.[0]?.content?.parts?.[0]?.text || '문제 생성에 실패했습니다.';

    // 전체 질문 텍스트 로깅
    console.log('\n=== 생성된 문제 전체 ===');
    console.log(question);
    console.log('=== 질문 끝 ===\n');

    /* ===== OpenRouter 버전 (보존용) =====
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'BigData Mindmap Practice Generator',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-exp:free',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: improvedPrompt ? 8000 : 2000,
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', response.status, errorData);
      return NextResponse.json(
        { error: `OpenRouter API error: ${response.status} - ${errorData}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('OpenRouter response received:', JSON.stringify(data, null, 2).slice(0, 500));
    const question = data.choices?.[0]?.message?.content || '문제 생성에 실패했습니다.';
    ===== OpenRouter 버전 끝 ===== */

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: `Failed to generate question: ${errorMessage}` },
      { status: 500 }
    );
  }
}
