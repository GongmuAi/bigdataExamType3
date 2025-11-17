export const sampleCodes: Record<string, string> = {
  shapiro: `"""
[문제]
한 식품회사에서 생산하는 과자의 무게가 정규분포를 따르는지 확인하고자 한다.
무작위로 30개의 제품을 추출하여 무게를 측정한 결과가 다음과 같다.
유의수준 0.05에서 정규성 검정을 수행하시오.

Q1. 검정통계량을 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 정규분포를 따른다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '제품번호': [f'P{i:02d}' for i in range(1, 31)],
    '무게(g)': [152.3, 148.7, 151.2, 149.8, 153.1, 150.5, 147.9, 152.8, 149.2, 151.6,
                148.4, 153.5, 150.1, 147.6, 152.0, 149.5, 151.8, 148.2, 150.9, 153.2,
                147.3, 151.4, 149.1, 152.6, 148.9, 150.3, 153.8, 149.7, 151.1, 148.5]
})

# Shapiro-Wilk 정규성 검정
stat, p_value = stats.shapiro(df['무게(g)'])

print(f"Q1. 검정통계량: {stat:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value > 0.05:
    print("Q3. 예 (정규분포를 따름)")
else:
    print("Q3. 아니오 (정규분포를 따르지 않음)")`,

  anderson: `"""
[문제]
대형마트에서 고객들의 일일 구매금액이 정규분포를 따르는지 검정하고자 한다.
50명의 고객 구매금액 데이터를 수집하였다.
Anderson-Darling 검정을 수행하여 유의수준 5%에서 정규성을 검정하시오.

Q1. 검정통계량을 소수점 4자리까지 구하시오.
Q2. 유의수준 5%의 임계값을 소수점 4자리까지 구하시오.
Q3. 정규분포를 따른다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd

# 데이터셋: 고객 50명의 일일 구매금액 (단위: 천원)
df = pd.DataFrame({
    '고객ID': [f'C{i:03d}' for i in range(1, 51)],
    '구매금액': [45.2, 52.8, 38.1, 61.4, 55.9, 42.3, 58.7, 49.5, 67.2, 53.6,
                48.1, 56.3, 41.7, 63.8, 50.2, 44.9, 59.1, 47.4, 65.3, 51.8,
                46.5, 54.2, 40.8, 62.1, 52.4, 43.6, 57.8, 48.9, 66.4, 54.7,
                47.2, 55.6, 39.4, 60.7, 53.1, 45.8, 58.3, 50.6, 64.9, 52.9,
                49.3, 57.1, 42.6, 61.8, 51.5, 44.1, 56.9, 49.1, 63.2, 55.4]
})

# Anderson-Darling 정규성 검정
result = stats.anderson(df['구매금액'])

print(f"Q1. 검정통계량: {result.statistic:.4f}")

# 유의수준 5%는 index 2
sig_5_idx = 2
crit_val_5 = result.critical_values[sig_5_idx]
print(f"Q2. 임계값(5%): {crit_val_5:.4f}")

if result.statistic < crit_val_5:
    print("Q3. 예 (정규분포를 따름)")
else:
    print("Q3. 아니오 (정규분포를 따르지 않음)")`,

  levene: `"""
[문제]
두 가지 교육 프로그램(A, B)의 효과를 비교하기 위해 각 프로그램 수강생들의
시험 점수를 수집하였다. 두 그룹의 분산이 동일한지 검정하시오.

Q1. Levene 검정통계량을 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 등분산성을 만족하는가? (예/아니오)
Q4. t검정 시 equal_var 파라미터는? (True/False)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '학생ID': [f'S{i:02d}' for i in range(1, 31)],
    '프로그램': ['A']*15 + ['B']*15,
    '점수': [78, 82, 85, 79, 88, 92, 76, 81, 84, 90, 77, 83, 86, 80, 89,  # A
            72, 88, 65, 92, 70, 85, 68, 90, 73, 87, 69, 91, 74, 86, 71]   # B
})

group_a = df[df['프로그램'] == 'A']['점수']
group_b = df[df['프로그램'] == 'B']['점수']

# Levene 등분산성 검정
stat, p_value = stats.levene(group_a, group_b)

print(f"Q1. 검정통계량: {stat:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value > 0.05:
    print("Q3. 예 (등분산성 만족)")
    print("Q4. equal_var=True")
else:
    print("Q3. 아니오 (등분산성 불만족)")
    print("Q4. equal_var=False")`,

  bartlett: `"""
[문제]
세 개의 제조 라인(Line1, Line2, Line3)에서 생산된 제품의 품질 점수가
동일한 분산을 갖는지 검정하고자 한다. 각 라인에서 10개씩 제품을 추출하여
품질 점수를 측정하였다. (데이터가 정규분포를 따른다고 가정)

Q1. Bartlett 검정통계량을 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 세 그룹의 분산이 동일하다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '라인': ['Line1']*10 + ['Line2']*10 + ['Line3']*10,
    '품질점수': [88, 92, 85, 90, 87, 91, 86, 89, 93, 84,  # Line1
                86, 90, 88, 92, 85, 89, 87, 91, 84, 88,   # Line2
                87, 91, 86, 90, 88, 92, 85, 89, 93, 86]   # Line3
})

group1 = df[df['라인'] == 'Line1']['품질점수']
group2 = df[df['라인'] == 'Line2']['품질점수']
group3 = df[df['라인'] == 'Line3']['품질점수']

# Bartlett 등분산성 검정
stat, p_value = stats.bartlett(group1, group2, group3)

print(f"Q1. 검정통계량: {stat:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value > 0.05:
    print("Q3. 예 (등분산성 만족)")
else:
    print("Q3. 아니오 (등분산성 불만족)")`,

  'ttest-1samp': `"""
[문제]
한 제약회사에서 생산하는 비타민C 알약의 함량이 기준값 500mg인지 검정하고자 한다.
무작위로 20개의 알약을 추출하여 함량을 측정한 결과가 다음과 같다.
유의수준 0.05에서 모평균이 500mg인지 검정하시오.

Q1. 표본 평균을 소수점 2자리까지 구하시오.
Q2. 검정통계량을 소수점 4자리까지 구하시오.
Q3. p-value를 소수점 4자리까지 구하시오.
Q4. 모평균이 500mg과 다르다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '알약번호': [f'V{i:02d}' for i in range(1, 21)],
    '함량(mg)': [502.3, 498.7, 505.1, 501.4, 497.8, 503.2, 499.6, 504.5, 500.8, 506.1,
                498.2, 502.9, 501.1, 505.7, 499.3, 503.8, 497.5, 504.2, 500.6, 502.4]
})

# 단일표본 t검정
population_mean = 500
stat, p_value = stats.ttest_1samp(df['함량(mg)'], population_mean)

print(f"Q1. 표본 평균: {np.mean(df['함량(mg)']):.2f}mg")
print(f"Q2. 검정통계량: {stat:.4f}")
print(f"Q3. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q4. 예 (모평균이 500mg과 다름)")
else:
    print("Q4. 아니오 (모평균이 500mg과 차이 없음)")`,

  'wilcoxon-single': `"""
[문제]
온라인 쇼핑몰의 고객 만족도 점수(1-10점)가 기준값 7점과 다른지 검정하고자 한다.
15명의 고객을 대상으로 만족도를 조사한 결과가 다음과 같다.
데이터가 정규분포를 따르지 않아 Wilcoxon 부호순위 검정을 수행하시오.

Q1. 표본 중앙값을 구하시오.
Q2. 검정통계량을 소수점 4자리까지 구하시오.
Q3. p-value를 소수점 4자리까지 구하시오.
Q4. 중앙값이 7점과 다르다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '고객ID': [f'C{i:02d}' for i in range(1, 16)],
    '만족도': [8, 6, 9, 7, 8, 5, 9, 7, 8, 6, 9, 7, 8, 6, 7]
})

# Wilcoxon 부호순위 검정
median_test = 7
differences = df['만족도'] - median_test
stat, p_value = stats.wilcoxon(differences)

print(f"Q1. 표본 중앙값: {np.median(df['만족도']):.1f}점")
print(f"Q2. 검정통계량: {stat:.4f}")
print(f"Q3. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q4. 예 (중앙값이 7점과 다름)")
else:
    print("Q4. 아니오 (중앙값이 7점과 차이 없음)")`,

  'ttest-ind': `"""
[문제]
새로운 교수법이 기존 교수법보다 효과가 있는지 검증하기 위해
두 그룹의 학생들에게 각각 다른 교수법을 적용한 후 시험을 치렀다.
유의수준 0.05에서 두 그룹의 평균 점수에 차이가 있는지 검정하시오.

Q1. 전통방식 평균을 소수점 2자리까지 구하시오.
Q2. 신규방식 평균을 소수점 2자리까지 구하시오.
Q3. 등분산성 검정 후 적절한 t검정을 수행하고, 검정통계량을 소수점 4자리까지 구하시오.
Q4. p-value를 소수점 4자리까지 구하시오.
Q5. 두 그룹 평균에 유의한 차이가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '학생ID': [f'S{i:02d}' for i in range(1, 25)],
    '교수법': ['전통방식']*12 + ['신규방식']*12,
    '성적': [72, 78, 75, 80, 74, 77, 73, 79, 76, 81, 75, 78,  # 전통방식
            78, 85, 82, 88, 80, 84, 79, 86, 83, 89, 81, 87]   # 신규방식
})

group_a = df[df['교수법'] == '전통방식']['성적']
group_b = df[df['교수법'] == '신규방식']['성적']

print(f"Q1. 전통방식 평균: {np.mean(group_a):.2f}")
print(f"Q2. 신규방식 평균: {np.mean(group_b):.2f}")

# 1. 등분산성 검정
_, p_levene = stats.levene(group_a, group_b)

# 2. 독립표본 t검정
if p_levene > 0.05:
    stat, p_value = stats.ttest_ind(group_a, group_b, equal_var=True)
    print(f"(등분산 가정: True)")
else:
    stat, p_value = stats.ttest_ind(group_a, group_b, equal_var=False)
    print(f"(등분산 가정: False - Welch's t-test)")

print(f"Q3. 검정통계량: {stat:.4f}")
print(f"Q4. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q5. 예 (유의한 차이 있음)")
else:
    print("Q5. 아니오 (유의한 차이 없음)")`,

  mannwhitneyu: `"""
[문제]
두 온라인 마케팅 채널(SNS, 검색광고)의 고객당 구매금액을 비교하고자 한다.
각 채널에서 10명씩 고객을 추출하여 구매금액을 조사하였다.
데이터가 정규분포를 따르지 않아 Mann-Whitney U 검정을 수행하시오.

Q1. SNS 채널의 중앙값을 소수점 1자리까지 구하시오.
Q2. 검색광고 채널의 중앙값을 소수점 1자리까지 구하시오.
Q3. U 통계량을 소수점 4자리까지 구하시오.
Q4. p-value를 소수점 4자리까지 구하시오.
Q5. 두 채널의 구매금액에 차이가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋: 구매금액 (단위: 만원)
df = pd.DataFrame({
    '고객ID': [f'C{i:02d}' for i in range(1, 21)],
    '채널': ['SNS']*10 + ['검색광고']*10,
    '구매금액': [12.5, 15.8, 11.2, 18.3, 14.7, 16.2, 13.1, 19.5, 15.3, 17.8,  # SNS
                22.1, 25.4, 19.8, 28.6, 23.5, 26.9, 21.3, 29.2, 24.1, 27.3]   # 검색광고
})

group_sns = df[df['채널'] == 'SNS']['구매금액']
group_search = df[df['채널'] == '검색광고']['구매금액']

# Mann-Whitney U 검정
stat, p_value = stats.mannwhitneyu(group_sns, group_search)

print(f"Q1. SNS 중앙값: {np.median(group_sns):.1f}만원")
print(f"Q2. 검색광고 중앙값: {np.median(group_search):.1f}만원")
print(f"Q3. U 통계량: {stat:.4f}")
print(f"Q4. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q5. 예 (유의한 차이 있음)")
else:
    print("Q5. 아니오 (유의한 차이 없음)")`,

  'ttest-rel': `"""
[문제]
신약의 혈압 강하 효과를 검증하기 위해 12명의 환자에게 약을 투여하기 전후의
수축기 혈압을 측정하였다. 유의수준 0.05에서 약 투여 전후 혈압에
유의한 차이가 있는지 검정하시오.

Q1. 투여 전 평균 혈압을 소수점 2자리까지 구하시오.
Q2. 투여 후 평균 혈압을 소수점 2자리까지 구하시오.
Q3. 평균 차이를 소수점 2자리까지 구하시오.
Q4. 검정통계량을 소수점 4자리까지 구하시오.
Q5. p-value를 소수점 4자리까지 구하시오.
Q6. 전후 차이가 유의한가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '환자ID': [f'PT{i:02d}' for i in range(1, 13)],
    '투여전': [145, 152, 148, 155, 150, 147, 153, 149, 156, 151, 146, 154],
    '투여후': [138, 145, 142, 148, 144, 140, 146, 143, 149, 145, 139, 147]
})

# 대응표본 t검정
stat, p_value = stats.ttest_rel(df['투여전'], df['투여후'])

print(f"Q1. 투여 전 평균: {np.mean(df['투여전']):.2f}mmHg")
print(f"Q2. 투여 후 평균: {np.mean(df['투여후']):.2f}mmHg")
print(f"Q3. 평균 차이: {np.mean(df['투여전'] - df['투여후']):.2f}mmHg")
print(f"Q4. 검정통계량: {stat:.4f}")
print(f"Q5. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q6. 예 (전후 차이가 유의함)")
else:
    print("Q6. 아니오 (전후 차이가 유의하지 않음)")`,

  'wilcoxon-paired': `"""
[문제]
새로운 진통제의 효과를 검증하기 위해 10명의 환자에게 약물 투여 전후의
통증 점수(1-10점)를 측정하였다. 데이터가 정규분포를 따르지 않아
Wilcoxon 부호순위 검정을 수행하시오.

Q1. 투여 전 중앙값을 구하시오.
Q2. 투여 후 중앙값을 구하시오.
Q3. 검정통계량을 소수점 4자리까지 구하시오.
Q4. p-value를 소수점 4자리까지 구하시오.
Q5. 약물이 통증 감소에 효과가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '환자ID': [f'PT{i:02d}' for i in range(1, 11)],
    '투여전': [8, 7, 9, 6, 8, 7, 9, 8, 7, 9],
    '투여후': [5, 4, 6, 4, 5, 3, 6, 5, 4, 6]
})

# Wilcoxon 부호순위 검정
stat, p_value = stats.wilcoxon(df['투여전'], df['투여후'])

print(f"Q1. 투여 전 중앙값: {np.median(df['투여전']):.1f}점")
print(f"Q2. 투여 후 중앙값: {np.median(df['투여후']):.1f}점")
print(f"Q3. 검정통계량: {stat:.4f}")
print(f"Q4. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q5. 예 (통증 감소 효과 있음)")
else:
    print("Q5. 아니오 (통증 감소 효과 없음)")`,

  'f-oneway': `"""
[문제]
세 가지 다른 비료(A, B, C)가 토마토 수확량에 미치는 영향을 비교하고자 한다.
각 비료를 사용한 10개의 밭에서 토마토 수확량(kg)을 측정하였다.
유의수준 0.05에서 비료 종류에 따라 수확량에 차이가 있는지 검정하시오.

Q1. 비료A의 평균 수확량을 소수점 2자리까지 구하시오.
Q2. 비료B의 평균 수확량을 소수점 2자리까지 구하시오.
Q3. 비료C의 평균 수확량을 소수점 2자리까지 구하시오.
Q4. F-통계량을 소수점 4자리까지 구하시오.
Q5. p-value를 소수점 4자리까지 구하시오.
Q6. 비료 종류에 따라 수확량에 차이가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '밭번호': [f'F{i:02d}' for i in range(1, 31)],
    '비료종류': ['비료A']*10 + ['비료B']*10 + ['비료C']*10,
    '수확량': [45.2, 48.1, 46.5, 50.3, 47.8, 49.2, 44.6, 51.4, 46.9, 48.7,  # 비료A
              52.3, 55.8, 53.1, 58.4, 54.6, 56.2, 51.7, 59.1, 53.8, 55.2,   # 비료B
              58.7, 62.4, 60.1, 65.8, 61.3, 63.9, 57.5, 66.2, 60.8, 64.3]   # 비료C
})

group_a = df[df['비료종류'] == '비료A']['수확량']
group_b = df[df['비료종류'] == '비료B']['수확량']
group_c = df[df['비료종류'] == '비료C']['수확량']

# 일원배치 분산분석 (ANOVA)
stat, p_value = stats.f_oneway(group_a, group_b, group_c)

print(f"Q1. 비료A 평균: {np.mean(group_a):.2f}kg")
print(f"Q2. 비료B 평균: {np.mean(group_b):.2f}kg")
print(f"Q3. 비료C 평균: {np.mean(group_c):.2f}kg")
print(f"Q4. F-통계량: {stat:.4f}")
print(f"Q5. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q6. 예 (차이 있음 → 사후검정 필요)")
else:
    print("Q6. 아니오 (차이 없음)")`,

  kruskal: `"""
[문제]
세 가지 운동 프로그램(요가, 수영, 웨이트)의 체중 감량 효과를 비교하고자 한다.
각 프로그램 참가자 8명의 3개월 후 체중 감량(kg)을 측정하였다.
데이터가 정규분포를 따르지 않아 Kruskal-Wallis 검정을 수행하시오.

Q1. 요가 프로그램의 중앙값을 소수점 2자리까지 구하시오.
Q2. 수영 프로그램의 중앙값을 소수점 2자리까지 구하시오.
Q3. 웨이트 프로그램의 중앙값을 소수점 2자리까지 구하시오.
Q4. H-통계량을 소수점 4자리까지 구하시오.
Q5. p-value를 소수점 4자리까지 구하시오.
Q6. 프로그램 간 체중 감량에 차이가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '참가자ID': [f'P{i:02d}' for i in range(1, 25)],
    '프로그램': ['요가']*8 + ['수영']*8 + ['웨이트']*8,
    '감량': [2.1, 1.8, 2.5, 1.9, 2.3, 2.0, 2.2, 1.7,  # 요가
            3.2, 2.8, 3.5, 3.0, 3.4, 2.9, 3.1, 2.7,   # 수영
            4.5, 4.0, 4.8, 4.2, 4.6, 4.1, 4.4, 3.9]   # 웨이트
})

group_yoga = df[df['프로그램'] == '요가']['감량']
group_swim = df[df['프로그램'] == '수영']['감량']
group_weight = df[df['프로그램'] == '웨이트']['감량']

# Kruskal-Wallis 검정
stat, p_value = stats.kruskal(group_yoga, group_swim, group_weight)

print(f"Q1. 요가 중앙값: {np.median(group_yoga):.2f}kg")
print(f"Q2. 수영 중앙값: {np.median(group_swim):.2f}kg")
print(f"Q3. 웨이트 중앙값: {np.median(group_weight):.2f}kg")
print(f"Q4. H-통계량: {stat:.4f}")
print(f"Q5. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q6. 예 (프로그램 간 차이 있음)")
else:
    print("Q6. 아니오 (프로그램 간 차이 없음)")`,

  'proportions-ztest': `"""
[문제]
두 가지 웹사이트 디자인(A, B)의 전환율을 비교하고자 한다.
디자인 A는 500명 방문자 중 45명이, 디자인 B는 500명 방문자 중 62명이
구매를 완료하였다. 두 디자인의 전환율에 유의한 차이가 있는지 검정하시오.

Q1. 디자인 A의 전환율을 소수점 4자리까지 구하시오.
Q2. 디자인 B의 전환율을 소수점 4자리까지 구하시오.
Q3. z-통계량을 소수점 4자리까지 구하시오.
Q4. p-value를 소수점 4자리까지 구하시오.
Q5. 두 디자인의 전환율에 유의한 차이가 있는가? (예/아니오)
"""

from statsmodels.stats.proportion import proportions_ztest
import numpy as np

# 데이터셋
count = np.array([45, 62])   # 각 디자인의 전환 수
nobs = np.array([500, 500])  # 각 디자인의 방문자 수

# 두 비율 z검정
stat, p_value = proportions_ztest(count, nobs)

print(f"Q1. 디자인 A 전환율: {count[0]/nobs[0]:.4f}")
print(f"Q2. 디자인 B 전환율: {count[1]/nobs[1]:.4f}")
print(f"Q3. z-통계량: {stat:.4f}")
print(f"Q4. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q5. 예 (유의한 차이 있음)")
else:
    print("Q5. 아니오 (유의한 차이 없음)")`,

  'binom-test': `"""
[문제]
어떤 의약품의 부작용 발생률이 10%라고 알려져 있다.
새로운 임상시험에서 50명의 환자 중 9명에게 부작용이 발생하였다.
실제 부작용 발생률이 10%와 다른지 검정하시오.

Q1. 관측된 부작용 비율을 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 부작용 발생률이 10%와 다르다고 할 수 있는가? (예/아니오)
"""

from scipy import stats

# 데이터셋
successes = 9      # 부작용 발생 환자 수
trials = 50        # 전체 환자 수
expected_prob = 0.10  # 기대 부작용 발생률

# 이항검정
result = stats.binomtest(successes, trials, expected_prob)
p_value = result.pvalue

print(f"Q1. 관측 부작용 비율: {successes/trials:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q3. 예 (10%와 다름)")
else:
    print("Q3. 아니오 (10%와 차이 없음)")`,

  chisquare: `"""
[문제]
한 대학교의 학생 식당에서 요일별 이용객 수가 균등한지 조사하고자 한다.
월요일부터 금요일까지 각 요일의 이용객 수를 조사한 결과가 다음과 같다.
요일별 이용객 수가 균등하게 분포되어 있는지 검정하시오.

Q1. 카이제곱 통계량을 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 요일별 이용객 수가 균등하다고 할 수 있는가? (예/아니오)
"""

from scipy import stats
import numpy as np

# 데이터셋: 요일별 이용객 수
observed = np.array([120, 135, 142, 118, 125])  # 월, 화, 수, 목, 금
total = sum(observed)
expected = np.array([total/5] * 5)  # 균등 분포 기대값

print("요일별 이용객 수:")
days = ['월요일', '화요일', '수요일', '목요일', '금요일']
for i, day in enumerate(days):
    print(f"  {day}: {observed[i]}명")
print(f"기대값 (균등분포): 각 {expected[0]:.1f}명")

# 카이제곱 적합도 검정
stat, p_value = stats.chisquare(observed, expected)

print(f"\\nQ1. 카이제곱 통계량: {stat:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value > 0.05:
    print("Q3. 예 (균등하게 분포)")
else:
    print("Q3. 아니오 (균등하지 않음)")`,

  'chi2-contingency': `"""
[문제]
성별(남성, 여성)과 선호하는 음료(커피, 차, 주스)의 관계를 조사하고자 한다.
100명을 대상으로 조사한 결과가 다음과 같다. 성별과 음료 선호도가
독립인지 카이제곱 검정을 수행하시오.

Q1. 카이제곱 통계량을 소수점 4자리까지 구하시오.
Q2. 자유도를 구하시오.
Q3. p-value를 소수점 4자리까지 구하시오.
Q4. 성별과 음료 선호도가 독립이라고 할 수 있는가? (예/아니오)
"""

from scipy.stats import chi2_contingency
import pandas as pd
import numpy as np

# 데이터셋: 성별과 음료 선호도
data = {
    '성별': ['남성']*50 + ['여성']*50,
    '음료': (['커피']*25 + ['차']*15 + ['주스']*10 +  # 남성
            ['커피']*18 + ['차']*22 + ['주스']*10)     # 여성
}
df = pd.DataFrame(data)

# 교차표 생성
crosstab = pd.crosstab(df['성별'], df['음료'])
print("교차표:")
print(crosstab)

# 카이제곱 독립성 검정
chi2, p_value, dof, expected = chi2_contingency(crosstab)

print(f"\\nQ1. 카이제곱 통계량: {chi2:.4f}")
print(f"Q2. 자유도: {dof}")
print(f"Q3. p-value: {p_value:.4f}")

if p_value > 0.05:
    print("Q4. 예 (독립)")
else:
    print("Q4. 아니오 (독립이 아님)")`,

  'fisher-exact': `"""
[문제]
신약의 효과를 검증하기 위해 소규모 임상시험을 수행하였다.
신약 투여 그룹과 위약 그룹의 치료 성공 여부가 다음과 같다.
Fisher 정확검정을 수행하여 신약의 효과를 검정하시오.

           치료성공  치료실패
신약그룹      12        3
위약그룹       5       10

Q1. 오즈비를 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 신약이 효과가 있다고 할 수 있는가? (예/아니오)
"""

from scipy import stats

# 데이터셋: 2x2 분할표
table = [[12, 3], [5, 10]]

# Fisher 정확검정
odds_ratio, p_value = stats.fisher_exact(table)

print("분할표:")
print(f"           치료성공  치료실패")
print(f"신약그룹      {table[0][0]}        {table[0][1]}")
print(f"위약그룹       {table[1][0]}       {table[1][1]}")
print(f"\\nQ1. 오즈비: {odds_ratio:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q3. 예 (신약이 효과 있음)")
else:
    print("Q3. 아니오 (신약 효과 없음)")`,

  pearson: `"""
[문제]
학생들의 일일 공부시간과 시험 성적 간의 상관관계를 분석하고자 한다.
15명의 학생을 대상으로 조사한 결과가 다음과 같다.
Pearson 상관분석을 수행하시오.

Q1. Pearson 상관계수를 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 상관관계가 유의한가? (예/아니오)
Q4. 상관관계의 강도는? (강함/중간/약함)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '학생': [f'S{i:02d}' for i in range(1, 16)],
    '공부시간': [2.5, 3.0, 1.5, 4.0, 3.5, 2.0, 4.5, 3.0, 2.5, 4.0, 1.0, 5.0, 3.5, 2.0, 4.5],
    '성적': [68, 75, 60, 85, 78, 65, 92, 73, 70, 88, 55, 95, 80, 62, 90]
})

# Pearson 상관계수
corr, p_value = stats.pearsonr(df['공부시간'], df['성적'])

print(f"Q1. Pearson 상관계수: {corr:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q3. 예 (유의한 상관관계)")
else:
    print("Q3. 아니오 (유의하지 않음)")

if abs(corr) > 0.7:
    print("Q4. 강함")
elif abs(corr) > 0.4:
    print("Q4. 중간")
else:
    print("Q4. 약함")`,

  spearman: `"""
[문제]
온라인 쇼핑몰에서 제품의 리뷰 수와 월 매출액의 관계를 분석하고자 한다.
12개 제품의 데이터가 다음과 같다. 데이터가 정규분포를 따르지 않아
Spearman 순위 상관분석을 수행하시오.

Q1. Spearman 상관계수를 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 리뷰 수와 매출액 간에 유의한 상관관계가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '제품': [f'P{i:02d}' for i in range(1, 13)],
    '리뷰수': [15, 42, 8, 78, 25, 95, 12, 55, 30, 120, 18, 88],
    '매출(만원)': [150, 380, 90, 650, 220, 820, 120, 480, 280, 950, 160, 720]
})

# Spearman 순위 상관계수
corr, p_value = stats.spearmanr(df['리뷰수'], df['매출(만원)'])

print(f"Q1. Spearman 상관계수: {corr:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q3. 예 (유의한 상관관계 있음)")
else:
    print("Q3. 아니오 (유의한 상관관계 없음)")`,

  kendall: `"""
[문제]
10명 직원의 근속연수와 직급(순위)의 관계를 분석하고자 한다.
직급은 1이 가장 높고 10이 가장 낮다.
Kendall tau 상관분석을 수행하시오.

Q1. Kendall tau 상관계수를 소수점 4자리까지 구하시오.
Q2. p-value를 소수점 4자리까지 구하시오.
Q3. 근속연수와 직급 간에 유의한 상관관계가 있는가? (예/아니오)
"""

from scipy import stats
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '직원': [f'E{i:02d}' for i in range(1, 11)],
    '근속연수': [12, 8, 15, 5, 20, 3, 18, 10, 7, 25],
    '직급순위': [3, 5, 2, 7, 1, 9, 2, 4, 6, 1]
})

# Kendall tau 상관계수
corr, p_value = stats.kendalltau(df['근속연수'], df['직급순위'])

print(f"Q1. Kendall tau 상관계수: {corr:.4f}")
print(f"Q2. p-value: {p_value:.4f}")

if p_value < 0.05:
    print("Q3. 예 (유의한 상관관계 있음)")
else:
    print("Q3. 아니오 (유의한 상관관계 없음)")`,

  ols: `"""
[문제]
아파트 가격을 예측하기 위해 면적(평), 층수, 역거리(km)를 독립변수로 하는
다중회귀분석을 수행하고자 한다. 15개 아파트의 데이터가 다음과 같다.

Q1. 면적(평)의 회귀계수를 소수점 4자리까지 구하시오.
Q2. 층수의 회귀계수를 소수점 4자리까지 구하시오.
Q3. R-squared를 소수점 4자리까지 구하시오.
Q4. 면적 35평, 층수 10층, 역거리 0.8km인 아파트의 예측 가격을 소수점 2자리까지 구하시오.
"""

import statsmodels.api as sm
import pandas as pd

# 데이터셋: 아파트 가격 (단위: 억원)
df = pd.DataFrame({
    '아파트': [f'A{i:02d}' for i in range(1, 16)],
    '면적(평)': [25, 32, 28, 40, 35, 30, 45, 38, 33, 42, 27, 36, 31, 39, 34],
    '층수': [5, 12, 8, 20, 15, 10, 25, 18, 11, 22, 7, 16, 9, 21, 14],
    '역거리(km)': [0.5, 1.2, 0.8, 2.0, 1.5, 1.0, 2.5, 1.8, 1.3, 2.2, 0.6, 1.6, 1.1, 2.1, 1.4],
    '가격(억)': [8.5, 11.2, 9.8, 14.5, 12.8, 10.5, 16.2, 13.8, 11.8, 15.3, 9.2, 13.1, 10.9, 14.8, 12.5]
})

# 독립변수와 종속변수 설정
X = df[['면적(평)', '층수', '역거리(km)']]
y = df['가격(억)']

# ⚠️ 상수항 추가 필수!
X = sm.add_constant(X)

# OLS 회귀분석
model = sm.OLS(y, X).fit()

print("=== 회귀분석 결과 ===")
print(f"회귀계수:\\n{model.params}")
print(f"\\nQ1. 면적(평) 회귀계수: {model.params['면적(평)']:.4f}")
print(f"Q2. 층수 회귀계수: {model.params['층수']:.4f}")
print(f"Q3. R-squared: {model.rsquared:.4f}")

# 예측값 계산
new_data = pd.DataFrame({
    'const': [1],
    '면적(평)': [35],
    '층수': [10],
    '역거리(km)': [0.8]
})
pred = model.predict(new_data)
print(f"Q4. 예측 가격: {pred[0]:.2f}억원")`,

  'linear-regression': `"""
[문제]
카페의 일일 매출을 예측하기 위해 기온, 비 유무(0: 안옴, 1: 옴),
주말 여부(0: 평일, 1: 주말)를 독립변수로 하는 회귀모델을 구축하고자 한다.
20일간의 데이터가 다음과 같다.

Q1. 학습 데이터의 R²를 소수점 4자리까지 구하시오.
Q2. 테스트 데이터의 R²를 소수점 4자리까지 구하시오.
Q3. 기온 28도, 비 안옴, 주말인 날의 예측 매출을 소수점 2자리까지 구하시오.
"""

from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import pandas as pd
import numpy as np

# 데이터셋: 일일 매출 (단위: 만원)
df = pd.DataFrame({
    '날짜': [f'D{i:02d}' for i in range(1, 21)],
    '기온': [25, 28, 22, 30, 27, 24, 32, 29, 26, 31,
            23, 33, 28, 25, 30, 27, 29, 24, 31, 26],
    '비유무': [0, 0, 1, 0, 0, 1, 0, 0, 0, 0,
              1, 0, 0, 1, 0, 0, 0, 1, 0, 0],
    '주말': [0, 1, 0, 0, 1, 0, 1, 0, 0, 1,
            0, 0, 1, 0, 1, 0, 0, 1, 0, 1],
    '매출': [85, 120, 65, 95, 135, 70, 150, 110, 90, 145,
            60, 155, 125, 72, 140, 92, 115, 68, 148, 130]
})

X = df[['기온', '비유무', '주말']]
y = df['매출']

# 학습/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# 모델 학습
model = LinearRegression()
model.fit(X_train, y_train)

print(f"회귀계수: {model.coef_}")
print(f"절편: {model.intercept_:.4f}")
print(f"\\nQ1. 학습 R²: {model.score(X_train, y_train):.4f}")
print(f"Q2. 테스트 R²: {model.score(X_test, y_test):.4f}")

# 예측
new_data = np.array([[28, 0, 1]])  # 기온 28도, 비 안옴, 주말
pred = model.predict(new_data)
print(f"Q3. 예측 매출: {pred[0]:.2f}만원")`,

  logit: `"""
[문제]
은행에서 대출 승인 여부를 예측하기 위해 나이, 연소득(만원), 신용점수를
독립변수로 하는 로지스틱 회귀모델을 구축하고자 한다.
20명의 고객 데이터가 다음과 같다.

Q1. 연소득의 회귀계수를 소수점 6자리까지 구하시오.
Q2. 연소득의 오즈비를 소수점 4자리까지 구하시오.
Q3. 신용점수의 p-value를 소수점 4자리까지 구하시오.
Q4. 로그우도(Log-Likelihood)를 소수점 4자리까지 구하시오.
"""

import statsmodels.api as sm
import pandas as pd
import numpy as np

# 데이터셋
df = pd.DataFrame({
    '고객ID': [f'C{i:02d}' for i in range(1, 21)],
    '나이': [25, 35, 28, 45, 32, 52, 29, 48, 38, 55,
            27, 42, 33, 50, 30, 47, 36, 53, 31, 44],
    '연소득': [3500, 5200, 4100, 7800, 4800, 8500, 3800, 7200, 5500, 9000,
              3600, 6500, 4900, 8200, 4200, 7500, 5100, 8800, 4500, 6800],
    '신용점수': [650, 720, 680, 780, 710, 800, 660, 760, 730, 820,
               655, 750, 715, 790, 690, 770, 725, 810, 700, 755],
    '승인여부': [0, 1, 0, 1, 1, 1, 0, 1, 1, 1,
               0, 1, 1, 1, 0, 1, 1, 1, 1, 1]
})

# 독립변수 및 종속변수
X = df[['나이', '연소득', '신용점수']]
y = df['승인여부']

# ⚠️ 상수항 추가 필수!
X = sm.add_constant(X)

# 로지스틱 회귀 (GLM)
model = sm.GLM(y, X, family=sm.families.Binomial()).fit()

print("=== 로지스틱 회귀 결과 ===")
print(f"회귀계수:\\n{model.params}")

# 오즈비 계산
odds_ratios = np.exp(model.params)

print(f"\\nQ1. 연소득 회귀계수: {model.params['연소득']:.6f}")
print(f"Q2. 연소득 오즈비: {odds_ratios['연소득']:.4f}")
print(f"Q3. 신용점수 p-value: {model.pvalues['신용점수']:.4f}")
print(f"Q4. 로그우도: {model.llf:.4f}")`,

  'logistic-regression': `"""
[문제]
통신사에서 고객 이탈을 예측하기 위해 사용기간(개월), 월이용료(천원),
불만횟수를 독립변수로 하는 로지스틱 회귀모델을 구축하고자 한다.
20명의 고객 데이터가 다음과 같다.

Q1. 정확도(Accuracy)를 소수점 4자리까지 구하시오.
Q2. 혼동행렬의 True Positive(실제 이탈, 예측 이탈) 수를 구하시오.
Q3. 혼동행렬의 False Negative(실제 이탈, 예측 잔류) 수를 구하시오.
"""

from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, confusion_matrix
import pandas as pd

# 데이터셋
df = pd.DataFrame({
    '고객ID': [f'C{i:02d}' for i in range(1, 21)],
    '사용기간': [12, 24, 6, 36, 18, 48, 9, 30, 15, 42,
               8, 33, 21, 45, 11, 27, 14, 39, 7, 25],
    '월이용료': [45, 65, 35, 85, 55, 95, 40, 75, 50, 90,
               38, 78, 60, 92, 42, 70, 48, 88, 36, 68],
    '불만횟수': [3, 1, 4, 0, 2, 0, 5, 1, 3, 0,
               4, 1, 2, 0, 3, 1, 2, 0, 5, 2],
    '이탈여부': [1, 0, 1, 0, 0, 0, 1, 0, 1, 0,
               1, 0, 0, 0, 1, 0, 0, 0, 1, 0]
})

X = df[['사용기간', '월이용료', '불만횟수']]
y = df['이탈여부']

# 학습/테스트 분할
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

# 모델 학습
model = LogisticRegression()
model.fit(X_train, y_train)

# 예측 및 평가
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)

print(f"회귀계수: {model.coef_}")
print(f"절편: {model.intercept_}")
print(f"\\nQ1. 정확도: {accuracy:.4f}")
print(f"\\n혼동행렬:")
print(conf_matrix)
print(f"\\n      예측잔류  예측이탈")
print(f"실제잔류   {conf_matrix[0][0]}       {conf_matrix[0][1]}")
print(f"실제이탈   {conf_matrix[1][0]}       {conf_matrix[1][1]}")
print(f"\\nQ2. True Positive: {conf_matrix[1][1]}")
print(f"Q3. False Negative: {conf_matrix[1][0]}")`,
};
