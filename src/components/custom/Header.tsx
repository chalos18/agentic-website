export default function Header() {
  return (
    <header className="p-4 border-b">
      <div className="container mx-auto">
        <nav>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/blog">Blog</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
