import Link from 'next/link';

export default function Header() {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto">
        <nav>
          <ul className="flex flex-wrap gap-4">
            <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact</Link></li>
            <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
            <li><Link href="/rubiks" className="hover:text-blue-600">Rubik&apos;s</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
