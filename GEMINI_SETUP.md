# Gemini API Setup Guide

## Getting Started with Gemini API

### 1. Get Your API Key

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Sign in with your Google account
3. Click "Get API Key" in the left sidebar
4. Create a new API key or use an existing one
5. Copy your API key

### 2. Configure Your Environment

1. Create a `.env` file in your project root:
```bash
cp env.example .env
```

2. Add your Gemini API key to the `.env` file:
```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

### 3. Test the Integration

1. Start your development server:
```bash
npm run dev
```

2. Upload a document in the Dashboard
3. Watch as the AI processes your document and generates:
   - Smart summaries
   - Interactive mind maps
   - Flashcards for study
   - Quiz questions

### 4. Features Available

#### Document Processing
- **PDF Upload**: Drag and drop PDF files
- **Text Extraction**: Automatic text extraction from documents
- **AI Analysis**: Content analysis using Gemini AI

#### AI-Generated Study Tools
- **Smart Summaries**: Key points and concepts extraction
- **Mind Maps**: Visual representation of document structure
- **Flashcards**: Interactive study cards with spaced repetition
- **Quizzes**: Multiple choice questions with explanations

#### Interactive Features
- **Real-time Processing**: Watch progress as documents are processed
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Study Modes**: Different learning modes for optimal retention

### 5. API Usage

The application uses the Gemini Pro model for:
- Text analysis and summarization
- Concept extraction and relationship mapping
- Question generation for quizzes
- Flashcard content creation

### 6. Troubleshooting

#### Common Issues

**API Key Not Working**
- Ensure your API key is correctly set in the `.env` file
- Check that the key has proper permissions
- Verify the key is not expired

**Rate Limiting**
- Gemini API has rate limits
- If you hit limits, wait a few minutes before trying again
- Consider implementing request queuing for production

**Document Processing Errors**
- Ensure documents are in supported formats (PDF, TXT, DOC, DOCX)
- Check file size limits
- Verify document is not corrupted

### 7. Production Considerations

For production deployment:

1. **Environment Variables**: Use your hosting platform's environment variable system
2. **API Key Security**: Never commit API keys to version control
3. **Rate Limiting**: Implement proper rate limiting and error handling
4. **Caching**: Consider caching AI responses for better performance
5. **Monitoring**: Set up monitoring for API usage and errors

### 8. Advanced Configuration

You can customize the AI behavior by modifying the prompts in `src/services/aiService.ts`:

- Adjust summary length and detail level
- Modify mind map complexity
- Change flashcard difficulty distribution
- Customize quiz question types

### 9. Support

If you encounter issues:
1. Check the browser console for error messages
2. Verify your API key is working
3. Ensure all dependencies are installed
4. Check the Gemini API status page

Happy studying with Spectra.ai! 🎓✨


