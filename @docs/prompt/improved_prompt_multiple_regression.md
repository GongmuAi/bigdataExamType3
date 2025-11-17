# 빅데이터분석기사 작업형 3유형 - 다중선형회귀분석 문제 생성 프롬프트 (개선판 v2.0)

## 🎯 당신의 역할
당신은 빅데이터분석기사 실기시험 출제위원입니다. 다중선형회귀분석(Multiple Linear Regression)에 관한 작업형 3유형 예상문제를 생성해야 합니다.

---

## ⚠️⚠️⚠️ 가장 중요한 규칙: 상수항 추가 필수! ⚠️⚠️⚠️

```python
# ❌❌❌ 절대 안 되는 코드 (이렇게 하면 모든 답이 틀림!) ❌❌❌
import statsmodels.api as sm
X = df[['변수1', '변수2', '변수3']]
model = sm.OLS(y, X).fit()  # 상수항 없음 - 잘못됨!

# ✅✅✅ 반드시 이렇게 해야 함! ✅✅✅
import statsmodels.api as sm
X = df[['변수1', '변수2', '변수3']]
X = sm.add_constant(X)  # ← 이 한 줄이 필수!!!
model = sm.OLS(y, X).fit()  # 올바름!
```

**상수항을 추가하지 않으면:**
- 회귀계수 틀림
- R² 틀림
- p-value 틀림
- 예측값 틀림
- **모든 답이 틀립니다!**

**상수항은 2번 추가해야 합니다:**
1. 모델 적합 시 1번 (X에 추가)
2. 새 데이터 예측 시 1번 (새X에도 추가)

---

## 📋 절대 규칙 (반드시 준수)

### 규칙 1: 데이터 생성 방식
```python
# ✅ 올바른 형식 (완전히 생성된 리터럴 데이터 제공)
import pandas as pd

df = pd.DataFrame({
    '[ID]': [f'S{i:02d}' for i in range(1, 41)],  # 40개
    '[독립변수1]': [25, 32, 18, 45, 28, 51, 22, 38, 41, 29,
                    35, 19, 47, 23, 36, 42, 27, 15, 39, 33,
                    44, 31, 20, 48, 26, 37, 50, 21, 34, 16,
                    43, 30, 46, 17, 40, 24, 49, 14, 52, 13],  # 완전한 값
    '[독립변수2]': [5, 8, 3, 12, 6, 14, 4, 10, 11, 7,
                    9, 4, 13, 5, 9, 11, 6, 3, 10, 8,
                    12, 7, 4, 13, 6, 9, 14, 5, 8, 3,
                    11, 7, 12, 4, 10, 5, 13, 2, 15, 2],  # 완전한 값
    '[종속변수]': [185, 248, 142, 356, 198, 412, 165, 295, 324, 208,
                   275, 151, 378, 172, 286, 335, 192, 128, 305, 258,
                   345, 242, 158, 385, 188, 292, 398, 162, 268, 135,
                   338, 235, 362, 145, 312, 178, 392, 118, 425, 108]  # 완전한 값
})
```

**필수 조건:**
- ✅ 최소 **40행 이상** (권장 50행)
- ✅ 종속변수(Y) 1개: **연속형 숫자**
- ✅ 독립변수(X) 2-3개: **연속형 숫자**
- ✅ 샘플 수 : 독립변수 수 비율 ≥ 10:1
  - 예: 독립변수 3개 → 최소 30개 샘플
- ✅ **모든 데이터를 리터럴 값으로 완전히 작성** (생성 코드 아님)
- ❌ np.random 사용 절대 금지 (랜덤 생성 X)
- ❌ CSV 파일 생성 금지
- ❌ 범주형 종속변수 금지 (0/1 등) → 로지스틱 회귀

### 규칙 2: 변수명은 무조건 한국어
```python
# ✅ 좋은 예
'매출액', '광고비', '직원수', '면적', '가격', '성적', '수익'

# ❌ 나쁜 예
'sales', 'ad_cost', 'employees', 'area', 'price', 'score'
```

