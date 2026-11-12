import React from 'react'
import { FiUploadCloud, FiFileText } from "react-icons/fi";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { ServerUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData } from '../redux/userSlice';

const modes = [
    { value: "Technical", label: "Technical", hint: "Concepts, problem solving and your projects." },
    { value: "HR", label: "HR", hint: "Motivation, strengths, goals and fit." },
    { value: "Behavioral", label: "Behavioural", hint: "Real situations, answered with structure." },
];

function Step1SetUp({ onStart, initialMode = "Technical" }) {
  const navigate = useNavigate();
    const {userData}= useSelector((state)=>state.user)
    const dispatch = useDispatch()
    const [role, setRole] = useState("");
    const [experience, setExperience] = useState("");
    const [mode, setMode] = useState(initialMode);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [resumeText, setResumeText] = useState("");
    const [analysisDone, setAnalysisDone] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");


    const handleUploadResume = async () => {
        if (!resumeFile || analyzing) return;
        if (!userData) {
            setError("Please login before uploading your resume.");
            navigate('/auth');
            return;
        }
        setError("");
        setAnalyzing(true)

        const formdata = new FormData()
        formdata.append("resume", resumeFile)

        try {
            const result = await axios.post(ServerUrl+"/api/interview/resume", formdata, { withCredentials: true })

            console.log(result.data)

            setRole(result.data.role || "");
            setExperience(result.data.experience || "");
            setProjects(result.data.projects || []);
            setSkills(result.data.skills || []);
            setResumeText(result.data.resumeText || "");
            setAnalysisDone(true);

            setAnalyzing(false);

        } catch (error) {
            console.log(error)
            if (error.response?.status === 401) {
                localStorage.removeItem("liveprep-auth");
                dispatch(setUserData(null));
                setError("Your session expired. Please login again.");
                navigate('/auth');
            } else {
                setError(error.response?.data?.message || "Resume analysis failed. Please try again.");
            }
            setAnalyzing(false);
        }
    }

    const handleStart = async () => {
        if (!userData) {
            setError("Please login before starting a mock interview.");
            navigate('/auth');
            return;
        }
        setError("");
        setLoading(true)
        try {
           const result = await axios.post(ServerUrl + "/api/interview/generate-questions" , {role, experience, mode , resumeText, projects, skills } , {withCredentials:true})
           console.log(result.data)
           if(userData){
            dispatch(setUserData({...userData , credits:result.data.creditsLeft}))
           }
           setLoading(false)
           onStart({ ...result.data, mode })

        } catch (error) {
            console.log(error)
            if (error.response?.status === 401) {
                localStorage.removeItem("liveprep-auth");
                dispatch(setUserData(null));
                setError("Your session expired. Please login again.");
                navigate('/auth');
            } else {
                setError(error.response?.data?.message || "Unable to start interview. Please try again.");
            }
            setLoading(false)
        }
    }

    return (
        <div className='max-w-2xl'>
            <h1 className='page-title'>Set up your interview</h1>
            <p className='page-lede'>
                Tell the interviewer what you're applying for. Questions are spoken aloud,
                each one is timed, and you get feedback after every answer.
            </p>

            <div className='mt-10 space-y-10'>
                <section aria-labelledby='setup-role'>
                    <h2 id='setup-role' className='text-title font-semibold'>The role</h2>
                    <div className='mt-4 grid gap-4 sm:grid-cols-[1.4fr_1fr]'>
                        <div>
                            <label htmlFor='role' className='label'>Job title</label>
                            <input id='role' type='text' placeholder='e.g. Frontend developer'
                                className='field'
                                onChange={(e) => setRole(e.target.value)} value={role} />
                        </div>
                        <div>
                            <label htmlFor='experience' className='label'>Experience</label>
                            <input id='experience' type='text' placeholder='e.g. Fresher, 2 years'
                                className='field'
                                onChange={(e) => setExperience(e.target.value)} value={experience} />
                        </div>
                    </div>
                </section>

                <section aria-labelledby='setup-type'>
                    <h2 id='setup-type' className='text-title font-semibold'>Type of interview</h2>
                    <div role='radiogroup' aria-labelledby='setup-type' className='mt-4 grid gap-2 sm:grid-cols-3'>
                        {modes.map((m) => {
                            const active = mode === m.value;
                            return (
                                <button
                                    key={m.value}
                                    type='button'
                                    role='radio'
                                    aria-checked={active}
                                    onClick={() => setMode(m.value)}
                                    className={`rounded-sm border bg-sheet p-4 text-left transition-colors ${active ? 'border-ink shadow-[inset_0_0_0_1px_var(--color-ink)]' : 'border-rule hover:border-graphite'}`}
                                >
                                    <span className={`font-semibold ${active ? 'mark' : ''}`}>{m.label}</span>
                                    <span className='mt-1 block text-caption text-graphite'>{m.hint}</span>
                                </button>
                            );
                        })}
                    </div>
                </section>

                <section aria-labelledby='setup-resume'>
                    <h2 id='setup-resume' className='text-title font-semibold'>
                        Your resume <span className='text-body font-normal text-graphite'>(optional)</span>
                    </h2>
                    <p className='mt-1 text-graphite'>
                        Upload a PDF and the interviewer will ask about your own projects and skills.
                    </p>

                    {!analysisDone && (
                        <div className='mt-4 flex flex-col gap-3 rounded-sm border border-dashed border-graphite/50 bg-sheet p-4 sm:flex-row sm:items-center'>
                            <label htmlFor='resumeUpload' className='flex min-w-0 flex-1 cursor-pointer items-center gap-3'>
                                {resumeFile ? <FiFileText className='shrink-0 text-xl' /> : <FiUploadCloud className='shrink-0 text-xl text-graphite' />}
                                <span className={`truncate ${resumeFile ? 'font-medium' : 'text-graphite underline underline-offset-4'}`}>
                                    {resumeFile ? resumeFile.name : "Choose a PDF"}
                                </span>
                            </label>
                            <input type="file"
                                accept="application/pdf"
                                id="resumeUpload"
                                className='sr-only'
                                onChange={(e) => setResumeFile(e.target.files[0])} />
                            {resumeFile && (
                                <button type='button' onClick={handleUploadResume} disabled={analyzing} className='btn btn-secondary'>
                                    {analyzing ? "Reading resume…" : "Read resume"}
                                </button>
                            )}
                        </div>
                    )}

                    {analysisDone && (
                        <div className='sheet mt-4 space-y-4 p-5'>
                            <p className='font-semibold'>The interviewer will ask about</p>
                            {projects.length > 0 && (
                                <div>
                                    <p className='text-caption font-semibold text-graphite'>Projects</p>
                                    <ul className='mt-1 list-disc space-y-1 pl-5'>
                                        {projects.map((p, i) => (
                                            <li key={i}>{p}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            {skills.length > 0 && (
                                <div>
                                    <p className='text-caption font-semibold text-graphite'>Skills</p>
                                    <p className='mt-1'>{skills.join(", ")}</p>
                                </div>
                            )}
                        </div>
                    )}
                </section>

                {error && (
                    <p role='alert' className='border-l-2 border-bad pl-3 text-bad'>
                        {error}
                    </p>
                )}

                <div className='flex flex-col gap-3 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between'>
                    <p className='text-caption text-graphite'>
                        {!role || !experience ? "Add a job title and experience to begin." : "Starting an interview uses credits."}
                    </p>
                    <button
                        onClick={handleStart}
                        disabled={!role || !experience || loading}
                        className='btn btn-primary px-6 py-3'>
                        {loading ? "Preparing questions…" : "Start interview"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Step1SetUp
