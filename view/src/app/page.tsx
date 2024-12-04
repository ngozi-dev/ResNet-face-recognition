import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, Users, ShieldCheck, BookOpen } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen font-manrope bg-gradient-to-b from-blue-100 to-white">
      <header className="container mx-auto px-4 py-8">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">ExamAuth</div>
          <div className="space-x-4">
            <Button variant="ghost" asChild>
              <Link to="auth/login">Login</Link>
            </Button>
            <Button asChild>
              <Link to="register">Register</Link>
            </Button>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-16">
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Secure Exam Authentication</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Streamline your examination process with advanced facial recognition technology
          </p>
          <div className="flex justify-center space-x-4">
            <Button size="lg" asChild>
              <Link to="/register">Get Started</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="#features">Learn More</Link>
            </Button>
          </div>
        </section>

        <section id="features" className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {[
            { title: 'Facial Recognition', description: 'Secure student verification', icon: CheckCircle },
            { title: 'Easy Registration', description: 'Quick and simple sign-up process', icon: Users },
            { title: 'Admin Dashboard', description: 'Comprehensive management tools', icon: ShieldCheck },
            { title: 'Multiple Departments', description: 'Support for various courses', icon: BookOpen },
          ].map((feature, index) => (
            <Card key={index}>
              <CardHeader>
                <feature.icon className="w-10 h-10 text-blue-500 mb-2" />
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </section>

        <section className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Register', description: 'Create your account and verify your identity' },
              { step: '2', title: 'Authenticate', description: 'Use facial recognition to confirm your presence' },
              { step: '3', title: 'Take Exam', description: 'Access your exam securely and with confidence' },
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-xl font-bold mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of students and institutions using ExamAuth
          </p>
          <Button size="lg" asChild>
            <Link to="/register">Register Now</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>&copy; 2023 ExamAuth. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