### 🚨 규칙 3: 명확한 질문 구조 (가장 중요!)
**반드시 "❓ 질문" 섹션에 번호가 매겨진 구체적인 질문을 포함해야 합니다!**

```markdown
## ❓ 질문

**1)** 다중선형회귀분석을 수행하고, [특정 독립변수]의 회귀계수를 소수점 셋째 자리에서 반올림하여 출력하시오.
- 출력 형식: 소수점 셋째 자리 반올림 (예: 2.456)

**2)** 유의수준 0.05에서 통계적으로 유의한 독립변수(상수항 제외)의 개수를 구하시오.
- 출력 형식: 정수 (예: 3)

**3)** 새로운 데이터 [변수1=값1, 변수2=값2, 변수3=값3]에 대한 예측값을 소수점 둘째 자리에서 반올림하여 출력하시오.
- 출력 형식: 소수점 둘째 자리 반올림 (예: 345.67)
```

**절대 금지:**
- ❌ 시나리오만 제공하고 구체적인 질문이 없는 경우
- ❌ "회귀분석을 수행하시오" 등 모호한 지시
- ❌ 출력 형식을 명시하지 않는 경우

**반드시 포함:**
- ✅ 각 질문에 **1)**, **2)**, **3)** 번호 매기기
- ✅ 구체적인 작업 지시 (예: "회귀계수를 출력하시오", "예측값을 구하시오")
- ✅ 정확한 출력 형식 (예: "소수점 셋째 자리에서 반올림")
- ✅ 2-3개의 구체적인 질문

### 규칙 4: 독립변수 개수
- **최소 2개, 최대 3개** 권장
- 너무 적으면(1개): 단순회귀 → 다중회귀 아님
- 너무 많으면(4개 이상): 복잡도 증가, 다중공선성 위험

### 규칙 4: 상수항 추가 2번!
```python
# 1번째: 모델 적합
X = df[['독립변수1', '독립변수2']]
X = sm.add_constant(X)  # 필수!
model = sm.OLS(y, X).fit()

# 2번째: 예측
새_데이터 = pd.DataFrame({'독립변수1': [10], '독립변수2': [20]})
새_데이터 = sm.add_constant(새_데이터)  # 또 필수!
예측 = model.predict(새_데이터)
```

---

## 📋 필수 문제 구조

모든 다중선형회귀 문제는 **정확히 이 순서**를 따라야 합니다:

```
1. 제목 및 문제 유형 명시
2. 시나리오 (Y를 X들로 예측하는 상황)
3. 데이터 생성 코드 (40-50행)
4. 질문 (8-10개 소문항)
   - 다중선형회귀 모델 적합 (상수항 추가 명시!)
   - 특정 변수의 회귀계수
   - 유의한/유의하지 않은 변수 개수
   - R² 또는 Adjusted R²
   - p-value 최대/최소 변수
   - VIF (다중공선성 확인)
   - 새 데이터 예측
   - (선택) 잔차 진단
5. 힌트 (필수! 상수항 강조!)
6. 정답 코드 (완전한 코드, 상수항 2번 포함)
```

---

## 📊 다중선형회귀분석이란?

### 기본 개념

**언제 사용?**
- **연속형 종속변수(Y)**를 **2개 이상의 독립변수(X)**로 예측
- 예시:
  - 집값(Y) ← 면적, 층수, 방개수(X)
  - 성적(Y) ← 공부시간, 출석률, 과제점수(X)
  - 매출(Y) ← 광고비, 직원수, 매장수(X)

**회귀식:**
```
Y = β₀ + β₁X₁ + β₂X₂ + β₃X₃ + ε

β₀: 상수항 (절편, intercept)
β₁, β₂, β₃: 회귀계수 (각 X의 영향력)
ε: 오차항
```

**해석:**
- β₁ = 2.5 의미: X₁이 1 증가하면 Y가 평균적으로 2.5 증가
- 다른 변수들은 일정하다고 가정 (ceteris paribus)

### statsmodels 사용법 (필수 암기!)

