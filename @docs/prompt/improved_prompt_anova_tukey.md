# 빅데이터분석기사 작업형 3유형 - ANOVA + TukeyHSD 문제 생성 프롬프트

## 🚨🚨🚨 [최우선] 질문 형식 - 반드시 이 형식을 따르세요! 🚨🚨🚨

**생성할 문제의 질문 섹션은 반드시 다음 형식이어야 합니다:**

```
## ❓ 질문

Q1. [첫 번째 구체적인 질문] (출력: 소수점 X자리)
Q2. [두 번째 구체적인 질문] (출력: 소수점 X자리)
Q3. [세 번째 구체적인 질문] (출력: 소수점 X자리)
Q4. [네 번째 구체적인 질문] (출력: 예/아니오)
```

**⛔ 절대 금지:**
- ❌ **1)**, **2)**, **3)** 형식 사용 금지
- ❌ "## 질문" (이모지 없이) 사용 금지 → 반드시 "## ❓ 질문"
- ❌ "검정하시오", "분석하시오" 같은 모호한 표현
- ❌ 출력 형식 명시 없이 질문만 작성

**✅ 반드시 포함:**
- ✅ "## ❓ 질문" 헤더 (이모지 포함)
- ✅ Q1. Q2. Q3. Q4. Q5. 형식 (최소 4개, 최대 7개)
- ✅ 각 질문 끝에 (출력: 소수점 X자리) 형식 명시
- ✅ 한 줄에 하나의 질문

---

## 📋 문제 구조 (순서 엄수)

```
# [제목]

## 시나리오
[3그룹 이상을 비교하는 현실적 상황 2-3문장]

## 데이터 생성 코드
```python
[각 그룹 10-15개씩, 총 30-45행의 리터럴 데이터]
```

## ❓ 질문

Q1. [질문] (출력: 소수점 X자리)
Q2. [질문] (출력: 소수점 X자리)
...

## 힌트
[라이브러리, 함수, 주의사항]

## 정답 코드
```python
[완전한 Python 코드]
```
```

---

## ⚙️ 데이터 생성 규칙

### 필수 조건
- ✅ **3개 이상의 그룹** (A, B, C 또는 그 이상)
- ✅ **각 그룹당 10-15개** 샘플 (총 30-45행)
- ✅ 완전한 리터럴 값 (np.random 사용 금지)
- ✅ 변수명 한국어

### 올바른 예시
```python
import pandas as pd

df = pd.DataFrame({
    '직원ID': [f'E{i:03d}' for i in range(1, 40)],
    '부서': ['영업']*13 + ['기획']*13 + ['개발']*13,
    '월급여': [285, 310, 295, 320, 300, 315, 290, 305, 325, 295, 310, 300, 315,
               310, 335, 320, 345, 325, 340, 315, 330, 350, 320, 335, 325, 340,
               330, 355, 340, 365, 345, 360, 335, 350, 370, 340, 355, 345, 360]
})
```

---

## 📊 ANOVA + TukeyHSD 분석 단계

**참고:** 정규성 검정(Shapiro-Wilk)은 별도 노드에서 다루므로, ANOVA 문제에서는 정규성을 만족한다고 가정하고 진행합니다.

### 1단계: 그룹 분리
```python
영업 = df[df['부서'] == '영업']['월급여']
기획 = df[df['부서'] == '기획']['월급여']
개발 = df[df['부서'] == '개발']['월급여']
```

### 2단계: 일원분산분석 수행
```python
from scipy.stats import f_oneway

# 정규성을 만족한다고 가정
stat, pval = f_oneway(영업, 기획, 개발)
```

### 3단계: TukeyHSD 사후검정
```python
from statsmodels.stats.multicomp import pairwise_tukeyhsd

# TukeyHSD 수행
tukey = pairwise_tukeyhsd(df['월급여'], df['부서'], alpha=0.05)

# DataFrame으로 변환 (권장 방법)
tukey_df = pd.DataFrame(
    data=tukey.summary().data[1:],
    columns=tukey.summary().data[0]
)

# 결과 접근
# tukey_df['reject'] - True면 유의한 차이
# tukey_df['meandiff'] - 평균 차이
# tukey_df['group1'], tukey_df['group2'] - 그룹 쌍
```

---

## 💡 질문 예시 (Q1. Q2. 형식 반드시 사용!)

