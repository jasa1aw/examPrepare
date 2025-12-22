import React from 'react';
import { QuizState, GameMode } from '../types';
import { Trophy, RefreshCw, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface QuizResultsProps {
  state: QuizState;
  totalQuestions: number;
  onRestart: () => void;
  gameMode: GameMode;
}

export const QuizResults: React.FC<QuizResultsProps> = ({ state, totalQuestions, onRestart, gameMode }) => {
  const answeredCount = Object.keys(state.userAnswers).length;

  // Prepare Chart Data
  let data;
  let COLORS;

  if (gameMode === 'EXAM' && state.correctCount !== undefined) {
    const wrongCount = answeredCount - state.correctCount;
    // const skippedCount = totalQuestions - answeredCount; // Not needed if forced 40? 
    // Wait, user can finish early? Yes "Finish Exam" button exists on last question.
    // If they skipped some by jumping? No, random access not implemented in Exam Mode "Next calls handleNext".
    // Exam mode handles sequential next. "Finish Exam" only appears at end.
    // So all questions should be "Answered" or "Blank". But handleSelectOption just sets state.
    // If user clicked "Finish" on last Question without answering it?
    // "disabled={!hasAnswered}" logic in App.tsx prevents answering?
    // Yes.
    // So answeredCount should be equal to totalQuestions (40).

    data = [
      { name: 'Correct', value: state.correctCount },
      { name: 'Incorrect', value: wrongCount },
    ];
    COLORS = ['#22c55e', '#ef4444'];
  } else {
    data = [
      { name: 'Answered', value: answeredCount },
      { name: 'Skipped', value: totalQuestions - answeredCount },
    ];
    COLORS = ['#3b82f6', '#e2e8f0'];
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
      <div className="inline-flex items-center justify-center w-20 h-20 bg-yellow-100 rounded-full mb-6">
        <Trophy className="w-10 h-10 text-yellow-600" />
      </div>

      <h2 className="text-3xl font-bold text-gray-900 mb-2">
        {gameMode === 'EXAM' ? 'Exam Completed!' : 'Quiz Completed!'}
      </h2>
      <p className="text-gray-500 mb-8">
        {gameMode === 'EXAM'
          ? 'Here is your official assessment result.'
          : 'Great job practicing! Keep improving.'}
      </p>

      {/* Exam Score Display */}
      {gameMode === 'EXAM' && state.score !== undefined && (
        <div className="mb-8 p-6 bg-brand-50 rounded-2xl border border-brand-100 animate-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h3 className="text-sm font-bold text-brand-900 uppercase tracking-widest mb-2">Your Score</h3>
              <div className="flex items-baseline justify-center md:justify-start gap-1">
                <span className="text-6xl font-extrabold text-brand-600">{state.score}</span>
                <span className="text-2xl text-brand-400 font-medium">/100</span>
              </div>
            </div>

            <div className="flex flex-col gap-2 items-center md:items-start text-sm">
              {state.startTime && state.endTime && (
                <div className="flex items-center gap-2 text-gray-600">
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm text-brand-500">
                    <RefreshCw size={16} /> {/* Clock icon ideally */}
                  </div>
                  <span className="font-medium">
                    Time: {Math.floor((state.endTime - state.startTime) / 1000 / 60)}m {Math.floor((state.endTime - state.startTime) / 1000) % 60}s
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle size={16} />
                <span>{state.correctCount} Correct</span>
              </div>
              <div className="flex items-center gap-2 text-red-600">
                <XCircle size={16} />
                <span>{answeredCount - (state.correctCount || 0)} Incorrect</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="h-64 w-full mb-8">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-xl">
          <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Total Questions</p>
          <p className="text-3xl font-bold text-gray-900">{totalQuestions}</p>
        </div>
        <div className="bg-brand-50 p-4 rounded-xl">
          <p className="text-sm text-brand-600 uppercase tracking-wider font-semibold">
            {gameMode === 'EXAM' ? 'Attempted' : 'Answered'}
          </p>
          <p className="text-3xl font-bold text-brand-700">{answeredCount}</p>
        </div>
      </div>

      <button
        onClick={onRestart}
        className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl group"
      >
        <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform" />
        {gameMode === 'EXAM' ? 'Back to Menu' : 'Restart Quiz'}
      </button>
    </div>
  );
};