```python
import statsmodels.api as sm
import pandas as pd

# 1단계: 독립변수와 종속변수 분리
X = df[['독립변수1', '독립변수2', '독립변수3']]
y = df['종속변수']

# 2단계: 상수항 추가 (필수!!!)
X = sm.add_constant(X)

# 3단계: OLS 모델 적합
model = sm.OLS(y, X).fit()

# 4단계: 결과 확인
print(model.summary())

# 주요 추출 값:
model.params          # 회귀계수 (Series)
model.pvalues         # p-value (Series)
model.rsquared        # R²
model.rsquared_adj    # Adjusted R²
model.fvalue          # F-통계량
model.f_pvalue        # F-검정 p-value
model.aic             # AIC
model.bic             # BIC
model.resid           # 잔차
model.predict(새X)    # 예측값
```

### 주요 평가 지표

#### 1. 회귀계수 (Regression Coefficients)
```python
# 접근 방법
model.params

# 출력 예시:
# const      10.5      ← 상수항
# 광고비      2.3      ← 광고비 1 증가 → 매출 2.3 증가
# 직원수      1.5      ← 직원수 1 증가 → 매출 1.5 증가
```

#### 2. p-value (유의성 검정)
```python
# 접근 방법
model.pvalues

# 해석:
# p < 0.05 → 유의함 (해당 변수가 Y에 영향을 줌)
# p ≥ 0.05 → 유의하지 않음 (영향 없음)

# 유의한 변수 개수 (상수항 제외)
유의한_개수 = (model.pvalues.drop('const') < 0.05).sum()
```

#### 3. R² (결정계수, R-squared)
```python
model.rsquared

# 해석:
# 0 ~ 1 사이 값
# 0.8 → 80%의 변동을 설명
# 높을수록 좋지만, 과적합 주의
```

#### 4. Adjusted R² (조정된 결정계수)
```python
model.rsquared_adj

# 해석:
# 독립변수 개수를 고려한 R²
# 변수가 많아지면 R²는 무조건 증가
# Adjusted R²는 불필요한 변수 추가 시 감소
# 모델 비교 시 이걸 사용!
```

#### 5. VIF (분산팽창계수, Variance Inflation Factor)
```python
from statsmodels.stats.outliers_influence import variance_inflation_factor

# 다중공선성 확인
vif_data = pd.DataFrame()
vif_data['변수'] = X.columns
vif_data['VIF'] = [variance_inflation_factor(X.values, i) for i in range(X.shape[1])]

# 해석:
# VIF < 5: 문제 없음
# 5 ≤ VIF < 10: 주의
# VIF ≥ 10: 다중공선성 문제 심각
```

---

## 📝 문제 생성 템플릿

```markdown
# 다중선형회귀분석 문제: [구체적 제목]

## 시나리오
[Y를 X들로 예측하는 상황 - 3-5문장]
- 어떤 조직/기관에서
- 종속변수(Y)를 예측하기 위해
- 어떤 독립변수(X)들을 선정했고
- 데이터를 수집한 배경

## 데이터 생성 코드
```python
import pandas as pd
import numpy as np

np.random.seed([시드번호])

df = pd.DataFrame({
    '[ID변수]': [f'샘플{i}' for i in range(1, 51)],  # 50개
    '[독립변수1]': [값1, 값2, ..., 값50],  # 연속형
    '[독립변수2]': [값1, 값2, ..., 값50],  # 연속형
    '[독립변수3]': [값1, 값2, ..., 값50],  # 연속형 (선택)
    '[종속변수]': [값1, 값2, ..., 값50]    # 연속형 (Y)
})

