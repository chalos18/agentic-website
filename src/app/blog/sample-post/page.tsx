export const metadata = { title: 'Sample Post' }

export default function SamplePostPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Sample Post</h1>
      <p>This MDX sample exists at <code>content/posts/sample-post.mdx</code>. MDX rendering is configured, but the post is currently shown as static placeholder to avoid build runtime issues.</p>
    </main>
  )
}
