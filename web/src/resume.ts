// Web version of the resume. The phone number is deliberately left out.

export const resume = {
  summary:
    'Versatile software engineer with 6+ years of experience as a frontend engineer and 1+ years as a full-stack engineer. Deep experience with React/TypeScript frontends, JVM backends (Scala, Java), and custom Python webhook code. Specialized in fault-tolerant AI/LLM integrations, serverless agent webhooks (AWS Lambda), fast live translation engines, and production monitoring and debugging. Engineering leader with experience mentoring interns into full-time engineers and streamlining team onboarding.',

  experience: [
    {
      company: 'Quiq',
      role: 'Software Engineer (Full Stack)',
      dates: 'Sept 2019 – Aug 2026',
      highlights: [
        { text: "Architected, developed, and maintained core customer engagement features across Quiq's React/TypeScript web applications and Scala/Java microservices." },
        { title: 'Live translation engine & LLM architecture', text: 'Coordinated full-stack implementation of live message translation integrating Google, Unbabel, and LLM providers; engineered a parallel prompting pipeline in Python that reduced 20-message translation times from over 60s to under 5s on average by bounding batch latency to the single longest request.' },
        { title: 'Fault-tolerant LLM infrastructure & routing', text: 'Designed and implemented a cluster-based configuration system supporting percentage-based traffic routing to evaluate production model performance, alongside automated fallback strategies with configurable timeout thresholds when primary models fail or latency spikes.' },
        { title: 'Observability, monitoring & production triage', text: 'Used Prometheus, Sentry, and AWS Athena to monitor feature rollouts in production, query log data, triage reported bugs, and ship rapid hotfixes.' },
        { title: 'CI/CD & testing infrastructure', text: 'Implemented automated CI test suites using ScalaTest and Jest/React Testing Library to keep the system stable across releases.' },
        { title: 'Mentorship & onboarding', text: 'Directly mentored an engineering intern who converted to a full-time software engineer; led onboarding, code reviews, and technical guidance for incoming engineers and intern cohorts.' },
        { title: 'Analytics platform upgrade', text: 'Spearheaded a major end-to-end architectural upgrade of the analytics engine, driving platform design, UI design and implementation, backend API design, new metric tracking, and ClickHouse query optimization.' },
        { title: 'Serverless AI agent webhooks', text: 'Authored custom AWS Lambda webhooks in Python to run external data lookups and integrate real-time contextual data into conversational bots and AI agents for enterprise customers.' },
        { title: 'CRM & enterprise integrations', text: 'Built and maintained custom integrations with Salesforce, Zendesk, Microsoft Dynamics, and Oracle, streamlining third-party data synchronization and real-time customer interaction workflows.' },
        { title: 'AI tooling & developer productivity', text: 'Used AI coding tools, specifically Claude Code, to automate repetitive engineering tasks, build custom workflow automation scripts, and accelerate delivery.' },
      ],
    },
    {
      company: 'Gonzaga University CS Department',
      role: 'Computer Science Tutor',
      dates: 'Sept 2018 – May 2019',
      highlights: [
        { text: 'Guided undergraduate students through programming concepts, data structures, algorithms, and debugging techniques.' },
      ],
    },
    {
      company: 'Xpollin',
      role: 'Software Developer',
      dates: 'Feb 2015 – Apr 2019',
      highlights: [
        { text: 'Developed a cloud-hosted Python (Flask) web application comparing performance metrics across major text-analytics and audio-transcription APIs (Google, IBM, Microsoft, Amazon).' },
        { text: 'Implemented a multithreaded architecture to run API requests in parallel and significantly reduce response latency.' },
        { text: 'Containerized and deployed services on AWS.' },
      ],
    },
  ] as { company: string; role: string; dates: string; highlights: { title?: string; text: string }[] }[],

  skills: [
    { group: 'Languages', items: 'TypeScript, JavaScript, Python, Java, Scala, SQL' },
    { group: 'Frontend', items: 'React, Redux, HTML5, Yarn, Webpack, Jest / React Testing Library, responsive web design' },
    { group: 'Backend & systems', items: 'JVM (Scala/Java), ScalaTest, Gradle, RESTful APIs, microservices, ClickHouse, Redis, MySQL, enterprise CRM integrations, multithreading, MCP' },
    { group: 'AI & serverless', items: 'Claude Code, parallel LLM prompting & optimization, cluster-based LLM routing & fallbacks, custom Python LLM scripting, AWS Lambda webhooks, conversational bots / AI agents, translation integrations (Google, Unbabel, LLMs)' },
    { group: 'Observability', items: 'Prometheus, Sentry, AWS Athena, production monitoring, feature rollout tracking, log analytics & bug triage' },
    { group: 'CRM platforms', items: 'Salesforce, Zendesk, Microsoft Dynamics, Oracle' },
    { group: 'Cloud & DevOps', items: 'AWS (Lambda, Athena), CI/CD pipelines, Git' },
    { group: 'Leadership', items: 'Intern mentorship, developer onboarding, technical leadership, code reviews, workflow automation' },
  ],

  education: {
    school: 'Gonzaga University',
    location: 'Spokane, WA',
    degree: 'B.S. in Computer Science, Minor in Mathematics, cum laude',
    details: ['GPA: 3.57 overall, 3.72 in the Computer Science major', "Honors: President's List, Dean's List (3x)"],
  },
}
