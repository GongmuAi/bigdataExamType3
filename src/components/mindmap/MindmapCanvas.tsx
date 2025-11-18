'use client';

import { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Panel,
  MiniMap,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { statisticsTree } from '@/data/tree-structure';
import { convertTreeToFlow, getLayoutedElements } from '@/lib/tree-to-flow';
import StatMethodNode from './nodes/StatMethodNode';
import CategoryNode from './nodes/CategoryNode';
import ConditionNode from './nodes/ConditionNode';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, ChevronDown, ChevronUp } from 'lucide-react';
import { NodeExpansionProvider } from '@/contexts/NodeExpansionContext';

const nodeTypes = {
  category: CategoryNode,
  condition: ConditionNode,
  method: StatMethodNode,
};

function MindmapContent() {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(() => {
    const { nodes: rawNodes, edges: rawEdges } = convertTreeToFlow(statisticsTree);
    return getLayoutedElements(rawNodes, rawEdges, 'LR');
  }, []);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);
  const [isLegendExpanded, setIsLegendExpanded] = useState(false);

  const nodeColor = useCallback((node: { type?: string }) => {
    switch (node.type) {
      case 'category':
        return '#3b82f6';
      case 'condition':
        return '#a855f7';
      case 'method':
        return '#f97316';
      default:
        return '#6b7280';
    }
  }, []);

  return (
    <div className="w-full h-screen bg-gray-50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        nodesConnectable={false}
        fitView
        fitViewOptions={{
          padding: 0.1,
          maxZoom: 1,
          minZoom: 0.3,
        }}
        minZoom={0.1}
        maxZoom={2}
        attributionPosition="bottom-left"
      >
        <Controls position="top-right" />
        <MiniMap
          nodeColor={nodeColor}
          nodeStrokeWidth={3}
          pannable
          zoomable
          position="bottom-right"
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />

        <Panel position="top-left" className="m-4">
          <Card className="shadow-lg min-w-[480px] max-w-[630px]">
            <CardContent className={isLegendExpanded ? "p-3" : "px-3 py-2"}>
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">
                  빅분기 3유형 통계 분석
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0 ml-2"
                  onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                >
                  {isLegendExpanded ? (
                    <ChevronUp className="h-3 w-3" />
                  ) : (
                    <ChevronDown className="h-3 w-3" />
                  )}
                </Button>
              </div>
              {isLegendExpanded && (
                <div className="mt-3 space-y-2 text-xs max-h-[70vh] overflow-y-auto pr-2">
                  <div className="font-semibold text-blue-600 mb-3 text-sm">📚 검정 선택 가이드</div>

                  <div className="space-y-4">
                    <div className="bg-blue-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">🔍 사전검정</p>
                      <p className="text-gray-500 mb-2 italic">본격 분석 전에 데이터 특성 확인</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">Shapiro-Wilk:</span> "데이터가 정규분포야?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 샘플 수 적을 때 (n&lt;5000)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.shapiro(데이터)</code>
                        <p>• <span className="font-medium">Levene:</span> "두 그룹 분산 비슷해?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ t검정 전에 등분산성 확인</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.levene(그룹A, 그룹B)</code>
                        <p>• <span className="font-medium">F-검정:</span> "두 그룹 분산비 얼마나 차이나?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 분산비 직접 계산 (큰분산/작은분산)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">F = var_A / var_B  # var_A &gt; var_B</code>
                        <p>• <span className="font-medium">합동분산:</span> "등분산 가정 시 공통 분산은?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 두 그룹 분산의 가중평균</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">s_p² = ((n₁-1)s₁² + (n₂-1)s₂²) / (n₁+n₂-2)</code>
                      </div>
                    </div>

                    <div className="bg-purple-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">📊 t검정</p>
                      <p className="text-gray-500 mb-2 italic">평균 비교할 때 (2개 그룹 이하)</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">단일표본:</span> "우리 반 평균 80점 맞아?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 1개 그룹 vs 기준값</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.ttest_1samp(그룹, 비교값)</code>
                        <p>• <span className="font-medium">독립표본:</span> "A반 vs B반, 누가 잘해?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 서로 다른 2개 그룹</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.ttest_ind(그룹A, 그룹B)</code>
                        <p>• <span className="font-medium">대응표본:</span> "다이어트 전후 살 빠졌어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 같은 대상 전/후 비교</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.ttest_rel(사전, 사후)</code>
                      </div>
                    </div>

                    <div className="bg-green-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">📈 ANOVA</p>
                      <p className="text-gray-500 mb-2 italic">3개 이상 그룹 평균 비교</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">f_oneway:</span> "A, B, C반 중 차이 있어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 일원분산분석</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.f_oneway(A, B, C)</code>
                        <p>• <span className="font-medium">TukeyHSD:</span> "어느 반끼리 차이나?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 사후검정 (어디가 다른지)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">result = pairwise_tukeyhsd(값, 그룹)</code>
                      </div>
                    </div>

                    <div className="bg-orange-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">🎲 카이제곱</p>
                      <p className="text-gray-500 mb-2 italic">범주형 데이터 분석 (남/여, 찬성/반대)</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">독립성:</span> "성별-선호도 관련 있어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 두 변수 간 독립성 검정</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">chi2, pval, dof, exp = stats.chi2_contingency(교차표)</code>
                        <p>• <span className="font-medium">적합도:</span> "주사위 조작됐어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 기대빈도 vs 관측빈도</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">stat, pval = stats.chisquare(관측, 기대)</code>
                      </div>
                    </div>

                    <div className="bg-pink-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">🔗 상관분석</p>
                      <p className="text-gray-500 mb-2 italic">두 변수 간 관계 강도 측정</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">Pearson:</span> "키-몸무게 관계있어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 선형 상관관계 (정규성 O)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">corr, pval = stats.pearsonr(X, Y)</code>
                        <p>• <span className="font-medium">Spearman:</span> "순위 간 관계있어?"</p>
                        <p className="text-xs ml-3 text-gray-500">→ 순위 상관관계 (정규성 X)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">corr, pval = stats.spearmanr(X, Y)</code>
                      </div>
                    </div>

                    <div className="bg-indigo-50 p-2 rounded">
                      <p className="font-semibold text-gray-800 mb-1.5">📉 회귀분석</p>
                      <p className="text-gray-500 mb-2 italic">Y값 예측 (독립변수 → 종속변수)</p>
                      <div className="ml-2 space-y-1.5 text-gray-700">
                        <p>• <span className="font-medium">다중선형:</span> "공부시간→점수 예측"</p>
                        <p className="text-xs ml-3 text-gray-500">→ Y가 연속형 (점수, 키, 가격)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">model = sm.OLS(y, X).fit()</code>
                        <p>• <span className="font-medium">로지스틱:</span> "나이→합격확률 예측"</p>
                        <p className="text-xs ml-3 text-gray-500">→ Y가 범주형 (합격/불합격)</p>
                        <code className="text-xs ml-3 bg-gray-100 px-1.5 py-0.5 rounded block mt-1">model = sm.Logit(y, X).fit()</code>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </Panel>
      </ReactFlow>
    </div>
  );
}

export default function MindmapCanvas() {
  return (
    <NodeExpansionProvider>
      <MindmapContent />
    </NodeExpansionProvider>
  );
}
