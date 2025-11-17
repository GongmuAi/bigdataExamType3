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
          <Card className="shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">
                  빅분기 3유형 통계 분석 마인드맵
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 ml-2"
                  onClick={() => setIsLegendExpanded(!isLegendExpanded)}
                >
                  {isLegendExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isLegendExpanded && (
                <>
                  <div className="space-y-2 text-sm mt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 rounded" />
                      <span>카테고리</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-purple-500 rounded" />
                      <span>조건 분기</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-orange-500 rounded" />
                      <span>통계 메서드 (클릭하여 코드 확인)</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold mb-2">라이브러리</p>
                    <div className="flex flex-wrap gap-1">
                      <Badge className="bg-blue-500 text-white text-xs">
                        scipy.stats
                      </Badge>
                      <Badge className="bg-green-500 text-white text-xs">
                        statsmodels
                      </Badge>
                      <Badge className="bg-purple-500 text-white text-xs">
                        sklearn
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold mb-2">중요도</p>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-xs">필수 (자주 출제)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-xs">중요</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        </div>
                        <span className="text-xs">참고</span>
                      </div>
                    </div>
                  </div>
                </>
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
