import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MindMap, MindMapNode } from '../services/types'
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download,
  Share2,
  Trash2,
  BookmarkPlus,
  GraduationCap,
  Save,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface MindMapViewerProps {
  mindMap: MindMap
  onClose: () => void
}

interface Position {
  x: number
  y: number
}

interface NodePosition {
  x: number
  y: number
}

const MindMapViewer = ({ mindMap, onClose }: MindMapViewerProps) => {
  const [zoom, setZoom] = useState(1)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState<Position | null>(null)
  const [examMode, setExamMode] = useState(false)
  const [studyNotes, setStudyNotes] = useState<Record<string, string>>({})
  const [savedNodes, setSavedNodes] = useState<Set<string>>(new Set())
  const containerRef = useRef<HTMLDivElement>(null)

  const handleSaveNode = (nodeId: string) => {
    setSavedNodes(prev => {
      const newSet = new Set(prev)
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId)
        toast.success('Removed from revision list')
      } else {
        newSet.add(nodeId)
        toast.success('Added to revision list')
      }
      return newSet
    })
  }

  const handleUpdateNotes = (nodeId: string, note: string) => {
    setStudyNotes(prev => ({
      ...prev,
      [nodeId]: note
    }))
  }

  const toggleExamMode = () => {
    setExamMode(prev => !prev)
    toast.success(examMode ? 'Exited exam mode' : 'Entered exam mode')
  }

  const handleSaveProgress = () => {
    const savedData = {
      mindMapId: mindMap.title,
      savedNodes: Array.from(savedNodes),
      studyNotes,
      lastModified: new Date().toISOString()
    }
    localStorage.setItem(`mindmap-${mindMap.title}`, JSON.stringify(savedData))
    toast.success('Progress saved successfully')
  }

  useEffect(() => {
    // Load saved progress
    const savedData = localStorage.getItem(`mindmap-${mindMap.title}`)
    if (savedData) {
      const { savedNodes: saved, studyNotes: notes } = JSON.parse(savedData)
      setSavedNodes(new Set(saved))
      setStudyNotes(notes)
    }
  }, [])

  useEffect(() => {
    // Center the mindmap initially
    if (containerRef.current) {
      const container = containerRef.current
      setPan({
        x: (container.clientWidth - 800) / 2, // 800 is an estimated width of the mind map
        y: (container.clientHeight - 600) / 2  // 600 is an estimated height
      })
    }
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && dragStart) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    setDragStart(null)
  }

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 3))
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5))
  const handleReset = () => {
    setZoom(1)
    setPan({ x: 0, y: 0 })
  }

  const getNodeColor = (level: number) => {
    const colors = [
      'bg-primary-500', // Root
      'bg-secondary-500', // Level 1
      'bg-accent-500', // Level 2
      'bg-yellow-500', // Level 3
      'bg-pink-500', // Level 4+
    ]
    return colors[Math.min(level, colors.length - 1)]
  }

  const getNodeSize = (level: number) => {
    const sizes = ['w-16 h-16', 'w-12 h-12', 'w-10 h-10', 'w-8 h-8', 'w-6 h-6']
    return sizes[Math.min(level, sizes.length - 1)]
  }

  const calculateNodePosition = (node: MindMapNode, nodes: MindMapNode[]): NodePosition => {
    // Cache for memoizing positions to avoid recalculation
    const positionCache = new Map<string, NodePosition>()

    const calculatePosition = (currentNode: MindMapNode): NodePosition => {
      // Check cache first
      const cached = positionCache.get(currentNode.id)
      if (cached) return cached

      if (currentNode.level === 0) {
        // Root node at center with offset for container size
        const position = { 
          x: window.innerWidth / 2 - 100, 
          y: window.innerHeight / 3 // Position root node higher to allow for tree growth
        }
        positionCache.set(currentNode.id, position)
        return position
      }

      const parentNode = nodes.find(n => n.children.includes(currentNode.id))
      if (!parentNode) {
        const defaultPos = { x: 0, y: 0 }
        positionCache.set(currentNode.id, defaultPos)
        return defaultPos
      }

      const parentPos = calculatePosition(parentNode)
      const siblings = parentNode.children
      const index = siblings.indexOf(currentNode.id)
      
      // Calculate angle based on position in siblings
      const angleStep = Math.PI / Math.max(siblings.length - 1, 1)
      const baseAngle = -Math.PI / 2 // Start from top (-90 degrees)
      const angle = baseAngle + angleStep * index
      
      // Radius increases with level but at a decreasing rate
      const radius = 150 * Math.sqrt(currentNode.level)
      
      const position = {
        x: parentPos.x + radius * Math.cos(angle),
        y: parentPos.y + radius * Math.sin(angle)
      }
      
      positionCache.set(currentNode.id, position)
      return position
    }

    return calculatePosition(node)
  }

  const renderNode = (node: MindMapNode, index: number) => {
    const position = calculateNodePosition(node, mindMap.nodes)
    const x = position.x
    const y = position.y
    const isSelected = selectedNode === node.id
    const isSaved = savedNodes.has(node.id)

    // Add exam mode styling
    const examModeClass = examMode && isSaved
      ? 'ring-2 ring-primary-500 ring-offset-2'
      : ''

    return (
      <motion.div
        key={node.id}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: x + pan.x,
          y: y + pan.y
        }}
        transition={{ 
          duration: 0.5, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 100
        }}
        className={`absolute ${getNodeSize(node.level)} ${getNodeColor(node.level)} ${examModeClass} 
          rounded-full flex items-center justify-center text-white font-semibold text-sm cursor-pointer 
          hover:scale-110 transition-all duration-200 shadow-lg
          ${isSelected ? 'ring-4 ring-primary-300 ring-offset-2' : ''}
          ${isSaved ? 'border-2 border-primary-300' : ''}`}
        onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <span className="text-center px-2 truncate">
          {node.label.length > 10 ? node.label.substring(0, 10) + '...' : node.label}
        </span>
      </motion.div>
    )
  }

  const renderConnections = () => {
    return mindMap.connections.map((connection, index) => {
      const fromNode = mindMap.nodes.find(n => n.id === connection.from)
      const toNode = mindMap.nodes.find(n => n.id === connection.to)
      
      if (!fromNode || !toNode) return null

      const fromIndex = mindMap.nodes.findIndex(n => n.id === connection.from)
      const toIndex = mindMap.nodes.findIndex(n => n.id === connection.to)
      
      const fromX = (fromIndex % 4) * 200 + 100 + 32 // Center of node
      const fromY = Math.floor(fromIndex / 4) * 150 + 100 + 32
      const toX = (toIndex % 4) * 200 + 100 + 32
      const toY = Math.floor(toIndex / 4) * 150 + 100 + 32

      return (
        <motion.line
          key={index}
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.6 }}
          transition={{ duration: 1, delay: index * 0.1 }}
          x1={fromX + pan.x}
          y1={fromY + pan.y}
          x2={toX + pan.x}
          y2={toY + pan.y}
          stroke="#6366f1"
          strokeWidth={connection.strength * 3}
          className="drop-shadow-sm"
        />
      )
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl h-[80vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{mindMap.title}</h2>
            <p className="text-slate-600">Interactive Mind Map</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2 mr-4">
              <button
                onClick={handleZoomOut}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Zoom out"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="text-sm font-medium min-w-[3rem] text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Zoom in"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={handleReset}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Reset view"
              >
                <RotateCcw className="h-5 w-5" />
              </button>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-2" />

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleExamMode}
                className={`px-3 py-1.5 rounded-lg transition-colors flex items-center space-x-2 ${
                  examMode 
                    ? 'bg-primary-100 text-primary-700' 
                    : 'hover:bg-slate-100'
                }`}
                title={examMode ? 'Exit exam mode' : 'Enter exam mode'}
              >
                <GraduationCap className="h-4 w-4" />
                <span className="text-sm font-medium">Exam Mode</span>
              </button>

              <button
                onClick={handleSaveProgress}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Save progress"
              >
                <Save className="h-5 w-5" />
              </button>

              <button
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Export mind map"
              >
                <Download className="h-5 w-5" />
              </button>

              <button
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                title="Share mind map"
              >
                <Share2 className="h-5 w-5" />
              </button>

              <button
                onClick={onClose}
                className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                title="Close mind map"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Mind Map Content */}
        <div 
          ref={containerRef}
          className="flex-1 relative overflow-hidden cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div
            className={`w-full h-full relative ${isDragging ? 'cursor-grabbing' : ''}`}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: 'center center'
            }}
          >
            {/* SVG for connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {renderConnections()}
            </svg>
            
            {/* Nodes */}
            {mindMap.nodes.map((node, index) => renderNode(node, index))}
          </div>
        </div>

        {/* Selected Node Info */}
          {selectedNode && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute bottom-4 left-4 right-4 bg-white rounded-lg shadow-lg p-4 border border-slate-200"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-slate-900">
                {mindMap.nodes.find(n => n.id === selectedNode)?.label}
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleSaveNode(selectedNode)}
                  className="text-blue-600 hover:text-blue-800"
                  title="Save for revision"
                >
                  <BookmarkPlus className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {/* Node Summary */}
              {mindMap.nodes.find(n => n.id === selectedNode)?.summary && (
                <div className="text-sm text-slate-600">
                  <p className="font-medium text-slate-700 mb-1">Summary:</p>
                  <p>{mindMap.nodes.find(n => n.id === selectedNode)?.summary}</p>
                </div>
              )}
              
              {/* Connected Nodes */}
              <div className="text-sm">
                <p className="font-medium text-slate-700 mb-1">Connected Concepts:</p>
                <div className="flex flex-wrap gap-2">
                  {mindMap.nodes
                    .filter(node => 
                      mindMap.connections.some(conn => 
                        (conn.from === selectedNode && conn.to === node.id) ||
                        (conn.to === selectedNode && conn.from === node.id)
                      )
                    )
                    .map(node => (
                      <button
                        key={node.id}
                        onClick={() => setSelectedNode(node.id)}
                        className="px-2 py-1 text-xs bg-slate-100 hover:bg-slate-200 rounded-full"
                      >
                        {node.label}
                      </button>
                    ))
                  }
                </div>
              </div>

              {/* Study Notes - only in exam mode */}
              {examMode && (
                <div className="text-sm border-t border-slate-200 pt-3 mt-3">
                  <p className="font-medium text-slate-700 mb-1">Study Notes:</p>
                  <textarea
                    value={studyNotes[selectedNode] || ''}
                    onChange={(e) => handleUpdateNotes(selectedNode, e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Add your study notes here..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </motion.div>
        )}        {/* Instructions */}
        <div className="absolute top-20 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 text-sm text-slate-600">
          <p>💡 Click nodes to explore • Use zoom controls • Drag to pan</p>
        </div>
      </motion.div>
    </div>
  )
}

export default MindMapViewer


