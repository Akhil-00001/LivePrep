import React, { useState, useEffect } from 'react';
import Timer from './Timer';

const MCQComponent = ({ question, options, onAnswer, timeLimit = 30 }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);

  const handleSubmit = () => {
    onAnswer(selectedOption);
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleSubmit();
    }
  }, [timeLeft]);

  return (
    <div className='max-w-2xl'>
      <Timer timeLeft={timeLeft} totalTime={timeLimit} />
      <p className={`num mt-2 text-right text-caption ${timeLeft <= 10 ? 'font-semibold text-bad' : 'text-graphite'}`}>
        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} left
      </p>

      <p className='voice mt-6 text-heading leading-snug'>{question}</p>

      <div role='radiogroup' aria-label='Answer options' className='mt-8 space-y-2'>
        {options.map((option, index) => {
          const active = selectedOption === index;
          return (
            <button
              key={index}
              type='button'
              role='radio'
              aria-checked={active}
              onClick={() => setSelectedOption(index)}
              className={`flex w-full items-start gap-4 rounded-sm border bg-sheet p-4 text-left transition-colors ${
                active
                  ? 'border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]'
                  : 'border-rule hover:border-graphite'
              }`}
            >
              <span className={`num flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-caption font-semibold ${active ? 'border-ink bg-ink text-white' : 'border-rule text-graphite'}`}>
                {String.fromCharCode(65 + index)}
              </span>
              <span className={active ? 'mark' : ''}>{option}</span>
            </button>
          );
        })}
      </div>

      <div className='mt-8 flex justify-end'>
        <button
          onClick={handleSubmit}
          disabled={selectedOption === null}
          className='btn btn-primary px-6 py-3'
        >
          Next question
        </button>
      </div>
    </div>
  );
};

export default MCQComponent;
