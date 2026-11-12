import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { ServerUrl } from '../App'

const practice = [
  {
    title: 'Interview',
    desc: 'Technical, HR or behavioural rounds, spoken aloud and based on your resume. Timed, with feedback on every answer.',
    cta: 'Start',
    path: '/interview',
  },
  {
    title: 'Behavioural guide',
    desc: 'Common questions and hard workplace scenarios, with how to answer and sample answers.',
    cta: 'Read',
    path: '/behavioural-interview',
  },
  {
    title: 'Aptitude test',
    desc: 'Twenty new multiple-choice questions, 45 seconds each, scored at the end.',
    cta: 'Take a test',
    path: '/aptitude',
  },
]

const modeLabel = { Technical: 'Technical', HR: 'HR', Behavioral: 'Behavioural' }

const scoreTone = (value) =>
  value >= 8 ? 'text-good' : value >= 5 ? 'text-warn' : 'text-bad'

function LastReport() {
  const [latest, setLatest] = useState(undefined)

  useEffect(() => {
    const load = async () => {
      try {
        const result = await axios.get(ServerUrl + '/api/interview/get-interview', { withCredentials: true })
        const done = (result.data || []).filter((i) => i.status === 'completed')
        setLatest(done[0] || null)
      } catch (error) {
        console.log(error)
        setLatest(null)
      }
    }
    load()
  }, [])

  if (latest === undefined) {
    return <div className='h-28' aria-hidden />
  }

  if (!latest) {
    return (
      <div className='border-y border-rule py-6'>
        <p className='font-semibold'>You haven't finished an interview yet.</p>
        <p className='mt-1 text-graphite'>Your first one takes about ten minutes. You'll get a full report at the end.</p>
        <Link to='/interview' className='btn btn-primary mt-5'>Start your first interview</Link>
      </div>
    )
  }

  return (
    <div className='grid gap-6 border-y border-rule py-6 sm:grid-cols-[1fr_auto] sm:items-center'>
      <div>
        <p className='text-caption text-graphite'>Your last interview</p>
        <p className='mt-1 font-semibold'>
          {latest.role}, {modeLabel[latest.mode] || latest.mode}
        </p>
        <p className='num mt-0.5 text-caption text-graphite'>
          {new Date(latest.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'long' })}
        </p>
        <div className='mt-4 flex flex-wrap gap-2'>
          <Link to={`/report/${latest._id}`} className='btn btn-secondary'>Read the report</Link>
          <Link to='/interview' className='btn btn-primary'>Practise again</Link>
        </div>
      </div>
      <p className={`num voice leading-none sm:text-right ${scoreTone(latest.finalScore || 0)}`}>
        <span className='text-[4.5rem]'>{latest.finalScore || 0}</span>
        <span className='text-title text-graphite'>/10</span>
      </p>
    </div>
  )
}

function Home() {
  const { userData } = useSelector((state) => state.user)
  const firstName = userData?.name?.split(' ')[0]

  return (
    <div>
      {userData ? (
        <section>
          <h1 className='voice text-balance text-heading leading-tight sm:text-display'>
            {firstName ? `Hi ${firstName}.` : 'Welcome back.'} What are you practising today?
          </h1>
          <div className='mt-8'>
            <LastReport />
          </div>
        </section>
      ) : (
        <section className='max-w-[44rem]'>
          <h1 className='voice text-balance text-heading leading-tight sm:text-display'>
            Rehearse the interview before the one that counts.
          </h1>
          <p className='mt-5 max-w-[58ch] text-lead text-graphite'>
            An AI interviewer asks you questions out loud. You answer by voice or text, and every
            answer is marked with feedback and a stronger example.
          </p>
          <div className='mt-8 flex flex-wrap gap-3'>
            <Link to='/auth' className='btn btn-primary px-6 py-3'>Sign in to start</Link>
            <Link to='/about' className='btn btn-secondary px-6 py-3'>How it works</Link>
          </div>
        </section>
      )}

      <section aria-labelledby='home-practice' className='mt-14'>
        <h2 id='home-practice' className='text-title font-semibold'>Practice</h2>
        <ul className='mt-4 divide-y divide-rule border-y border-rule'>
          {practice.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className='group grid gap-2 py-5 sm:grid-cols-[14rem_1fr_auto] sm:items-baseline sm:gap-6'
              >
                <span className='font-semibold group-hover:underline group-hover:underline-offset-4'>{item.title}</span>
                <span className='text-graphite'>{item.desc}</span>
                <span className='text-caption font-semibold text-ink'>{item.cta}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

export default Home
