import { motion } from 'framer-motion'
import { 
  Brain, 
  Map, 
  FileText, 
  Zap, 
  Target, 
  Clock,
  Users,
  BookOpen,
  Lightbulb,
  BarChart3,
  Smartphone,
  Globe
} from 'lucide-react'

const Features = () => {
  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your documents to extract key concepts, relationships, and learning patterns.",
      color: "from-primary-500 to-primary-600"
    },
    {
      icon: Map,
      title: "Interactive Mind Maps",
      description: "Visualize complex information through dynamic, interactive mind maps that adapt to your learning style.",
      color: "from-secondary-500 to-secondary-600"
    },
    {
      icon: FileText,
      title: "Smart Summaries",
      description: "Get concise, comprehensive summaries tailored to your academic level and learning objectives.",
      color: "from-accent-500 to-accent-600"
    },
    {
      icon: Zap,
      title: "Instant Processing",
      description: "Upload and process documents in seconds with our lightning-fast AI processing engine.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Target,
      title: "Personalized Learning",
      description: "Adaptive learning paths that adjust to your progress and focus on areas that need improvement.",
      color: "from-pink-500 to-rose-500"
    },
    {
      icon: Clock,
      title: "Time-Efficient Study",
      description: "Reduce study time by up to 70% with our intelligent content organization and prioritization.",
      color: "from-indigo-500 to-purple-500"
    }
  ]

  const studyTools = [
    {
      icon: BookOpen,
      title: "Flashcards",
      description: "Auto-generated flashcards with spaced repetition for optimal retention"
    },
    {
      icon: BarChart3,
      title: "Progress Tracking",
      description: "Monitor your learning progress with detailed analytics and insights"
    },
    {
      icon: Smartphone,
      title: "Mobile Learning",
      description: "Study anywhere with our responsive mobile-optimized interface"
    },
    {
      icon: Globe,
      title: "Collaborative Study",
      description: "Share study materials and collaborate with classmates and study groups"
    }
  ]

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="gradient-text">Modern Students</span>
          </h2>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Everything you need to transform complex information into mastery, 
            designed specifically for the modern student experience.
          </p>
        </motion.div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-8 group hover:scale-105 transition-all duration-300"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Study Tools Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-3xl p-12"
        >
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Study Toolkit
            </h3>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Everything you need for effective studying, all in one place
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {studyTools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center group hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors">
                  <tool.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h4 className="font-semibold mb-2">{tool.title}</h4>
                <p className="text-sm text-slate-600">{tool.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-3xl p-12 text-white">
            <h3 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of students who are already mastering their studies with Spectra.ai
            </p>
            <button className="bg-white text-primary-600 font-semibold py-4 px-8 rounded-xl hover:bg-slate-50 transition-colors duration-300 text-lg">
              Start Your Free Trial
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Features






