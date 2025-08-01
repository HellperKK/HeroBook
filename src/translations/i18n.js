import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      "file": "file",
      "open": "open",
      "save": "save",
      "quit": "quit",
      "window": "window",
      "settings": "settings",
      "colors": "Colors",
      "light theme": "Light",
      "light contrast theme": "Light contrast",
      "dark theme": "Dark",
      "dark contrast theme": "Dark contrast",
      "text size": "Text size",
      "small text": "Small text",
      "medium text": "Medium text",
      "font" : "Font",
      "language": "Language",
      "click delay": "Click delay in miliseconds",
      "more": "More",
      "Primary": "Primary",
      "Primary text": "Primary text",
      "Surface": "Surface",
      "Surface text": "Surface text",
    },

  },
  fr: {
    translation: {
      "file": "fichier",
      "open": "ouvrir",
      "save": "sauvegarder",
      "quit": "quiter",
      "window": "fenêtre",
      "settings": "paramètres",
      "colors": "Couleurs",
      "light theme": "Clair",
      "light contrast theme": "Clair contrasté",
      "dark theme": "Sombre",
      "dark contrast theme": "Sombre contrasté",
      "text size": "Taille du texte",
      "small text": "Petit texte",
      "medium text": "Moyen texte",
      "font" : "Police",
      "language": "Langue",
      "click delay": "Délay de clic en milisecondes",
      "more": "Plus",
      "Primary": "Primaire",
      "Primary text": "Primaire texte",
      "Surface": "Surface",
      "Surface text": "Surface texte",
    }
  }
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option

    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

  export default i18n;