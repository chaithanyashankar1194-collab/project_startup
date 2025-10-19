import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flashcard } from '../services/aiService'
import { 
  ChevronLeft, 
  ChevronRight, 
  RotateCcw, 
  Shuffle,
  Download,
  Share2,
  X,
  CheckCircle,
  XCircle,
  Star
} from 'lucide-react'
import toast from 'react-hot-toast'

interface FlashcardsViewerProps {
  flashcards: Flashcard[]
  documentTitle: string
  onClose: () => void
}

const FlashcardsViewer = ({ flashcards, documentTitle, onClose }: FlashcardsViewerProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [studyMode, setStudyMode] = useState(false)
  const [correctAnswers, setCorrectAnswers] = useState<Set<string>>(new Set())
  const [incorrectAnswers, setIncorrectAnswers] = useState<Set<string>>(new Set())

  const currentCard = flashcards[currentIndex]
  const progress = ((currentIndex + 1) / flashcards.length) * 100

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(prev => prev + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
      setIsFlipped(false)
    }
  }

  const shuffleCards = () => {
    const shuffled = [...flashcards].sort(() => Math.random() - 0.5)
    setCurrentIndex(0)
    setIsFlipped(false)
    toast.success('Cards shuffled!')
  }

  const markCorrect = () => {
    setCorrectAnswers(prev => new Set([...prev, currentCard.id]))
    setIncorrectAnswers(prev => {
      const newSet = new Set(prev)
      newSet.delete(currentCard.id)
      return newSet
    })
    toast.success('Marked as correct!')
  }

  const markIncorrect = () => {
    setIncorrectAnswers(prev => new Set([...prev, currentCard.id]))
    setCorrectAnswers(prev => {
      const newSet = new Set(prev)
      newSet.delete(currentCard.id)
      return newSet
    })
    toast.error('Marked as incorrect')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-cyan-100 text-cyan-800'
    ]
    const hash = category.split('').reduce((a, b) => a + b.charCodeAt(0), 0)
    return colors[hash % colors.length]
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{documentTitle}</h2>
            <p className="text-slate-600">Flashcards Study Session</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setStudyMode(!studyMode)}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                studyMode 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {studyMode ? 'Study Mode' : 'Review Mode'}
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Download className="h-5 w-5" />
            </button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Share2 className="h-5 w-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-600">
              Card {currentIndex + 1} of {flashcards.length}
            </span>
            <span className="text-sm text-slate-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div 
              className="bg-primary-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Card Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl"
            >
              {/* Card */}
              <div className="relative">
                <motion.div
                  className="bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8 shadow-lg border border-slate-200 min-h-[300px] flex flex-col justify-center"
                  onClick={() => setIsFlipped(!isFlipped)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(currentCard.difficulty)}`}>
                        {currentCard.difficulty}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(currentCard.category)}`}>
                        {currentCard.category}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      {correctAnswers.has(currentCard.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                      {incorrectAnswers.has(currentCard.id) && (
                        <XCircle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-slate-600 mb-4">
                      {isFlipped ? 'Answer' : 'Question'}
                    </h3>
                    <p className="text-xl text-slate-800 leading-relaxed">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  {/* Flip Indicator */}
                  <div className="absolute bottom-4 right-4 text-slate-400 text-sm">
                    Click to {isFlipped ? 'show question' : 'reveal answer'}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={prevCard}
                disabled={currentIndex === 0}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={shuffleCards}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Shuffle cards"
              >
                <Shuffle className="h-5 w-5" />
              </button>
              <button
                onClick={() => {
                  setCurrentIndex(0)
                  setIsFlipped(false)
                }}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                title="Reset to first card"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            {studyMode && isFlipped && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={markIncorrect}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <XCircle className="h-4 w-4" />
                  <span>Incorrect</span>
                </button>
                <button
                  onClick={markCorrect}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium flex items-center space-x-1"
                >
                  <CheckCircle className="h-4 w-4" />
                  <span>Correct</span>
                </button>
              </div>
            )}

            <div className="flex items-center space-x-2">
              <button
                onClick={nextCard}
                disabled={currentIndex === flashcards.length - 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Study Stats */}
          {studyMode && (
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-slate-600">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>{correctAnswers.size} Correct</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>{incorrectAnswers.size} Incorrect</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500" />
                <span>{Math.round(((correctAnswers.size) / (correctAnswers.size + incorrectAnswers.size)) * 100) || 0}% Accuracy</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default FlashcardsViewer


