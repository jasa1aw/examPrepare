import React from 'react';
import { CheckCircle, XCircle, Activity, AlertCircle } from 'lucide-react';

interface StatsSidebarProps {
    stats: {
        passed: number;
        correct: number;
        incorrect: number;
        remaining: number;
    };
}

export const StatsSidebar: React.FC<StatsSidebarProps> = ({ stats }) => {
    return (
        <div className="fixed right-6 top-24 w-48 bg-white rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-gray-100 p-5 hidden xl:block animate-in fade-in slide-in-from-right-8 duration-700">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 border-b pb-2">Statistics</h3>

            <div className="space-y-4">
                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-blue-600 transition-colors">
                        <Activity size={18} className="text-blue-500" />
                        <span className="text-sm font-medium">Passed</span>
                    </div>
                    <span className="text-lg font-bold text-gray-700 tabular-nums">{stats.passed}</span>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-green-600 transition-colors">
                        <CheckCircle size={18} className="text-green-500" />
                        <span className="text-sm font-medium">Correct</span>
                    </div>
                    <span className="text-lg font-bold text-green-600 tabular-nums">{stats.correct}</span>
                </div>

                <div className="flex items-center justify-between group">
                    <div className="flex items-center gap-2 text-gray-600 group-hover:text-red-500 transition-colors">
                        <XCircle size={18} className="text-red-500" />
                        <span className="text-sm font-medium">Wrong</span>
                    </div>
                    <span className="text-lg font-bold text-red-500 tabular-nums">{stats.incorrect}</span>
                </div>

                <div className="flex items-center justify-between pt-2 opacity-80 hover:opacity-100 transition-opacity">
                    <div className="flex items-center gap-2 text-gray-400">
                        <AlertCircle size={18} />
                        <span className="text-sm font-medium">Left</span>
                    </div>
                    <span className="text-lg font-bold text-gray-500 tabular-nums">{stats.remaining}</span>
                </div>
            </div>
        </div>
    );
};
