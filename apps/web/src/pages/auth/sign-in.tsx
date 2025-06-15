import { SignIn } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function SignInPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Profesyonel Diyetisyenler",
      description: "Alanında uzman diyetisyenlerle çalışın",
    },
    {
      title: "Kişiselleştirilmiş Programlar",
      description: "Size özel beslenme planları oluşturun",
    },
    {
      title: "Kolay Takip",
      description: "İlerlemenizi anlık olarak takip edin",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-emerald-50 to-teal-50">
      {/* Left Section */}
      <div className="lg:w-1/2 flex flex-col justify-center px-10 py-20">
        <div className="max-w-lg mx-auto space-y-8">
          <h1 className="text-4xl font-bold text-emerald-800 leading-snug">
            Dietkem'e Hoş Geldiniz
          </h1>
          <p className="text-lg text-gray-700">
            Beslenme sürecinizi profesyonelce yönetin. Takip kolay, danışmanlık hızlı.
          </p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="h-7 w-7 flex items-center justify-center bg-emerald-100 rounded-full">
                  <svg
                    className="h-4 w-4 text-emerald-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="text-sm text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <img
            src="/auth-illustration.svg"
            alt="Auth Illustration"
            className="mt-10 w-full max-w-sm mx-auto"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="lg:w-1/2 bg-white flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-xl bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Giriş Yap</h2>
            <p className="mt-2 text-sm text-gray-600">Hesabınızla devam edin</p>
          </div>

          <SignIn
            appearance={{
              layout: {
                socialButtonsPlacement: "bottom",
                logoPlacement: "inside",
                logoImageUrl: "/logo.png",
              },
              elements: {
                card: "p-0 shadow-none",
                formButtonPrimary:
                  "bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 px-4 rounded-lg w-full text-sm font-medium transition",
                formFieldInput:
                  "w-full rounded-lg border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 text-sm",
                formFieldLabel: "text-gray-700 text-sm font-medium",
                formFieldAction: "text-emerald-600 hover:text-emerald-700 text-sm",
                footer: "hidden",
                alert: "bg-red-50 text-red-600 text-sm rounded-lg p-3",
              },
              variables: {
                colorPrimary: "#059669",
                borderRadius: "0.5rem",
              },
            }}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            afterSignInUrl="/dashboard"
          />

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Hesabınız yok mu?{" "}
              <button
                onClick={() => navigate("/sign-up")}
                className="font-medium text-emerald-600 hover:text-emerald-700"
              >
                Kayıt olun
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
