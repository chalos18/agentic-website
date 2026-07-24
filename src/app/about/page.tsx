import Link from 'next/link';
import Doodle from '@/components/motifs/Doodle';

export const metadata = { title: 'About' };

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start mb-10">
        <div className="w-32 h-32 shrink-0 rounded-full bg-cream-deep border-2 border-clay-line flex items-center justify-center">
          <Doodle variant="cherry" className="w-14 h-14 text-terracotta" />
        </div>
        <div>
          <h1 className="font-display text-4xl font-semibold text-espresso mb-2">About</h1>
          <p className="text-terracotta-dark font-medium">Associate Software Engineer</p>
        </div>
      </div>

      <div className="prose-warm">
        <p>
          I&apos;m a software engineer with a background in mentoring, leading, and teaching,
          and a habit of learning by building things end to end. Most of my day-to-day work nowadays
          is fullstack focused - Vue, AWS, LLM Evaluation Harnesses, data processing pipelines, and AI integrations. 
        </p>
        <p>
          Outside of work, this site is where the smaller projects live: a Rubik&apos;s Cube
          trainer I built out of spite, and a blog
          that mixes engineering notes with whatever&apos;s been cooking lately. Why out of spite? Because of the mastermorphix, a cube I bought due to its interesting shape but never been able to solve.
          There are not many tutorials for that cube out there, so I built a trainer to help me learn it. It&apos;s still a work in progress, but you can check it out on the{' '}
          <Link href="/rubiks">Rubik&apos;s Cube trainer</Link> page.
        </p>
        <p>
          If you want to see what I&apos;m up to professionally, my{' '}
          <a href="https://www.linkedin.com/in/-ana-oliveira-/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </a>{' '}
          is the best place to look, or say hello on the{' '}
          <Link href="/contact">contact</Link> page.
        </p>
      </div>
    </div>
  );
}
