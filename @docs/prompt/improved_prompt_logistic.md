# 빅데이터분석기사 작업형 3유형 - 로지스틱회귀분석 문제 생성 프롬프트

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
[이진 분류 문제 상황: 합격/불합격, 구매/비구매 등]
## 데이터 생성 코드
```python
[30-50행, 1개 이진 종속변수 (0/1) + 2개 이상 독립변수]
```
## ❓ 질문
Q1. ... (출력: 소수점 X자리)
## 힌트
## 정답 코드
```

---

## ⚙️ 데이터 규칙

- ✅ 30-50행
- ✅ 종속변수: **이진 변수** (0/1, 합격/불합격, 구매/비구매)
- ✅ 독립변수: 2-4개 (연속형 또는 범주형)
- ✅ 리터럴 값 (np.random 금지)
- ✅ 변수명 한국어

```python
df = pd.DataFrame({
    '고객ID': [f'C{i:03d}' for i in range(1, 41)],
    '나이': [25, 30, 35, 40, 28, 33, 38, 26, 31, 36, ...],
    '소득': [3500, 4200, 5000, 5500, 3800, 4500, 5200, 3600, 4300, 5100, ...],
    '방문횟수': [2, 5, 7, 10, 3, 6, 8, 2, 5, 7, ...],
    '구매여부': [0, 1, 1, 1, 0, 1, 1, 0, 1, 1, ...]  # 0: 비구매, 1: 구매
})
```

---

## 📊 로지스틱회귀 핵심

### 필수: sm.add_constant() 사용!

```python
import statsmodels.api as sm
import numpy as np

# X, y 분리
X = df[['나이', '소득', '방문횟수']]
y = df['구매여부']

# 절편 추가 (필수!)
X = sm.add_constant(X)

# Logit 모델 적합
model = sm.Logit(y, X).fit()

# 주요 결과
print(model.summary())  # 전체 요약
print(model.params)  # 회귀계수 (로그 오즈)
print(np.exp(model.params))  # 오즈비 (Odds Ratio)
print(model.pvalues)  # p-value
```

### 오즈비 해석
- 오즈비 = np.exp(회귀계수)
- 오즈비 > 1: 독립변수 증가 시 Y=1 확률 증가
- 오즈비 < 1: 독립변수 증가 시 Y=1 확률 감소
- 오즈비 = 1: 독립변수와 Y 무관

---

## 💡 질문 예시

```
## ❓ 질문

Q1. '나이' 변수의 회귀계수를 구하시오. (출력: 소수점 4자리)
Q2. '나이' 변수의 오즈비를 구하시오. (출력: 소수점 3자리)
Q3. '소득' 변수의 p-value를 구하시오. (출력: 소수점 4자리)
Q4. '방문횟수' 변수가 유의수준 0.05에서 유의한지 판단하시오. (출력: "유의" 또는 "유의하지 않음")
Q5. 나이=30, 소득=4500, 방문횟수=6일 때 구매 확률을 구하시오. (출력: 소수점 3자리)
```

---

## 🎯 힌트

```markdown
## 힌트

### 필요한 라이브러리
- pandas, numpy
- statsmodels.api as sm

### 주요 함수
1. 절편 추가: `sm.add_constant(X)` ← 반드시!
2. 모델 적합: `sm.Logit(y, X).fit()`
3. 회귀계수: `model.params['변수명']`
4. 오즈비: `np.exp(model.params['변수명'])`
5. p-value: `model.pvalues['변수명']`
6. 예측 확률: `model.predict(새로운X)`

### 흔한 실수
❌ sm.add_constant() 누락
❌ Logit(X, y) 순서 (정답: Logit(y, X))
❌ 오즈비 계산 시 np.exp() 누락
❌ 종속변수가 문자열 ('구매', '비구매') → 0/1로 변환 필요
```

---

## 💻 정답 코드

```python
import pandas as pd
import numpy as np
import statsmodels.api as sm

df = pd.DataFrame({...})

# 종속변수가 문자열인 경우 0/1 변환
if df['구매여부'].dtype == 'object':
    df['구매여부'] = (df['구매여부'] == '구매').astype(int)

# X, y 분리
X = df[['나이', '소득', '방문횟수']]
y = df['구매여부']

# 절편 추가
X = sm.add_constant(X)

# Logit 모델
model = sm.Logit(y, X).fit()

# Q1
print(round(model.params['나이'], 4))

# Q2: 오즈비
print(round(np.exp(model.params['나이']), 3))

# Q3
print(round(model.pvalues['소득'], 4))

# Q4
print("유의" if model.pvalues['방문횟수'] < 0.05 else "유의하지 않음")

# Q5: 예측 확률
new_X = pd.DataFrame({
    'const': [1],
    '나이': [30],
    '소득': [4500],
    '방문횟수': [6]
})
prob = model.predict(new_X)
print(round(prob.values[0], 3))
```

---

## ✅ 체크리스트

- [ ] "## ❓ 질문" (이모지 포함)
- [ ] Q1. Q2. Q3. 형식
- [ ] 종속변수는 이진 (0/1)
- [ ] sm.add_constant() 반드시 포함
- [ ] Logit(y, X) 순서 정확
- [ ] 오즈비는 np.exp(계수)
- [ ] 예측 시 새 데이터에도 const 포함
- [ ] print 최소화
