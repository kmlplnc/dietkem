import { useLanguage } from '../context/LanguageContext';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const trLocalization = {
  signIn: {
    start: {
      title: '',
      subtitle: '',
      actionText: 'Hesabınız yok mu?',
      actionLink: 'Hesap oluştur'
    },
    formFieldLabel__emailAddress: 'E-posta',
    formFieldLabel__password: 'Şifre',
    formButtonPrimary: 'Giriş Yap',
    formFieldAction__forgotPassword: 'Şifremi unuttum'
  },
  signUp: {
    start: {
      title: 'Kayıt Ol',
      subtitle: 'Modern diyetisyenler için akıllı çözüm ortağı',
      actionText: 'Zaten hesabınız var mı?',
      actionLink: 'Giriş yap'
    },
    emailLink: {
      title: 'E-posta ile kayıt ol',
      subtitle: 'Kayıt bağlantısı için e-posta adresinizi girin',
      formTitle: 'E-posta bağlantısı',
      formSubtitle: 'Kayıt bağlantısı için e-posta adresinizi girin',
      resendButton: 'Yeniden gönder',
      verified: {
        title: 'Başarıyla kayıt olundu',
        subtitle: 'E-posta bağlantınız doğrulandı'
      },
      loading: {
        title: 'Kayıt yapılıyor...',
        subtitle: 'Lütfen bekleyin'
      },
      verifiedSwitchTab: {
        title: 'E-posta ile kayıt olundu',
        subtitle: 'Farklı bir yöntemle kayıt olmak için devam edin'
      }
    },
    emailCode: {
      title: 'E-posta kodu ile kayıt ol',
      subtitle: 'E-posta adresinize gönderilen kodu girin',
      formTitle: 'Doğrulama kodu',
      formSubtitle: 'E-posta adresinize gönderilen kodu girin',
      resendButton: 'Kodu yeniden gönder'
    },
    phoneCode: {
      title: 'Telefon kodu ile kayıt ol',
      subtitle: 'Telefonunuza gönderilen kodu girin',
      formTitle: 'Doğrulama kodu',
      formSubtitle: 'Telefonunuza gönderilen kodu girin',
      resendButton: 'Kodu yeniden gönder'
    },
    formFieldLabel__emailAddress: 'E-posta',
    formFieldLabel__password: 'Şifre',
    formButtonPrimary: 'Kayıt Ol',
    socialButtonsBlockButton__google: 'Google ile devam et',
    socialButtonsBlockButton__github: 'GitHub ile devam et'
  }
};

const enLocalization = {
  signIn: {
    start: {
      title: '',
      subtitle: '',
      actionText: 'Don\'t have an account?',
      actionLink: 'Create account'
    },
    formFieldLabel__emailAddress: 'Email',
    formFieldLabel__password: 'Password',
    formButtonPrimary: 'Sign In',
    formFieldAction__forgotPassword: 'Forgot password?'
  },
  signUp: {
    start: {
      title: 'Sign Up',
      subtitle: 'Smart solution partner for modern dietitians',
      actionText: 'Already have an account?',
      actionLink: 'Sign in'
    },
    emailLink: {
      title: 'Sign up with email',
      subtitle: 'Enter your email for sign up link',
      formTitle: 'Email link',
      formSubtitle: 'Enter your email for sign up link',
      resendButton: 'Resend',
      verified: {
        title: 'Successfully signed up',
        subtitle: 'Your email link has been verified'
      },
      loading: {
        title: 'Signing up...',
        subtitle: 'Please wait'
      },
      verifiedSwitchTab: {
        title: 'Signed up with email',
        subtitle: 'Continue with a different method'
      }
    },
    emailCode: {
      title: 'Sign up with email code',
      subtitle: 'Enter the code sent to your email',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the code sent to your email',
      resendButton: 'Resend code'
    },
    phoneCode: {
      title: 'Sign up with phone code',
      subtitle: 'Enter the code sent to your phone',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the code sent to your phone',
      resendButton: 'Resend code'
    },
    formFieldLabel__emailAddress: 'Email',
    formFieldLabel__password: 'Password',
    formButtonPrimary: 'Sign Up',
    socialButtonsBlockButton__google: 'Continue with Google',
    socialButtonsBlockButton__github: 'Continue with GitHub'
  }
};

export function ClerkLocalizationProvider({ children }: { children: React.ReactNode }) {
  const { currentLang } = useLanguage();
  const localization = currentLang === 'tr' ? trLocalization : enLocalization;

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      localization={localization}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/welcome"
      afterSignUpUrl="/welcome"
      appearance={{
        elements: {
          formButtonPrimary: "w-full",
          formFieldInput: "w-full",
          formFieldLabel: "hidden",
          formFieldAction: "hidden",
          identityPreviewEditButton: "hidden",
          identityPreviewText: "hidden",
          formFieldInputShowPasswordButton: "hidden",
          formFieldInputShowPasswordIcon: "hidden",
          formFieldInputShowPasswordIconContainer: "hidden"
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
} 