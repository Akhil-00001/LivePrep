import React from 'react'

const features = [
  {
    title: 'Mock interviews',
    text: 'Technical and HR rounds, spoken aloud by an AI interviewer. Each answer is timed, marked and given feedback.',
  },
  {
    title: 'Behavioural guide',
    text: 'The questions asked in almost every interview, with how to approach each one and sample answers.',
  },
  {
    title: 'Aptitude tests',
    text: 'Twenty new multiple-choice questions per test, timed and scored, with fewer repeats between attempts.',
  },
  {
    title: 'Reports',
    text: 'An overall score, ratings for confidence, communication and correctness, and feedback on every answer.',
  },
]

const techStack = [
  ['Frontend', 'React, Vite, Tailwind CSS, Redux, React Router'],
  ['Backend', 'Node.js, Express, MongoDB'],
  ['AI', 'OpenRouter for questions, feedback and scoring'],
  ['Services', 'Firebase sign-in, PDF resume parsing, Razorpay payments'],
]

const workflow = [
  'Sign in and choose a technical, HR or behavioural interview, or an aptitude test.',
  'Optionally upload your resume so questions are based on your role, projects and skills.',
  'The AI writes the questions, or the guide shows common ones with sample answers.',
  'Answer each timed question and get feedback, a score and ways to improve.',
]

function About() {
  return (
    <div className='max-w-3xl'>
      <h1 className='voice text-balance text-heading leading-tight sm:text-display'>
        What LivePrep does, and how it works.
      </h1>
      <p className='mt-5 max-w-[62ch] text-lead text-graphite'>
        LivePrep lets students and job seekers practise mock interviews, aptitude rounds and
        behavioural questions, then see exactly where their answers fell short.
      </p>

      <section aria-labelledby='about-what' className='mt-14'>
        <h2 id='about-what' className='text-title font-semibold'>What you can do</h2>
        <dl className='mt-4 divide-y divide-rule border-y border-rule'>
          {features.map((f) => (
            <div key={f.title} className='grid gap-1 py-4 sm:grid-cols-[12rem_1fr] sm:gap-6'>
              <dt className='font-semibold'>{f.title}</dt>
              <dd className='text-graphite'>{f.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby='about-how' className='mt-14'>
        <h2 id='about-how' className='text-title font-semibold'>How it works</h2>
        <ol className='mt-4 space-y-4'>
          {workflow.map((item, index) => (
            <li key={item} className='grid grid-cols-[2rem_1fr] gap-2'>
              <span className='num voice text-title leading-none text-graphite'>{index + 1}</span>
              <p>{item}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby='about-stack' className='mt-14'>
        <h2 id='about-stack' className='text-title font-semibold'>How it's built</h2>
        <dl className='mt-4 divide-y divide-rule border-y border-rule'>
          {techStack.map(([k, v]) => (
            <div key={k} className='grid gap-1 py-3 sm:grid-cols-[12rem_1fr] sm:gap-6'>
              <dt className='text-graphite'>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}

export default About
