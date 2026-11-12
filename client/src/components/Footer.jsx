import React from 'react'
import { Link } from 'react-router-dom'

const links = [
  { to: '/interview', label: 'Interview' },
  { to: '/behavioural-interview', label: 'Behavioural guide' },
  { to: '/aptitude', label: 'Aptitude test' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/about', label: 'About' },
]

function Footer() {
  return (
    <footer className='border-t border-rule px-4 py-8 sm:px-8'>
      <div className='mx-auto flex max-w-5xl flex-col gap-4 text-caption text-graphite sm:flex-row sm:items-center sm:justify-between'>
        <p className='voice text-body text-ink'>LivePrep</p>
        <nav aria-label='Footer' className='flex flex-wrap gap-x-5 gap-y-2'>
          {links.map((l) => (
            <Link key={l.to} to={l.to} className='hover:text-ink hover:underline underline-offset-4'>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  )
}

export default Footer
