'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { NodeData } from '@/types/mindmap';

const CategoryNode = ({ data }: NodeProps) => {
  const nodeData = data as unknown as NodeData;

  return (
    <div className="min-w-[280px]">
      <Handle type="target" position={Position.Left} className="!bg-gray-400" />

      <Card className="border-2 border-blue-500 bg-blue-50 shadow-md">
        <CardHeader className="py-5">
          <CardTitle className="text-center text-3xl font-bold text-blue-700 whitespace-pre-line">
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

export default memo(CategoryNode);
