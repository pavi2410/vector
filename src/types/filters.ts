export interface FilterInput {
  name: string;
  type: 'source' | 'result';
  value?: string;
}

export interface FilterOutput {
  name: string;
  result: string;
}

export type FilterNodeType = 
  | 'source'
  | 'blur'
  | 'dropshadow'
  | 'colormatrix'
  | 'displacement'
  | 'composite'
  | 'merge'
  | 'output';

export interface FilterNode {
  id: string;
  type: FilterNodeType;
  position: { x: number; y: number };
  data: {
    params: Record<string, any>;
    inputs: FilterInput[];
    outputs: FilterOutput[];
  };
}

export interface FilterPipeline {
  id: string;
  name: string;
  nodes: FilterNode[];
  edges: Array<{
    id: string;
    source: string;
    target: string;
    sourceHandle?: string;
    targetHandle?: string;
  }>;
  outputNode: string;
}

export interface FilterState {
  pipelines: Record<string, FilterPipeline>;
  activePipeline: string | null;
  previewEnabled: boolean;
}