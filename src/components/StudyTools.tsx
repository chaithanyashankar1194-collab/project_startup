import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Map, 
  FileText, 
  Brain, 
  BookOpen, 
  Target, 
  Clock,
  CheckCircle,
  ArrowRight,
  RotateCcw,
  Star,
  Share2,
  Download,
  Maximize2,
  Minimize2,
  Play,
  Pause,
  Volume2
} from 'lucide-react'
import MindMapViewer from './MindMapViewer'
import SummaryViewer from './SummaryViewer'
import FlashcardsViewer from './FlashcardsViewer'
import { AISummary, MindMap, Flashcard, QuizQuestion } from '../services/aiService'

interface StudyTool {
  id: string
  type: 'mindmap' | 'summary' | 'flashcards' | 'quiz'
  title: string
  document: string
  progress: number
  lastAccessed: string
  status: 'completed' | 'in-progress' | 'new'
}

const StudyTools = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedMindMap, setSelectedMindMap] = useState<MindMap | null>(null)
  const [selectedSummary, setSelectedSummary] = useState<AISummary | null>(null)
  const [selectedFlashcards, setSelectedFlashcards] = useState<Flashcard[] | null>(null)
  const [selectedQuiz, setSelectedQuiz] = useState<QuizQuestion[] | null>(null)
  const [currentDocument, setCurrentDocument] = useState<string>('')

  const studyTools: StudyTool[] = [
    {
      id: '1',
      type: 'mindmap',
      title: 'Calculus Concepts Mind Map',
      document: 'Advanced Calculus Textbook',
      progress: 85,
      lastAccessed: '2 hours ago',
      status: 'in-progress'
    },
    {
      id: '2',
      type: 'summary',
      title: 'Machine Learning Summary',
      document: 'ML Research Paper',
      progress: 100,
      lastAccessed: '1 day ago',
      status: 'completed'
    },
    {
      id: '3',
      type: 'flashcards',
      title: 'Biology Flashcards',
      document: 'Biology Study Guide',
      progress: 60,
      lastAccessed: '3 hours ago',
      status: 'in-progress'
    },
    {
      id: '4',
      type: 'quiz',
      title: 'Physics Practice Quiz',
      document: 'Physics Textbook',
      progress: 0,
      lastAccessed: 'Never',
      status: 'new'
    }
  ]

  const getToolIcon = (type: string) => {
    switch (type) {
      case 'mindmap': return Map
      case 'summary': return FileText
      case 'flashcards': return BookOpen
      case 'quiz': return Target
      default: return Brain
    }
  }

  const getToolColor = (type: string) => {
    switch (type) {
      case 'mindmap': return 'from-blue-500 to-blue-600'
      case 'summary': return 'from-green-500 to-green-600'
      case 'flashcards': return 'from-purple-500 to-purple-600'
      case 'quiz': return 'from-orange-500 to-orange-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-100'
      case 'in-progress': return 'text-yellow-600 bg-yellow-100'
      case 'new': return 'text-blue-600 bg-blue-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const handleOpenTool = async (tool: StudyTool) => {
    setCurrentDocument(tool.document)
    
    // Simulate loading AI-generated content
    // In a real app, this would fetch from your backend
    switch (tool.type) {
      case 'mindmap':
        // Simulate mind map data
        const mockMindMap: MindMap = {
          title: tool.title,
          nodes: [
            {
              id: '1',
              label: tool.title,
              level: 0,
              children: ['2', '3', '4'],
              connections: []
            },
            {
              id: '2',
              label: 'Fundamentals',
              level: 1,
              children: ['5', '6'],
              connections: ['1']
            },
            {
              id: '3',
              label: 'Applications',
              level: 1,
              children: ['7', '8'],
              connections: ['1']
            },
            {
              id: '4',
              label: 'Advanced Topics',
              level: 1,
              children: ['9', '10'],
              connections: ['1']
            },
            {
              id: '5',
              label: 'Basic Principles',
              level: 2,
              children: [],
              connections: ['2']
            },
            {
              id: '6',
              label: 'Core Concepts',
              level: 2,
              children: ['11', '12'],
              connections: ['2']
            },
            {
              id: '7',
              label: 'Real-world Usage',
              level: 2,
              children: [],
              connections: ['3']
            },
            {
              id: '8',
              label: 'Case Studies',
              level: 2,
              children: [],
              connections: ['3']
            },
            {
              id: '9',
              label: 'Current Research',
              level: 2,
              children: [],
              connections: ['4']
            },
            {
              id: '10',
              label: 'Future Directions',
              level: 2,
              children: [],
              connections: ['4']
            },
            {
              id: '11',
              label: 'Theory',
              level: 3,
              children: [],
              connections: ['6']
            },
            {
              id: '12',
              label: 'Practice',
              level: 3,
              children: [],
              connections: ['6']
            }
          ],
          connections: [
            { from: '1', to: '2', strength: 0.9 },
            { from: '1', to: '3', strength: 0.8 },
            { from: '1', to: '4', strength: 0.7 },
            { from: '2', to: '5', strength: 0.8 },
            { from: '2', to: '6', strength: 0.8 },
            { from: '3', to: '7', strength: 0.7 },
            { from: '3', to: '8', strength: 0.6 },
            { from: '4', to: '9', strength: 0.7 },
            { from: '4', to: '10', strength: 0.6 },
            { from: '6', to: '11', strength: 0.6 },
            { from: '6', to: '12', strength: 0.6 }
          ]
        }
        setSelectedMindMap(mockMindMap)
        break
        
      case 'summary':
        // Simulate summary data
        const mockSummary: AISummary = {
          summary: `This document provides a comprehensive overview of ${tool.title}. It covers essential concepts and key principles that are fundamental to understanding the subject matter. The content is structured to facilitate learning and comprehension.`,
          keyPoints: [
            'Essential concepts and definitions',
            'Key principles and methodologies',
            'Practical applications and examples',
            'Important relationships and connections',
            'Critical insights and takeaways'
          ],
          concepts: ['Core Concepts', 'Key Principles', 'Applications'],
          difficulty: 'intermediate'
        }
        setSelectedSummary(mockSummary)
        break
        
      case 'flashcards':
        // Simulate flashcards data
        const mockFlashcards: Flashcard[] = [
          {
            id: '1',
            front: 'What is the main topic of this document?',
            back: tool.title,
            difficulty: 'easy',
            category: 'General'
          },
          {
            id: '2',
            front: 'What are the key concepts discussed?',
            back: 'The document covers important concepts related to the main topic.',
            difficulty: 'medium',
            category: 'Concepts'
          },
          {
            id: '3',
            front: 'What is the difficulty level?',
            back: 'This content is designed for intermediate learners.',
            difficulty: 'hard',
            category: 'Assessment'
          }
        ]
        setSelectedFlashcards(mockFlashcards)
        break
        
      case 'quiz':
        // Simulate quiz data
        const mockQuiz: QuizQuestion[] = [
          {
            id: '1',
            question: 'What is the main subject of this document?',
            options: [tool.title, 'General topic', 'Unknown subject', 'Multiple topics'],
            correctAnswer: 0,
            explanation: 'The main subject is clearly stated in the document title.',
            difficulty: 'easy'
          }
        ]
        setSelectedQuiz(mockQuiz)
        break
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">Study Tools</h1>
          <p className="text-slate-600 text-lg">
            Interactive learning tools generated from your documents
          </p>
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Map className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">12</div>
            <div className="text-sm text-slate-600">Mind Maps</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">8</div>
            <div className="text-sm text-slate-600">Summaries</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">156</div>
            <div className="text-sm text-slate-600">Flashcards</div>
          </div>
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-slate-900 mb-1">5</div>
            <div className="text-sm text-slate-600">Quizzes</div>
          </div>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
        >
          <div className="flex items-center space-x-4">
            <div className="flex space-x-2">
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-medium">
                All Tools
              </button>
              <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                Mind Maps
              </button>
              <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                Summaries
              </button>
              <button className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium transition-colors">
                Flashcards
              </button>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Maximize2 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Minimize2 className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Study Tools Grid/List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }
        >
          {studyTools.map((tool, index) => {
            const IconComponent = getToolIcon(tool.type)
            const colorClass = getToolColor(tool.type)
            const statusClass = getStatusColor(tool.status)

            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className={`card p-6 group hover:shadow-xl transition-all duration-300 cursor-pointer ${
                  viewMode === 'list' ? 'flex items-center space-x-4' : ''
                }`}
                onClick={() => setActiveTool(tool.id)}
              >
                {viewMode === 'grid' ? (
                  <>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{tool.title}</h3>
                          <p className="text-sm text-slate-500">{tool.document}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                        {tool.status.replace('-', ' ')}
                      </span>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                        <span>Progress</span>
                        <span>{tool.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`bg-gradient-to-r ${colorClass} h-2 rounded-full transition-all duration-300`}
                          style={{ width: `${tool.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 mb-4">
                      <span>Last accessed: {tool.lastAccessed}</span>
                    </div>

                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleOpenTool(tool)}
                        className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Open</span>
                      </button>
                      <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                        <Share2 className="h-4 w-4" />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className={`w-12 h-12 bg-gradient-to-r ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{tool.title}</h3>
                      <p className="text-sm text-slate-500">{tool.document}</p>
                      <div className="flex items-center space-x-4 mt-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-24 bg-slate-200 rounded-full h-1.5">
                            <div 
                              className={`bg-gradient-to-r ${colorClass} h-1.5 rounded-full`}
                              style={{ width: `${tool.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500">{tool.progress}%</span>
                        </div>
                        <span className="text-xs text-slate-500">Last accessed: {tool.lastAccessed}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                        {tool.status.replace('-', ' ')}
                      </span>
                      <button 
                        onClick={() => handleOpenTool(tool)}
                        className="btn-primary text-sm py-2 px-4 flex items-center space-x-2"
                      >
                        <Play className="h-4 w-4" />
                        <span>Open</span>
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )
          })}
        </motion.div>

        {/* Empty State */}
        {studyTools.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Brain className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No study tools yet</h3>
            <p className="text-slate-400 mb-6">
              Upload documents to generate interactive study tools
            </p>
            <button className="btn-primary">
              Upload Documents
            </button>
          </motion.div>
        )}
      </div>

      {/* Viewer Components */}
      {selectedMindMap && (
        <MindMapViewer
          mindMap={selectedMindMap}
          onClose={() => setSelectedMindMap(null)}
        />
      )}

      {selectedSummary && (
        <SummaryViewer
          summary={selectedSummary}
          documentTitle={currentDocument}
          onClose={() => setSelectedSummary(null)}
        />
      )}

      {selectedFlashcards && (
        <FlashcardsViewer
          flashcards={selectedFlashcards}
          documentTitle={currentDocument}
          onClose={() => setSelectedFlashcards(null)}
        />
      )}
    </div>
  )
}

export default StudyTools




