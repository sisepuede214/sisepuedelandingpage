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
    title: 'Tap in for your event photos',
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
  photosPage: {
    title: 'Mundial 5k: SISEPUEDE X HYPHEN',
    subtitle: 'Thank you for joining us! Enter your info for photos and updates!',
    ctaTitle: 'Tap In',
    photoCredit: 'Taken by: Emanuel Gonzales',
    imageAltOne: 'Event highlight one',
    imageAltTwo: 'Event highlight two',
    gateTitle: "You're on the list.",
    gateBody: "We'll send your photos when they're ready.",
    gateSubnote: "We'll keep you posted first.",
  },
  footer: {
    legal:
      '© 2026 Si Se Puede. By subscribing you agree to receive marketing communications. You can unsubscribe at any time.',
  },
  signupForm: {
    successTitle: "You're on the list.",
    successBodyBefore: 'Watch',
    successBodyAfter: "— that's where the tease drops.",
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
  foundersPage: {
    meta: {
      title: 'Founders 240 — Si Se Puede',
      description:
        'Join Founders 240 and become part of the journey. For those who believed in the mission before the finish line was visible.',
      ogDescription: 'Become part of the journey. Join Founders 240.',
    },
    nav: {
      homeAria: 'Si Se Puede home',
    },
    hero: {
      eyebrow: 'Founders 240',
      headline: 'Become Part of the Journey',
      cta: 'Join Founders 240',
      ctaNote: 'Reserved for the first believers',
    },
    tracker: {
      membersLabel: 'founding members',
      totalLabel: 'total spots',
      totalSuffix: 'ever',
      remaining: '{count} spots remaining',
    },
    soldOut: {
      title: 'All 240 spots claimed. You missed it.',
      waitlistHint: 'Join the waitlist — we will let you know if anything opens up.',
    },
    why240: {
      label: 'Why 240?',
      body1:
        'Many of you have been part of this journey long before there was ever a product. Whether we crossed paths through La Bandera 5K, running, community events, or personal relationships, your support helped build this from the ground up.',
      body2:
        'That same mindset carried us through the Moab 240 in 2024, one of the toughest ultra marathons in the world.',
      body3: '240 miles through the desert heat of Moab, Utah.',
      lessonIntro: 'That race taught us something important:',
      quote: 'Nobody gets through something that hard alone.',
      body4:
        'It takes people willing to believe in the mission before the finish line is visible.',
      body5: "That's what Founders 240 represents.",
    },
    benefits: {
      label: 'What you get as a Founder',
      items: [
        {
          icon: 'hash',
          title: 'Your Founder number',
          description:
            'Permanently assigned #001–240. You\'ll know your number when your order ships.',
        },
        {
          icon: 'rocket',
          title: 'First access',
          description: "Every future product launch, you're first in line.",
        },
        {
          icon: 'shirt',
          title: 'Founders merch',
          description: 'Exclusive drops that will never restock.',
        },
        {
          icon: 'calendar',
          title: 'Priority event access',
          description: 'Front of the line for every SISE event.',
        },
        {
          icon: 'users',
          title: 'Private community',
          description: 'Direct access to the team and other Founders.',
        },
        {
          icon: 'flask',
          title: 'Flavor testing',
          description: 'Try new products before anyone else.',
        },
        {
          icon: 'trending',
          title: 'Investment access',
          description: 'First look if opportunities ever open up.',
        },
        {
          icon: 'star',
          title: 'Lifetime recognition',
          description: 'An original supporter of SISE. Always.',
        },
      ],
    },
    chips: {
      label: "Who's already in",
      intro: 'The first {count} Founders have claimed their spots.',
      youChip: '— you?',
      spotsOpen: '{count} spots open',
      more: '+{count} more',
      footnote: 'Spots are claimed in order. Your number is assigned at purchase.',
    },
    bottomCta: {
      headline: 'You were at La Bandera.',
      headline2: 'You already know what this is about.',
      body1: 'Secure your Founder number before all 240 spots are claimed.',
      body2: 'There is no waitlist. There is no second round.',
      remaining: '{count} spots remaining · Only 240 will ever exist',
      questionsBefore: 'Questions? Reply to your email or DM us on',
      instagramHandle: '@sisepuede1.0',
    },
    footer: {
      copyright: '© 2026 Si Se Puede · Hydration for the cultura',
      privacy: 'Privacy',
      unsubscribe: 'Unsubscribe',
      instagram: 'Instagram',
    },
  },
  foundersWelcomePage: {
    meta: {
      title: 'Founders 240 — Welcome',
      description:
        "You're in. See your Founder perks and what happens next as we build SISE together.",
      ogDescription: 'Welcome, Founder. Your perks and what comes next.',
    },
    hero: {
      eyebrow: 'Founders 240',
      headline: "You're in.",
      subhead:
        'Thank you for believing early. Here\'s what comes with your Founder spot.',
      groupChatCta: 'Join the Founders group chat',
      groupChatNote: 'Tap to join on Instagram — don\'t miss updates from the team.',
    },
    intro: {
      label: 'What this is',
      body1:
        'Many of you have been part of this journey long before there was ever a product — through La Bandera 5K, running, community events, or personal relationships. Your support helped build this from the ground up.',
      body2:
        "Founders 240 is for people who believed in the mission before the finish line was visible. Nobody gets through something that hard alone — and we're building this together.",
    },
    benefits: {
      label: 'Your Founder perks',
    },
    cta: {
      label: 'Questions or updates?',
      button: 'Message us on Instagram',
      instagramHandle: '@sisepuede1.0',
    },
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
    title: 'Conéctate y recibe tus fotos del evento',
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
  photosPage: {
    title: 'Mundial 5k: SISEPUEDE X HYPHEN',
    subtitle: '¡Gracias por acompañarnos! Ingresa tu información para fotos y novedades.',
    ctaTitle: 'Conéctate',
    photoCredit: 'Tomada por: Emanuel Gonzales',
    imageAltOne: 'Momento destacado del evento uno',
    imageAltTwo: 'Momento destacado del evento dos',
    gateTitle: 'Ya estás en la lista.',
    gateBody: 'Te enviaremos las fotos cuando estén listas.',
    gateSubnote: 'Te avisamos primero.',
  },
  footer: {
    legal:
      '© 2026 Si Se Puede. Al suscribirte aceptas recibir comunicaciones de marketing. Puedes darte de baja en cualquier momento.',
  },
  signupForm: {
    successTitle: 'Ya estás en la lista.',
    successBodyBefore: 'Mira',
    successBodyAfter: '— ahí caen los adelantos.',
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
  foundersPage: {
    meta: {
      title: 'Founders 240 — Si Se Puede',
      description:
        'Únete a Founders 240 y forma parte del viaje. Para quienes creyeron en la misión antes de ver la meta.',
      ogDescription: 'Forma parte del viaje. Únete a Founders 240.',
    },
    nav: {
      homeAria: 'Inicio Si Se Puede',
    },
    hero: {
      eyebrow: 'Founders 240',
      headline: 'Forma Parte del Viaje',
      cta: 'Únete a Founders 240',
      ctaNote: 'Reservado para los primeros que creyeron',
    },
    tracker: {
      membersLabel: 'miembros fundadores',
      totalLabel: 'lugares en total',
      totalSuffix: 'para siempre',
      remaining: '{count} lugares disponibles',
    },
    soldOut: {
      title: 'Los 240 lugares están ocupados. Te lo perdiste.',
      waitlistHint:
        'Únete a la lista de espera — te avisaremos si se abre algo.',
    },
    why240: {
      label: '¿Por qué 240?',
      body1:
        'Muchos de ustedes han sido parte de este viaje mucho antes de que existiera un producto. Ya sea que nos cruzamos en La Bandera 5K, corriendo, en eventos comunitarios o por relaciones personales, su apoyo ayudó a construir esto desde cero.',
      body2:
        'Esa misma mentalidad nos llevó a completar el Moab 240 en 2024, una de las ultramaratones más duras del mundo.',
      body3: '240 millas a través del calor del desierto de Moab, Utah.',
      lessonIntro: 'Esa carrera nos enseñó algo importante:',
      quote: 'Nadie atraviesa algo tan difícil solo.',
      body4:
        'Se necesita gente dispuesta a creer en la misión antes de que la meta sea visible.',
      body5: 'Eso es lo que representa Founders 240.',
    },
    benefits: {
      label: 'Lo que obtienes como Fundador',
      items: [
        {
          icon: 'hash',
          title: 'Tu número de Fundador',
          description:
            'Asignado permanentemente #001–240. Sabrás tu número cuando se envíe tu pedido.',
        },
        {
          icon: 'rocket',
          title: 'Acceso primero',
          description: 'En cada lanzamiento futuro, tú eres el primero.',
        },
        {
          icon: 'shirt',
          title: 'Merch de Fundadores',
          description: 'Lanzamientos exclusivos que nunca volverán.',
        },
        {
          icon: 'calendar',
          title: 'Acceso prioritario a eventos',
          description: 'Al frente de la fila en cada evento SISE.',
        },
        {
          icon: 'users',
          title: 'Comunidad privada',
          description: 'Acceso directo al equipo y otros Fundadores.',
        },
        {
          icon: 'flask',
          title: 'Prueba de sabores',
          description: 'Prueba productos nuevos antes que nadie.',
        },
        {
          icon: 'trending',
          title: 'Acceso a inversión',
          description: 'Primera mirada si algún día se abren oportunidades.',
        },
        {
          icon: 'star',
          title: 'Reconocimiento de por vida',
          description: 'Un apoyador original de SISE. Siempre.',
        },
      ],
    },
    chips: {
      label: 'Quién ya está dentro',
      intro: 'Los primeros {count} Fundadores ya reclamaron su lugar.',
      youChip: '— ¿tú?',
      spotsOpen: '{count} lugares disponibles',
      more: '+{count} más',
      footnote:
        'Los lugares se reclaman en orden. Tu número se asigna al comprar.',
    },
    bottomCta: {
      headline: 'Estuviste en La Bandera.',
      headline2: 'Ya sabes de qué se trata.',
      body1: 'Asegura tu número de Fundador antes de que se ocupen los 240 lugares.',
      body2: 'No hay lista de espera. No hay segunda ronda.',
      remaining: '{count} lugares disponibles · Solo existirán 240',
      questionsBefore: '¿Preguntas? Responde tu correo o escríbenos en',
      instagramHandle: '@sisepuede1.0',
    },
    footer: {
      copyright: '© 2026 Si Se Puede · Hidratación para la cultura',
      privacy: 'Privacidad',
      unsubscribe: 'Darse de baja',
      instagram: 'Instagram',
    },
  },
  foundersWelcomePage: {
    meta: {
      title: 'Founders 240 — Bienvenida',
      description:
        'Ya estás dentro. Mira tus beneficios de Fundador y lo que sigue mientras construimos SISE juntos.',
      ogDescription: 'Bienvenido, Fundador. Tus beneficios y lo que viene.',
    },
    hero: {
      eyebrow: 'Founders 240',
      headline: 'Ya estás dentro.',
      subhead:
        'Gracias por creer desde el principio. Esto es lo que incluye tu lugar como Fundador.',
      groupChatCta: 'Únete al chat grupal de Fundadores',
      groupChatNote:
        'Toca para unirte en Instagram — no te pierdas las actualizaciones del equipo.',
    },
    intro: {
      label: 'De qué se trata',
      body1:
        'Muchos de ustedes han sido parte de este viaje mucho antes de que existiera un producto — en La Bandera 5K, corriendo, en eventos comunitarios o por relaciones personales. Su apoyo ayudó a construir esto desde cero.',
      body2:
        'Founders 240 es para quienes creyeron en la misión antes de que la meta fuera visible. Nadie atraviesa algo tan difícil solo — y estamos construyendo esto juntos.',
    },
    benefits: {
      label: 'Tus beneficios de Fundador',
    },
    cta: {
      label: '¿Preguntas o actualizaciones?',
      button: 'Escríbenos en Instagram',
      instagramHandle: '@sisepuede1.0',
    },
  },
} as unknown as Messages;

const byLocale: Record<AppLocale, Messages> = {
  en: messagesEn,
  es: messagesEs,
};

export function getMessages(locale: string): Messages {
  return isValidLocale(locale) ? byLocale[locale] : byLocale.en;
}
