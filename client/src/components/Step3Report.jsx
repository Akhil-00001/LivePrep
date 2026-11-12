import React from 'react'
import { FiArrowLeft, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function Step3Report({ report }) {
  const navigate = useNavigate()
  if (!report) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-graphite">Loading your report…</p>
      </div>
    );
  }
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;


  const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 25;

  // ================= TITLE =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(23, 35, 58);
  doc.text("LivePrep interview report", pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 5;

  // underline
  doc.setDrawColor(23, 35, 58);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 15;

  // ================= FINAL SCORE BOX =================
  doc.setFillColor(255, 243, 194);
  doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Final Score: ${finalScore}/10`,
    pageWidth / 2,
    currentY + 12,
    { align: "center" }
  );

  currentY += 30;

  // ================= SKILLS BOX =================
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

  doc.setFontSize(12);

  doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
  doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
  doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

  currentY += 45;

  // ================= ADVICE =================
  let advice = "";

  if (finalScore >= 8) {
    advice =
      "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
  } else if (finalScore >= 5) {
    advice =
      "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
  } else {
    advice =
      "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220);
  doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

  doc.setFont("helvetica", "bold");
  doc.text("Professional Advice", margin + 10, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
  doc.text(splitAdvice, margin + 10, currentY + 20);

  currentY += 50;

  // ================= QUESTION TABLE =================
  autoTable(doc, {
    startY: currentY,
    margin: { left: margin, right: margin },
    head: [["#", "Question", "Your Answer", "Time (s)", "Score", "Feedback"]],
    body: questionWiseScore.map((q, i) => [
      `${i + 1}`,
      q.question,
      q.answer || "No answer",
      `${q.timeTaken || 0}`,
      `${q.score}/10`,
      q.feedback,
    ]),
    styles: {
      fontSize: 8,
      cellPadding: 5,
      valign: "top",
    },
    headStyles: {
      fillColor: [23, 35, 58],
      textColor: 255,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      1: { cellWidth: 55 },
      2: { cellWidth: 60 },
      3: { cellWidth: 18, halign: "center" },
      4: { cellWidth: 18, halign: "center" },
      5: { cellWidth: "auto" },
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251],
    },
  });


  doc.save("AI_Interview_Report.pdf");
};

  const scoreTone = (value) =>
    value >= 8 ? "text-good" : value >= 5 ? "text-warn" : "text-bad";
  const scoreBar = (value) =>
    value >= 8 ? "bg-good" : value >= 5 ? "bg-warn" : "bg-bad";

  return (
    <div>
      <button
        onClick={() => navigate("/history")}
        className='btn btn-quiet -ml-2 mb-6 text-graphite hover:text-ink'>
        <FiArrowLeft aria-hidden /> All reports
      </button>

      {/* Verdict */}
      <header className='grid gap-8 border-b border-rule pb-10 md:grid-cols-[auto_1fr] md:items-end md:gap-12'>
        <div>
          <p className='text-caption text-graphite'>Overall score</p>
          <p className='num voice mt-1 leading-none text-ink'>
            <span className='text-[6rem] sm:text-[7.5rem]'>{score}</span>
            <span className='text-heading text-graphite'>/10</span>
          </p>
        </div>
        <div className='max-w-[52ch]'>
          <h1 className='text-heading font-semibold leading-tight'>
            <span className='mark'>{performanceText}</span>
          </h1>
          <p className='mt-2 text-lead text-graphite'>{shortTagline}</p>
          <button onClick={downloadPDF} className='btn btn-secondary mt-6'>
            <FiDownload aria-hidden /> Download PDF
          </button>
        </div>
      </header>

      {/* Skills and trend */}
      <section className='grid gap-10 border-b border-rule py-10 md:grid-cols-[1fr_1.6fr] md:gap-12'>
        <div>
          <h2 className='text-title font-semibold'>How you came across</h2>
          <dl className='mt-6 space-y-5'>
            {skills.map((s) => (
              <div key={s.label}>
                <div className='mb-1.5 flex items-baseline justify-between'>
                  <dt>{s.label}</dt>
                  <dd className={`num font-semibold ${scoreTone(s.value)}`}>{s.value}/10</dd>
                </div>
                <div className='h-1.5 bg-rule' aria-hidden>
                  <div className={`h-full ${scoreBar(s.value)}`} style={{ width: `${Math.min(100, s.value * 10)}%` }} />
                </div>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <h2 className='text-title font-semibold'>Score by question</h2>
          <div className='mt-6 h-56 sm:h-64'>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={questionScoreData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                <CartesianGrid stroke="#DFE3E9" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: "#DFE3E9" }} tick={{ fill: "#5E6878", fontSize: 13 }} />
                <YAxis domain={[0, 10]} ticks={[0, 5, 10]} tickLine={false} axisLine={false} tick={{ fill: "#5E6878", fontSize: 13 }} />
                <Tooltip
                  cursor={{ stroke: "#17233A", strokeDasharray: "3 3" }}
                  contentStyle={{ borderRadius: 6, border: "1px solid #DFE3E9", fontSize: 13 }}
                  formatter={(v) => [`${v}/10`, "Score"]}
                />
                <Area type="monotone"
                  dataKey="score"
                  stroke="#17233A"
                  fill="#17233A"
                  fillOpacity={0.06}
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#17233A" }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Question by question */}
      <section className='py-10'>
        <h2 className='text-title font-semibold'>Question by question</h2>
        <ol className='mt-6 divide-y divide-rule border-y border-rule'>
          {questionWiseScore.map((q, i) => (
            <li key={i} className='grid gap-4 py-8 md:grid-cols-[3rem_1fr_auto] md:gap-6'>
              <span className='num text-caption text-graphite md:pt-1.5'>Q{i + 1}</span>

              <div className='min-w-0 max-w-[68ch]'>
                <p className='voice text-title leading-snug'>
                  {q.question || "Question not available"}
                </p>

                <h3 className='mt-5 text-caption font-semibold text-graphite'>
                  Your answer
                  {q.timeTaken != null && <span className='num font-normal'> in {q.timeTaken}s</span>}
                </h3>
                <p className={`mt-1 leading-relaxed ${q.answer?.trim() ? '' : 'italic text-graphite'}`}>
                  {q.answer?.trim() ? q.answer : "No answer submitted."}
                </p>

                <h3 className='mt-5 text-caption font-semibold text-graphite'>Feedback</h3>
                <p className='mt-1 leading-relaxed'>
                  {q.feedback && q.feedback.trim() !== ""
                    ? q.feedback
                    : "No feedback for this question."}
                </p>
              </div>

              <p className={`num text-title font-semibold md:text-right ${scoreTone(q.score ?? 0)}`}>
                {q.score ?? 0}<span className='text-body font-normal text-graphite'>/10</span>
              </p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

export default Step3Report
