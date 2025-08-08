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
    this.listeners.get(event)?.forEach(handler => 
      handler(...(args as T[K] extends void ? [] : [T[K]]))
    );
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
  React.useEffect(() => {
    eventBus.on(event, handler);
    return () => eventBus.off(event, handler);
  }, deps);
}