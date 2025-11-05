import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  fr: {
    translation: {
      header: { home: "Accueil", about: "À propos", services: "Tokenomics", whitepaper: "Whitepaper" },
      hero: { title: "NEXUL — Ultimate Impact V3", subtitle: "La plateforme d'impact sur Polygon.", discover: "Découvrir", tokenomics: "Tokenomics" },
      buy: { button: "Acheter", desc: "Scanner pour acheter le token Nexul" },
      about: { title: "À propos", mission: "Notre mission...", vision: "Notre vision...", impact: "Impact", impactDesc: "Description", access: "Accessibilité", accessDesc: "Description", transparency: "Transparence", transparencyDesc: "Description" },
      services: { title: "Tokenomics", desc: "Répartition du token Nexul", reserve: "Réserve Fondatrice", publicSale: "Vente Publique", marketing: "Marketing & Rewards" },
      team: { title: "Équipe" },
      partners: { title: "Partenaires" },
      roadmap: { title: "Roadmap", m1: { title: "Phase 1", desc: "Lancement initial" }, m2: { title: "Phase 2", desc: "Développement" }, m3: { title: "Phase 3", desc: "Adoption" } }
    }
  },
  en: {
    translation: {
      header: { home: "Home", about: "About", services: "Tokenomics", whitepaper: "Whitepaper" },
      hero: { title: "NEXUL — Ultimate Impact V3", subtitle: "The impact platform on Polygon.", discover: "Discover", tokenomics: "Tokenomics" },
      buy: { button: "Buy", desc: "Scan to buy Nexul token" },
      about: { title: "About", mission: "Our mission...", vision: "Our vision...", impact: "Impact", impactDesc: "Description", access: "Accessibility", accessDesc: "Description", transparency: "Transparency", transparencyDesc: "Description" },
      services: { title: "Tokenomics", desc: "Nexul token allocation", reserve: "Founders Reserve", publicSale: "Public Sale", marketing: "Marketing & Rewards" },
      team: { title: "Team" },
      partners: { title: "Partners" },
      roadmap: { title: "Roadmap", m1: { title: "Phase 1", desc: "Initial launch" }, m2: { title: "Phase 2", desc: "Development" }, m3: { title: "Phase 3", desc: "Adoption" } }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'fr',
    interpolation: { escapeValue: false }
  });

export default i18n;