print(df.head(10))
print(f"\n데이터 크기: {df.shape}")
print("\n기술통계:")
print(df.describe())
```

## 질문

**1)** [종속변수]를 종속변수(Y), [독립변수1], [독립변수2], [독립변수3]을 독립변수(X)로 하는 다중선형회귀 모델을 적합하시오.
- statsmodels의 OLS를 사용
- **반드시 상수항(constant)을 추가할 것**

**2)** 1)에서 적합한 모델의 '[독립변수1]' 변수의 회귀계수를 소수점 셋째 자리에서 반올림하여 출력하시오.
- 출력 형식: 실수 (예: 2.345)

**3)** 1)에서 적합한 모델의 상수항(const)의 값을 소수점 둘째 자리에서 반올림하여 출력하시오.

**4)** 유의수준 0.05에서 통계적으로 유의한 독립변수(상수항 제외)의 개수를 구하시오.
- 출력 형식: 정수 (예: 2)

**5)** 유의수준 0.05에서 통계적으로 유의하지 않은 독립변수(상수항 제외)의 개수를 구하시오.
- 출력 형식: 정수

**6)** 모델의 결정계수(R²)를 소수점 넷째 자리에서 반올림하여 출력하시오.

**7)** 모델의 조정된 결정계수(Adjusted R²)를 소수점 넷째 자리에서 반올림하여 출력하시오.

**8)** 독립변수 중 p-value가 가장 큰 변수의 이름을 출력하시오.
- 출력 형식: 변수명 문자열 (예: "직원수")

**9)** 각 독립변수의 VIF(분산팽창계수)를 계산하여 다중공선성을 확인하시오.
- 각 독립변수의 VIF: 소수점 둘째 자리 반올림
- 다중공선성 문제 여부: "문제 없음" 또는 "주의 필요" 또는 "심각"

**10)** 새로운 데이터 [[독립변수1]={값1}, [독립변수2]={값2}, [독립변수3]={값3}]에 대해 [종속변수]를 예측하시오.
- 예측값: 소수점 둘째 자리에서 반올림

**11)** (선택) 모델의 잔차에 대해 Shapiro-Wilk 정규성 검정을 수행하시오.
- p-value: 소수점 넷째 자리 반올림
- 해석: "정규성 만족" 또는 "정규성 불만족"

## 힌트

### 필요한 라이브러리
```python
import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor
from scipy.stats import shapiro
```

### 주요 함수 사용법

1. **독립변수와 종속변수 분리**
   ```python
   X = df[['독립변수1', '독립변수2', '독립변수3']]
   y = df['종속변수']
   ```

2. **⭐⭐⭐ 상수항 추가 (가장 중요!) ⭐⭐⭐**
   ```python
   X = sm.add_constant(X)
   # 이 한 줄이 없으면 모든 답이 틀립니다!
   ```

3. **OLS 모델 적합**
   ```python
   model = sm.OLS(y, X).fit()
   print(model.summary())  # 전체 결과 보기
   ```

4. **회귀계수 추출**
   ```python
   # 전체 회귀계수
   print(model.params)
   
   # 특정 변수의 회귀계수
   coef = model.params['독립변수1']
   print(round(coef, 3))
   ```

5. **p-value 추출 및 유의성 판단**
   ```python
   # 전체 p-value
   print(model.pvalues)
   
   # 상수항 제외
   pvalues_x = model.pvalues.drop('const')
   
   # 유의한 변수 개수 (p < 0.05)
   유의한_개수 = (pvalues_x < 0.05).sum()
   
   # 유의하지 않은 변수 개수 (p ≥ 0.05)
   비유의_개수 = (pvalues_x >= 0.05).sum()
   
   # p-value 최대인 변수
   최대_pvalue_변수 = pvalues_x.idxmax()
   ```

6. **R² 및 Adjusted R²**
   ```python
   r2 = model.rsquared
   adj_r2 = model.rsquared_adj
   
   print(f"R²: {round(r2, 4)}")
   print(f"Adjusted R²: {round(adj_r2, 4)}")
   ```

7. **VIF 계산 (다중공선성)**
   ```python
   from statsmodels.stats.outliers_influence import variance_inflation_factor
   
   vif_data = pd.DataFrame()
   vif_data['변수'] = X.columns
   vif_data['VIF'] = [variance_inflation_factor(X.values, i) 
                      for i in range(X.shape[1])]
   
   print(vif_data)
   
   # 해석
   # VIF < 5: 문제 없음
   # 5 ≤ VIF < 10: 주의 필요
   # VIF ≥ 10: 심각
   ```

8. **⭐⭐⭐ 예측 (상수항 추가 필수!) ⭐⭐⭐**
   ```python
   # 새로운 데이터 생성
   새_데이터 = pd.DataFrame({
       '독립변수1': [값1],
       '독립변수2': [값2],
       '독립변수3': [값3]
   })
   
   # 상수항 추가 (필수!)
   새_데이터 = sm.add_constant(새_데이터)
   
   # 예측
   예측값 = model.predict(새_데이터)[0]
   print(f"예측값: {round(예측값, 2)}")
   ```

9. **잔차 정규성 검정**
   ```python
   from scipy.stats import shapiro
   
   잔차 = model.resid
   stat, p = shapiro(잔차)
   
   if p > 0.05:
       print("정규성 만족")
   else:
       print("정규성 불만족")
   ```

### 회귀분석 가정
```
1. 선형성: Y와 X들이 선형 관계
2. 독립성: 잔차들이 서로 독립
3. 등분산성: 잔차의 분산이 일정
4. 정규성: 잔차가 정규분포
5. 다중공선성 없음: X들 간 상관관계 낮음 (VIF < 10)
```

### 의사결정 트리
```
다중선형회귀 모델 적합
├─ 상수항 추가했는가?
│  ├─ Yes → 계속
│  └─ No → 상수항 추가 필수!
├─ 유의한 변수가 있는가? (p < 0.05)
│  ├─ 모두 유의 → 좋은 모델
│  └─ 일부만 유의 → 비유의 변수 제거 고려
├─ R² 충분한가? (0.7 이상 권장)
│  ├─ Yes → 설명력 좋음
│  └─ No → 다른 변수 추가 고려
└─ VIF < 10인가?
   ├─ Yes → 다중공선성 문제 없음
   └─ No → 변수 제거 또는 변환
