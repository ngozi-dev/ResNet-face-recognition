import SignInForm from '@/components/sign-in-form'

export default function SignIn() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Admin Sign In</h1>
        <SignInForm />
      </div>
    </div>
  )
}

