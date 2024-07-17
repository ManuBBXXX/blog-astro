import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ url }): Promise<Response> => {
  const query = url.searchParams.get('query') || '';

  if (!query) {
    return Response.json(
      { error: 'Query is required' },
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const allBlogArticles = await getCollection('blog');
  const filteredPosts = allBlogArticles.filter((post) => {
    const titleMatch = post.data.title
      .toLowerCase()
      .includes(query.toLowerCase());
    const contentMatch = post.body.toLowerCase().includes(query.toLowerCase());
    const slugMatch = post.slug.toLowerCase().includes(query.toLowerCase());
    return titleMatch || contentMatch || slugMatch;
  });

  return Response.json(
    { searchResults: filteredPosts },
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
};
