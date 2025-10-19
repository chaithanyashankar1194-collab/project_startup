import { callAIProxy } from './aiService'
import { MindMap, MindMapNode } from './types'

interface RawMindMapNode {
  id: string
  label: string
  summary: string
  children: RawMindMapNode[]
}

export class MindMapService {
  static async generateMindMapFromText(content: string, title: string): Promise<MindMap> {
    const prompt = `
      Analyze this educational content and create a hierarchical mind map structure.
      Generate a comprehensive mind map with the following requirements:

      1. Create a hierarchical structure with a main topic and subtopics
      2. Each node should have:
         - A concise label (2-5 words)
         - A brief summary (1-2 sentences)
      3. Maximum 3 levels deep
      4. Main topic should branch into 3-5 key concepts
      5. Each key concept can have 2-4 subtopics
      6. Include relationships between connected concepts

      Content to analyze:
      Title: ${title}
      ${content.substring(0, 4000)} // Limit content for API

      Format the response as a JSON object with this structure:
      {
        "nodes": [
          {
            "id": "1",
            "label": "Main Topic",
            "summary": "Brief summary of the topic",
            "children": [
              {
                "id": "2",
                "label": "Subtopic",
                "summary": "Brief summary",
                "children": []
              }
            ]
          }
        ]
      }
    `

    try {
      const response = await callAIProxy(prompt)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid AI response format')

      const rawData = JSON.parse(jsonMatch[0])
      return convertRawToMindMap(rawData.nodes[0], title)
    } catch (error) {
      console.error('Failed to generate mind map:', error)
      throw new Error('Failed to generate mind map')
    }
  }

  static async generateRevisionClusters(mindMap: MindMap): Promise<MindMap> {
    // Create a study-focused version of the mind map
    const prompt = `
      Given this mind map structure, create a revision-focused version that:
      1. Groups concepts by complexity level
      2. Adds practice questions to each node
      3. Suggests study order
      4. Highlights key exam concepts

      Mind map structure:
      ${JSON.stringify(mindMap)}

      Format the response as a similar JSON structure with added study metadata.
    `

    try {
      const response = await callAIProxy(prompt)
      const jsonMatch = response.match(/\{[\s\S]*\}/)
      if (!jsonMatch) throw new Error('Invalid AI response format')

      const enhancedMap = JSON.parse(jsonMatch[0])
      return {
        ...mindMap,
        ...enhancedMap,
        title: mindMap.title + ' (Exam Mode)'
      }
    } catch (error) {
      console.error('Failed to generate revision clusters:', error)
      throw new Error('Failed to generate revision clusters')
    }
  }
}

// Helper function to convert the raw AI response to our MindMap format
function convertRawToMindMap(rootNode: RawMindMapNode, title: string): MindMap {
  const nodes: MindMapNode[] = []
  const connections: { from: string; to: string; strength: number }[] = []
  
  function processNode(node: RawMindMapNode, level: number, parentId?: string) {
    const currentNode: MindMapNode = {
      id: node.id,
      label: node.label,
      summary: node.summary, // Added summary field
      level,
      children: node.children.map(child => child.id),
      connections: []
    }
    
    if (parentId) {
      connections.push({
        from: parentId,
        to: node.id,
        strength: 1 - (level * 0.2) // Decrease connection strength with depth
      })
      currentNode.connections.push(parentId)
    }
    
    nodes.push(currentNode)
    
    node.children.forEach(child => {
      processNode(child, level + 1, node.id)
    })
  }
  
  processNode(rootNode, 0)
  
  return {
    title,
    nodes,
    connections
  }
}