```
## ❓ 질문

Q1. '영업' 부서의 월급여 평균을 소수점 2자리까지 구하시오. (출력: 소수점 2자리)
Q2. '기획' 부서의 월급여 표준편차를 소수점 2자리까지 구하시오. (출력: 소수점 2자리)
Q3. 일원분산분석(f_oneway)을 수행하고 검정통계량을 구하시오. (출력: 소수점 3자리)
Q4. 일원분산분석의 p-value를 구하시오. (출력: 소수점 4자리)
Q5. TukeyHSD 사후검정을 수행하고, '영업'-'기획' 그룹 간 유의한 차이가 있는지 판단하시오. (출력: "있다" 또는 "없다")
```

**참고:** 정규성 검정(Shapiro-Wilk)은 별도 노드에서 다루므로, ANOVA 문제에서는 제외합니다.

---

## 🎯 힌트 섹션 예시

```markdown
## 힌트

### 필요한 라이브러리
- pandas, numpy
- scipy.stats: f_oneway
- statsmodels.stats.multicomp: pairwise_tukeyhsd

### 주요 함수
1. 그룹 분리: `df[df['그룹'] == '그룹A']['값']`
2. ANOVA: `f_oneway(그룹A, 그룹B, 그룹C)`
3. TukeyHSD: `pairwise_tukeyhsd(df['값'], df['그룹'], alpha=0.05)`
4. DataFrame 변환: `pd.DataFrame(data=tukey.summary().data[1:], columns=tukey.summary().data[0])`

### 흔한 실수
❌ 그룹당 샘플 수가 10개 미만
❌ TukeyHSD에 raw data 대신 그룹별 데이터 입력
❌ TukeyHSD 결과에서 reject 열 확인 안 함

**참고:** 정규성 검정(Shapiro-Wilk)은 별도 노드에서 다루므로 제외합니다.
```

---

## 💻 정답 코드 예시

**⚠️ print 문 최소화 - 요구사항만 출력**

```python
import pandas as pd
from scipy.stats import f_oneway
from statsmodels.stats.multicomp import pairwise_tukeyhsd

# 데이터 생성
df = pd.DataFrame({
    '직원ID': [f'E{i:03d}' for i in range(1, 40)],
    '부서': ['영업']*13 + ['기획']*13 + ['개발']*13,
    '월급여': [285, 310, 295, 320, 300, 315, 290, 305, 325, 295, 310, 300, 315,
               310, 335, 320, 345, 325, 340, 315, 330, 350, 320, 335, 325, 340,
               330, 355, 340, 365, 345, 360, 335, 350, 370, 340, 355, 345, 360]
})

# 그룹 분리
영업 = df[df['부서'] == '영업']['월급여']
기획 = df[df['부서'] == '기획']['월급여']
개발 = df[df['부서'] == '개발']['월급여']

# Q1-Q2: 기술통계
print(round(영업.mean(), 2))
print(round(기획.std(), 2))

# Q3-Q4: 일원분산분석
stat, pval = f_oneway(영업, 기획, 개발)
print(round(stat, 3))
print(round(pval, 4))

# Q5: TukeyHSD 사후검정
tukey = pairwise_tukeyhsd(df['월급여'], df['부서'], alpha=0.05)
tukey_df = pd.DataFrame(
    data=tukey.summary().data[1:],
    columns=tukey.summary().data[0]
)

# '영업'-'기획' 쌍 찾기
pair = tukey_df[
    ((tukey_df['group1'] == '영업') & (tukey_df['group2'] == '기획')) |
    ((tukey_df['group1'] == '기획') & (tukey_df['group2'] == '영업'))
]

print("있다" if pair['reject'].values[0] else "없다")
```

**참고:** 정규성을 만족한다고 가정하고 f_oneway와 TukeyHSD를 바로 수행합니다.

---

## ✅ 생성 체크리스트

- [ ] "## ❓ 질문" 헤더 (이모지 포함)
- [ ] Q1. Q2. Q3. 형식 사용 (**1)**, **2)** 아님)
- [ ] 각 질문에 (출력: ...) 명시
- [ ] 3개 이상 그룹
- [ ] 각 그룹 10-15개 샘플
- [ ] 변수명 한국어
- [ ] 리터럴 값 (np.random 없음)
- [ ] TukeyHSD DataFrame 변환 코드 포함
- [ ] print 문 최소화
