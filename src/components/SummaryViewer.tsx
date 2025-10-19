import { motion } from 'framer-motion'
import { AISummary } from '../services/aiService'
import { 
  Download, 
  Share2, 
  Copy, 
  BookOpen, 
  Lightbulb,
  Target,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface SummaryViewerProps {
  summary: AISummary
  documentTitle: string
  onClose: () => void
}

const SummaryViewer = ({ summary, documentTitle, onClose }: SummaryViewerProps) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('Copied to clipboard!')
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
            <p className="text-slate-600">AI-Generated Summary</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => copyToClipboard(summary.summary)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Copy summary"
            >
              <Copy className="h-5 w-5" />
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Difficulty Badge */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-slate-600">Difficulty Level:</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(summary.difficulty)}`}>
              {summary.difficulty.charAt(0).toUpperCase() + summary.difficulty.slice(1)}
            </span>
          </div>

          {/* Summary */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-slate-900">Summary</h3>
            </div>
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                {summary.summary}
              </p>
            </div>
          </div>

          {/* Key Points */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-secondary-600" />
              <h3 className="text-lg font-semibold text-slate-900">Key Points</h3>
            </div>
            <div className="space-y-2">
              {summary.keyPoints.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg"
                >
                  <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-slate-700">{point}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Main Concepts */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Lightbulb className="h-5 w-5 text-accent-600" />
              <h3 className="text-lg font-semibold text-slate-900">Main Concepts</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.concepts.map((concept, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-3 py-1 bg-accent-100 text-accent-800 rounded-full text-sm font-medium"
                >
                  {concept}
                </motion.span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="border-t border-slate-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500">
              Generated by Spectra.ai AI • {new Date().toLocaleDateString()}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => copyToClipboard(summary.summary)}
                className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium"
              >
                Copy Summary
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium">
                Generate Study Plan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default SummaryViewer


