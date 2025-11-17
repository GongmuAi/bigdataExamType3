'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface NodeExpansionContextType {
  expandedNodeId: string | null;
  setExpandedNodeId: (id: string | null) => void;
}

const NodeExpansionContext = createContext<NodeExpansionContextType | null>(null);

export function NodeExpansionProvider({ children }: { children: ReactNode }) {
  const [expandedNodeId, setExpandedNodeId] = useState<string | null>(null);

  return (
    <NodeExpansionContext.Provider value={{ expandedNodeId, setExpandedNodeId }}>
      {children}
    </NodeExpansionContext.Provider>
  );
}

export function useNodeExpansion() {
  const context = useContext(NodeExpansionContext);
  if (!context) {
    throw new Error('useNodeExpansion must be used within NodeExpansionProvider');
  }
  return context;
}
