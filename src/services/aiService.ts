// Use backend proxy for all AI calls
export const AI_AVAILABLE = true // Always true if backend is running

const AI_PROXY_URL = 'http://localhost:4000/ai'

async function callAIProxy(prompt: string): Promise<string> {
  try {
    const res = await fetch(AI_PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    })
    if (!res.ok) throw new Error('Proxy error: ' + res.status)
    const data = await res.json()
    return data.text || ''
  } catch (err) {
    console.warn('AI proxy call failed:', err)
    return ''
  }
}

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

export class AIService {
  static async generateSummary(content: DocumentContent): Promise<AISummary> {
    // If AI client isn't available, return a safe fallback immediately
    try {
      const prompt = `
        Analyze this educational document and create a comprehensive summary:
        
        Title: ${content.title}
        Type: ${content.type}
        
        Content:
        ${content.text.substring(0, 4000)} // Limit content for API
        
        Please provide:
        1. A concise summary (2-3 paragraphs)
        2. Key points (5-7 bullet points)
        3. Main concepts (3-5 concepts)
        4. Difficulty level (beginner/intermediate/advanced)
        
        Format as JSON:
        {
          "summary": "...",
          "keyPoints": ["...", "..."],
          "concepts": ["...", "..."],
          "difficulty": "beginner|intermediate|advanced"
        }
      `
      const text = await callAIProxy(prompt)
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.warn('Failed to parse JSON, using fallback')
      }
      return {
        summary: text.substring(0, 500),
        keyPoints: ['Key concepts extracted from document', 'Important information highlighted'],
        concepts: ['Main topic', 'Secondary concepts'],
        difficulty: 'intermediate'
      }
    } catch (error) {
      console.error('Error generating summary:', error)
      return {
        summary: `(AI unavailable) Summary for ${content.title}:\n\n${content.text.substring(0, 300)}`,
        keyPoints: ['Key concepts could not be generated (AI unavailable)'],
        concepts: ['AI unavailable'],
        difficulty: 'intermediate'
      }
    }
  }

  static async generateMindMap(content: DocumentContent): Promise<MindMap> {
    // If AI client isn't available, return a fallback mind map
    try {
      const prompt = `
        Create a mind map structure for this educational content:
        
        Title: ${content.title}
        Content: ${content.text.substring(0, 3000)}
        
        Generate a hierarchical mind map with:
        - Main topic as root
        - 3-5 main branches
        - 2-3 sub-branches per main branch
        - Key concepts and relationships
        
        Format as JSON:
        {
          "title": "Main Topic",
          "nodes": [
            {
              "id": "1",
              "label": "Main Topic",
              "level": 0,
              "children": ["2", "3"],
              "connections": []
            }
          ],
          "connections": [
            {"from": "1", "to": "2", "strength": 0.8}
          ]
        }
      `
      const text = await callAIProxy(prompt)
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.warn('Failed to parse mind map JSON, using fallback')
      }
      return {
        title: content.title,
        nodes: [
          { id: '1', label: content.title, level: 0, children: ['2', '3', '4'], connections: [] },
          { id: '2', label: 'Key Concept 1', level: 1, children: [], connections: ['1'] },
          { id: '3', label: 'Key Concept 2', level: 1, children: [], connections: ['1'] },
          { id: '4', label: 'Key Concept 3', level: 1, children: [], connections: ['1'] }
        ],
        connections: [
          { from: '1', to: '2', strength: 0.8 },
          { from: '1', to: '3', strength: 0.7 },
          { from: '1', to: '4', strength: 0.6 }
        ]
      }
    } catch (error) {
      console.error('Error generating mind map:', error)
      return {
        title: content.title,
        nodes: [
          { id: '1', label: content.title, level: 0, children: ['2', '3', '4'], connections: [] },
          { id: '2', label: 'Key Concept 1', level: 1, children: [], connections: ['1'] },
          { id: '3', label: 'Key Concept 2', level: 1, children: [], connections: ['1'] },
          { id: '4', label: 'Key Concept 3', level: 1, children: [], connections: ['1'] }
        ],
        connections: [
          { from: '1', to: '2', strength: 0.8 },
          { from: '1', to: '3', strength: 0.7 },
          { from: '1', to: '4', strength: 0.6 }
        ]
      }
    }
  }

  static async generateFlashcards(content: DocumentContent, count: number = 10): Promise<Flashcard[]> {
    // If AI client isn't available, return a small set of fallback flashcards
    try {
      const prompt = `
        Create ${count} educational flashcards from this content:
        
        Title: ${content.title}
        Content: ${content.text.substring(0, 3000)}
        
        Each flashcard should have:
        - Clear, concise question on front
        - Detailed answer on back
        - Appropriate difficulty level
        - Relevant category
        
        Format as JSON array:
        [
          {
            "id": "1",
            "front": "Question text",
            "back": "Answer text",
            "difficulty": "easy|medium|hard",
            "category": "Category name"
          }
        ]
      `
      const text = await callAIProxy(prompt)
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.warn('Failed to parse flashcards JSON, using fallback')
      }
      return [
        { id: '1', front: 'What is the main topic of this document?', back: content.title, difficulty: 'easy', category: 'General' },
        { id: '2', front: 'Name one key concept from the document.', back: 'Key concept (AI unavailable)', difficulty: 'medium', category: 'Concepts' }
      ]
    } catch (error) {
      console.error('Error generating flashcards:', error)
      return [
        { id: '1', front: 'What is the main topic of this document?', back: content.title, difficulty: 'easy', category: 'General' },
        { id: '2', front: 'Name one key concept from the document.', back: 'Key concept (AI unavailable)', difficulty: 'medium', category: 'Concepts' }
      ]
    }
  }

  static async generateQuiz(content: DocumentContent, questionCount: number = 5): Promise<QuizQuestion[]> {
    // If AI client isn't available, return a small fallback quiz
    try {
      const prompt = `
        Create ${questionCount} quiz questions from this educational content:
        
        Title: ${content.title}
        Content: ${content.text.substring(0, 3000)}
        
        Each question should have:
        - Clear, specific question
        - 4 multiple choice options
        - Correct answer (0-3 index)
        - Explanation for the answer
        - Appropriate difficulty level
        
        Format as JSON array:
        [
          {
            "id": "1",
            "question": "Question text?",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": 0,
            "explanation": "Why this answer is correct",
            "difficulty": "easy|medium|hard"
          }
        ]
      `
      const text = await callAIProxy(prompt)
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/)
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0])
        }
      } catch (e) {
        console.warn('Failed to parse quiz JSON, using fallback')
      }
      return [
        { id: '1', question: 'What is the main subject of this document?', options: [content.title, 'General topic', 'Unknown subject', 'Multiple topics'], correctAnswer: 0, explanation: 'The main subject is the document title.', difficulty: 'easy' }
      ]
    } catch (error) {
      console.error('Error generating quiz:', error)
      return [
        { id: '1', question: 'What is the main subject of this document?', options: [content.title, 'General topic', 'Unknown subject', 'Multiple topics'], correctAnswer: 0, explanation: 'The main subject is the document title.', difficulty: 'easy' }
      ]
    }
  }

  static async extractTextFromPDF(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
  reader.onload = async () => {
        try {
        // For demo purposes, we'll simulate PDF text extraction
          // In a real app, you'd use a proper PDF parsing library
        const text = `Extracted text from ${file.name}:

  This is a sample educational document that would normally be processed by a PDF parser. The content would include:

  1. Introduction to the main topic
  2. Key concepts and definitions
  3. Detailed explanations and examples
  4. Important formulas or equations
  5. Summary and conclusions

  The AI would analyze this content to generate study tools like mind maps, summaries, flashcards, and quizzes.`
          
          resolve(text)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file) // This is a simplified approach
    })
  }
}
