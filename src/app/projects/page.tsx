import Link from 'next/link'

export default function ProjectsPage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Projects</h2>
      <ul className="mt-4 list-disc ml-6">
        <li><Link href="/projects/sample-project">Sample Project</Link></li>
      </ul>
    </main>
  )
}
