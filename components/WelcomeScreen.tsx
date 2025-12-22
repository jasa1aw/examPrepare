import React from 'react';
import { BookOpen, GraduationCap, Clock, Award, Brain, ArrowRight } from 'lucide-react';
import { Subject } from '../types';

interface WelcomeScreenProps {
    onStart: (mode: 'PRACTICE' | 'EXAM', subject: Subject) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStart }) => {
    const [subject, setSubject] = React.useState<Subject>('philosophy');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-4xl w-full text-center space-y-12 animate-in fade-in zoom-in duration-500">

                <div className="space-y-4">
                    <div className="inline-flex items-center justify-center p-4 bg-brand-600 rounded-2xl shadow-lg mb-4">
                        <GraduationCap className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                        Wayground <span className="text-brand-600">Quiz</span>
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto">
                        Master Philosophy and Psychology through interactive learning and assessment.
                    </p>
                </div>

                {/* Subject Selection */}
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => setSubject('philosophy')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${subject === 'philosophy'
                                ? 'bg-white text-brand-700 shadow-md border-brand-100 ring-2 ring-brand-500 ring-offset-2'
                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <BookOpen size={20} />
                        Philosophy
                    </button>
                    <button
                        onClick={() => setSubject('psychology')}
                        className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all ${subject === 'psychology'
                                ? 'bg-white text-purple-700 shadow-md border-purple-100 ring-2 ring-purple-500 ring-offset-2'
                                : 'bg-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        <Brain size={20} />
                        Psychology
                    </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto px-4">
                    {/* Practice Mode */}
                    <button
                        onClick={() => onStart('PRACTICE', subject)}
                        className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-brand-500 transition-all text-left overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity ${subject === 'psychology' ? 'text-purple-500' : 'text-brand-500'}`}>
                            <BookOpen size={120} />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${subject === 'psychology' ? 'bg-purple-100 text-purple-600' : 'bg-brand-100 text-brand-600'}`}>
                                <BookOpen size={24} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Practice Mode</h3>
                                <p className="text-gray-500">Learn at your own pace with immediate feedback and explanations.</p>
                            </div>

                            <ul className="space-y-2 text-sm text-gray-500">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Immediate answer checking
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    Unlimited time
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                                    AI Explanations available
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-brand-600 font-bold group-hover:translate-x-1 transition-transform">
                            Start Practice <ArrowRight size={18} />
                        </div>
                    </button>

                    {/* Exam Mode */}
                    <button
                        onClick={() => onStart('EXAM', subject)}
                        className="group relative bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl border-2 border-transparent hover:border-red-500 transition-all text-left overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity text-red-500">
                            <Award size={120} />
                        </div>

                        <div className="relative z-10 space-y-4">
                            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                <Clock size={24} />
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Exam Mode</h3>
                                <p className="text-gray-500">Test your knowledge under exam conditions.</p>
                            </div>

                            <ul className="space-y-2 text-sm text-gray-500">
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    40 Random Questions
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    No immediate feedback
                                </li>
                                <li className="flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                    Graded on 100-point scale
                                </li>
                            </ul>
                        </div>

                        <div className="mt-8 flex items-center gap-2 text-red-600 font-bold group-hover:translate-x-1 transition-transform">
                            Start Exam <ArrowRight size={18} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};
