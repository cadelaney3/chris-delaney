// All personal content lives here. Edit this file to make the site yours.

export const site = {
  name: 'Your Name',
  tagline: 'Software engineer building thoughtful things for the web.',
  bio: [
    "I'm a software engineer who enjoys working across the stack, from Go services to React interfaces. I care about simple systems, clear writing, and software that feels good to use.",
    'Currently exploring distributed systems and developer tooling. Outside of work you can find me reading, hiking, or tinkering with side projects.',
  ],
  links: [
    { label: 'GitHub', href: 'https://github.com/your-username' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cadelaney3/' },
    { label: 'Email', href: 'mailto:you@example.com' },
  ],
}

export type Project = {
  name: string
  description: string
  tech: string[]
  links: { label: string; href: string }[]
  year: number
}

export const projects: Project[] = [
  {
    name: 'Personal site',
    description: 'This website: a React frontend on GitHub Pages backed by a Go API on Fly.io that serves Markdown posts and handles the contact form.',
    tech: ['React', 'TypeScript', 'Go'],
    links: [{ label: 'Source', href: 'https://github.com/cadelaney3/chris-delaney' }],
    year: 2026,
  },
  {
    name: 'Project two',
    description: 'One or two sentences on what it does, why it exists, and what was interesting about building it.',
    tech: ['Go', 'PostgreSQL'],
    links: [{ label: 'Source', href: 'https://github.com/your-username/project-two' }],
    year: 2025,
  },
  {
    name: 'Project three',
    description: 'Another project worth showing off. Mention outcomes if you have them: users, performance, what you learned.',
    tech: ['TypeScript', 'React'],
    links: [
      { label: 'Live', href: 'https://example.com' },
      { label: 'Source', href: 'https://github.com/your-username/project-three' },
    ],
    year: 2024,
  },
]
