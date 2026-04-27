import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  AlertTriangle, CheckCircle, Clock, Calendar,
  ArrowLeft, BookOpen, ChevronRight, X, Zap
} from "lucide-react";

function hasTimeConflict(a, b) {
  if (a.day !== b.day) return false;
  const toMins = t => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };
  const [aS, aE] = a.time.split("-").map(toMins);
  const [bS, bE] = b.time.split("-").map(toMins);
  return aS < bE && bS < aE;
}

// ❌ REMOVED coursesData dependency
function getAlternatives(course, selected) {
  // backend doesn’t support multiple slots → return empty
  return [];
}

export default function ConflictResolver() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const selected = state || [];
  const [resolved, setResolved] = useState([]);

  // Detect conflicts
  const conflicts = [];
  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      if (hasTimeConflict(selected[i], selected[j])) {
        conflicts.push({
          a: selected[i],
          b: selected[j],
          id: `${selected[i].id}-${selected[j].id}`
        });
      }
    }
  }

  const unresolvedConflicts = conflicts.filter(c => !resolved.includes(c.id));
  const allResolved = unresolvedConflicts.length === 0;

  const markResolved = (id) => {
    setResolved(prev => [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">

      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate("/schedule/builder", { state: selected })}
          className="text-sm text-gray-500 mb-2"
        >
          ← Back to Builder
        </button>

        <h1 className="text-2xl font-bold">Conflict Resolver</h1>
        <p className="text-sm text-gray-500">
          {conflicts.length === 0
            ? "No conflicts found"
            : `${unresolvedConflicts.length} conflicts remaining`}
        </p>
      </div>

      {/* No conflicts */}
      {conflicts.length === 0 ? (
        <div className="bg-green-100 p-6 rounded text-center">
          <CheckCircle className="mx-auto mb-2 text-green-600" />
          <p>No conflicts in your schedule</p>

          <button
            onClick={() => navigate("/schedule/builder")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
          >
            Back
          </button>
        </div>
      ) : (
        <div className="space-y-4">

          {/* Conflicts */}
          {conflicts.map((cf, idx) => {
            const isResolved = resolved.includes(cf.id);

            return (
              <div key={cf.id} className="bg-white p-4 rounded shadow">

                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-bold">
                    Conflict {idx + 1}
                  </h2>

                  {!isResolved && (
                    <button
                      onClick={() => markResolved(cf.id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      Mark Resolved
                    </button>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  {[cf.a, cf.b].map((course, i) => (
                    <div key={i} className="border p-3 rounded bg-red-50">
                      <p className="font-semibold">{course.name}</p>
                      <p className="text-sm">{course.code}</p>
                      <p className="text-sm">
                        {course.day} | {course.time}
                      </p>
                    </div>
                  ))}
                </div>

                {!isResolved && (
                  <div className="mt-3 text-sm text-gray-600">
                    Remove one of these courses or adjust schedule.
                  </div>
                )}

              </div>
            );
          })}

          {/* Selected list */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Selected Courses</h2>

            {selected.map((c, i) => {
              const hasConflict = conflicts.some(cf =>
                (cf.a.id === c.id || cf.b.id === c.id) &&
                !resolved.includes(cf.id)
              );

              return (
                <div key={i} className="flex justify-between border p-2 rounded mb-2">
                  <span>{c.name}</span>
                  {hasConflict ? (
                    <span className="text-red-500 text-sm">Conflict</span>
                  ) : (
                    <CheckCircle className="text-green-500 w-4" />
                  )}
                </div>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
}