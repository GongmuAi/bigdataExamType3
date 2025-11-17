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
    const { methodName, library, note, sampleCode } = await request.json();

    // 개선된 프롬프트 파일이 있는지 확인
    const improvedPrompt = getImprovedPrompt(methodName);

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

## ⚠️ 반드시 지켜야 할 출력 형식

생성하는 문제는 **반드시** 다음 구조를 포함해야 합니다:

### 1. 시나리오 (간단히 2-3문장)
### 2. 데이터 생성 코드 (완전한 리터럴 데이터)
### 3. ❓ 질문 섹션 (가장 중요! 절대 생략 금지!)

**질문 섹션은 반드시 아래 형식을 따라야 합니다:**

\`\`\`
## ❓ 질문

**1)** [첫 번째 구체적인 질문]
- 출력 형식: [소수점 자릿수 등 명시]

**2)** [두 번째 구체적인 질문]
- 출력 형식: [명시]

**3)** [세 번째 구체적인 질문] (선택)
- 출력 형식: [명시]
\`\`\`

### 4. 힌트 (라이브러리, 함수명, 주의사항)
### 5. 정답 코드 (완전한 Python 코드)

## 🚫 절대 금지사항
- ❌ 시나리오만 있고 질문이 없는 형태
- ❌ 줄글 형태로 질문을 서술하는 것
- ❌ "분석하시오", "검정하시오" 등 모호한 지시
- ❌ 출력 형식을 명시하지 않는 것

## ✅ 반드시 포함
- ✅ **1)**, **2)**, **3)** 번호가 매겨진 명확한 질문
- ✅ 각 질문마다 구체적인 출력 형식 지정
- ✅ 소수점 자릿수 명시 (예: "소수점 셋째 자리에서 반올림")

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

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
        'X-Title': 'BigData Mindmap Practice Generator',
      },
      body: JSON.stringify({
        model: 'microsoft/mai-ds-r1:free',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: improvedPrompt ? 8000 : 2000,  // 개선된 프롬프트는 더 긴 응답 필요
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const question = data.choices?.[0]?.message?.content || '문제 생성에 실패했습니다.';

    return NextResponse.json({ question });
  } catch (error) {
    console.error('Error generating question:', error);
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    );
  }
}
