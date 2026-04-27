import Link from 'next/link'

export default function BlogPage() {
  return (
    <main className="p-8">
      <h2 className="text-2xl font-semibold">Blog</h2>
      <ul className="mt-4 list-disc ml-6">
        <li><Link href="/blog/sample-post">Sample Post</Link></li>
      </ul>
    </main>
  )
}
