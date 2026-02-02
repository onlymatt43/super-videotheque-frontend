import { apiClient } from './client';

export type SurveyAnswers = {
  genres?: string[];
  likeMore?: string[];
  likeLess?: string[];
  frequency?: string;
};

export async function submitSurvey(payload: { email?: string; answers: SurveyAnswers }) {
  const { data } = await apiClient.post('/analytics/survey', payload);
  return data?.data;
}
