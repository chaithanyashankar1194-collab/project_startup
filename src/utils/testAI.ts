import { GoogleGenerativeAI } from '@google/generative-ai'

export const testGeminiConnection = async () => {
  try {
    const genAI = new GoogleGenerativeAI('AIzaSyBFBI1pL8Gy-WVKWFoZk-oW5Xw8m_iZr88')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const result = await model.generateContent('Hello, can you respond with "AI is working!"?')
    const response = await result.response
    const text = response.text()
    
    console.log('✅ Gemini AI is working! Response:', text)
    return { success: true, response: text }
  } catch (error) {
    console.error('❌ Gemini AI connection failed:', error)
    return { success: false, error: error.message }
  }
}


