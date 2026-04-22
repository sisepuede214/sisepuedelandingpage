import type { AppLocale } from './locale';
import { isValidLocale } from './locale';

export type Messages = typeof messagesEn;

const messagesEn = {
  nav: {
    instagramAria: 'Si Se Puede on Instagram',
    languageToggle: 'Language',
  },
  hero: {
    early: 'If you’re seeing this, you’re early.',
    tagline: 'Hydration for the cultura.',
    builtFor: 'Built for those who carry the flag.',
    headlineBefore: 'Hydration for the',
    headlineAccent: 'cultura.',
    subline: 'Electrolyte Drink Mix',
    preorderLine: 'Pre-orders open May 5.',
  },
  countdown: {
    aria: 'Countdown to May 5th pre-orders',
    days: 'Days',
    hours: 'Hrs',
    minutes: 'Mins',
    seconds: 'Secs',
  },
  signupSection: {
    title: 'Get early access',
    subtitle: "Enter your info. We'll text you first.",
    subnote: 'The people here get it first.',
  },
  community: {
    imageAlt: 'La Bandera — community',
    quote: '“This is bigger than a drink.”',
  },
  manifesto: {
    intro: "What you felt today, that's where this comes from.",
    line1: "We're built to go",
    line2: 'the distance.',
    hard: 'To face hard things.',
    showing: 'To keep showing up.',
    body: 'We made this to represent us and to fuel the journey.',
    forYou: 'For you.',
    forUs: 'For us.',
    forCultura: 'For the cultura.',
  },
  product: {
    imageAlt: 'SISE product',
  },
  closing: {
    title: 'You were here first.',
    subtitle: "Don't miss what comes next.",
    cta: 'Get early access',
  },
  follow: {
    label: 'Follow the journey',
  },
  footer: {
    legal:
      '© 2026 Si Se Puede. By subscribing you agree to receive marketing communications. You can unsubscribe at any time.',
  },
  signupForm: {
    successTitle: "You're on the list.",
    successBodyBefore: 'Watch',
    successBodyAfter: "— that's where the tease drops.",
    smsNote: "We'll text you first when pre-orders open May 5th.",
    followInstagram: 'Follow on Instagram',
    emailLabel: 'Email *',
    phoneLabel: 'Phone',
    optional: '(optional)',
    phoneHint:
      'Use a US number (10 digits) or full international format with + country code so we can text you.',
    smsConsent:
      'Yes, text me updates about product. Message & data rates may apply. Reply STOP to unsubscribe.',
    errorGeneric: 'Something went wrong. Please try again.',
    sending: 'Sending...',
    submit: 'Get early access',
  },
  signupGate: {
    title: "You're on the list.",
    body: 'You were here early. Stay locked in, the drop is coming soon.',
    subnote: "We'll keep you updated first.",
    followInstagram: 'Follow on Instagram',
  },
} as const;

const messagesEs = {
  nav: {
    instagramAria: 'Si Se Puede en Instagram',
    languageToggle: 'Idioma',
  },
  hero: {
    early: 'Si ves esto, llegaste temprano.',
    tagline: 'Esto es más que una bebida. Preventas muy pronto.',
    builtFor: 'Hecho para quienes cargan la bandera.',
    headlineBefore: 'Hidratación para la',
    headlineAccent: 'cultura.',
    subline: 'Bebida en Polvo con electrolitos',
    preorderLine: 'Preventas abren el 5 de mayo.',
  },
  countdown: {
    aria: 'Cuenta regresiva para preventas del 5 de mayo',
    days: 'Días',
    hours: 'Hrs',
    minutes: 'Min',
    seconds: 'Seg',
  },
  signupSection: {
    title: 'Acceso anticipado',
    subtitle: 'Deja tus datos. Te escribimos primero.',
    subnote: 'Los de aquí lo saben primero.',
  },
  community: {
    imageAlt: 'La Bandera — comunidad',
    quote: '“Esto es más que una bebida.”',
  },
  manifesto: {
    intro: 'Lo que sentiste hoy, de ahí viene esto.',
    line1: 'Estamos hechos para',
    line2: 'llegar lejos.',
    hard: 'Para enfrentar lo difícil.',
    showing: 'Para seguir presentes.',
    body: 'Hicimos esto para representarnos y alimentar el camino.',
    forYou: 'Para ti.',
    forUs: 'Para nosotros.',
    forCultura: 'Para la cultura.',
  },
  product: {
    imageAlt: 'Producto SISE',
  },
  closing: {
    title: 'Estuviste aquí primero.',
    subtitle: 'No te pierdas lo que sigue.',
    cta: 'Acceso anticipado',
  },
  follow: {
    label: 'Sigue el recorrido',
  },
  footer: {
    legal:
      '© 2026 Si Se Puede. Al suscribirte aceptas recibir comunicaciones de marketing. Puedes darte de baja en cualquier momento.',
  },
  signupForm: {
    successTitle: 'Ya estás en la lista.',
    successBodyBefore: 'Mira',
    successBodyAfter: '— ahí caen los adelantos.',
    smsNote: 'Te avisamos por SMS cuando abran las preventas el 5 de mayo.',
    followInstagram: 'Seguir en Instagram',
    emailLabel: 'Correo *',
    phoneLabel: 'Teléfono',
    optional: '(opcional)',
    phoneHint:
      'Usa un número de EE. UU. (10 dígitos) o formato internacional completo con +código de país para poder enviarte SMS.',
    smsConsent:
      'Sí, envíenme actualizaciones por SMS sobre el producto. Pueden aplicarse tarifas de mensajes y datos. Responde STOP para darte de baja.',
    errorGeneric: 'Algo salió mal. Intenta de nuevo.',
    sending: 'Enviando...',
    submit: 'Quiero acceso anticipado',
  },
  signupGate: {
    title: 'Ya estás en la lista.',
    body: 'Llegaste temprano. Mantente atento, el lanzamiento viene pronto.',
    subnote: 'Te mantendremos al tanto primero.',
    followInstagram: 'Seguir en Instagram',
  },
} as unknown as Messages;

const byLocale: Record<AppLocale, Messages> = {
  en: messagesEn,
  es: messagesEs,
};

export function getMessages(locale: string): Messages {
  return isValidLocale(locale) ? byLocale[locale] : byLocale.en;
}
