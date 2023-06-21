import { useEffect, useState } from "react";

type EventSourceOptions = {
  /** EventSource constructor options */
  init?: EventSourceInit;
  /** The event to listen to */
  event?: string;
  /** enable or disable the event source */
  enabled?: boolean;
};

/**
 * Subscribe to an event source and return the latest event.
 * @param url The URL of the event source to connect to
 * @param options The options to pass to the EventSource constructor
 * @returns The last event received from the server
 */
export function useEventSource(
  url: string | URL,
  { event = "message", init, enabled = true }: EventSourceOptions = {}
) {
  const [data, setData] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled) return;
    
    const eventSource = new EventSource(url, init);
    eventSource.addEventListener(event ?? "message", handler);

    // rest data if dependencies change
    setData(null);

    function handler(event: MessageEvent) {
      setData(event.data || "UNKNOWN_EVENT_DATA");
    }

    return () => {
      eventSource.removeEventListener(event ?? "message", handler);
      eventSource.close();
    };
  }, [url, event, init]);

  return data;
}
