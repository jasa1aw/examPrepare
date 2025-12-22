
import React, { useState, useEffect } from 'react';
import { QUESTIONS_PHILOSOPHY, QUESTIONS_PSYCHOLOGY } from './constants';
import { QuizState, AIAnalysis, Question, Subject } from './types';
import { QuestionCard } from './components/QuestionCard';
import { QuizResults } from './components/QuizResults';
import { StatsSidebar } from './components/StatsSidebar';
import { ApiKeyModal } from './components/ApiKeyModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import { analyzeQuestion } from './services/geminiService';
import { Settings, GraduationCap, RotateCcw, ArrowRight, ArrowLeft, Brain, BookOpen, Clock, Home } from 'lucide-react';

const BATCH_SIZE = 15;

// Fisher-Yates Shuffle Algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const App: React.FC = () => {
  const [appMode, setAppMode] = useState<'WELCOME' | 'QUIZ'>('WELCOME');
  const [gameMode, setGameMode] = useState<'PRACTICE' | 'EXAM'>('PRACTICE');
  const [subject, setSubject] = useState<Subject>('philosophy');

  // Initialize questions based on subject - initially empty until started
  const [questions, setQuestions] = useState<Question[]>([]);

  const [quizState, setQuizState] = useState<QuizState>({
    currentQuestionIndex: 0,
    userAnswers: {},
    isFinished: false,
    answerHistory: {},
    isReviewing: false,
    reviewQueue: [],
    mainProgressIndex: 0
  });

  const [apiKey, setApiKey] = useState<string>('');
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<AIAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load API key from session storage if available
  useEffect(() => {
    const storedKey = sessionStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  // Effect to handle subject change
  useEffect(() => {
    handleRestart(subject);
  }, [subject]);

  const handleApiKeySave = (key: string) => {
    setApiKey(key);
    sessionStorage.setItem('gemini_api_key', key);
    setShowKeyModal(false);
  };

  const handleStartQuiz = (mode: 'PRACTICE' | 'EXAM', selectedSubject: Subject) => {
    setGameMode(mode);
    setSubject(selectedSubject);

    const rawQuestions = selectedSubject === 'psychology' ? QUESTIONS_PSYCHOLOGY : QUESTIONS_PHILOSOPHY;
    let initialQuestions = shuffleArray(rawQuestions);

    if (mode === 'EXAM') {
      initialQuestions = initialQuestions.slice(0, 40);
    }

    setQuestions(initialQuestions);
    setAppMode('QUIZ');
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      isFinished: false,
      answerHistory: {},
      isReviewing: false,
      reviewQueue: [],
      mainProgressIndex: 0,
      startTime: Date.now(),
    });
    setCurrentAnalysis(null);
  };

  // Timer logic for Exam Mode
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (appMode === 'QUIZ' && gameMode === 'EXAM' && !quizState.isFinished) {
      interval = setInterval(() => {
        if (quizState.startTime) {
          setElapsedTime(Math.floor((Date.now() - quizState.startTime) / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [appMode, gameMode, quizState.isFinished, quizState.startTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (index: number) => {
    if (currentAnalysis) return; // Prevent changing answer after check
    const currentQ = questions[quizState.currentQuestionIndex];

    setQuizState(prev => ({
      ...prev,
      userAnswers: {
        ...prev.userAnswers,
        [currentQ.id]: index
      }
    }));
  };

  const handleRequestAnalysis = async () => {
    const currentIndex = quizState.currentQuestionIndex;
    const currentQuestion = questions[currentIndex];

    // Check if we use AI or Static
    if (!apiKey) {
      // STATIC CHECK MODE
      const staticCorrectIndex = currentQuestion.correctAnswerIndex ?? 0;

      const staticAnalysis: AIAnalysis = {
        correctOptionIndex: staticCorrectIndex,
        explanation: "Answer verified against the official answer key."
      };

      setCurrentAnalysis(staticAnalysis);

      const selectedIndex = quizState.userAnswers[currentQuestion.id];
      const isCorrect = selectedIndex === staticCorrectIndex;

      setQuizState(prev => ({
        ...prev,
        answerHistory: { ...prev.answerHistory, [currentIndex]: isCorrect }
      }));
      return;
    }

    // AI MODE
    setIsAnalyzing(true);
    try {
      const analysis = await analyzeQuestion(apiKey, currentQuestion);
      setCurrentAnalysis(analysis);

      const selectedIndex = quizState.userAnswers[currentQuestion.id];
      const isCorrect = selectedIndex === analysis.correctOptionIndex;

      setQuizState(prev => ({
        ...prev,
        answerHistory: { ...prev.answerHistory, [currentIndex]: isCorrect }
      }));

    } catch (error) {
      alert("Failed to analyze question. Check your API key or network.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNext = () => {
    const currentIndex = quizState.currentQuestionIndex;

    // If we are currently reviewing
    if (quizState.isReviewing) {
      const remainingQueue = quizState.reviewQueue.slice(1);

      if (remainingQueue.length > 0) {
        // Continue review
        const nextReviewIndex = remainingQueue[0];
        setQuizState(prev => ({
          ...prev,
          reviewQueue: remainingQueue,
          currentQuestionIndex: nextReviewIndex,
          // Important: Clear the answer for the next review question so user can try again
          userAnswers: { ...prev.userAnswers, [questions[nextReviewIndex].id]: undefined as any }
        }));
      } else {
        // Finish review, go back to main progress
        const nextMainIndex = quizState.mainProgressIndex + 1;
        if (nextMainIndex >= questions.length) {
          finishQuiz();
        } else {
          setQuizState(prev => ({
            ...prev,
            isReviewing: false,
            currentQuestionIndex: nextMainIndex
          }));
        }
      }
    } else {
      // Normal flow

      // EXAM MODE FLOW
      if (gameMode === 'EXAM') {
        if (currentIndex < questions.length - 1) {
          setQuizState(prev => ({ ...prev, currentQuestionIndex: currentIndex + 1 }));
        } else {
          finishQuiz();
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // PRACTICE MODE FLOW
      const isBatchEnd = (currentIndex + 1) % BATCH_SIZE === 0 || currentIndex === questions.length - 1;

      if (isBatchEnd) {
        // Check for incorrect answers in the current batch
        const batchStart = Math.floor(currentIndex / BATCH_SIZE) * BATCH_SIZE;
        const incorrectIndices: number[] = [];

        for (let i = batchStart; i <= currentIndex; i++) {
          if (quizState.answerHistory[i] === false) {
            incorrectIndices.push(i);
          }
        }

        if (incorrectIndices.length > 0) {
          // Clear user answers for these questions so they can try again
          const newUserAnswers = { ...quizState.userAnswers };
          incorrectIndices.forEach(idx => {
            delete newUserAnswers[questions[idx].id];
          });

          // Enter review mode
          setQuizState(prev => ({
            ...prev,
            isReviewing: true,
            reviewQueue: incorrectIndices,
            mainProgressIndex: currentIndex, // Save where we left off
            currentQuestionIndex: incorrectIndices[0],
            userAnswers: newUserAnswers,
          }));
        } else {
          // No errors, proceed normally
          if (currentIndex < questions.length - 1) {
            setQuizState(prev => ({
              ...prev,
              currentQuestionIndex: currentIndex + 1
            }));
          } else {
            finishQuiz();
          }
        }
      } else {
        // Not batch end, just next question
        setQuizState(prev => ({
          ...prev,
          currentQuestionIndex: currentIndex + 1
        }));
      }
    }

    setCurrentAnalysis(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (gameMode === 'EXAM' && quizState.currentQuestionIndex > 0) {
      setQuizState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }));
      setCurrentAnalysis(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const finishQuiz = () => {
    setQuizState(prev => {
      // Calculate Score for Exam
      let score = undefined;
      let endTime = undefined;
      let correctCount = undefined;

      if (gameMode === 'EXAM') {
        endTime = Date.now();
        let c = 0;
        questions.forEach(q => {
          if (prev.userAnswers[q.id] === q.correctAnswerIndex) {
            c++;
          }
        });
        correctCount = c;
        // Score out of 100
        score = Math.round((c / questions.length) * 100);
      }

      return {
        ...prev,
        isFinished: true,
        endTime,
        score,
        correctCount
      };
    });
  };

  const handleRestart = (newSubject?: Subject) => {
    // If just changing subject in header during practice, restart practice
    // If coming from Results, go to Welcome Screen
    if (quizState.isFinished) {
      setAppMode('WELCOME');
      return;
    }

    const targetSubject = newSubject || subject;
    const rawQuestions = targetSubject === 'psychology' ? QUESTIONS_PSYCHOLOGY : QUESTIONS_PHILOSOPHY;

    // Default to Practice behavior if switched mid-game via tabs
    setQuestions(shuffleArray(rawQuestions));
    setQuizState({
      currentQuestionIndex: 0,
      userAnswers: {},
      isFinished: false,
      answerHistory: {},
      isReviewing: false,
      reviewQueue: [],
      mainProgressIndex: 0
    });
    setCurrentAnalysis(null);
  };

  const currentQuestion = questions[quizState.currentQuestionIndex];

  // Progress Calculation
  const displayedProgressIndex = quizState.isReviewing
    ? quizState.mainProgressIndex
    : quizState.currentQuestionIndex;

  const progress = questions.length > 0 ? ((displayedProgressIndex + 1) / questions.length) * 100 : 0;
  const isChecked = currentAnalysis !== null;
  const hasAnswered = quizState.userAnswers[currentQuestion?.id] !== undefined;

  const stats = {
    passed: Object.keys(quizState.answerHistory).length,
    correct: Object.values(quizState.answerHistory).filter(Boolean).length,
    incorrect: Object.values(quizState.answerHistory).filter((v) => !v).length,
    remaining: questions.length - Object.keys(quizState.answerHistory).length,
  };

  if (appMode === 'WELCOME') {
    return <WelcomeScreen onStart={handleStartQuiz} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans selection:bg-brand-100 selection:text-brand-900">
      <ApiKeyModal
        isOpen={showKeyModal}
        onClose={() => setShowKeyModal(false)}
        onSave={handleApiKeySave}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-brand-600 text-white p-1.5 rounded-lg">
                <GraduationCap size={24} />
              </div>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-700 to-brand-500 hidden sm:block">
                Wayground
              </h1>
            </div>

            {/* Subject Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button
                onClick={() => setSubject('philosophy')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${subject === 'philosophy'
                  ? 'bg-white text-brand-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <BookOpen size={16} />
                <span className="hidden xs:inline">Philosophy</span>
              </button>
              <button
                onClick={() => setSubject('psychology')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${subject === 'psychology'
                  ? 'bg-white text-purple-700 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
                  }`}
              >
                <Brain size={16} />
                <span className="hidden xs:inline">Psychology</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Home button - only in Practice Mode */}
            {gameMode === 'PRACTICE' && !quizState.isFinished && (
              <button
                onClick={() => setAppMode('WELCOME')}
                className="p-2 rounded-full text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                title="Return to Home"
              >
                <Home size={20} />
              </button>
            )}

            <button
              onClick={() => setShowKeyModal(true)}
              className={`p-2 rounded-full transition-colors ${apiKey ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'}`}
              title="Configure API Key"
            >
              <Settings size={20} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {!quizState.isFinished && (
          <div className="h-1 w-full bg-gray-100 relative">
            <div
              className={`h-full transition-all duration-500 ease-out ${subject === 'psychology' ? 'bg-purple-600' : 'bg-brand-500'}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 pb-32">
        {!quizState.isFinished ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-gray-500">
                {gameMode === 'EXAM' ? (
                  <span className="flex items-center gap-2 text-brand-600 font-bold">
                    Question {quizState.currentQuestionIndex + 1} of {questions.length}
                  </span>
                ) : (
                  quizState.isReviewing ? (
                    <span className="flex items-center gap-2 text-orange-600 font-bold">
                      <RotateCcw size={16} />
                      Reviewing Mistakes ({quizState.reviewQueue.indexOf(quizState.currentQuestionIndex) + 1}/{quizState.reviewQueue.length})
                    </span>
                  ) : (
                    `Question ${quizState.currentQuestionIndex + 1} of ${questions.length}`
                  )
                )}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-medium ${gameMode === 'EXAM' ? 'bg-red-100 text-red-700' :
                quizState.isReviewing ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                }`}>
                {gameMode === 'EXAM' ? 'Exam Mode' : (quizState.isReviewing ? 'Review Mode' : 'Practice Mode')}
              </span>
            </div>

            {currentQuestion ? (
              <QuestionCard
                question={currentQuestion}
                selectedOptionIndex={quizState.userAnswers[currentQuestion.id]}
                onSelectOption={handleSelectOption}
                aiAnalysis={currentAnalysis}
                isAnalyzing={isAnalyzing}
                onRequestAnalysis={handleRequestAnalysis}
                hasApiKey={!!apiKey}
                isExamMode={gameMode === 'EXAM'}
              />
            ) : (
              <div className="text-center py-20 text-gray-400">Loading questions...</div>
            )}

            <div className="flex justify-between pt-4">
              {/* Show Previous button in Exam Mode */}
              {gameMode === 'EXAM' && (
                <button
                  onClick={handlePrevious}
                  disabled={quizState.currentQuestionIndex === 0}
                  className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${quizState.currentQuestionIndex === 0 ? 'bg-gray-300 cursor-not-allowed' :
                    subject === 'psychology' ? 'bg-purple-900 hover:bg-purple-950' : 'bg-brand-900 hover:bg-brand-950'
                    }`}
                >
                  <ArrowLeft size={18} />
                  Previous
                </button>
              )}

              {/* Show Next button logic depends on Mode */}
              {gameMode === 'EXAM' ? (
                <button
                  onClick={handleNext}
                  disabled={!hasAnswered}
                  className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all ${!hasAnswered ? 'bg-gray-300 cursor-not-allowed' :
                    subject === 'psychology' ? 'bg-purple-900 hover:bg-purple-950' : 'bg-brand-900 hover:bg-brand-950'
                    }`}
                >
                  {quizState.currentQuestionIndex === questions.length - 1 ? 'Finish Exam' : 'Next Question'}
                  <ArrowRight size={18} />
                </button>
              ) : (
                !isChecked ? (
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-2 mr-1">Please check your answer to proceed</p>
                  </div>
                ) : (
                  <button
                    onClick={handleNext}
                    className={`flex items-center gap-2 px-8 py-3 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 active:translate-y-0 animate-in fade-in slide-in-from-bottom-2 ${subject === 'psychology' ? 'bg-purple-900 hover:bg-purple-950' : 'bg-gray-900 hover:bg-black'}`}
                  >
                    {quizState.isReviewing && quizState.reviewQueue.length === 1 ? 'Finish Review' : 'Next Question'}
                    <ArrowRight size={18} />
                  </button>
                )
              )}
            </div>
          </div>
        ) : (
          <QuizResults
            state={quizState}
            totalQuestions={questions.length}
            onRestart={() => handleRestart()}
            gameMode={gameMode}
          />
        )}
      </main>

      {gameMode === 'PRACTICE' && <StatsSidebar stats={stats} />}
      {/* Persistent Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-3 text-center text-xs text-gray-400">
        <p>© 2024 Wayground Quiz. Powered by Gemini.</p>
      </footer>
    </div>
  );
};

export default App;
