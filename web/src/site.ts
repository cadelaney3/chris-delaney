// All personal content lives here. Edit this file to make the site yours.

export const site = {
  name: 'Chris Delaney',
  location: 'Missoula, MT',
  email: 'cadelaney3@gmail.com',
  tagline: 'Full-stack engineer, AI-driven, always pushing forward.',
  bio: [
    "I'm a software engineer in Missoula, Montana, with a passion for AI-driven engineering. I started my software career as a frontend-focused developer, primarily building React/TypeScript frontends. Over time I expanded my skillset to full-stack development, including building Scala microservices.",
    'Most recently my focus has been AI and LLM infrastructure: a live translation engine that cut 20-message translation times from over 60 seconds to under 5, cluster-based model routing with automatic fallbacks, and serverless AWS Lambda webhooks that feed real-time data to conversational AI agents.',
    'I believe AI is the future of software, both in the process of building software and integrating LLMs into products and product features.',
    "Outside of software, I like to be outside and enjoy all the benefits that come with living in Montana. I'm an avid trail runner, hunter, golfer, and snowboarder. I enjoy pushing my physical and mental limits, doing hard things and learning new tricks and skills to improve in whatever I do.",
  ],
  // Shows the Writing section (nav link, /blog pages, recent posts on home).
  showWriting: false,
  status: 'Currently open to new full-stack and AI engineering roles.',
  links: [
    { label: 'GitHub', href: 'https://github.com/cadelaney3' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/cadelaney3/' },
    { label: 'Email', href: 'mailto:cadelaney3@gmail.com' },
  ],
}

export type Project = {
  name: string
  description: string
  tech: string[]
  links: { label: string; href: string }[]
  // Where and when, e.g. "Quiq" or "Personal · 2026".
  context: string
}

export const projects: Project[] = [
  {
    name: 'Live translation engine',
    description: 'Full-stack live message translation across Google, Unbabel, and LLM providers. A parallel prompting pipeline in Python bounds batch latency to the single slowest request, cutting 20-message translation times from over 60 seconds to under 5 on average.',
    tech: ['Python', 'LLMs', 'React', 'TypeScript', 'Scala'],
    links: [],
    context: 'Quiq',
  },
  {
    name: 'Hunt unit ranker',
    description: "Ranks Montana hunting units by draw odds, harvest success, population, and animal quality. A Python pipeline parses state wildlife agency PDFs and CSVs into one schema (all 422 hunts from the 2026 draw, checked against each report's own totals), and a React + TanStack Table app lets you filter, sort, and drill in. Draw odds come from a model of Montana's bonus-point lottery fitted to each applicant pool.",
    tech: ['Python', 'React', 'TypeScript', 'TanStack Table'],
    links: [{ label: 'Source', href: 'https://github.com/cadelaney3/hunt-research' }],
    context: 'Personal · 2026',
  },
  {
    name: 'Fault-tolerant LLM routing',
    description: 'A cluster-based configuration system with percentage-based traffic routing for evaluating models in production, plus automatic fallbacks with configurable timeouts when a primary model fails or latency spikes.',
    tech: ['Scala', 'Java', 'LLMs'],
    links: [],
    context: 'Quiq',
  },
  {
    name: 'Analytics platform upgrade',
    description: 'Led an end-to-end overhaul of the analytics engine: platform architecture, UI design and implementation, backend API design, new metric tracking, and ClickHouse query optimization.',
    tech: ['React', 'TypeScript', 'Scala', 'ClickHouse'],
    links: [],
    context: 'Quiq',
  },
  {
    name: 'Serverless AI agent webhooks',
    description: 'Python AWS Lambda webhooks that run external data lookups and bring real-time context into conversational bots and AI agents for enterprise customers.',
    tech: ['Python', 'AWS Lambda'],
    links: [],
    context: 'Quiq',
  },
  {
    name: 'Personal site',
    description: 'This website: a React frontend on GitHub Pages backed by a Go API on Fly.io that serves Markdown posts and handles the contact form.',
    tech: ['React', 'TypeScript', 'Go'],
    links: [{ label: 'Source', href: 'https://github.com/cadelaney3/chris-delaney' }],
    context: 'Personal · 2026',
  },
  {
    name: 'Speech & text API benchmarking',
    description: 'A cloud-hosted Flask app comparing text-analytics and audio-transcription APIs from Google, IBM, Microsoft, and Amazon, using multithreaded parallel requests to cut response latency. Containerized and deployed on AWS.',
    tech: ['Python', 'Flask', 'AWS'],
    links: [{ label: 'Source', href: 'https://github.com/cadelaney3/projectNAP' }],
    context: 'Xpollin · 2015–2019',
  },
]
