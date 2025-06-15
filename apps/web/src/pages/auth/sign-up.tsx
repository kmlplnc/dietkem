import { SignUp } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../components/auth/AuthLayout";

export default function SignUpPage() {
  const navigate = useNavigate();

  const features = [
    {
      title: "Profesyonel Diyetisyenler",
      description: "Alanında uzman diyetisyenlerle çalışın"
    },
    {
      title: "Kişiselleştirilmiş Programlar",
      description: "Size özel beslenme planları oluşturun"
    },
    {
      title: "Kolay Takip",
      description: "İlerlemenizi anlık olarak takip edin"
    }
  ];

  return (
    <AuthLayout
      title="Dietkem'e Katılın"
      subtitle="Sağlıklı yaşam yolculuğunuza bizimle başlayın. Uzman diyetisyenlerimiz size özel programlar hazırlasın."
      features={features}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Kayıt Ol</h2>
        <p className="mt-2 text-sm text-gray-600">
          Yeni bir hesap oluşturun ve hemen başlayın
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <SignUp
          appearance={{
            layout: {
              socialButtonsPlacement: "bottom",
              socialButtonsVariant: "iconButton",
              showOptionalFields: true,
              logoPlacement: "inside",
              logoImageUrl: "/logo.png",
            },
            elements: {
              rootBox: "mx-auto w-full",
              card: "shadow-none p-0",
              header: "hidden",
              main: "p-0",
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg w-full transition-colors",
              formFieldInput: 
                "w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-sm",
              formFieldLabel: 
                "text-gray-700 text-sm font-medium",
              formFieldAction: 
                "text-blue-600 hover:text-blue-700 text-sm",
              identityPreviewEditButton: 
                "text-blue-600 hover:text-blue-700 text-sm",
              footerActionLink: 
                "text-blue-600 hover:text-blue-700 text-sm",
              socialButtonsBlockButton: 
                "border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm",
              socialButtonsBlockButtonText: 
                "text-gray-700 text-sm",
              formFieldInputShowPasswordButton: 
                "text-gray-500 hover:text-gray-700",
              footer: "hidden",
              formFieldError: "text-red-500 text-sm",
              alert: "bg-red-50 text-red-500 text-sm rounded-lg p-3",
              alertText: "text-red-500 text-sm",
              alertIcon: "text-red-500",
              identityPreviewText: "text-gray-700 text-sm",
              otpCodeFieldInput: 
                "w-12 h-12 rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500 text-center text-lg",
              formFieldWarningText: "text-yellow-600 text-sm",
              formFieldSuccessText: "text-green-600 text-sm",
            },
            variables: {
              colorPrimary: "#2563eb",
              colorText: "#1f2937",
              colorTextSecondary: "#6b7280",
              colorBackground: "#ffffff",
              colorInputBackground: "#ffffff",
              colorInputText: "#1f2937",
              colorDanger: "#ef4444",
              colorSuccess: "#22c55e",
              colorWarning: "#f59e0b",
              borderRadius: "0.5rem",
            },
          }}
          afterSignUpUrl="/dashboard"
          signInUrl="/sign-in"
          routing="path"
          path="/sign-up"
        />
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Zaten hesabınız var mı?{" "}
          <button
            onClick={() => navigate("/sign-in")}
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Giriş yapın
          </button>
        </p>
      </div>
    </AuthLayout>
  );
} 