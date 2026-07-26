import { getAllBlogPosts } from '@/lib/content';
import BlogList from '@/components/Blog/BlogList';

export const metadata = { title: 'Blog' };

export default function BlogPage() {
  const posts = getAllBlogPosts();
  return <BlogList posts={posts} />;
}
