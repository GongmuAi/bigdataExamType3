# 빅데이터분석기사 작업형 3유형 - 상관분석 문제 생성 프롬프트

## 🚨🚨🚨 [최우선] 질문 형식 - 반드시 Q1. Q2. Q3. 형식 사용! 🚨🚨🚨

```
## ❓ 질문

Q1. [질문] (출력: 소수점 X자리)
Q2. [질문] (출력: 소수점 X자리)
Q3. [질문] (출력: 예/아니오)
```

**⛔ 절대 금지:** **1)**, **2)** 형식 / "## 질문" (이모지 없이)
**✅ 반드시:** "## ❓ 질문" 헤더 / Q1. Q2. Q3. 형식 / (출력: ...) 명시

---

## 📋 문제 구조

```
# [제목]
## 시나리오
[2-3문장]
## 데이터 생성 코드
```python
[30-40행 리터럴 데이터, 2개 이상 연속형 변수]
```
## ❓ 질문
Q1. ... (출력: 소수점 X자리)
## 힌트
## 정답 코드
```

---

## ⚙️ 데이터 규칙

- ✅ 30-40행
- ✅ **2개 이상의 연속형 변수** (키, 몸무게, 성적, 판매량 등)
- ✅ 리터럴 값 (np.random 금지)
- ✅ 변수명 한국어

```python
df = pd.DataFrame({
    '학생ID': [f'S{i:02d}' for i in range(1, 31)],
    '공부시간': [2.5, 3.0, 1.5, 4.0, 2.0, 3.5, 4.5, 2.5, 3.0, 5.0,
                 1.0, 3.5, 2.5, 4.0, 3.0, 2.0, 4.5, 3.5, 1.5, 5.0,
                 2.5, 3.0, 4.0, 2.0, 3.5, 4.5, 3.0, 2.5, 4.0, 3.5],
    '시험점수': [65, 75, 55, 85, 60, 80, 90, 70, 75, 95,
                 50, 80, 65, 85, 75, 60, 90, 80, 55, 95,
                 70, 75, 85, 60, 80, 90, 75, 70, 85, 80]
})
```

---

## 📊 상관분석 유형

### 1. Pearson 상관계수 (연속형, 선형관계, 정규분포)
```python
from scipy.stats import pearsonr
corr, pval = pearsonr(df['변수1'], df['변수2'])
```

### 2. Spearman 상관계수 (비선형, 순위 기반)
```python
from scipy.stats import spearmanr
corr, pval = spearmanr(df['변수1'], df['변수2'])
```

### 3. Kendall Tau (순위 기반, 표본 작을 때)
```python
from scipy.stats import kendalltau
corr, pval = kendalltau(df['변수1'], df['변수2'])
```

---

## 💡 질문 예시

```
## ❓ 질문

Q1. '공부시간'과 '시험점수'의 Pearson 상관계수를 구하시오. (출력: 소수점 3자리)
Q2. Pearson 상관분석의 p-value를 구하시오. (출력: 소수점 4자리)
Q3. 유의수준 0.05에서 두 변수 간 유의한 상관관계가 있는지 판단하시오. (출력: "있다" 또는 "없다")
Q4. 3개 변수 중 절대값 기준 가장 강한 상관관계를 보이는 변수 쌍을 구하시오. (출력: "변수1-변수2")
```

---

## 🎯 힌트

```markdown
## 힌트

### 라이브러리
- scipy.stats: pearsonr, spearmanr, kendalltau

### 주요 함수
1. Pearson: `pearsonr(df['변수1'], df['변수2'])`
2. 가장 강한 상관: `abs(corr)` 사용

### 흔한 실수
❌ 음의 상관계수를 약한 상관으로 판단 (절대값 사용!)
❌ p-value 해석 오류 (p < 0.05면 유의함)
```

---

## 💻 정답 코드

```python
import pandas as pd
from scipy.stats import pearsonr

df = pd.DataFrame({...})

# Q1-Q2
corr, pval = pearsonr(df['공부시간'], df['시험점수'])
print(round(corr, 3))
print(round(pval, 4))

# Q3
print("있다" if pval < 0.05 else "없다")

# Q4 (3개 변수 간 상관분석)
corr1, _ = pearsonr(df['변수1'], df['변수2'])
corr2, _ = pearsonr(df['변수1'], df['변수3'])
corr3, _ = pearsonr(df['변수2'], df['변수3'])

abs_corrs = {
    '변수1-변수2': abs(corr1),
    '변수1-변수3': abs(corr2),
    '변수2-변수3': abs(corr3)
}
print(max(abs_corrs, key=abs_corrs.get))
```

---

## ✅ 체크리스트

- [ ] "## ❓ 질문" (이모지 포함)
- [ ] Q1. Q2. Q3. 형식
- [ ] 2개 이상 연속형 변수
- [ ] 절대값 기준 강한 상관 질문 시 abs() 사용
- [ ] print 최소화
