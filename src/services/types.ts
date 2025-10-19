// Export all types used across the application
export interface DocumentContent {
  text: string
  title: string
  type: string
  size: string
}

export interface AISummary {
  summary: string
  keyPoints: string[]
  concepts: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
}

export interface MindMapNode {
  id: string
  label: string
  summary?: string // Added summary field
  level: number
  children: string[]
  connections: string[]
}

export interface MindMap {
  title: string
  nodes: MindMapNode[]
  connections: { from: string; to: string; strength: number }[]
}

export interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
  category: string
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
}