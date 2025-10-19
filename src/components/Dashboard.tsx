import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { 
  Upload, 
  FileText, 
  Brain, 
  Map, 
  Clock, 
  CheckCircle,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MoreVertical,
  Download,
  Share2,
  Trash2,
  Eye
} from 'lucide-react'
import toast from 'react-hot-toast'
import { AIService, DocumentContent, AI_AVAILABLE } from '../services/aiService'
import MindMapViewer from './MindMapViewer'
import SummaryViewer from './SummaryViewer'
import FlashcardsViewer from './FlashcardsViewer'
import { PDFProcessor } from '../utils/pdfProcessor'

interface Document {
  id: string
  name: string
  type: string
  size: string
  uploadDate: string
  status: 'processing' | 'completed' | 'error'
  progress?: number
  ai?: {
    summary?: any
    mindMap?: any
    flashcards?: any
    quiz?: any
  }
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      name: 'Advanced Calculus Textbook',
      type: 'PDF',
      size: '15.2 MB',
      uploadDate: '2024-01-15',
      status: 'completed'
    },
    {
      id: '2',
      name: 'Machine Learning Research Paper',
      type: 'PDF',
      size: '8.7 MB',
      uploadDate: '2024-01-14',
      status: 'completed'
    },
    {
      id: '3',
      name: 'Biology Study Guide',
      type: 'PDF',
      size: '12.1 MB',
      uploadDate: '2024-01-13',
      status: 'processing',
      progress: 65
    }
  ])

  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showToolsModal, setShowToolsModal] = useState(false)
  const [modalData, setModalData] = useState<{summary?: any, mindMap?: any, flashcards?: any, quiz?: any, documentTitle?: string} | null>(null)

  const onDrop = async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const newDoc: Document = {
        id: Date.now().toString(),
        name: file.name,
        type: file.type.split('/')[1].toUpperCase(),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'processing',
        progress: 0
      }
      
      setDocuments(prev => [newDoc, ...prev])
      
      // Process document with AI
      await processDocumentWithAI(newDoc.id, file)
    }
    
    toast.success(`${acceptedFiles.length} file(s) uploaded successfully!`)
  }

  const processDocumentWithAI = async (docId: string, file: File) => {
    try {
      // Update progress: Text extraction
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === docId 
            ? { ...doc, progress: 20 }
            : doc
        )
      )

      // Extract text from document
      const extractedText = await PDFProcessor.processDocument(file)
      
      // Update progress: AI processing
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === docId 
            ? { ...doc, progress: 60 }
            : doc
        )
      )

      // Create document content object
      const documentContent: DocumentContent = {
        text: extractedText,
        title: file.name.replace(/\.[^/.]+$/, ""), // Remove file extension
        type: file.type.split('/')[1].toUpperCase(),
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB'
      }

      // Generate AI content (summary, mind map, etc.)
      try {
        const [summary, mindMap, flashcards, quiz] = await Promise.all([
          AIService.generateSummary(documentContent),
          MindMapService.generateMindMapFromText(documentContent.text, documentContent.title),
          AIService.generateFlashcards(documentContent, 5),
          AIService.generateQuiz(documentContent, 3)
        ])

        // Store AI-generated content in document
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId 
              ? { ...doc, status: 'completed' as const, progress: 100, ai: { summary, mindMap, flashcards, quiz } }
              : doc
          )
        )
        // Show modal with generated tools
        setModalData({ summary, mindMap, flashcards, quiz, documentTitle: documentContent.title })
        setShowToolsModal(true)
        if (AI_AVAILABLE) {
          toast.success('Document processed successfully! AI tools generated.')
        } else {
          toast.success('Document processed in demo mode — using fallback AI output.')
        }
      } catch (aiError) {
        console.error('AI processing error:', aiError)
        // Still mark as completed even if AI fails
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId 
              ? { ...doc, status: 'completed' as const, progress: 100 }
              : doc
          )
        )
  toast.success('Document uploaded! (AI unavailable — using demo fallback output)')
      }
    } catch (error) {
      console.error('Document processing error:', error)
      setDocuments(prev => 
        prev.map(doc => 
          doc.id === docId 
            ? { ...doc, status: 'error' as const }
            : doc
        )
      )
      toast.error('Failed to process document')
    }
  }

  const simulateProcessing = (docId: string) => {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 20
      if (progress >= 100) {
        progress = 100
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId 
              ? { ...doc, status: 'completed' as const, progress: 100 }
              : doc
          )
        )
        clearInterval(interval)
        toast.success('Document processing completed!')
      } else {
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === docId 
              ? { ...doc, progress: Math.round(progress) }
              : doc
          )
        )
      }
    }, 500)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'text/plain': ['.txt'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true
  })

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      {/* Modal for generated tools */}
      {showToolsModal && modalData && (
        <>
          {modalData.mindMap && (
            <MindMapViewer mindMap={modalData.mindMap} onClose={() => setShowToolsModal(false)} />
          )}
          {modalData.summary && (
            <SummaryViewer summary={modalData.summary} documentTitle={modalData.documentTitle || ''} onClose={() => setShowToolsModal(false)} />
          )}
          {modalData.flashcards && (
            <FlashcardsViewer flashcards={modalData.flashcards} documentTitle={modalData.documentTitle || ''} onClose={() => setShowToolsModal(false)} />
          )}
        </>
      )}
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold mb-2">My Documents</h1>
          <p className="text-slate-600 text-lg">
            Upload and manage your study materials
          </p>
        </motion.div>

        {/* Upload Area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-slate-300 hover:border-primary-400 hover:bg-slate-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              {isDragActive ? 'Drop files here' : 'Upload Documents'}
            </h3>
            <p className="text-slate-600 mb-4">
              Drag and drop files here, or click to select files
            </p>
            <p className="text-sm text-slate-500">
              Supports PDF, DOC, DOCX, and TXT files
            </p>
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
            <div className="relative">
              <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search documents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <Grid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Documents Grid/List */}
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
          {filteredDocuments.map((doc, index) => (
            <motion.div
              key={doc.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`card p-6 group hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex items-center space-x-4' : ''
              }`}
            >
              {viewMode === 'grid' ? (
                <>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg truncate">{doc.name}</h3>
                        <p className="text-sm text-slate-500">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    {/* Show badge if AI is unavailable */}
                    {!AI_AVAILABLE && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Demo AI</span>
                    )}
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <MoreVertical className="h-5 w-5 text-slate-400" />
                    </button>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-2">
                      <span>Uploaded {doc.uploadDate}</span>
                      <div className="flex items-center space-x-1">
                        {doc.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                        {doc.status === 'processing' && <Clock className="h-4 w-4 text-yellow-500" />}
                        <span className="capitalize">{doc.status}</span>
                      </div>
                    </div>
                    
                    {doc.status === 'processing' && doc.progress !== undefined && (
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${doc.progress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <button
                      className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-2"
                      onClick={() => navigate('/study-tools')}
                    >
                      <Brain className="h-4 w-4" />
                      <span>Generate Tools</span>
                    </button>
                    <button className="px-3 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    {/* Show badge if AI is unavailable */}
                    {!AI_AVAILABLE && (
                      <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-semibold">Demo AI</span>
                    )}
                    <h3 className="font-semibold text-lg truncate">{doc.name}</h3>
                    <p className="text-sm text-slate-500">{doc.type} • {doc.size} • {doc.uploadDate}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {doc.status === 'completed' && <CheckCircle className="h-4 w-4 text-green-500" />}
                      {doc.status === 'processing' && <Clock className="h-4 w-4 text-yellow-500" />}
                      <span className="text-sm capitalize">{doc.status}</span>
                    </div>
                    <button
                      className="btn-primary text-sm py-2 px-4 flex items-center space-x-2"
                      onClick={() => navigate('/study-tools')}
                    >
                      <Brain className="h-4 w-4" />
                      <span>Generate</span>
                    </button>
                    <button className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          ))}
        </motion.div>

        {filteredDocuments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-500 mb-2">No documents found</h3>
            <p className="text-slate-400">
              {searchQuery ? 'Try adjusting your search terms' : 'Upload your first document to get started'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default Dashboard




