import React from 'react'
import { FiPlus } from 'react-icons/fi'


const repeatedBehavioralQuestions = [
  {
    question: 'Tell me about yourself.',
    teach: 'Keep it short: present role or studies, strongest skills, one proof point, and why this job fits.',
    answer: 'I am a frontend developer focused on building clean, responsive user experiences. In my recent projects, I worked with React, APIs, and authentication flows. I enjoy turning requirements into simple interfaces, and this role fits because it lets me keep improving product quality while learning from a strong team.',
  },
  {
    question: 'What are your strengths?',
    teach: 'Choose strengths that match the job, then prove them with a real example.',
    answer: 'My biggest strengths are consistency, problem solving, and communication. For example, when I was stuck on an API issue, I broke the problem into smaller checks, tested each part, and explained the fix clearly to my team so the same issue would not repeat.',
  },
  {
    question: 'What is your weakness?',
    teach: 'Pick a real but manageable weakness, then show the action you are taking.',
    answer: 'Earlier, I sometimes spent too much time trying to make a solution perfect. I am improving by setting time limits, asking for feedback earlier, and focusing first on a working solution before polishing details.',
  },
  {
    question: 'Why should we hire you?',
    teach: 'Connect your skills, attitude, and learning ability to the company need.',
    answer: 'You should hire me because I can learn quickly, take ownership, and communicate clearly. I may not know everything on day one, but I am consistent, I ask the right questions, and I focus on delivering reliable work.',
  },
  {
    question: 'Tell me about a time you faced a challenge.',
    teach: 'Use STAR: Situation, Task, Action, Result. Spend most time on your action.',
    answer: 'In one project, a feature was not working close to the deadline. I checked the error logs, isolated the API response issue, and coordinated the frontend changes. We fixed it on time, and I learned to test integrations earlier.',
  },
  {
    question: 'Describe a conflict with a teammate.',
    teach: 'Do not blame. Show listening, calm communication, and a shared solution.',
    answer: 'A teammate and I disagreed about the best UI approach. I listened to their reason, shared my concern about user flow, and suggested comparing both options. We chose the simpler design and finished faster without affecting quality.',
  },
  {
    question: 'Tell me about a mistake you made.',
    teach: 'Own the mistake, explain the fix, and end with what changed in your process.',
    answer: 'I once missed a validation case while testing a form. After it was found, I fixed it quickly and added a checklist for common edge cases. Since then, I test normal, empty, and invalid inputs before submitting work.',
  },
  {
    question: 'How do you handle pressure or deadlines?',
    teach: 'Show prioritization, communication, and steady execution.',
    answer: 'Under pressure, I list the most important tasks, estimate what can be finished, and communicate early if something is risky. This helps me stay calm and focus on progress instead of panic.',
  },
  {
    question: 'Where do you see yourself in five years?',
    teach: 'Keep it ambitious but connected to growth in the same career path.',
    answer: 'In five years, I see myself as a strong engineer who can handle larger features independently, mentor juniors, and contribute to product decisions. I want to grow through real project experience and continuous learning.',
  },
  {
    question: 'Why do you want to join this company?',
    teach: 'Mention role fit, learning opportunity, and contribution. Avoid only salary or brand name.',
    answer: 'I want to join because the role matches my skills and gives me room to grow. I am interested in contributing to useful products, learning from experienced people, and becoming someone the team can depend on.',
  },
]

const aiFrequentScenarios = [
  {
    question: 'What would you do if your colleague took credit for your work?',
    teach: 'Stay professional. First verify the situation, then speak privately, keep proof ready, and focus on correcting the record without creating drama.',
    answer: 'If a colleague took credit for my work, I would first stay calm and confirm whether it was intentional. I would speak to them privately, explain my concern, and share the facts clearly. If the issue continued, I would involve my manager professionally with evidence, focusing on fairness and team trust.',
  },
  {
    question: 'What would you do if your manager gave you unrealistic deadlines?',
    teach: 'Do not simply say no. Clarify priorities, explain tradeoffs, and offer a realistic plan.',
    answer: 'I would first understand the deadline and the reason behind it. Then I would break down the work, identify risks, and discuss priorities with my manager. If needed, I would suggest reducing scope or getting support so we can still deliver the most important work well.',
  },
  {
    question: 'What would you do if a teammate was not doing their part?',
    teach: 'Show ownership, communication, and problem solving before escalation.',
    answer: 'I would first talk to the teammate privately and understand if they are blocked. If I can help, I would support them and agree on clear next steps. If the problem still affects delivery, I would update the team lead with facts and focus on completing the work.',
  },
]


// One question you can open to see how to answer it and a sample answer.
function QuestionItem({ item, answerLabel }) {
  return (
    <li>
      <details className='group py-5'>
        <summary className='flex cursor-pointer list-none items-start justify-between gap-6 [&::-webkit-details-marker]:hidden'>
          <span className='voice text-title leading-snug group-open:font-medium'>{item.question}</span>
          <FiPlus aria-hidden className='mt-1.5 shrink-0 text-graphite transition-transform duration-200 group-open:rotate-45' />
        </summary>

        <div className='mt-5 grid max-w-[68ch] gap-5'>
          <div>
            <h3 className='text-caption font-semibold text-graphite'>How to answer</h3>
            <p className='mt-1'><span className='mark'>{item.teach}</span></p>
          </div>
          <div className='border-l-2 border-ink pl-5'>
            <h3 className='text-caption font-semibold text-graphite'>{answerLabel}</h3>
            <p className='voice mt-1 text-lead leading-[1.7] text-ink-soft'>{item.answer}</p>
          </div>
        </div>
      </details>
    </li>
  )
}

function BehaviouralQuestions() {
  return (
    <div>
      <h1 className='page-title'>Behavioural questions</h1>
      <p className='page-lede'>
        The questions that come up in almost every interview, with how to approach each
        one and an answer you can adapt. Open a question to read it.
      </p>

      <div className='mt-8 max-w-[68ch] border-l-2 border-highlight pl-5'>
        <p className='font-semibold'>A structure that works for most answers</p>
        <p className='mt-1 text-graphite'>
          Describe the situation, what you did, what happened, and what you learned.
          Spend most of your time on what you did.
        </p>
      </div>

      <section aria-labelledby='bq-common' className='mt-12'>
        <h2 id='bq-common' className='text-title font-semibold'>Asked in most interviews</h2>
        <ul className='mt-4 divide-y divide-rule border-y border-rule'>
          {repeatedBehavioralQuestions.map((item) => (
            <QuestionItem key={item.question} item={item} answerLabel='Sample answer' />
          ))}
        </ul>
      </section>

      <section aria-labelledby='bq-scenarios' className='mt-14'>
        <h2 id='bq-scenarios' className='text-title font-semibold'>Harder workplace scenarios</h2>
        <p className='mt-1 text-graphite'>Interviewers use these to see how you handle difficult people and pressure.</p>
        <ul className='mt-4 divide-y divide-rule border-y border-rule'>
          {aiFrequentScenarios.map((item) => (
            <QuestionItem key={item.question} item={item} answerLabel='Strong answer' />
          ))}
        </ul>
      </section>
    </div>
  )
}

export default BehaviouralQuestions