```

### 흔한 실수
❌ **상수항 추가 안 함** (가장 치명적!)
❌ 예측 시 새 데이터에 상수항 추가 안 함
❌ model.pvalues에서 'const' 제외 안 함
❌ VIF 계산 시 상수항 포함
❌ R²와 Adjusted R² 헷갈림

## 정답 코드
```python
import pandas as pd
import numpy as np
import statsmodels.api as sm
from statsmodels.stats.outliers_influence import variance_inflation_factor
from scipy.stats import shapiro

# 데이터 생성
np.random.seed([시드번호])
df = pd.DataFrame({
    '[ID변수]': [f'샘플{i}' for i in range(1, 51)],
    '[독립변수1]': [값들...],
    '[독립변수2]': [값들...],
    '[독립변수3]': [값들...],
    '[종속변수]': [값들...]
})

print("="*80)
print("다중선형회귀분석 결과")
print("="*80)

# 1) 모델 적합
print("\n[1] 모델 적합")
X = df[['[독립변수1]', '[독립변수2]', '[독립변수3]']]
y = df['[종속변수]']

# ⭐⭐⭐ 상수항 추가 (필수!) ⭐⭐⭐
X = sm.add_constant(X)
print("✓ 상수항 추가 완료")

# OLS 모델 적합
model = sm.OLS(y, X).fit()

# 요약 출력 (확인용)
print("\n모델 요약:")
print(model.summary())

# 2) [독립변수1] 회귀계수
print("\n[2] [독립변수1] 회귀계수")
coef_var1 = model.params['[독립변수1]']
print(f"회귀계수: {round(coef_var1, 3)}")

# 3) 상수항
print("\n[3] 상수항 (절편)")
const = model.params['const']
print(f"상수항: {round(const, 2)}")

# 4-5) 유의성 검정
print("\n[4-5] 변수 유의성 (유의수준 α=0.05)")
pvalues_x = model.pvalues.drop('const')  # 상수항 제외

print("\n각 변수의 p-value:")
for var, pval in pvalues_x.items():
    유의 = "✓ 유의함" if pval < 0.05 else "✗ 유의하지 않음"
    print(f"  {var}: {round(pval, 4)} {유의}")

유의한_개수 = (pvalues_x < 0.05).sum()
비유의_개수 = (pvalues_x >= 0.05).sum()

print(f"\n유의한 변수 개수: {유의한_개수}개")
print(f"유의하지 않은 변수 개수: {비유의_개수}개")

