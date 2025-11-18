# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is an **Interactive Statistical Decision Tree Visualization Tool** for preparing the Korean Big Data Certification Exam (빅데이터 분석기사 실기), specifically Type 3 problems (작업형 3유형) which focus on statistical inference and hypothesis testing using Python.

The application provides an interactive mind map that helps students understand when to use different statistical methods, with AI-powered practice question generation.

## Development Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
```

**Environment Variables:**
- `GEMINI_API_KEY` - Required for AI question generation (Get from https://aistudio.google.com/app/apikey)
- `NEXT_PUBLIC_SITE_URL` - Optional, defaults to localhost

## Tech Stack

- **Next.js 16** with App Router
- **React 19** + TypeScript
- **@xyflow/react** - Interactive graph visualization
- **dagre** - Hierarchical graph layout
- **shadcn/ui** + Tailwind CSS - UI components
- **Gemini 2.5 Flash-Lite API** - LLM for question generation (직접 호출)

## Code Architecture

```
src/
├── app/
│   ├── page.tsx                    # Main entry (dynamic import of MindmapCanvas)
│   └── api/generate-question/      # AI question generation endpoint
├── components/
│   ├── mindmap/
│   │   ├── MindmapCanvas.tsx       # Main ReactFlow visualization
│   │   └── nodes/                  # Custom node renderers (Category/Condition/Method)
│   └── ui/                         # shadcn/ui components
├── data/
│   ├── tree-structure.ts           # Statistical method hierarchy (30+ methods)
│   └── sample-codes.ts             # Python code examples per method
├── lib/
│   └── tree-to-flow.ts             # Tree→ReactFlow conversion + Dagre layout
├── contexts/
│   └── NodeExpansionContext.tsx    # Global state for expanded nodes
└── types/
    └── mindmap.ts                  # TypeScript interfaces

@docs/prompt/                       # AI prompt templates for each statistical method
```

### Key Patterns

**1. Tree-to-Graph Conversion:**
```typescript
// src/lib/tree-to-flow.ts converts hierarchical data to ReactFlow format
const { nodes, edges } = convertTreeToFlow(treeData);
const layouted = getLayoutedElements(nodes, edges, 'LR'); // Dagre layout
```

**2. Prompt Template Mapping** (in API route):
```typescript
// Maps statistical method names to specialized prompt files
const promptMapping = {
  'OLS()': 'improved_prompt_multiple_regression.md',
  'Logit()': 'improved_prompt_logistic.md',
  'ttest_ind()': 'improved_prompt_ttest.md',
  // ... 30+ mappings
};
```

**3. Client-Side Only Rendering:**
```typescript
// MindmapCanvas uses dynamic import with SSR disabled
const MindmapCanvas = dynamic(() => import('@/components/mindmap/MindmapCanvas'), {
  ssr: false
});
```

**4. Path Aliases:**
```typescript
import { something } from '@/components/...';  // Maps to src/
```

## Key Domain Knowledge

### Exam Focus (Post-June 2025)
- **Problem 5**: Multiple Linear Regression or Logistic Regression (required)
- **Problem 6**: Hypothesis Testing with TukeyHSD post-hoc test (required)
- Balance: 50% regression analysis + 50% hypothesis testing
- Emphasis on **inference**, not prediction

### Core Statistical Libraries
```python
import statsmodels.api as sm          # Regression models
from scipy import stats                # Hypothesis tests
from statsmodels.stats.multicomp import pairwise_tukeyhsd  # Post-hoc tests
```

### Critical Implementation Patterns

**Always add constant for statsmodels regression:**
```python
X = sm.add_constant(X)  # REQUIRED for intercept
model = sm.OLS(y, X).fit()          # Linear regression
model = sm.Logit(y, X).fit()        # Logistic regression
model = sm.GLM(y, X, family=sm.families.Binomial()).fit()  # GLM approach
```

**Key model outputs:**
- `model.params` - regression coefficients
- `model.pvalues` - p-values for significance testing
- `np.exp(model.params)` - odds ratios (logistic regression)
- `model.rsquared` - R-squared (linear regression)
- `model.llf` - log-likelihood (logistic regression)

### Common Problem Types

1. **Multiple Linear Regression**: Extract coefficients, p-values, R², predictions
2. **Logistic Regression**: Odds ratios (`np.exp(coef)`), significance testing, deviance
3. **Independent t-test**: `stats.ttest_ind()` with `equal_var` parameter based on Levene test
4. **One-way ANOVA + TukeyHSD**: `stats.f_oneway()` followed by `pairwise_tukeyhsd()`
5. **Chi-square Independence**: `chi2_contingency()` with `pd.crosstab()` for raw data
6. **Correlation Analysis**: Use `abs()` for "strongest correlation" questions

### Common Pitfalls to Avoid

- Missing `sm.add_constant()` for regression intercepts
- Not using `abs()` when finding strongest correlations (negative correlations)
- Using raw data directly in chi-square instead of `pd.crosstab()` first
- Ignoring `equal_var` parameter in t-tests (check Levene test first)
- Incorrect TukeyHSD input format (needs 1D array + group labels)

## Workflow

Problems are structured as:
- Data source: CSV files (often from GitHub raw URLs)
- Analysis: Statistical modeling with specific numeric outputs
- Output: Rounded to specified decimal places

When generating practice problems, create two files per problem:
1. `data.csv` - actual data file
2. `question.md` - problem statement with data description
