import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft, BookOpen, Clock, Calendar, User, Star,
  Users, Award, CheckCircle, AlertTriangle, ChevronRight,
  Tag, BookMarked
} from "lucide-react";

const COURSE_DESCRIPTIONS = {
  CS301: "Covers relational databases, SQL, normalization, transactions, indexing, and NoSQL systems. Hands-on with MySQL and MongoDB for real-world schema design.",
  CS302: "Explores process management, memory management, file systems, synchronization, and scheduling algorithms in Unix/Linux environments.",
  CS401: "Introduces supervised/unsupervised learning, neural networks, decision trees, and deep learning with Python, scikit-learn, and TensorFlow.",
  CS303: "Covers OSI/TCP-IP models, routing, switching, HTTP, DNS, socket programming, and wireless networking protocols.",
  CS404: "Full stack development using React, Node.js, Express, and MongoDB. Students build and deploy real-world web applications.",
  CS201: "Core algorithms and data structures: arrays, trees, graphs, sorting, searching, dynamic programming, and complexity analysis.",
  CS405: "Covers AWS/Azure cloud services, containerization with Docker, Kubernetes orchestration, and CI/CD pipelines.",
  CS304: "Software development life cycle, Agile/Scrum, UML modeling, testing strategies, and project management.",
  CS406: "Network security, cryptographic protocols, ethical hacking basics, PKI, and secure coding practices.",
  CS202: "Instruction set architecture, pipelining, memory hierarchy, cache design, and parallel processing fundamentals.",
  MA201: "Probability theory, distributions, hypothesis testing, regression, and statistical inference with R.",
  MA202: "Sets, logic, graph theory, combinatorics, and proof techniques essential for computer science.",
  MA101: "Calculus, linear algebra, matrices, eigenvalues, and vector spaces relevant to engineering applications.",
  EC201: "Boolean algebra, logic gates, flip-flops, counters, and digital circuit design with Verilog.",
  EC301: "8086/ARM microprocessors, assembly language, interfacing peripherals, and embedded C programming.",
  HS301: "Research design, literature review, academic writing, data collection methods, and citation practices.",
  HS201: "Technical report writing, presentations, email etiquette, and professional communication for engineers.",
  CS407: "IoT architecture, sensor networks, MQTT protocol, Raspberry Pi, and cloud integration for smart systems.",
  CS408: "Hadoop, Spark, Hive, data pipelines, and large-scale data processing techniques for industry use cases.",
  CS409: "Blockchain fundamentals, Ethereum, smart contracts with Solidity, and decentralized application development.",
};

const TAG_COLORS = {
  Core: "bg-blue-100 text-blue-700",
  Elective: "bg-indigo-100 text-indigo-700",
  Popular: "bg-amber-100 text-amber-700",
  New: "bg-green-100 text-green-700",
};

const SYLLABUS = [
  "Introduction & Course Overview",
  "Core Theoretical Foundations",
  "Practical Lab Sessions & Assignments",
  "Mid-Semester Project",
  "Advanced Topics & Case Studies",
  "Industry Applications & Guest Lectures",
  "End-Semester Project & Presentations",
];

export default function CourseDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!state) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <BookOpen className="w-12 h-12 text-slate-300" />
        <p className="text-slate-500 font-medium">No course selected</p>
        <button onClick={() => navigate("/courses")}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>
      </div>
    );
  }

  const course = state;
  const pct = Math.round((course.enrolled / course.capacity) * 100);
  const full = pct >= 95;
  const description = COURSE_DESCRIPTIONS[course.code] || "This course covers core concepts and practical applications relevant to modern software and system design.";

  const handleRegister = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setRegistered(true);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Back */}
        <button onClick={() => navigate("/courses")}
          className="flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </button>

        {/* Hero Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 relative overflow-hidden">
            <div className="absolute inset-0 opacity-10"
              style={{ backgroundImage: 'radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div className="flex items-center gap-1 bg-white/20 px-3 py-1.5 rounded-xl">
                  <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                  <span className="text-white font-bold text-sm">{course.rating}</span>
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-white mb-1 leading-snug">{course.name}</h1>
              <p className="text-blue-200 font-mono text-sm font-semibold">{course.code}</p>
            </div>
          </div>

          {/* Tags */}
          <div className="px-6 py-3 border-b border-slate-100 flex flex-wrap gap-2">
            {(course.tags || []).map(tag => (
              <span key={tag} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${TAG_COLORS[tag]}`}>{tag}</span>
            ))}
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{course.credits} Credits</span>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">{course.dept}</span>
          </div>

          {/* Meta grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-slate-100">
            {[
              { icon: User, label: "Instructor", value: course.instructor },
              { icon: Calendar, label: "Day", value: course.day },
              { icon: Clock, label: "Time", value: course.time },
              { icon: Users, label: "Enrolled", value: `${course.enrolled}/${course.capacity}` },
            ].map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="p-4 flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{m.label}</p>
                    <p className="text-sm font-semibold text-slate-700 mt-0.5">{m.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enrollment bar */}
          <div className="px-6 pb-5">
            <div className="flex justify-between text-xs text-slate-500 mb-1.5">
              <span className="font-medium">Seat Availability</span>
              <span className={`font-semibold ${full ? "text-amber-500" : "text-blue-600"}`}>
                {course.capacity - course.enrolled} seats left {full && "· Almost Full!"}
              </span>
            </div>
            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500"
                style={{ width: `${pct}%`, background: full ? "#f59e0b" : "#3b82f6" }} />
            </div>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-3">
            <BookMarked className="w-4 h-4 text-blue-600" /> About this Course
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">{description}</p>
        </div>

        {/* Syllabus */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Tag className="w-4 h-4 text-blue-600" /> Course Syllabus
          </h2>
          <div className="space-y-2">
            {SYLLABUS.map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <span className="text-sm text-slate-700">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        {full && !registered && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
            <p className="text-sm text-amber-700 font-medium">This course is almost full. Register quickly to secure your seat!</p>
          </div>
        )}

        {registered ? (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-green-700">Successfully Registered!</p>
              <p className="text-xs text-green-600 mt-0.5">You've been enrolled in {course.name}.</p>
            </div>
            <button onClick={() => navigate("/registration")}
              className="ml-auto flex items-center gap-1 text-sm font-semibold text-green-600 hover:underline">
              View Registration <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button onClick={handleRegister} disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-2xl shadow-md shadow-blue-200 transition-all disabled:opacity-70 flex items-center justify-center gap-2">
            {loading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                </svg>
                Registering…
              </>
            ) : (
              <>Register for this Course <ChevronRight className="w-4 h-4" /></>
            )}
          </button>
        )}

      </div>
    </div>
  );
}