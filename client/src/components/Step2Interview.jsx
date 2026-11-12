import React from 'react'
import maleVideo from "../assets/videos/male-ai.mp4"
import femaleVideo from "../assets/videos/female-ai.mp4"
import Timer from './Timer'
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react"
import { FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useState } from 'react'
import { useRef } from 'react'
import { useEffect } from 'react'
import axios from "axios"
import { ServerUrl } from '../App'
import { useFocusMode } from './focusModeContext'
import { useNavigate } from 'react-router-dom'
import { useToast } from './ToastProvider'

function Step2Interview({ interviewData, onFinish }) {
  const { interviewId, questions, userName } = interviewData;
  const navigate = useNavigate();
  const { confirmToast } = useToast();
  useFocusMode();
  const [isIntroPhase, setIsIntroPhase] = useState(true);

  const [isMicOn, setIsMicOn] = useState(true);
  const recognitionRef = useRef(null);
  const [isAIPlaying, setIsAIPlaying] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [idealAnswer, setIdealAnswer] = useState("");
  const [timeLeft, setTimeLeft] = useState(
    questions[0]?.timeLimit || 60
  );
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [voiceGender, setVoiceGender] = useState("female");
  const [subtitle, setSubtitle] = useState("");
  const hasLeftRef = useRef(false);


  const videoRef = useRef(null);

  const currentQuestion = questions[currentIndex];

  const stopInterviewMedia = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current.abort();
    }

    window.speechSynthesis.cancel();
    videoRef.current?.pause();
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
    }
    setIsAIPlaying(false);
    setIsMicOn(false);
    setSubtitle("");
  };


  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;

      // Try known female voices first
      const femaleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("zira") ||
          v.name.toLowerCase().includes("samantha") ||
          v.name.toLowerCase().includes("female")
        );

      if (femaleVoice) {
        setSelectedVoice(femaleVoice);
        setVoiceGender("female");
        return;
      }

      // Try known male voices
      const maleVoice =
        voices.find(v =>
          v.name.toLowerCase().includes("david") ||
          v.name.toLowerCase().includes("mark") ||
          v.name.toLowerCase().includes("male")
        );

      if (maleVoice) {
        setSelectedVoice(maleVoice);
        setVoiceGender("male");
        return;
      }

      // Fallback: first voice (assume female)
      setSelectedVoice(voices[0]);
      setVoiceGender("female");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

  }, [])

  const videoSource = voiceGender === "male" ? maleVideo : femaleVideo;


  /* ---------------- SPEAK FUNCTION ---------------- */
  const speakText = (text) => {
    return new Promise((resolve) => {
      if (hasLeftRef.current) {
        resolve();
        return;
      }

      if (!window.speechSynthesis || !selectedVoice) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel();

      // Add natural pauses after commas and periods
      const humanText = text
        .replace(/,/g, ", ... ")
        .replace(/\./g, ". ... ");

      const utterance = new SpeechSynthesisUtterance(humanText);

      utterance.voice = selectedVoice;

      // Human-like pacing
      utterance.rate = 0.92;     // slightly slower than normal
      utterance.pitch = 1.05;    // small warmth
      utterance.volume = 1;

      utterance.onstart = () => {
        if (hasLeftRef.current) {
          window.speechSynthesis.cancel();
          resolve();
          return;
        }

        setIsAIPlaying(true);
        stopMic()
        videoRef.current?.play();
      };


      utterance.onend = () => {
        if (hasLeftRef.current) {
          resolve();
          return;
        }

        videoRef.current?.pause();
        videoRef.current.currentTime = 0;
        setIsAIPlaying(false);



        if (isMicOn) {
          startMic();
        }
        setTimeout(() => {
          setSubtitle("");
          resolve();
        }, 300);
      };


      setSubtitle(text);

      window.speechSynthesis.speak(utterance);
    });
  };


  useEffect(() => {
    if (hasLeftRef.current) return;

    if (!selectedVoice) {
      return;
    }
    const runIntro = async () => {
      if (hasLeftRef.current) return;

      if (isIntroPhase) {
        await speakText(
          `Hi ${userName}, it's great to meet you today. I hope you're feeling confident and ready.`
        );

        if (hasLeftRef.current) return;

        await speakText(
          "I'll ask you a few questions. Just answer naturally, and take your time. Let's begin."
        );

        if (hasLeftRef.current) return;

        setIsIntroPhase(false)
      } else if (currentQuestion) {
        await new Promise(r => setTimeout(r, 800));

        if (hasLeftRef.current) return;

        // If last question (hard level)
        if (currentIndex === questions.length - 1) {
          await speakText("Alright, this one might be a bit more challenging.");
        }

        if (hasLeftRef.current) return;

        await speakText(currentQuestion.question);

        if (isMicOn) {
          startMic();
        }
      }

    }

    runIntro()

  }, [selectedVoice, isIntroPhase, currentIndex])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasLeftRef.current) return;
    if (isIntroPhase) return;
    if (!currentQuestion) return;
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0;
        }
        return prev - 1

      })
    }, 1000);

    return () => clearInterval(timer)

  }, [isIntroPhase, currentIndex])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
  if (hasLeftRef.current) return;
  if (!isIntroPhase && currentQuestion) {
    setTimeLeft(currentQuestion.timeLimit || 60);
  }
}, [currentIndex]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) return;

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = true;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;

      setAnswer((prev) => prev + " " + transcript);
    };

    recognitionRef.current = recognition;

  }, []);


  const startMic = () => {
    if (hasLeftRef.current) return;

    if (recognitionRef.current && !isAIPlaying) {
      try {
        recognitionRef.current.start();
      } catch {
        // Ignore speech synthesis errors
      }
    }
  };

  const stopMic = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };
  const toggleMic = () => {
    if (hasLeftRef.current) return;

    if (isMicOn) {
      stopMic();
    } else {
      startMic();
    }
    setIsMicOn(!isMicOn);
  };


  const submitAnswer = async () => {
    if (isSubmitting || hasLeftRef.current) return;
    stopMic()
    setIsSubmitting(true)

    try {
      const result = await axios.post(ServerUrl + "/api/interview/submit-answer", {
        interviewId,
        questionIndex: currentIndex,
        answer,
        timeTaken:
          currentQuestion.timeLimit - timeLeft,
      } , {withCredentials:true})

      setFeedback(result.data.feedback)
      setIdealAnswer(result.data.idealAnswer || "")
      speakText(result.data.feedback)
      setIsSubmitting(false)
    } catch (error) {
console.log(error)
setIsSubmitting(false)
    }
  }

  const handleNext =async () => {
    if (hasLeftRef.current) return;

    setAnswer("");
    setFeedback("");
    setIdealAnswer("");

    if (currentIndex + 1 >= questions.length) {
      finishInterview();
      return;
    }

    await speakText("Alright, let's move to the next question.");

    setCurrentIndex(currentIndex + 1);
    setTimeout(() => {
      if (isMicOn) startMic();
    }, 500);

   
  }

  const finishInterview = async () => {
    if (hasLeftRef.current) return;

    stopMic()
    setIsMicOn(false)
    try {
      const result = await axios.post(ServerUrl+ "/api/interview/finish" , { interviewId} , {withCredentials:true})

      console.log(result.data)
      onFinish(result.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleLeaveInterview = async () => {
    if (isLeaving) return;

    const shouldLeave = await confirmToast("End this interview? It stops now and is not marked.", {
      confirmText: "End interview",
      cancelText: "Keep going",
    });
    if (!shouldLeave) return;

    hasLeftRef.current = true;
    setIsLeaving(true);
    stopInterviewMedia();

    try {
      await axios.post(ServerUrl + "/api/interview/cancel", { interviewId }, { withCredentials: true });
    } catch (error) {
      console.log(error);
    } finally {
      navigate("/");
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (hasLeftRef.current) return;
    if (isIntroPhase) return;
    if (!currentQuestion) return;

    if (timeLeft === 0 && !isSubmitting && !feedback) {
      submitAnswer()
    }
  }, [timeLeft]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current.abort();
      }

      window.speechSynthesis.cancel();
    };
  }, []);







  const modeLabel = { Technical: "Technical", HR: "HR", Behavioral: "Behavioural" }[interviewData?.mode] || "Mock";
  const totalTime = currentQuestion?.timeLimit || 60;

  // The first sentence of feedback is the verdict; it gets the highlighter.
  const verdictSplit = feedback.match(/^(.+?[.!?])(\s+[\s\S]*)?$/);
  const verdict = verdictSplit ? verdictSplit[1] : feedback;
  const feedbackRest = verdictSplit ? (verdictSplit[2] || "").trim() : "";

  // Show the spoken line under the video only when it isn't the question already on screen.
  const showSubtitle = subtitle && (isIntroPhase || (subtitle !== currentQuestion?.question && subtitle !== feedback));

  return (
    <div className='flex min-h-screen flex-col bg-paper'>
      {/* Time left: drains across the top of the screen */}
      <div className='sticky top-0 z-10 bg-paper'>
        {isIntroPhase ? <div className='h-1 w-full bg-rule' /> : <Timer timeLeft={timeLeft} totalTime={totalTime} />}
        <div className='mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-8'>
          <div className='flex flex-wrap items-baseline gap-x-5 gap-y-1 text-caption text-graphite'>
            <span className='font-semibold text-ink'>{modeLabel} interview</span>
            {!isIntroPhase && (
              <>
                <span className='num'>Question {currentIndex + 1} of {questions.length}</span>
                <span className={`num ${timeLeft <= 10 ? 'font-semibold text-bad' : ''}`}>{timeLeft}s left</span>
              </>
            )}
          </div>
          <button
            onClick={handleLeaveInterview}
            disabled={isLeaving}
            className='btn btn-danger py-1.5 text-caption'
          >
            {isLeaving ? "Ending…" : "End interview"}
          </button>
        </div>
      </div>

      <main className='mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-8 pt-4 sm:px-8 sm:pt-8'>
        {/* The interviewer and the question */}
        <section className='grid gap-6 md:grid-cols-[180px_1fr] md:gap-10'>
          <div className='flex items-start gap-4 md:block'>
            <div className='w-24 shrink-0 overflow-hidden rounded-md bg-ink md:w-full'>
              <video
                src={videoSource}
                key={videoSource}
                ref={videoRef}
                muted
                playsInline
                preload="auto"
                className="aspect-square h-auto w-full object-cover"
              />
            </div>
            <p className='mt-0 flex items-center gap-2 text-caption text-graphite md:mt-3' aria-live='polite'>
              <span className={`h-2 w-2 rounded-full ${isAIPlaying ? 'bg-good' : 'bg-rule'}`} aria-hidden />
              {isAIPlaying ? "Interviewer speaking" : "Interviewer listening"}
            </p>
          </div>

          <div className='min-w-0'>
            {isIntroPhase ? (
              <p className='voice text-balance text-heading text-ink sm:text-display'>
                {subtitle || "Your interviewer is joining…"}
              </p>
            ) : (
              <motion.h1
                key={currentIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.2, 0.7, 0.2, 1] }}
                className='voice max-w-[34ch] text-balance text-heading text-ink sm:text-[2.25rem] sm:leading-[1.2]'
              >
                {currentQuestion?.question}
              </motion.h1>
            )}

            {showSubtitle && !isIntroPhase && (
              <p className='voice mt-4 text-lead italic text-graphite'>“{subtitle}”</p>
            )}
          </div>
        </section>

        {/* Your answer, or the marked-up feedback */}
        <section className='mt-10 flex flex-1 flex-col border-t border-rule pt-6'>
          {!feedback ? (
            <>
              <div className='mb-2 flex items-center justify-between'>
                <label htmlFor='answer' className='font-semibold'>Your answer</label>
                <span className='text-caption text-graphite'>
                  {isMicOn ? "Speak or type — speech is added as text" : "Mic off — type your answer"}
                </span>
              </div>
              <textarea
                id='answer'
                placeholder={isIntroPhase ? "The first question is on its way." : "Start speaking, or type here…"}
                onChange={(e) => setAnswer(e.target.value)}
                value={answer}
                className="field min-h-48 flex-1 resize-none p-4 text-lead leading-relaxed" />

              <div className='mt-4 flex items-center gap-3'>
                <motion.button
                  onClick={toggleMic}
                  whileTap={{ scale: 0.92 }}
                  aria-pressed={isMicOn}
                  aria-label={isMicOn ? "Turn microphone off" : "Turn microphone on"}
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border transition-colors ${isMicOn ? 'border-ink bg-ink text-white' : 'border-rule bg-sheet text-graphite'}`}>
                  {isMicOn ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
                </motion.button>
                <span className='hidden text-caption text-graphite sm:inline'>{isMicOn ? "Mic on" : "Mic off"}</span>

                <button
                  onClick={submitAnswer}
                  disabled={isSubmitting || isIntroPhase}
                  className='btn btn-primary ml-auto px-6 py-3'>
                  {isSubmitting ? "Marking your answer…" : "Submit answer"}
                </button>
              </div>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className='max-w-[68ch]'
            >
              <h2 className='font-semibold'>Feedback</h2>
              <p className='mt-2 text-lead leading-relaxed'>
                <span className='mark'>{verdict}</span>
                {feedbackRest && <> {feedbackRest}</>}
              </p>

              {idealAnswer && (
                <div className='mt-8 border-l-2 border-ink pl-5'>
                  <h3 className='font-semibold'>A strong answer</h3>
                  <p className='voice mt-2 text-lead leading-[1.7] text-ink-soft'>{idealAnswer}</p>
                </div>
              )}

              <div className='mt-8 flex justify-end'>
                <button onClick={handleNext} className='btn btn-primary px-6 py-3'>
                  {currentIndex + 1 >= questions.length ? "Finish and see report" : "Next question"}
                </button>
              </div>
            </motion.div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Step2Interview
