import { api } from '@remotes/supabaseClient';

export interface Comment {
  id: number;
  feedId: number;
  message: string;
  createAt: string;
}

export async function getComments(feedId: number) {
  const { data } = await api
    .from('comments')
    .select('id, feedId, message, createAt')
    .eq('feedId', feedId)
    .order('id', { ascending: false });

  return data as Comment[] | null;
}

export async function addComment(
  feedId: number,
  { message }: Pick<Comment, 'message'>
) {
  return api.from('comments').upsert({
    feedId,
    message,
    createAt: new Date().toISOString(),
  });
}
