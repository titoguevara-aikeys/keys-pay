import { useEffect, useRef, useCallback, useState } from 'react';

interface WorkerMessage {
  type: string;
  payload: any;
  id: string;
}

interface WorkerResponse {
  type: string;
  id: string;
  result?: any;
  error?: string;
}

export function useWebWorker() {
  const workerRef = useRef<Worker | null>(null);
  const pendingCallbacks = useRef<Map<string, (result: any, error?: string) => void>>(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    try {
      const worker = new Worker(new URL('../../workers/heavy-worker.ts', import.meta.url), {
        type: 'module'
      });
      
      worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, id, result, error } = e.data;
        const callback = pendingCallbacks.current.get(id);
        
        if (callback) {
          callback(result, error);
          pendingCallbacks.current.delete(id);
        }
      };

      worker.onerror = (error) => {
        console.error('Worker error:', error);
      };

      workerRef.current = worker;
      setIsReady(true);

      return () => {
        worker.terminate();
        pendingCallbacks.current.clear();
        setIsReady(false);
      };
    } catch (error) {
      console.warn('Web Worker not supported, falling back to main thread');
      setIsReady(false);
    }
  }, []);

  const postMessage = useCallback(<T = any>(
    type: string, 
    payload: any
  ): Promise<T> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current || !isReady) {
        // Fallback for when worker is not available
        switch (type) {
          case 'MARKDOWN':
            const html = payload
              .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              .replace(/\*(.*?)\*/g, '<em>$1</em>')
              .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
              .replace(/`(.*?)`/g, '<code>$1</code>')
              .replace(/^# (.*$)/gim, '<h1>$1</h1>')
              .replace(/^## (.*$)/gim, '<h2>$1</h2>')
              .replace(/^### (.*$)/gim, '<h3>$1</h3>')
              .replace(/\n/g, '<br>');
            resolve(html as T);
            return;
          case 'JSON_PARSE':
            try {
              resolve(JSON.parse(payload) as T);
            } catch (e: any) {
              reject(e);
            }
            return;
          case 'TEXT_ANALYSIS':
            const wordCount = payload.split(/\s+/).length;
            const charCount = payload.length;
            const sentences = payload.split(/[.!?]+/).length - 1;
            resolve({ wordCount, charCount, sentences } as T);
            return;
          default:
            reject(new Error('Unknown operation'));
            return;
        }
      }

      const id = `${type}-${Date.now()}-${Math.random()}`;
      
      pendingCallbacks.current.set(id, (result, error) => {
        if (error) {
          reject(new Error(error));
        } else {
          resolve(result);
        }
      });

      workerRef.current.postMessage({ type, payload, id });
    });
  }, [isReady]);

  return { postMessage, isReady };
}