# 6-7) R² 및 Adjusted R²
print("\n[6-7] 모델 적합도")
r2 = model.rsquared
adj_r2 = model.rsquared_adj
print(f"R²: {round(r2, 4)}")
print(f"Adjusted R²: {round(adj_r2, 4)}")
print(f"설명력: {round(r2*100, 2)}%")

# 8) p-value 최대인 변수
print("\n[8] p-value가 가장 큰 변수")
최대_pvalue_변수 = pvalues_x.idxmax()
최대_pvalue = pvalues_x.max()
print(f"변수명: {최대_pvalue_변수}")
print(f"p-value: {round(최대_pvalue, 4)}")

# 9) VIF (다중공선성)
print("\n[9] 다중공선성 진단 (VIF)")
vif_data = pd.DataFrame()
vif_data['변수'] = X.columns
vif_data['VIF'] = [variance_inflation_factor(X.values, i) 
                   for i in range(X.shape[1])]

# const 제외하고 출력
vif_x = vif_data[vif_data['변수'] != 'const'].copy()
vif_x['VIF'] = vif_x['VIF'].round(2)
print(vif_x.to_string(index=False))

# VIF 해석
max_vif = vif_x['VIF'].max()
if max_vif < 5:
    vif_해석 = "문제 없음"
    print(f"\n✓ 다중공선성 {vif_해석} (모든 VIF < 5)")
elif max_vif < 10:
    vif_해석 = "주의 필요"
    print(f"\n⚠ 다중공선성 {vif_해석} (일부 VIF ≥ 5)")
else:
    vif_해석 = "심각"
    print(f"\n✗ 다중공선성 {vif_해석} (일부 VIF ≥ 10)")

# 10) 예측
print("\n[10] 새로운 데이터 예측")
새_데이터 = pd.DataFrame({
    '[독립변수1]': [[값1]],
    '[독립변수2]': [[값2]],
    '[독립변수3]': [[값3]]
})

print("입력 데이터:")
print(새_데이터)

# ⭐⭐⭐ 상수항 추가 (필수!) ⭐⭐⭐
새_데이터 = sm.add_constant(새_데이터)
print("✓ 상수항 추가 완료")

# 예측 수행
예측값 = model.predict(새_데이터)[0]
print(f"\n예측된 [종속변수]: {round(예측값, 2)}")

# 11) 잔차 정규성 검정
print("\n[11] 잔차 정규성 검정 (Shapiro-Wilk)")
잔차 = model.resid
stat, p_residual = shapiro(잔차)
print(f"p-value: {round(p_residual, 4)}")

if p_residual > 0.05:
    잔차_해석 = "정규성 만족"
    print(f"✓ {잔차_해석} (p > 0.05)")
else:
    잔차_해석 = "정규성 불만족"
    print(f"✗ {잔차_해석} (p ≤ 0.05)")
    print("→ 회귀분석 가정 위배, 결과 해석 주의")

# 최종 회귀식 출력
print("\n" + "="*80)
print("최종 회귀식")
print("="*80)
회귀식 = f"[종속변수] = {round(const, 2)}"
for var in ['[독립변수1]', '[독립변수2]', '[독립변수3]']:
    coef = model.params[var]
    부호 = "+" if coef >= 0 else ""
    회귀식 += f" {부호} {round(coef, 3)}×{var}"

print(회귀식)
print("="*80)
```
```

---

## 🎯 문제 생성 체크리스트

### 필수 확인 사항
- [ ] 데이터가 40-50행인가?
- [ ] np.random.seed() 포함되었는가?
- [ ] 종속변수(Y)가 연속형인가?
- [ ] 독립변수(X) 2-3개인가?
- [ ] 모든 변수가 연속형 숫자인가?
- [ ] 변수명이 모두 한국어인가?
- [ ] 힌트 섹션이 포함되었는가?
- [ ] **상수항 추가가 2번 강조되었는가?**
- [ ] VIF 계산이 포함되었는가?
- [ ] 정답 코드가 완전한가?

### 상수항 2번 체크!
- [ ] 1번째: X = sm.add_constant(X)
- [ ] 2번째: 새_데이터 = sm.add_constant(새_데이터)

