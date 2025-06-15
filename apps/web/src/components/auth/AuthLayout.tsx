import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  features?: {
    title: string;
    description: string;
  }[];
}

export default function AuthLayout({ children, title, subtitle, features }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Branding */}
      <div className="hidden lg:flex w-1/2 flex-col justify-center bg-gradient-to-br from-blue-50 via-blue-100 to-white p-12">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-8">
          <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-xl">D</span>
          </div>
          <span className="text-2xl font-bold text-gray-900">Dietkem</span>
        </div>

        {/* Welcome Message */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Features */}
        {features && (
          <ul className="mt-12 space-y-6">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="mt-1">
                  <svg 
                    className="h-4 w-4 text-blue-600" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900">{feature.title}</p>
                  {feature.description && (
                    <p className="text-sm text-gray-600 mt-1">{feature.description}</p>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Illustration */}
        <div className="mt-12">
          <img
            src="/auth-illustration.svg"
            alt="Dietkem"
            className="w-full max-w-sm mx-auto"
          />
        </div>
      </div>

      {/* Right side - Auth form */}
      <div className="flex flex-1 items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
} 