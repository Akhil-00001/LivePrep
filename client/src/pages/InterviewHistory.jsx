import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import { ServerUrl } from '../App'

const modeLabel = { Technical: "Technical", HR: "HR", Behavioral: "Behavioural" }

const scoreTone = (value) =>
    value >= 8 ? "text-good" : value >= 5 ? "text-warn" : "text-bad"

function InterviewHistory() {
    const [interviews, setInterviews] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const getMyInterviews = async () => {
            try {
                const result = await axios.get(ServerUrl + "/api/interview/get-interview", { withCredentials: true })

                setInterviews(result.data)

            } catch (error) {
                console.log(error)
            } finally {
                setLoading(false)
            }

        }

        getMyInterviews()

    }, [])


    return (
        <div>
            <h1 className='page-title'>Your reports</h1>
            <p className='page-lede'>Every interview you finish is marked and kept here.</p>

            {loading ? (
                <p className='mt-10 text-graphite'>Loading your reports…</p>
            ) : interviews.length === 0 ? (
                <div className='mt-10 border-t border-rule pt-8'>
                    <p className='voice text-title'>No interviews yet.</p>
                    <p className='mt-1 text-graphite'>Your first report appears here after you finish an interview.</p>
                    <Link to='/interview' className='btn btn-primary mt-6'>Start an interview</Link>
                </div>
            ) : (
                <ul className='mt-8 divide-y divide-rule border-y border-rule'>
                    {interviews.map((item, index) => {
                        const completed = item.status === "completed"
                        return (
                            <li key={item._id || index}>
                                <Link
                                    to={`/report/${item._id}`}
                                    className='group grid grid-cols-[1fr_auto] items-center gap-4 py-5 sm:grid-cols-[1fr_9rem_5rem]'
                                >
                                    <div className='min-w-0'>
                                        <p className='truncate font-semibold group-hover:underline group-hover:underline-offset-4'>
                                            {item.role}
                                        </p>
                                        <p className='mt-0.5 text-caption text-graphite'>
                                            {modeLabel[item.mode] || item.mode} interview, {item.experience}
                                        </p>
                                    </div>

                                    <p className='num hidden text-caption text-graphite sm:block'>
                                        {new Date(item.createdAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })}
                                    </p>

                                    <p className='text-right'>
                                        {completed ? (
                                            <span className={`num text-title font-semibold ${scoreTone(item.finalScore || 0)}`}>
                                                {item.finalScore || 0}<span className='text-caption font-normal text-graphite'>/10</span>
                                            </span>
                                        ) : (
                                            <span className='text-caption capitalize text-graphite'>{item.status}</span>
                                        )}
                                    </p>
                                </Link>
                            </li>
                        )
                    })}
                </ul>
            )}
        </div>
    )
}

export default InterviewHistory