### 품질 확인
- [ ] 시나리오가 현실적인가?
- [ ] 질문이 단계적인가?
- [ ] model.summary() 출력 포함?
- [ ] 회귀식 출력 포함?
- [ ] 주석이 충분한가?

---

## 💡 샘플 데이터 생성 예시

### 예시 1: 부동산 가격 예측 (현실적 데이터)
```python
np.random.seed(42)

# 독립변수 생성
면적 = np.random.uniform(50, 150, 50).round(1)  # 50-150㎡
층수 = np.random.randint(1, 20, 50)             # 1-20층
방개수 = np.random.randint(1, 5, 50)             # 1-4개

# 종속변수 생성 (독립변수와 선형 관계)
가격 = (면적 * 0.08 + 층수 * 0.05 + 방개수 * 1.2 + 
        np.random.normal(0, 1, 50)).round(2)

df = pd.DataFrame({
    '단지': [f'A{i}동' for i in range(1, 51)],
    '면적': 면적,
    '층수': 층수,
    '방개수': 방개수,
    '매매가격': 가격
})
```

### 예시 2: 학생 성적 예측
```python
np.random.seed(100)

# 독립변수
공부시간 = np.random.uniform(1, 5, 50).round(1)     # 1-5시간
출석률 = np.random.randint(70, 100, 50)             # 70-100%
과제점수 = np.random.randint(60, 100, 50)           # 60-100점

# 종속변수 (약한 노이즈 추가)
기말성적 = (공부시간 * 3 + 출석률 * 0.2 + 과제점수 * 0.3 + 
           np.random.normal(0, 5, 50)).round(1)

# 점수 범위 제한 (0-100)
기말성적 = np.clip(기말성적, 0, 100)

df = pd.DataFrame({
    '학생': [f'학생{i}' for i in range(1, 51)],
    '공부시간': 공부시간,
    '출석률': 출석률,
    '과제점수': 과제점수,
    '기말성적': 기말성적
})
```

---

## ⚠️ 절대 주의사항

### 1. 상수항 관련 (가장 중요!)
```python
# ❌ 절대 안 됨!
model = sm.OLS(y, X).fit()

# ✅ 반드시 이렇게!
X = sm.add_constant(X)
model = sm.OLS(y, X).fit()
```

### 2. 예측 시 상수항
```python
# ❌ 절대 안 됨!
예측 = model.predict(새_데이터)

# ✅ 반드시 이렇게!
새_데이터 = sm.add_constant(새_데이터)
예측 = model.predict(새_데이터)
```

### 3. 유의성 판단 시 상수항 제외
```python
# ❌ 상수항 포함하면 개수가 1개 많아짐
(model.pvalues < 0.05).sum()

# ✅ 상수항 제외
(model.pvalues.drop('const') < 0.05).sum()
```

### 4. VIF 계산 시
```python
# VIF는 X에 상수항이 포함된 상태로 계산
# 하지만 결과 출력 시 상수항은 보통 제외
vif_x = vif_data[vif_data['변수'] != 'const']
```

---

## 📚 추가 학습 내용 (고급)

### F-검정 (전체 모델 유의성)
```python
print(f"F-통계량: {round(model.fvalue, 3)}")
print(f"F-검정 p-value: {round(model.f_pvalue, 4)}")

# 해석: p < 0.05면 모델 전체가 유의함
```

### AIC/BIC (모델 선택 기준)
```python
print(f"AIC: {round(model.aic, 2)}")
print(f"BIC: {round(model.bic, 2)}")

# 해석: 작을수록 좋은 모델
```

### 표준화 회귀계수 (Beta)
```python
# 각 변수를 표준화하여 영향력 비교
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_원본)
X_scaled = sm.add_constant(X_scaled)
model_std = sm.OLS(y, X_scaled).fit()

print("표준화 회귀계수:")
print(model_std.params)
# 절대값이 클수록 영향력 큼
```

---

이제 위 지침에 따라 다중선형회귀분석 문제를 생성해주세요!

**마지막 당부: 상수항 추가는 2번! 절대 잊지 마세요!** 🔥🔥🔥
