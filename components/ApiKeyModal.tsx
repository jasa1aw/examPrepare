import React, { useState } from 'react';
import { Key, X, AlertCircle } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSave }) => {
  const [inputKey, setInputKey] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 mb-4 text-brand-600">
          <Key className="w-6 h-6" />
          <h2 className="text-xl font-bold text-gray-800">Unlock AI Grading</h2>
        </div>

        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
          The quiz questions provided do not have a pre-defined answer key. To get real-time corrections and explanations, you can use your own Google Gemini API key.
        </p>

        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 mb-4 flex gap-3 items-start">
          <AlertCircle className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <p className="text-xs text-brand-800">
            Your key is only stored in your browser's memory and is never sent to any server other than Google's API.
          </p>
        </div>

        <input
          type="password"
          placeholder="Enter your Gemini API Key"
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none mb-4 transition-all"
          value={inputKey}
          onChange={(e) => setInputKey(e.target.value)}
        />

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
          >
            Skip
          </button>
          <button
            onClick={() => {
              if (inputKey.trim()) onSave(inputKey);
            }}
            disabled={!inputKey.trim()}
            className="flex-1 px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enable AI
          </button>
        </div>
      </div>
    </div>
  );
};
