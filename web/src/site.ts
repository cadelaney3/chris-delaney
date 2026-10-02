// All personal content lives here. Edit this file to make the site yours.

export const site = {
  name: 'Chris Delaney',
  location: 'Missoula, MT',
  email: 'cadelaney3@gmail.com',
  tagline: 'Full-stack engineer building fast, fault-tolerant AI products.',
  bio: [
    "I'm a software engineer in Missoula, Montana. For the past seven years at Quiq I've built customer engagement software across React/TypeScript frontends and Scala/Java microservices.",
    'Most recently my focus has been AI and LLM infrastructure: a live translation engine that cut 20-message translation times from over 60 seconds to under 5, cluster-based model routing with automatic fallbacks, and serverless AWS Lambda webhooks that feed real-time data to conversational AI agents.',
    "I care about the people side of engineering too. I've mentored an intern into a full-time engineer and led onboarding and code reviews for new engineers and intern cohorts.",
  ],
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
    links: [],
    context: 'Xpollin · 2015–2019',
  },
]
