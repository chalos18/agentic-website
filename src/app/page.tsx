export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Ana Oliveira</h1>
        <p className="text-xl text-gray-600 mb-6">Associate Software Engineer</p>
        <p className="text-lg max-w-2xl mx-auto">
          Passionate learner with a background in mentoring, leading, and teaching.
          Software engineer with strong Python and backend expertise, specializing in
          performance testing, GCP, and AI integrations.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Skills</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded">Python</div>
          <div className="p-4 border rounded">Locust</div>
          <div className="p-4 border rounded">PostgreSQL</div>
          <div className="p-4 border rounded">Google Cloud Platform</div>
          <div className="p-4 border rounded">Azure</div>
          <div className="p-4 border rounded">API Development</div>
          <div className="p-4 border rounded">Mentoring</div>
          <div className="p-4 border rounded">Scrum</div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">Featured Projects</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-6 border rounded">
            <h3 className="text-xl font-semibold mb-2">Performance Testing Framework</h3>
            <p className="text-gray-600 mb-4">
              Led the design and implementation of a scalable API stress-testing framework
              using Locust, enabling performance benchmarking across production-scale workloads.
            </p>
            <a href="/portfolio/performance-testing" className="text-blue-600 hover:underline">
              View Project →
            </a>
          </div>
          <div className="p-6 border rounded">
            <h3 className="text-xl font-semibold mb-2">GCP Migration</h3>
            <p className="text-gray-600 mb-4">
              Contributed to migrating a production Python API from Azure to Google Cloud Platform,
              implementing backend services and storage structures.
            </p>
            <a href="/portfolio/gcp-migration" className="text-blue-600 hover:underline">
              View Project →
            </a>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">Latest Blog Posts</h2>
        <div className="space-y-4">
          <article className="p-4 border rounded">
            <h3 className="text-lg font-semibold mb-2">
              <a href="/blog/sample-post" className="text-blue-600 hover:underline">
                Sample Post
              </a>
            </h3>
            <p className="text-gray-600">A sample blog post to validate MDX rendering.</p>
            <time className="text-sm text-gray-500">April 27, 2026</time>
          </article>
        </div>
      </section>
    </div>
  )
}