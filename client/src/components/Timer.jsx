import React from 'react'

// A thin bar that drains as the answer time runs out.
function Timer({ timeLeft, totalTime }) {
  const total = totalTime || 60
  const percentage = Math.max(0, Math.min(100, (timeLeft / total) * 100))
  const low = timeLeft <= 10

  return (
    <div
      role='progressbar'
      aria-label='Time left to answer'
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={timeLeft}
      className='h-1 w-full bg-rule'
    >
      <div
        className={`h-full transition-[width] duration-1000 ease-linear ${low ? 'bg-bad' : 'bg-ink'}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  )
}

export default Timer
