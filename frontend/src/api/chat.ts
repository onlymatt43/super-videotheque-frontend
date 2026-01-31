import { apiClient } from './client';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface ChatResponse {
  data: {
    response: string;
  };
}

export const sendChatMessage = async (
  message: string,
  history: ChatMessage[] = []
): Promise<string> => {
  const response = await apiClient.post<ChatResponse>('/api/chat', {
    message,
    history: history.map(m => ({ role: m.role, content: m.content }))
  });
  return response.data.data.response;
};
