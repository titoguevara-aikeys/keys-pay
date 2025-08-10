// Web Worker for heavy computations
self.onmessage = (e) => {
  const { type, payload, id } = e.data;
  
  try {
    switch (type) {
      case 'MARKDOWN':
        // Simple markdown parsing without heavy dependencies
        const html = payload
          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          .replace(/\*(.*?)\*/g, '<em>$1</em>')
          .replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>')
          .replace(/`(.*?)`/g, '<code>$1</code>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/\n/g, '<br>');
        
        self.postMessage({ type, id, result: html });
        break;
        
      case 'JSON_PARSE':
        const parsed = JSON.parse(payload);
        self.postMessage({ type, id, result: parsed });
        break;
        
      case 'TEXT_ANALYSIS':
        const wordCount = payload.split(/\s+/).length;
        const charCount = payload.length;
        const sentences = payload.split(/[.!?]+/).length - 1;
        
        self.postMessage({ 
          type, 
          id, 
          result: { wordCount, charCount, sentences } 
        });
        break;
        
      default:
        self.postMessage({ type, id, error: 'Unknown operation' });
    }
  } catch (error: any) {
    self.postMessage({ type, id, error: error.message });
  }
};

export {};