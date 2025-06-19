import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// CLERK_DISABLED_TEMP: import { useUser } from "@clerk/clerk-react";
import { useLanguage } from "../../context/LanguageContext";

export default function SSOCallbackPage() {
  // CLERK_DISABLED_TEMP: const { isSignedIn, isLoaded, user } = useUser();
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    // CLERK_DISABLED_TEMP: if (isLoaded) {
    // CLERK_DISABLED_TEMP:   if (isSignedIn) {
    // CLERK_DISABLED_TEMP:     if (!user?.firstName || !user?.lastName || !user?.username) {
    // CLERK_DISABLED_TEMP:       navigate("/complete-profile");
    // CLERK_DISABLED_TEMP:     } else {
    // CLERK_DISABLED_TEMP:       navigate("/welcome");
    // CLERK_DISABLED_TEMP:     }
    // CLERK_DISABLED_TEMP:   } else {
    // CLERK_DISABLED_TEMP:     navigate("/sign-in");
    // CLERK_DISABLED_TEMP:   }
    // CLERK_DISABLED_TEMP: }
    navigate("/sign-in");
  }, [navigate]);

  return <div>{t('sso.signingIn')}</div>;
} 