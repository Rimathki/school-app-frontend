"use client"

import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { GraduationCap, Users, BarChart3, Brain, Trophy, Gamepad2, Zap, BookOpen, PenTool } from "lucide-react"

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const Hero = () => {
  const router = useRouter()
  const tests = [
    { id: 1, title: "Math Quiz", description: "Test your algebra skills" },
    { id: 2, title: "Science Test", description: "Explore biology concepts" },
    { id: 3, title: "History Exam", description: "World War II knowledge check" },
  ]

  const items = [
    { id: 1, title: "Flashcards", icon: <BookOpen className="w-6 h-6" /> },
    { id: 2, title: "Practice Tests", icon: <PenTool className="w-6 h-6" /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-blue-50 to-cyan-50">
      <section className="px-4 pt-32 pb-16 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block text-purple-600">Learn Smarter, Play Harder!</span>
          </h1>
          <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-600">
            Revolutionize learning with AI & Gamification 
          </p>
          <div className="mt-8 space-x-4">
            <Button className="bg-blue-400 hover:bg-blue-500 px-5" onClick={() => router.push('/login')}>Demo</Button>
          </div>
        </motion.div>
      </section>

      <section className="py-16 bg-white">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Available Tests</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {tests.map((test) => (
              <motion.div
                key={test.id}
                className="p-6 bg-gradient-to-r from-purple-100 to-blue-100 rounded-2xl shadow-lg"
                {...fadeIn}
                transition={{ delay: test.id * 0.2 }}
              >
                <h3 className="text-xl font-semibold text-gray-900">{test.title}</h3>
                <p className="mt-2 text-gray-600">{test.description}</p>
                <Button className="mt-4 bg-purple-600 hover:bg-purple-700 text-white">Start Test</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Learning Tools</h2>
          <div className="grid gap-8 md:grid-cols-2">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="p-6 bg-white rounded-2xl shadow-lg flex items-center space-x-4"
                {...fadeIn}
                transition={{ delay: item.id * 0.2 }}
              >
                <div className="p-3 bg-blue-100 rounded-full">{item.icon}</div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                  <Button className="mt-2 bg-blue-600 hover:bg-blue-700 text-white">Explore</Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-100 via-blue-100 to-cyan-100">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <motion.div className="p-6 bg-white rounded-2xl shadow-xl" {...fadeIn} transition={{ delay: 0.2 }}>
              <div className="p-3 bg-purple-100 rounded-lg w-fit">
                <GraduationCap className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">For Students</h3>
              <p className="mt-2 text-gray-600">
                Say goodbye to boring study sessions! Take AI-generated quizzes and play interactive learning games.
              </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-2xl shadow-xl" {...fadeIn} transition={{ delay: 0.4 }}>
              <div className="p-3 bg-blue-100 rounded-lg w-fit">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">For Teachers</h3>
              <p className="mt-2 text-gray-600">
                Upload your textbooks, case study, and let our AI turn them into engaging quizzes & challenges in
                seconds.
              </p>
            </motion.div>

            <motion.div className="p-6 bg-white rounded-2xl shadow-xl" {...fadeIn} transition={{ delay: 0.6 }}>
              <div className="p-3 bg-cyan-100 rounded-lg w-fit">
                <BarChart3 className="w-6 h-6 text-cyan-600" />
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">For Admins</h3>
              <p className="mt-2 text-gray-600">
                Manage students, teachers, topics, and classes with ease. Use powerful analytics to drive better
                outcomes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold text-gray-900">Why You&apos;ll Love It?</h2>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Brain className="w-6 h-6" />,
                title: "AI-Generated Quizzes & Games",
                description: "Never create quizzes manually again!",
              },
              {
                icon: <Trophy className="w-6 h-6" />,
                title: "Gamified Learning",
                description: "Earn rewards, badges & XP as you progress.",
              },
              {
                icon: <Gamepad2 className="w-6 h-6" />,
                title: "Challenge Friends",
                description: "Compete in quiz battles & leaderboards.",
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: "Personalized Insights",
                description: "AI recommends topics based on students' weak areas.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="p-3 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg w-fit">{feature.icon}</div>
                <h3 className="mt-4 text-lg font-semibold text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <motion.div
            className="text-center text-white"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl font-bold">Join thousands of students & teachers transforming education today!</h2>
            <div className="mt-8">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 hover:text-purple-700">
                Start Learning & Playing Now!
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Hero

