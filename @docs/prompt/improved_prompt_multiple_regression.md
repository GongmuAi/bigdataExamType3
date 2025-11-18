# 빅데이터분석기사 작업형 3유형 - 다중선형회귀분석 문제 생성 프롬프트

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
[Y를 예측하기 위해 X1, X2, X3... 사용하는 상황]
## 데이터 생성 코드
```python
[30-50행, 1개 종속변수 + 2개 이상 독립변수]
```
## ❓ 질문
Q1. ... (출력: 소수점 X자리)
## 힌트
## 정답 코드
```

---

## ⚙️ 데이터 규칙

- ✅ 30-50행
- ✅ 종속변수 1개 (연속형, Y)
- ✅ 독립변수 2-4개 (연속형, X1, X2, X3...)
- ✅ 리터럴 값 (np.random 금지)
- ✅ 변수명 한국어

```python
df = pd.DataFrame({
    '고객ID': [f'C{i:03d}' for i in range(1, 41)],
    '광고비': [100, 120, 90, 150, 110, 130, 140, 105, 125, 145, ...],
    '매장수': [5, 6, 4, 8, 5, 7, 7, 5, 6, 8, ...],
    '직원수': [10, 12, 8, 15, 10, 13, 14, 10, 12, 15, ...],
    '매출액': [500, 580, 450, 720, 520, 650, 680, 510, 600, 700, ...]
})
```

---

## 📊 다중선형회귀 핵심

### 필수: sm.add_constant() 사용!

```python
import statsmodels.api as sm

# X, y 분리
X = df[['광고비', '매장수', '직원수']]
y = df['매출액']

# 절편 추가 (필수!)
X = sm.add_constant(X)

# OLS 모델 적합
model = sm.OLS(y, X).fit()

# 주요 결과
print(model.summary())  # 전체 요약
print(model.params)  # 회귀계수
print(model.pvalues)  # p-value
print(model.rsquared)  # R²
```

---

## 💡 질문 예시

```
## ❓ 질문

Q1. '광고비' 변수의 회귀계수를 구하시오. (출력: 소수점 3자리)
Q2. '광고비' 변수의 p-value를 구하시오. (출력: 소수점 4자리)
Q3. '매장수' 변수가 유의수준 0.05에서 유의한지 판단하시오. (출력: "유의" 또는 "유의하지 않음")
Q4. 모델의 R²를 구하시오. (출력: 소수점 3자리)
Q5. 광고비=120, 매장수=6, 직원수=12일 때 예측 매출액을 구하시오. (출력: 소수점 2자리)
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
2. 모델 적합: `sm.OLS(y, X).fit()`
3. 회귀계수: `model.params['변수명']`
4. p-value: `model.pvalues['변수명']`
5. R²: `model.rsquared`
6. 예측: `model.predict(새로운X)`

### 흔한 실수
❌ sm.add_constant() 누락 (절편 0이 됨)
❌ OLS(X, y) 순서 (정답: OLS(y, X))
❌ 예측 시 새 데이터에 add_constant 안 함
```

---

## 💻 정답 코드

```python
import pandas as pd
import numpy as np
import statsmodels.api as sm

df = pd.DataFrame({...})

# X, y 분리
X = df[['광고비', '매장수', '직원수']]
y = df['매출액']

# 절편 추가
X = sm.add_constant(X)

# OLS 모델
model = sm.OLS(y, X).fit()

# Q1-Q2
print(round(model.params['광고비'], 3))
print(round(model.pvalues['광고비'], 4))

# Q3
print("유의" if model.pvalues['매장수'] < 0.05 else "유의하지 않음")

# Q4
print(round(model.rsquared, 3))

# Q5: 예측
new_X = pd.DataFrame({
    'const': [1],
    '광고비': [120],
    '매장수': [6],
    '직원수': [12]
})
pred = model.predict(new_X)
print(round(pred.values[0], 2))
```

---

## ✅ 체크리스트

- [ ] "## ❓ 질문" (이모지 포함)
- [ ] Q1. Q2. Q3. 형식
- [ ] sm.add_constant() 반드시 포함
- [ ] OLS(y, X) 순서 정확
- [ ] 예측 시 새 데이터에도 const 컬럼 포함
- [ ] print 최소화
