import React from 'react';

type EventMap = {
  'zoom:in': void;
  'zoom:out': void;
  'zoom:fit': void;
  'zoom:actual': void;
  'canvas:center': void;
};

class EventBus<T extends Record<string, any>> {
  private listeners = new Map<keyof T, Function[]>();

  emit<K extends keyof T>(event: K, ...args: T[K] extends void ? [] : [T[K]]) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    // Snapshot the handlers array so that on/off calls inside a handler
    // don't affect the current iteration.
    for (const handler of [...handlers]) {
      try {
        handler(...(args as T[K] extends void ? [] : [T[K]]));
      } catch (err) {
        console.error(`[EventBus] Handler for "${String(event)}" threw:`, err);
      }
    }
  }

  on<K extends keyof T>(event: K, handler: T[K] extends void ? () => void : (data: T[K]) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler);
  }

  off<K extends keyof T>(event: K, handler: T[K] extends void ? () => void : (data: T[K]) => void) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) handlers.splice(index, 1);
    }
  }
}

export const eventBus = new EventBus<EventMap>();

export function useOnEvent<K extends keyof EventMap>(
  event: K, 
  handler: EventMap[K] extends void ? () => void : (data: EventMap[K]) => void,
  deps: React.DependencyList = []
) {
  // Keep a stable ref to the latest handler so we don't need to
  // re-subscribe on every render when the handler identity changes.
  const handlerRef = React.useRef(handler);
  React.useLayoutEffect(() => {
    handlerRef.current = handler;
  });

  React.useEffect(() => {
    const stable = (...args: any[]) => (handlerRef.current as any)(...args);
    eventBus.on(event, stable as any);
    return () => eventBus.off(event, stable as any);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, ...deps]);
}