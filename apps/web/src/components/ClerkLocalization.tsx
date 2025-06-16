import { useLanguage } from '../context/LanguageContext';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

const trLocalization = {
  signIn: {
    start: {
      title: 'Giriş Yap',
      subtitle: 'Modern diyetisyenler için akıllı çözüm ortağı',
      actionText: 'Hesabınız yok mu?',
      actionLink: 'Hesap oluştur'
    },
    emailLink: {
      title: 'E-posta ile giriş yap',
      subtitle: 'Giriş bağlantısı için e-posta adresinizi girin',
      formTitle: 'E-posta bağlantısı',
      formSubtitle: 'Giriş bağlantısı için e-posta adresinizi girin',
      resendButton: 'Yeniden gönder',
      verified: {
        title: 'Başarıyla giriş yapıldı',
        subtitle: 'E-posta bağlantınız doğrulandı'
      },
      loading: {
        title: 'Giriş yapılıyor...',
        subtitle: 'Lütfen bekleyin'
      },
      verifiedSwitchTab: {
        title: 'E-posta ile giriş yapıldı',
        subtitle: 'Farklı bir yöntemle giriş yapmak için devam edin'
      }
    },
    emailCode: {
      title: 'E-posta kodu ile giriş yap',
      subtitle: 'E-posta adresinize gönderilen kodu girin',
      formTitle: 'Doğrulama kodu',
      formSubtitle: 'E-posta adresinize gönderilen kodu girin',
      resendButton: 'Kodu yeniden gönder'
    },
    phoneCode: {
      title: 'Telefon kodu ile giriş yap',
      subtitle: 'Telefonunuza gönderilen kodu girin',
      formTitle: 'Doğrulama kodu',
      formSubtitle: 'Telefonunuza gönderilen kodu girin',
      resendButton: 'Kodu yeniden gönder'
    },
    formFieldLabel__emailAddress: 'E-posta',
    formFieldLabel__password: 'Şifre',
    formButtonPrimary: 'Giriş Yap',
    formFieldAction__forgotPassword: 'Şifremi unuttum',
    socialButtonsBlockButton__google: 'Google ile devam et',
    socialButtonsBlockButton__github: 'GitHub ile devam et'
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
      title: 'Sign In',
      subtitle: 'Smart solution partner for modern dietitians',
      actionText: 'Don\'t have an account?',
      actionLink: 'Create account'
    },
    emailLink: {
      title: 'Sign in with email',
      subtitle: 'Enter your email for sign in link',
      formTitle: 'Email link',
      formSubtitle: 'Enter your email for sign in link',
      resendButton: 'Resend',
      verified: {
        title: 'Successfully signed in',
        subtitle: 'Your email link has been verified'
      },
      loading: {
        title: 'Signing in...',
        subtitle: 'Please wait'
      },
      verifiedSwitchTab: {
        title: 'Signed in with email',
        subtitle: 'Continue with a different method'
      }
    },
    emailCode: {
      title: 'Sign in with email code',
      subtitle: 'Enter the code sent to your email',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the code sent to your email',
      resendButton: 'Resend code'
    },
    phoneCode: {
      title: 'Sign in with phone code',
      subtitle: 'Enter the code sent to your phone',
      formTitle: 'Verification code',
      formSubtitle: 'Enter the code sent to your phone',
      resendButton: 'Resend code'
    },
    formFieldLabel__emailAddress: 'Email',
    formFieldLabel__password: 'Password',
    formButtonPrimary: 'Sign In',
    formFieldAction__forgotPassword: 'Forgot password?',
    socialButtonsBlockButton__google: 'Continue with Google',
    socialButtonsBlockButton__github: 'Continue with GitHub'
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

  return (
    <ClerkProvider 
      publishableKey={clerkPubKey}
      localization={{
        locale: currentLang,
        ...(currentLang === 'tr' ? trLocalization : enLocalization)
      }}
      appearance={{
        elements: {
          headerSubtitle: {
            display: 'none'
          },
          headerTitle: {
            display: 'none'
          }
        }
      }}
    >
      {children}
    </ClerkProvider>
  );
} 