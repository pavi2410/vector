import React from 'react';

type EventMap = {
  'zoom:in': void;
  'zoom:out': void;
  'zoom:fit': void;
  'zoom:actual': void;
  'canvas:center': void;
};

type EventArgs<T, K extends keyof T> = T[K] extends void ? [] : [T[K]];
type EventHandler<T, K extends keyof T> = (...args: EventArgs<T, K>) => void;

class EventBus<T extends Record<string, unknown>> {
  private listeners = new Map<keyof T, EventHandler<T, keyof T>[]>();

  emit<K extends keyof T>(event: K, ...args: EventArgs<T, K>) {
    const handlers = this.listeners.get(event);
    if (!handlers) return;
    // Snapshot the handlers array so that on/off calls inside a handler
    // don't affect the current iteration.
    for (const handler of [...handlers]) {
      try {
        (handler as EventHandler<T, K>)(...args);
      } catch (err) {
        console.error(`[EventBus] Handler for "${String(event)}" threw:`, err);
      }
    }
  }

  on<K extends keyof T>(event: K, handler: EventHandler<T, K>) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(handler as EventHandler<T, keyof T>);
  }

  off<K extends keyof T>(event: K, handler: EventHandler<T, K>) {
    const handlers = this.listeners.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler as EventHandler<T, keyof T>);
      if (index > -1) handlers.splice(index, 1);
    }
  }
}

export const eventBus = new EventBus<EventMap>();

export function useOnEvent<K extends keyof EventMap>(
  event: K, 
  handler: EventHandler<EventMap, K>,
  deps: React.DependencyList = []
) {
  const onEvent = React.useEffectEvent((...args: EventArgs<EventMap, K>) => {
    handler(...args);
  });

  React.useEffect(() => {
    const stable: EventHandler<EventMap, K> = (...args) => onEvent(...args);
    eventBus.on(event, stable);
    return () => eventBus.off(event, stable);
  }, [event, ...deps]);
}
