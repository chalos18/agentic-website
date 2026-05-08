"use client"
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GithubIcon from '@mui/icons-material/GitHub';

export default function Footer() {
  return (
    <footer className="p-4 border-t mt-8">
      <div className="container mx-auto">
        <LinkedInIcon color="primary" fontSize="large" onClick={() => window.open('https://www.linkedin.com/in/-ana-oliveira-/', '_blank')} className="cursor-pointer" />
        <GithubIcon color="secondary" fontSize="large" onClick={() => window.open('https://github.com/-ana-oliveira-/', '_blank')} className="cursor-pointer ml-4" />

      </div>
    </footer>

  )
}
