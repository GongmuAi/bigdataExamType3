import { Node, Edge } from '@xyflow/react';
import dagre from 'dagre';
import { StatNode, NodeData } from '@/types/mindmap';

export function convertTreeToFlow(tree: StatNode): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  function traverse(node: StatNode, parentId?: string) {
    const flowNode: Node = {
      id: node.id,
      type: node.type,
      data: {
        label: node.label,
        type: node.type,
        metadata: node.metadata,
      } as NodeData,
      position: { x: 0, y: 0 }, // Will be calculated by dagre
    };

    nodes.push(flowNode);

    if (parentId) {
      edges.push({
        id: `${parentId}-${node.id}`,
        source: parentId,
        target: node.id,
        type: 'smoothstep',
        animated: false,
        style: {
          stroke: '#94a3b8',
          strokeWidth: 2.5,
          strokeOpacity: 0.8,
        },
        // 엣지 간격 개선을 위한 pathOptions 추가
        pathOptions: { offset: 5, borderRadius: 10 },
      });
    }

    if (node.children) {
      node.children.forEach((child) => traverse(child, node.id));
    }
  }

  traverse(tree);

  return { nodes, edges };
}

export function getLayoutedElements(
  nodes: Node[],
  edges: Edge[],
  direction: 'TB' | 'LR' = 'TB'
): { nodes: Node[]; edges: Edge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const nodeWidth = 350;
  const nodeHeight = 120;

  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: 200,      // 노드 수직 간격 증가 (100 → 200)
    ranksep: 250,      // 계층 간 수평 간격 증가 (120 → 250)
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: nodeWidth,
      height: nodeHeight,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  // Get all method nodes and sort them by their original Y position
  const methodNodes = nodes.filter(n => n.type === 'method');
  const otherNodes = nodes.filter(n => n.type !== 'method');

  // Sort method nodes by their dagre-calculated Y position
  const methodNodesWithPositions = methodNodes.map(node => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      node,
      originalY: nodeWithPosition.y,
      x: nodeWithPosition.x,
    };
  }).sort((a, b) => a.originalY - b.originalY);

  // Find the rightmost X position for method nodes (they should all be in the same column)
  const maxX = Math.max(...methodNodesWithPositions.map(m => m.x));

  // Recalculate Y positions for method nodes to be evenly spaced in a single column
  const methodNodeSpacing = nodeHeight + 180; // height + vertical gap (100 → 180)
  const startY = methodNodesWithPositions.length > 0 ? methodNodesWithPositions[0].originalY : 0;

  const layoutedMethodNodes = methodNodesWithPositions.map((item, index) => ({
    ...item.node,
    position: {
      x: maxX - nodeWidth / 2,
      y: startY + (index * methodNodeSpacing) - nodeHeight / 2,
    },
  }));

  const layoutedOtherNodes = otherNodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: [...layoutedOtherNodes, ...layoutedMethodNodes], edges };
}
