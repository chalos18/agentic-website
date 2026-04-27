export default function ProjectPage({ params }: { params: { slug: string } }) {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Project: {params.slug}</h2>
      <p className="mt-2">This is a simple project detail placeholder.</p>
    </main>
  )
}
