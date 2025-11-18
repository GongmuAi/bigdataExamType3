import { StatNode } from '@/types/mindmap';

export const statisticsTree: StatNode = {
  id: 'root',
  label: '빅분기 3유형',
  type: 'category',
  children: [
    {
      id: 'pre-test',
      label: '사전검정',
      type: 'category',
      children: [
        {
          id: 'normality',
          label: '정규성 검정',
          type: 'condition',
          children: [
            {
              id: 'shapiro',
              label: 'Shapiro-Wilk\n(n < 5000)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: 'p > 0.05면 정규분포',
                functionName: 'shapiro()',
              },
            },
            {
              id: 'anderson',
              label: 'Anderson-Darling\n(n ≥ 5000)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 2,
                note: '대용량 데이터용',
                functionName: 'anderson()',
              },
            },
          ],
        },
        {
          id: 'homoscedasticity',
          label: '등분산성 검정',
          type: 'condition',
          children: [
            {
              id: 'levene',
              label: 'Levene 검정',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: 'p > 0.05면 등분산 만족',
                functionName: 'levene()',
              },
            },
            {
              id: 'bartlett',
              label: 'Bartlett 검정\n(정규성 만족 시)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 1,
                note: '정규성 만족시 사용',
                functionName: 'bartlett()',
              },
            },
            {
              id: 'f-test-variance',
              label: 'F-검정\n(분산비 검정)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: '두 집단 분산비 검정',
                functionName: 'F = var1/var2',
              },
            },
            {
              id: 'pooled-variance',
              label: '합동분산추정량',
              type: 'method',
              metadata: {
                library: 'numpy',
                importance: 2,
                note: '두 집단 공통 분산 추정',
                functionName: 's²_p = ((n₁-1)s₁²+(n₂-1)s₂²)/(n₁+n₂-2)',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'continuous',
      label: '연속형 검정',
      type: 'category',
      children: [
        {
          id: 'one-group',
          label: '1개 그룹',
          type: 'condition',
          children: [
            {
              id: 'ttest-1samp',
              label: '단일표본 t검정\n(정규성 O)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 2,
                note: '모평균 검정',
                functionName: 'ttest_1samp()',
              },
            },
            {
              id: 'wilcoxon-single',
              label: 'Wilcoxon 부호순위\n(정규성 X)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 1,
                note: '비모수 대체',
                functionName: 'wilcoxon()',
              },
            },
          ],
        },
        {
          id: 'two-group',
          label: '2개 그룹',
          type: 'condition',
          children: [
            {
              id: 'independent',
              label: '독립',
              type: 'condition',
              children: [
                {
                  id: 'ttest-ind',
                  label: '독립표본 t검정\n(정규성 O)',
                  type: 'method',
                  metadata: {
                    library: 'scipy.stats',
                    importance: 3,
                    note: '두 집단 평균 비교',
                    functionName: 'ttest_ind()',
                  },
                },
                {
                  id: 'mannwhitneyu',
                  label: 'Mann-Whitney U\n(정규성 X)',
                  type: 'method',
                  metadata: {
                    library: 'scipy.stats',
                    importance: 1,
                    note: '비모수 대체',
                    functionName: 'mannwhitneyu()',
                  },
                },
              ],
            },
            {
              id: 'paired',
              label: '대응',
              type: 'condition',
              children: [
                {
                  id: 'ttest-rel',
                  label: '대응표본 t검정\n(정규성 O)',
                  type: 'method',
                  metadata: {
                    library: 'scipy.stats',
                    importance: 2,
                    note: '전후 비교',
                    functionName: 'ttest_rel()',
                  },
                },
                {
                  id: 'wilcoxon-paired',
                  label: 'Wilcoxon 부호순위\n(정규성 X)',
                  type: 'method',
                  metadata: {
                    library: 'scipy.stats',
                    importance: 1,
                    note: '비모수 대체',
                    functionName: 'wilcoxon()',
                  },
                },
              ],
            },
          ],
        },
        {
          id: 'three-plus',
          label: '3개+ 그룹',
          type: 'condition',
          children: [
            {
              id: 'f-oneway',
              label: '일원 ANOVA\n(정규성 O)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: '3개 이상 집단 평균',
                functionName: 'f_oneway()',
              },
            },
            {
              id: 'kruskal',
              label: 'Kruskal-Wallis\n(정규성 X)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 1,
                note: '비모수 대체',
                functionName: 'kruskal()',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'categorical',
      label: '범주형 검정',
      type: 'category',
      children: [
        {
          id: 'proportion',
          label: '비율 검정',
          type: 'condition',
          children: [
            {
              id: 'proportions-ztest',
              label: '비율 z검정',
              type: 'method',
              metadata: {
                library: 'statsmodels',
                importance: 1,
                note: '단일/두 비율 비교',
                functionName: 'proportions_ztest()',
              },
            },
            {
              id: 'binom-test',
              label: '이항검정\n(n 작을 때)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 1,
                note: 'n 작을 때',
                functionName: 'binom_test()',
              },
            },
          ],
        },
        {
          id: 'frequency',
          label: '빈도 검정',
          type: 'condition',
          children: [
            {
              id: 'chisquare',
              label: '카이제곱 적합도',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: '기대빈도 vs 관측빈도',
                functionName: 'chisquare()',
              },
            },
            {
              id: 'chi2-contingency',
              label: '카이제곱 독립성',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 3,
                note: '교차표 독립성 검정',
                functionName: 'chi2_contingency()',
              },
            },
            {
              id: 'fisher-exact',
              label: 'Fisher 정확검정\n(2x2, n<30)',
              type: 'method',
              metadata: {
                library: 'scipy.stats',
                importance: 1,
                note: '2x2, n<30',
                functionName: 'fisher_exact()',
              },
            },
          ],
        },
      ],
    },
    {
      id: 'correlation',
      label: '상관관계',
      type: 'category',
      children: [
        {
          id: 'pearson',
          label: 'Pearson 상관\n(정규성 O)',
          type: 'method',
          metadata: {
            library: 'scipy.stats',
            importance: 2,
            note: '선형 상관계수',
            functionName: 'pearsonr()',
          },
        },
        {
          id: 'spearman',
          label: 'Spearman 상관\n(정규성 X)',
          type: 'method',
          metadata: {
            library: 'scipy.stats',
            importance: 1,
            note: '순위 상관',
            functionName: 'spearmanr()',
          },
        },
        {
          id: 'kendall',
          label: 'Kendall 상관\n(정규성 X)',
          type: 'method',
          metadata: {
            library: 'scipy.stats',
            importance: 1,
            note: '순위 상관',
            functionName: 'kendalltau()',
          },
        },
      ],
    },
    {
      id: 'regression',
      label: '회귀분석',
      type: 'category',
      children: [
        {
          id: 'linear-reg',
          label: '선형회귀\n(연속형 Y)',
          type: 'condition',
          children: [
            {
              id: 'ols',
              label: '다중선형회귀\n(추론용)',
              type: 'method',
              metadata: {
                library: 'statsmodels',
                importance: 3,
                note: '연속형 Y, R² 확인',
                functionName: 'OLS()',
              },
            },
            {
              id: 'linear-regression',
              label: '다중선형회귀\n(예측용)',
              type: 'method',
              metadata: {
                library: 'sklearn',
                importance: 2,
                note: '예측용',
                functionName: 'LinearRegression()',
              },
            },
          ],
        },
        {
          id: 'logistic-reg',
          label: '로지스틱회귀\n(범주형 Y)',
          type: 'condition',
          children: [
            {
              id: 'logit',
              label: '로지스틱회귀\n(추론용)',
              type: 'method',
              metadata: {
                library: 'statsmodels',
                importance: 3,
                note: '범주형 Y, 오즈비',
                functionName: 'Logit()',
              },
            },
            {
              id: 'logistic-regression',
              label: '로지스틱회귀\n(예측용)',
              type: 'method',
              metadata: {
                library: 'sklearn',
                importance: 3,
                note: '예측용',
                functionName: 'LogisticRegression()',
              },
            },
          ],
        },
      ],
    },
  ],
};
