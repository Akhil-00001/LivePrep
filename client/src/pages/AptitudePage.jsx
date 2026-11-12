import React, { useEffect, useState } from 'react';
import MCQComponent from '../components/MCQComponent';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../components/ToastProvider';
import { useSelector } from 'react-redux';

const RECENT_APTITUDE_KEY = 'liveprep-recent-aptitude-questions';

const getRecentQuestions = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_APTITUDE_KEY)) || [];
  } catch {
    return [];
  }
};

const saveRecentQuestions = (newQuestions) => {
  const recentQuestions = getRecentQuestions();
  const merged = [...newQuestions, ...recentQuestions];
  const unique = Array.from(new Set(merged)).slice(0, 80);
  localStorage.setItem(RECENT_APTITUDE_KEY, JSON.stringify(unique));
};

const AptitudePage = () => {
  const navigate = useNavigate();
  const { confirmToast } = useToast();
  const { userData } = useSelector((state) => state.user);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [finished, setFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLeaving, setIsLeaving] = useState(false);

  const loadQuestions = async () => {
    if (!userData) {
      setLoading(false);
      navigate('/auth');
      return;
    }

    setLoading(true);
    setError('');
    setCurrentQuestion(0);
    setScore(0);
    setAnswers([]);
    setFinished(false);

    try {
      const result = await axios.post(`${ServerUrl}/api/aptitude/generate-questions`, {
        recentQuestions: getRecentQuestions(),
        sessionSeed: window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`,
      });

      const nextQuestions = result.data.questions || [];
      if (nextQuestions.length !== 20) {
        throw new Error('AI did not return 20 questions.');
      }

      setQuestions(nextQuestions);
      saveRecentQuestions(nextQuestions.map((item) => item.question));
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || 'Unable to generate aptitude questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userData) {
      setLoading(false);
      navigate('/auth');
      return;
    }

    loadQuestions();
  }, [userData]);

  const handleAnswer = (selected) => {
    if (isLeaving) return;
    if (!questions[currentQuestion]) return;

    const isCorrect = selected === questions[currentQuestion].correct;
    setAnswers([...answers, { question: currentQuestion, selected, correct: isCorrect }]);
    if (isCorrect) setScore(score + 1);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setFinished(true);
    }
  };

  const handleLeaveTest = async () => {
    const shouldLeave = await confirmToast('End this test? Your answers so far are not scored.', {
      confirmText: 'End test',
      cancelText: 'Keep going',
    });
    if (!shouldLeave) return;

    setIsLeaving(true);
    setQuestions([]);
    navigate('/');
  };

  // A quiet, centred status screen for loading, error and finished states.
  const StatusScreen = ({ title, children }) => (
    <div className='max-w-xl'>
      <h1 className='page-title'>{title}</h1>
      <div className='mt-3 text-lead text-graphite'>{children}</div>
    </div>
  );

  if (finished) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className='max-w-xl'>
        <p className='text-caption text-graphite'>Aptitude test result</p>
        <p className='num voice mt-1 leading-none'>
          <span className='text-[6rem] sm:text-[7.5rem]'>{score}</span>
          <span className='text-heading text-graphite'>/{questions.length}</span>
        </p>
        <p className='mt-4 text-lead'>
          You answered <span className='mark num font-semibold'>{percentage}%</span> of the questions correctly.
        </p>
        <button onClick={loadQuestions} className='btn btn-primary mt-8 px-6 py-3'>
          Take a new test
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <StatusScreen title='Writing your test'>
        <p>Preparing 20 new questions. This usually takes a few seconds.</p>
      </StatusScreen>
    );
  }

  if (error) {
    return (
      <StatusScreen title="The test didn't load">
        <p className='text-bad'>{error}</p>
        <button onClick={loadQuestions} className='btn btn-primary mt-6'>
          Try again
        </button>
      </StatusScreen>
    );
  }

  const activeQuestion = questions[currentQuestion];

  if (!activeQuestion) {
    return (
      <StatusScreen title='Preparing your test'>
        <p>Your questions are still loading.</p>
        <button onClick={loadQuestions} className='btn btn-secondary mt-6'>
          Load questions
        </button>
      </StatusScreen>
    );
  }

  return (
    <div>
      <div className='mb-8 flex max-w-2xl items-start justify-between gap-4'>
        <div>
          <h1 className='page-title'>Aptitude test</h1>
          <p className='num mt-1 text-graphite'>Question {currentQuestion + 1} of {questions.length}</p>
        </div>

        <button
          onClick={handleLeaveTest}
          disabled={isLeaving}
          className='btn btn-danger py-1.5 text-caption'
        >
          {isLeaving ? 'Ending…' : 'End test'}
        </button>
      </div>
      <MCQComponent
        key={currentQuestion}
        question={activeQuestion.question}
        options={activeQuestion.options}
        onAnswer={handleAnswer}
        timeLimit={45}
      />
    </div>
  );
};

export default AptitudePage;
