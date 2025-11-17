export interface StatNode {
  id: string;
  label: string;
  type: 'category' | 'condition' | 'method';
  code?: string;
  children?: StatNode[];
  metadata?: {
    library: string;
    importance: number; // 1-3 stars
    note: string;
    functionName: string;
  };
}

export interface NodeData {
  label: string;
  type: 'category' | 'condition' | 'method';
  code?: string;
  metadata?: {
    library: string;
    importance: number;
    note: string;
    functionName: string;
  };
  isExpanded?: boolean;
}
