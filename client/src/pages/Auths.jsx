import React, { useState } from 'react'
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../utils/firebase';
import axios from 'axios';
import { ServerUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { FiX } from "react-icons/fi";
function Auths({ isModel = false, onClose }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.user.userData)

  useEffect(() => {
    if (user) {
      navigate('/')
    }
  }, [user, navigate])
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider)
      // Send a Firebase-signed ID token; the server verifies it and reads name/email from it.
      const idToken = await response.user.getIdToken()
      const result = await axios.post(ServerUrl + '/api/auth/google', { idToken }, { withCredentials: true })
      localStorage.setItem("liveprep-auth", "true")
      dispatch(setUserData(result.data))
      navigate('/')
    } catch (error) {
      console.log(error)
      setError(error?.response?.data?.message || 'Google sign-in failed.')
      dispatch(setUserData(null))
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = mode === 'login' ? '/api/auth/login' : '/api/auth/register'
      const payload = { email: form.email, password: form.password }
      if (mode === 'register') payload.name = form.name
      const result = await axios.post(ServerUrl + url, payload, { withCredentials: true })
      localStorage.setItem("liveprep-auth", "true")
      dispatch(setUserData(result.data))
      navigate('/')
    } catch (error) {
      setError(error?.response?.data?.message || 'Authentication failed.')
      dispatch(setUserData(null))
    }

    setLoading(false)
  }

  const isLogin = mode === 'login'

  return (
    <div className='grid min-h-screen bg-paper lg:grid-cols-[1.1fr_1fr]'>
      {/* A sample of what practice looks like: a question, an answer, a marked verdict */}
      <aside className='hidden flex-col justify-between border-r border-rule bg-sheet px-12 py-10 lg:flex xl:px-16'>
        <p className='voice text-title'>LivePrep</p>

        <figure className='max-w-[34rem]'>
          <p className='text-caption text-graphite'>Question 2 of 5</p>
          <blockquote className='voice mt-3 text-heading leading-snug'>
            Tell me about a time a project didn't go to plan. What did you do?
          </blockquote>
          <div className='mt-8 border-t border-rule pt-6'>
            <p className='text-caption font-semibold text-graphite'>Feedback</p>
            <p className='mt-2 text-lead leading-relaxed'>
              <span className='mark'>Clear situation and a specific action you took.</span>{' '}
              Finish with the result in numbers, and one thing you'd do differently next time.
            </p>
          </div>
        </figure>

        <p className='max-w-sm text-graphite'>
          Rehearse with an AI interviewer, then see exactly where your answers fell short.
        </p>
      </aside>

      <main className='relative flex items-center justify-center px-4 py-16 sm:px-8'>
        <button
          type='button'
          aria-label='Close'
          onClick={() => {
            if (onClose) return onClose()
            navigate('/')
          }}
          className='absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-graphite hover:bg-sheet hover:text-ink'
        >
          <FiX size={18} />
        </button>

        <div className='w-full max-w-sm'>
          <p className='voice mb-10 text-title lg:hidden'>LivePrep</p>
          <h1 className='page-title'>{isLogin ? 'Welcome back' : 'Create your account'}</h1>
          <p className='mt-2 text-graphite'>
            {isLogin
              ? 'Sign in to continue practising and see your reports.'
              : 'Your interviews and reports are saved to your account.'}
          </p>

          <button
            type='button'
            onClick={handleGoogleAuth}
            className='btn btn-secondary mt-8 w-full py-3'
          >
            <FcGoogle size={18} aria-hidden />
            Continue with Google
          </button>

          <div className='my-6 flex items-center gap-3 text-caption text-graphite'>
            <span className='h-px flex-1 bg-rule' />
            or use email
            <span className='h-px flex-1 bg-rule' />
          </div>

          <form onSubmit={handleSubmit} className='space-y-4'>
            {!isLogin && (
              <div>
                <label htmlFor='auth-name' className='label'>Name</label>
                <input
                  id='auth-name'
                  required
                  autoComplete='name'
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className='field'
                />
              </div>
            )}

            <div>
              <label htmlFor='auth-email' className='label'>Email</label>
              <input
                id='auth-email'
                required
                type='email'
                autoComplete='email'
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className='field'
              />
            </div>

            <div>
              <label htmlFor='auth-password' className='label'>Password</label>
              <input
                id='auth-password'
                required
                type='password'
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className='field'
              />
            </div>

            {error && <p role='alert' className='border-l-2 border-bad pl-3 text-bad'>{error}</p>}

            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full py-3'
            >
              {loading ? (isLogin ? 'Signing in…' : 'Creating account…') : isLogin ? 'Sign in' : 'Create account'}
            </button>
          </form>

          <p className='mt-6 text-center text-graphite'>
            {isLogin ? 'New to LivePrep? ' : 'Already have an account? '}
            <button
              type='button'
              onClick={() => { setMode(isLogin ? 'register' : 'login'); setError('') }}
              className='font-semibold text-ink underline underline-offset-4'
            >
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </main>
    </div>
  )
}

export default Auths
