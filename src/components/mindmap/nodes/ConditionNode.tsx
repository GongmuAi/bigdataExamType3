'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeData } from '@/types/mindmap';

const ConditionNode = ({ data }: NodeProps) => {
  const nodeData = data as NodeData;

  return (
    <div className="min-w-[260px]">
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />

      <Card className="border-2 border-purple-400 bg-purple-50 shadow-sm">
        <CardHeader className="py-4">
          <CardTitle className="text-center text-2xl font-semibold text-purple-700 whitespace-pre-line">
            {nodeData.label}
          </CardTitle>
        </CardHeader>
      </Card>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-gray-400"
      />
    </div>
  );
};

export default memo(ConditionNode);
