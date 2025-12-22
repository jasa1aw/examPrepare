import React from 'react';
import { Question, AIAnalysis } from '../types';
import { CheckCircle, XCircle, BrainCircuit, Loader2, CheckSquare } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedOptionIndex: number | undefined;
  onSelectOption: (index: number) => void;
  aiAnalysis: AIAnalysis | null;
  isAnalyzing: boolean;
  onRequestAnalysis: () => void;
  hasApiKey: boolean;
  isExamMode?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionIndex,
  onSelectOption,
  aiAnalysis,
  isAnalyzing,
  onRequestAnalysis,
  hasApiKey,
  isExamMode = false
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
        <span className="inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-100 text-brand-700 mb-3">
          Question {question.id}
        </span>
        <h3 className="text-xl font-medium text-gray-900 leading-relaxed">
          {question.text}
        </h3>
      </div>

      {/* Options */}
      <div className="p-6 space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionIndex === index;
          const isCorrect = aiAnalysis?.correctOptionIndex === index;
          const isWrong = aiAnalysis && isSelected && !isCorrect;

          let containerClass = "relative flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 group ";

          if (aiAnalysis) {
            if (isCorrect) containerClass += "border-green-500 bg-green-50 text-green-900";
            else if (isWrong) containerClass += "border-red-300 bg-red-50 text-red-900 opacity-70";
            else containerClass += "border-gray-200 text-gray-500 opacity-50";
          } else {
            if (isSelected) containerClass += "border-brand-500 bg-brand-50 shadow-md ring-1 ring-brand-200";
            else containerClass += "border-gray-200 hover:border-brand-200 hover:bg-gray-50";
          }

          return (
            <div
              key={index}
              onClick={() => !aiAnalysis && onSelectOption(index)}
              className={containerClass}
            >
              <div className={`
                flex items-center justify-center w-8 h-8 rounded-full border-2 mr-4 text-sm font-bold transition-colors
                ${isSelected || isCorrect ? 'border-transparent' : 'border-gray-300 text-gray-500'}
                ${isSelected && !aiAnalysis ? 'bg-brand-500 text-white' : ''}
                ${isCorrect ? 'bg-green-500 text-white' : ''}
                ${isWrong ? 'bg-red-500 text-white' : ''}
              `}>
                {String.fromCharCode(65 + index)}
              </div>
              <span className="flex-1 text-base">{option}</span>

              {isCorrect && <CheckCircle className="w-6 h-6 text-green-600 ml-2 animate-in zoom-in duration-300" />}
              {isWrong && <XCircle className="w-6 h-6 text-red-500 ml-2 animate-in zoom-in duration-300" />}
            </div>
          );
        })}
      </div>

      {/* AI Controls & Explanation - Only show if NOT in Exam Mode */}
      {!isExamMode && (
        <div className="bg-gray-50 p-6 border-t border-gray-100 min-h-[80px] flex flex-col justify-center">
          {!aiAnalysis && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-500 italic">
                {selectedOptionIndex !== undefined ? 'Ready to check?' : 'Select an answer to continue'}
              </p>
              <button
                onClick={onRequestAnalysis}
                disabled={selectedOptionIndex === undefined || isAnalyzing}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium text-white transition-all w-full sm:w-auto justify-center
                 ${selectedOptionIndex === undefined
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-brand-600 hover:bg-brand-700 shadow-lg hover:shadow-xl translate-y-0 hover:-translate-y-0.5 active:translate-y-0'}
               `}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    {hasApiKey ? <BrainCircuit className="w-4 h-4" /> : <CheckSquare className="w-4 h-4" />}
                    {hasApiKey ? 'Check with AI' : 'Check Answer'}
                  </>
                )}
              </button>
            </div>
          )}

          {aiAnalysis && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-start gap-3 bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                <div className="bg-brand-100 p-2 rounded-lg shrink-0">
                  {hasApiKey ? <BrainCircuit className="w-5 h-5 text-brand-600" /> : <CheckSquare className="w-5 h-5 text-brand-600" />}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                    {hasApiKey ? 'AI Explanation' : 'Result'}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${aiAnalysis.correctOptionIndex === selectedOptionIndex ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {aiAnalysis.correctOptionIndex === selectedOptionIndex ? 'Correct' : 'Incorrect'}
                    </span>
                  </h4>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {aiAnalysis.explanation}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};