import { atom } from 'nanostores';
import type { FilterState, FilterPipeline } from '../types/filters';

export const filterStore = atom<FilterState>({
  pipelines: {},
  activePipeline: null,
  previewEnabled: true
});

export const createFilterPipeline = (name: string): FilterPipeline => {
  const id = `pipeline-${Date.now()}`;
  return {
    id,
    name,
    nodes: [
      {
        id: 'source-1',
        type: 'source',
        position: { x: 0, y: 0 },
        data: {
          params: { input: 'SourceGraphic' },
          inputs: [],
          outputs: [{ name: 'output', result: 'SourceGraphic' }]
        }
      },
      {
        id: 'output-1',
        type: 'output',
        position: { x: 300, y: 0 },
        data: {
          params: {},
          inputs: [{ name: 'input', type: 'result' }],
          outputs: []
        }
      }
    ],
    edges: [
      {
        id: 'edge-1',
        source: 'source-1',
        target: 'output-1'
      }
    ],
    outputNode: 'output-1'
  };
};

export const addFilterPipeline = (name: string) => {
  const current = filterStore.get();
  const pipeline = createFilterPipeline(name);
  filterStore.set({
    ...current,
    pipelines: {
      ...current.pipelines,
      [pipeline.id]: pipeline
    },
    activePipeline: pipeline.id
  });
  return pipeline.id;
};

export const setActivePipeline = (pipelineId: string | null) => {
  const current = filterStore.get();
  filterStore.set({
    ...current,
    activePipeline: pipelineId
  });
};

export const togglePreview = () => {
  const current = filterStore.get();
  filterStore.set({
    ...current,
    previewEnabled: !current.previewEnabled
  });
};