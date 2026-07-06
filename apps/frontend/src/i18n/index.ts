import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ar: {
    translation: {
      login: "تسجيل الدخول",
      email: "البريد الإلكتروني",
      password: "كلمة المرور",
      submit: "إرسال",
      loading: "جارٍ التحميل...",
      error: "حدث خطأ",
    },
  },
  en: {
    translation: {
      login: "Login",
      email: "Email",
      password: "Password",
      submit: "Submit",
      loading: "Loading...",
      error: "An error occurred",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "ar",
  fallbackLng: "ar",
  interpolation: { escapeValue: false },
});

export default i18n;
