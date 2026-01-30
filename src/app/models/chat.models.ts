export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
}

export interface ChatRequest {
  messages: ChatMessage[];
  model?: string; // Optional: depends on provider (OpenAI, Azure OpenAI, etc.)
}

export interface ChatResponse {
  reply: string;
  raw?: any; // Keep the raw payload for debugging or future use
}
``