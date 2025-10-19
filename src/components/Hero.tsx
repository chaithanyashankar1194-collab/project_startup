import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Upload, 
  Brain, 
  Map, 
  FileText, 
  ArrowRight,
  Sparkles,
  BookOpen,
  Zap
} from 'lucide-react'

const Hero = () => {
  return (
    <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              Transform{' '}
              <span className="gradient-text">Information</span>
              <br />
              into{' '}
              <span className="gradient-text">Mastery</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Convert complex documents into interactive study tools with AI-powered mind maps, 
              summaries, and personalized learning experiences.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
          >
            <Link
              to="/dashboard"
              className="btn-primary text-lg px-8 py-4 flex items-center space-x-2 group"
            >
              <Upload className="h-5 w-5" />
              <span>Start Learning Now</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="btn-secondary text-lg px-8 py-4 flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Watch Demo</span>
            </button>
          </motion.div>

          {/* Feature Cards */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
          >
            {/* Upload Document */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Documents</h3>
              <p className="text-slate-600">
                Upload PDFs, textbooks, research papers, and any educational content
              </p>
            </div>

            {/* AI Processing */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-secondary-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-secondary-200 transition-colors">
                <Brain className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Processing</h3>
              <p className="text-slate-600">
                Our AI analyzes and understands the content to create personalized study tools
              </p>
            </div>

            {/* Interactive Tools */}
            <div className="card p-8 text-center group hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-accent-100 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-accent-200 transition-colors">
                <Map className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Study Tools</h3>
              <p className="text-slate-600">
                Get mind maps, summaries, flashcards, and interactive quizzes
              </p>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">10K+</div>
              <div className="text-slate-600">Students</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">50K+</div>
              <div className="text-slate-600">Documents Processed</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">95%</div>
              <div className="text-slate-600">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">24/7</div>
              <div className="text-slate-600">AI Support</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Hero






