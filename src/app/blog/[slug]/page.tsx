export default function PostPage({ params }: { params: { slug: string } }) {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Post: {params.slug}</h2>
      <p className="mt-2">This is a simple blog post placeholder.</p>
    </main>
  )
}
