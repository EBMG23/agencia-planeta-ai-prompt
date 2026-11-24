export interface WhatsAppChannel {
  id: 'principal' | 'alternativo';
  label: string;
  advisorTitle: string;
  phoneDisplay: string;
  phoneRaw: string;
  url: string;
  badge: string;
}

export const WHATSAPP_MESSAGE_DEFAULT =
  'Hola Agencia Planeta, soy creador de TikTok y quiero unirme para empezar a ganar';

export const WHATSAPP_CHANNELS: WhatsAppChannel[] = [
  {
    id: 'principal',
    label: 'Opción 1: Registro vía WhatsApp Principal',
    advisorTitle: 'CONTACTAR ASESOR 1 (+58 424-7418161)',
    phoneDisplay: '+58 424-7418161',
    phoneRaw: '584247418161',
    url: 'https://wa.me/584247418161?text=Hola%20Agencia%20Planeta,%20soy%20creador%20de%20TikTok%20y%20quiero%20unirme%20para%20empezar%20a%20ganar',
    badge: 'Línea Principal • Respuesta Inmediata',
  },
  {
    id: 'alternativo',
    label: 'Opción 2: Registro vía WhatsApp Alternativo',
    advisorTitle: 'CONTACTAR ASESOR 2 (+58 4129126548)',
    phoneDisplay: '+58 4129126548',
    phoneRaw: '584129126548',
    url: 'https://wa.me/584129126548?text=Hola%20Agencia%20Planeta,%20soy%20creador%20de%20TikTok%20y%20quiero%20unirme%20para%20empezar%20a%20ganar',
    badge: 'Línea Alternativa • Soporte Directo',
  },
];

export function buildWhatsAppUrl(phoneRaw: string, customMessage?: string): string {
  if (!customMessage) {
    return `https://wa.me/${phoneRaw}?text=Hola%20Agencia%20Planeta,%20soy%20creador%20de%20TikTok%20y%20quiero%20unirme%20para%20empezar%20a%20ganar`;
  }
  return `https://wa.me/${phoneRaw}?text=${encodeURIComponent(customMessage)}`;
}

export type CreatorLeague = 'D1' | 'C' | 'B';

export interface LeagueInfo {
  id: CreatorLeague;
  name: string;
  tagline: string;
  estimatedRange: string;
  diamondGoal: string;
  protectionLevel: string;
  battleAccess: string;
  highlights: string[];
}

export const LEAGUES_DATA: Record<CreatorLeague, LeagueInfo> = {
  D1: {
    id: 'D1',
    name: 'Liga D1',
    tagline: 'Impulso de Despegue y Retención en LIVE',
    estimatedRange: '$50 - $75 USD / mes',
    diamondGoal: '100K Diamantes',
    protectionLevel: 'Escudo Anti-Baneos Activo + Optimización de Perfil',
    battleAccess: 'Batallas Oficiales de Escalada D1 → C',
    highlights: [
      'Asesoría estratégica para retener audiencia y multiplicar regalos',
      'Desbloqueo de Batallas Oficiales para subir rápido a Liga C',
      'Soporte directo contra bloqueos o restricciones de LIVE',
    ],
  },
  C: {
    id: 'C',
    name: 'Liga C',
    tagline: 'Aceleración y Monetización Constante',
    estimatedRange: '$65 - $90 USD / mes',
    diamondGoal: '100K Diamantes',
    protectionLevel: 'Soporte Prioritario 24/7 contra Baneos y Reportes',
    battleAccess: 'Torneos y Eventos Oficiales de TikTok LIVE',
    highlights: [
      'Capacitación avanzada para alcanzar y superar los 100K Diamantes',
      'Conexión con creadores de la agencia para batallas programadas',
      'Pagos recurrentes directos a tu cuenta de PayPal en USD',
    ],
  },
  B: {
    id: 'B',
    name: 'Liga B',
    tagline: 'Alto Rendimiento y Máxima Recompensa',
    estimatedRange: '$80 - $100 USD / mes',
    diamondGoal: '100K Diamantes',
    protectionLevel: 'Blindaje VIP de Cuenta + Gestor Dedicado',
    battleAccess: 'Eventos Estelares y Batallas Oficiales Internacionales',
    highlights: [
      'Máxima bonificación mensual de hasta $100 USD vía PayPal',
      'Estrategias élite de fidelización de donadores y batallas PK',
      'Protección total de cuenta y soporte técnico inmediato',
    ],
  },
};

export interface QuickPromptChip {
  id: string;
  label: string;
  voicePhrase: string;
  category: 'general' | 'pagos' | 'ligas' | 'requisitos' | 'registro';
}

export const QUICK_PROMPT_CHIPS: QuickPromptChip[] = [
  {
    id: 'como-entrar',
    label: '💰 ¿Cómo entrar y cuánto pagan?',
    voicePhrase: '¿Cómo puedo entrar a la agencia y cuánto pagan?',
    category: 'general',
  },
  {
    id: 'liga-d1-c-b',
    label: '🚀 Soy Liga D1, C o B',
    voicePhrase: 'Soy creador de Liga D1, C o B, ¿cómo me ayudan a subir de nivel?',
    category: 'ligas',
  },
  {
    id: 'pagos-diamantes',
    label: '💎 Meta 100K Diamantes y PayPal',
    voicePhrase: '¿Cómo funciona el sistema de pagos de 100K diamantes por PayPal?',
    category: 'pagos',
  },
  {
    id: 'requisitos',
    label: '📋 Requisitos (100% Gratis)',
    voicePhrase: '¿Cuáles son los requisitos para entrar a Agencia Planeta y tiene algún costo?',
    category: 'requisitos',
  },
  {
    id: 'baneos-batallas',
    label: '🛡️ Protección contra Baneos y Batallas',
    voicePhrase: '¿Cómo funciona el soporte contra baneos y las batallas oficiales?',
    category: 'ligas',
  },
  {
    id: 'registro-ya',
    label: '📲 Quiero registrarme por WhatsApp',
    voicePhrase: 'Estoy listo para unirme a Agencia Planeta con un asesor en WhatsApp',
    category: 'registro',
  },
];

export interface VoiceCommandShortcut {
  command: string;
  description: string;
  sampleTrigger: string;
}

export const VOICE_COMMANDS_GUIDE: VoiceCommandShortcut[] = [
  {
    command: '“¿Cuánto pagan?” o “Cómo entrar”',
    description: 'Explica los pagos de $50 a $100 USD, meta de 100K diamantes y cómo unirte gratis.',
    sampleTrigger: '¿Cómo puedo entrar a la agencia y cuánto pagan?',
  },
  {
    command: '“Soy Liga D1 / Liga C / Liga B”',
    description: 'Activa asesoría para tu liga, protección contra baneos y batallas oficiales.',
    sampleTrigger: 'Soy creador de Liga C y quiero subir de nivel',
  },
  {
    command: '“Requisitos” o “¿Es gratis?”',
    description: 'Detalla los requisitos de ingreso (+18, PayPal, constancia y costo $0).',
    sampleTrigger: '¿Cuáles son los requisitos de ingreso?',
  },
  {
    command: '“Beneficios” o “Baneos”',
    description: 'Muestra el soporte contra baneos, capacitación y comunidad de creadores.',
    sampleTrigger: '¿Qué beneficios tengo y cómo protegen mi cuenta de baneos?',
  },
  {
    command: '“Contactar asesor 1” o “Abrir WhatsApp 1”',
    description: 'Te prepara el enlace directo con el Asesor Principal (+58 424-7418161).',
    sampleTrigger: 'Quiero contactar al asesor 1 por WhatsApp',
  },
  {
    command: '“Contactar asesor 2” o “Abrir WhatsApp 2”',
    description: 'Te prepara el enlace directo con el Asesor Alternativo (+58 4129126548).',
    sampleTrigger: 'Quiero contactar al asesor 2 por WhatsApp',
  },
];

export interface AIResponseResult {
  markdown: string;
  speechText: string;
  intentLabel: string;
  detectedLeague?: CreatorLeague;
  triggerWhatsAppOption?: 1 | 2;
}

const WHATSAPP_CLOSING_MARKDOWN = `🚀 **¿Listo para empezar a ganar?** Haz clic en cualquiera de nuestros enlaces oficiales para que un asesor humano finalice tu registro ahora mismo:

👉 [**CONTACTAR ASESOR 1 (+58 424-7418161)**](https://wa.me/584247418161?text=Hola%20Agencia%20Planeta,%20soy%20creador%20de%20TikTok%20y%20quiero%20unirme%20para%20empezar%20a%20ganar)

👉 [**CONTACTAR ASESOR 2 (+58 4129126548)**](https://wa.me/584129126548?text=Hola%20Agencia%20Planeta,%20soy%20creador%20de%20TikTok%20y%20quiero%20unirme%20para%20empezar%20a%20ganar)`;

const WHATSAPP_CLOSING_SPEECH =
  '¿Estás listo para empezar a ganar? Haz clic en cualquiera de los dos botones oficiales de WhatsApp en pantalla para contactar al Asesor 1 o al Asesor 2 y finalizar tu registro 100 por ciento gratis.';

export const INITIAL_WELCOME_MESSAGE: AIResponseResult = {
  intentLabel: 'Bienvenida Oficial • IA Agencia Planeta',
  markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. Es un gusto saludarte y darte la bienvenida.

Somos una agencia líder en el impulso de talentos en **TikTok LIVE** (especialmente creadores de las ligas **D1, C y B**). Te ayudamos a transformar tus transmisiones en una fuente de ingresos constante con estrategias de crecimiento, acceso a **Batallas Oficiales** y soporte técnico contra baneos.

* 💎 **Meta y Pagos:** Gana desde **$50 hasta $100 USD** mensuales al alcanzar los **100K Diamantes**, pagados directamente a tu cuenta de **PayPal**.
* 🆓 **Ingreso 100% GRATUITO:** No cobramos absolutamente nada por entrar.
* 🎙️ **Comandos de Voz Activos:** Puedes escribirme o tocar el botón del **Micrófono** para hablarme con tu voz y te responderé al instante.

${WHATSAPP_CLOSING_MARKDOWN}`,
  speechText:
    '¡Hola! Soy el Asistente de Inteligencia Artificial de Agencia Planeta. Es un gusto saludarte. Ayudamos a creadores de TikTok LIVE de las ligas D1, C y B a profesionalizar su contenido, proteger su cuenta contra baneos y ganar entre 50 y 100 dólares mensuales por PayPal al alcanzar los 100 mil diamantes. Unirse es 100 por ciento gratis. Puedes hablarme usando el micrófono o hacer clic en los enlaces oficiales de WhatsApp para registrarte ahora mismo.',
};

export function generateAIResponse(userInput: string): AIResponseResult {
  const normalized = userInput
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();

  // Detect specific league mention (D1, C, B)
  let detectedLeague: CreatorLeague | undefined;
  if (/\b(d1|liga d1|liga d)\b/.test(normalized)) {
    detectedLeague = 'D1';
  } else if (/\b(liga c|soy c|nivel c)\b/.test(normalized)) {
    detectedLeague = 'C';
  } else if (/\b(liga b|soy b|nivel b)\b/.test(normalized)) {
    detectedLeague = 'B';
  }

  // 1. Voice command to directly contact Advisor 1 or Advisor 2
  if (
    normalized.includes('asesor 1') ||
    normalized.includes('whatsapp 1') ||
    normalized.includes('opcion 1') ||
    normalized.includes('principal') ||
    normalized.includes('424')
  ) {
    return {
      intentLabel: 'Comando de Voz • Conexión WhatsApp Principal',
      triggerWhatsAppOption: 1,
      markdown: `¡Excelente decisión! 🤖 Soy el **Asistente de IA de Agencia Planeta** y ya preparé tu acceso directo con nuestro **WhatsApp Principal**.

Recuerda que tu ingreso a **Agencia Planeta** es **100% GRATIS**, recibirás soporte contra baneos, acceso a **Batallas Oficiales** y pagos de **$50 a $100 USD** mensuales vía **PayPal** al alcanzar los **100K Diamantes**.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText:
        '¡Excelente decisión! Soy el Asistente de IA de Agencia Planeta. He preparado tu enlace directo con nuestro Asesor 1 en el WhatsApp Principal. Recuerda que unirte es 100 por ciento gratis y podrás ganar entre 50 y 100 dólares mensuales por PayPal. Haz clic en el botón del Asesor 1 para enviar tu mensaje automático.',
    };
  }

  if (
    normalized.includes('asesor 2') ||
    normalized.includes('whatsapp 2') ||
    normalized.includes('opcion 2') ||
    normalized.includes('alternativo') ||
    normalized.includes('412')
  ) {
    return {
      intentLabel: 'Comando de Voz • Conexión WhatsApp Alternativo',
      triggerWhatsAppOption: 2,
      markdown: `¡Perfecto! 🤖 Soy el **Asistente de IA de Agencia Planeta** y tienes listo el canal directo con nuestro **WhatsApp Alternativo**.

Unirte a **Agencia Planeta** es **100% GRATIS**. Tendrás respaldo técnico personalizado, participación en **Batallas Oficiales** y recompensas desde **$50 hasta $100 USD** mensuales directo a tu **PayPal** al lograr la meta de **100K Diamantes**.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText:
        '¡Perfecto! Soy el Asistente de IA de Agencia Planeta. Tienes listo el enlace directo con nuestro Asesor 2 en el WhatsApp Alternativo. Recuerda que el ingreso es 100 por ciento gratuito. Haz clic en el botón del Asesor 2 para iniciar tu registro inmediato.',
    };
  }

  // 2. Exact Model Example or combined "how to join + how much do you pay"
  const asksHowToJoin =
    normalized.includes('como puedo entrar') ||
    normalized.includes('como entrar') ||
    normalized.includes('como ingreso') ||
    normalized.includes('entrar a la agencia');
  const asksPayment =
    normalized.includes('cuanto pagan') ||
    normalized.includes('pago') ||
    normalized.includes('pagan') ||
    normalized.includes('ganar') ||
    normalized.includes('dinero') ||
    normalized.includes('diamante') ||
    normalized.includes('paypal') ||
    normalized.includes('dolar');

  if (asksHowToJoin && asksPayment) {
    return {
      intentLabel: 'Ingreso y Sistema de Pagos • Agencia Planeta',
      detectedLeague,
      markdown: `¡Hola! 🤖 Soy el Asistente de IA de **Agencia Planeta**. Es un gusto saludarte.

Para entrar a nuestra agencia y empezar a profesionalizar tus LIVES de TikTok, solo necesitas ser **mayor de 18 años (+18)**, ser constante en tus transmisiones y tener una cuenta de **PayPal**. ¡Y lo mejor es que **unirse es 100% GRATIS**!

**Sobre los pagos:**
* 💰 **Monto:** Recibes entre **$50 y $100 USD** mensuales al alcanzar la meta de **100K diamantes**.
* 💳 **Método:** Pago directo a tu cuenta de **PayPal**.
* ✅ **Garantía:** Pagos seguros, mensuales y con total transparencia.

Como creador, también recibirás asesoría para evitar baneos y acceso a **Batallas Oficiales** para subir de liga rápidamente.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Es un gusto saludarte. Para entrar a nuestra agencia y empezar a profesionalizar tus LIVES de TikTok, solo necesitas ser mayor de 18 años, ser constante en tus transmisiones y tener una cuenta de PayPal. ¡Y lo mejor es que unirse es 100 por ciento GRATIS! Sobre los pagos: recibes entre 50 y 100 dólares mensuales al alcanzar la meta de 100 mil diamantes, con pago directo a tu cuenta de PayPal y total transparencia. Como creador, también recibirás asesoría para evitar baneos y acceso a Batallas Oficiales para subir de liga rápidamente. ${WHATSAPP_CLOSING_SPEECH}`,
    };
  }

  // 3. League D1, C, B specific persuasion rule
  if (
    detectedLeague ||
    normalized.includes('liga') ||
    normalized.includes('d1') ||
    normalized.includes('subir de nivel') ||
    normalized.includes('escalar')
  ) {
    const leagueTag = detectedLeague ? `Liga ${detectedLeague}` : 'Ligas D1, C y B';
    const leagueDetails = detectedLeague ? LEAGUES_DATA[detectedLeague] : null;

    return {
      intentLabel: `Especialista en ${leagueTag} • Impulso Oficial`,
      detectedLeague: detectedLeague || 'D1',
      markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. ¡Qué gran noticia que estés en **${leagueTag}**!

Para creadores de **${leagueTag}**, **Agencia Planeta es el impulso perfecto para subir de nivel y proteger tu cuenta contra baneos**. Nuestro equipo trabaja contigo paso a paso para que tus transmisiones sean más rentables y seguras:

* 🛡️ **Soporte Personalizado Anti-Baneos:** Equipo dedicado a resolver bloqueos, problemas de cuenta y optimización de tu perfil.
* ⚔️ **Eventos y Batallas Oficiales:** Participación en dinámicas exclusivas de TikTok para escalar ligas rápidamente${leagueDetails ? ` (${leagueDetails.battleAccess})` : ''}.
* 📈 **Asesoría y Capacitación:** Estrategias probadas para retener audiencia y aumentar la recepción de regalos.
* 🤝 **Comunidad Activa:** Conexión con otros creadores para colaboraciones y crecimiento mutuo.
* 💵 **Recompensas Mensuales:** Al alcanzar los **100K Diamantes**, recibes pagos recurrentes desde **$50 hasta $100 USD** directos a tu **PayPal** (${leagueDetails ? `estimado en tu liga: **${leagueDetails.estimatedRange}**` : 'pagos 100% seguros en dólares'}).

Recuerda que entrar es **100% GRATIS** (solo necesitas ser **+18 años** y tener **PayPal**).

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Si eres creador de ${leagueTag}, nuestra agencia es el impulso perfecto para subir de nivel y proteger tu cuenta contra baneos. Te brindamos soporte personalizado contra restricciones, acceso a Batallas Oficiales de TikTok para escalar rápido, capacitación para recibir más regalos y pagos mensuales desde 50 hasta 100 dólares por PayPal al alcanzar los 100 mil diamantes. Y recuerda que el servicio es 100 por ciento gratuito. ${WHATSAPP_CLOSING_SPEECH}`,
    };
  }

  // 4. Payments, Diamonds & PayPal inquiries
  if (asksPayment) {
    return {
      intentLabel: 'Sistema de Pagos y Recompensas • PayPal USD',
      markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. Con gusto te explico con total transparencia cómo funciona nuestro **Sistema de Pagos y Recompensas**:

* 💎 **Meta Mensual:** Al alcanzar los **100K Diamantes** acumulados en tus LIVEs de TikTok.
* 💵 **Monto de Pago:** Recibes pagos mensuales recurrentes desde **$50 hasta $100 USD**.
* 💳 **Método de Pago:** Transferencias directas a tu cuenta activa de **PayPal**.
* 🌎 **Moneda:** Dólares estadounidenses (**USD**).
* 🔒 **Seguridad Total:** Pagos **100% seguros**, sin letras pequeñas y con transparencia total. ¡Además, pertenecer a la agencia es **100% GRATIS**!

Si estás en las ligas **D1, C o B**, nuestra agencia es el **impulso perfecto para subir de nivel y proteger tu cuenta contra baneos** mientras alcanzas tus **100K Diamantes** más rápido con **Batallas Oficiales**.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Te explico nuestro sistema de pagos: al alcanzar la meta de 100 mil diamantes en tus LIVES, recibes pagos mensuales recurrentes desde 50 hasta 100 dólares estadounidenses mediante transferencia directa a tu cuenta de PayPal. Son pagos 100 por ciento seguros, sin letras pequeñas y unirte a la agencia es totalmente gratis. ${WHATSAPP_CLOSING_SPEECH}`,
    };
  }

  // 5. Requirements & Cost ("¿Es gratis?", "Requisitos", "Edad")
  if (
    normalized.includes('requisito') ||
    normalized.includes('gratis') ||
    normalized.includes('costo') ||
    normalized.includes('cobran') ||
    normalized.includes('edad') ||
    normalized.includes('18') ||
    normalized.includes('necesito')
  ) {
    return {
      intentLabel: 'Requisitos de Ingreso • 100% Gratuito',
      markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. Unirse a nuestro equipo es muy sencillo y **no tiene ningún costo**.

### 📋 Requisitos Oficiales de Ingreso:
* 🔥 **Actitud y Constancia:** Tener ganas de crecer y ser constante en tus transmisiones de **TikTok LIVE**.
* 🔞 **Mayoría de Edad:** Ser mayor de 18 años (**+18**).
* 💳 **Cuenta de Cobro:** Contar con una cuenta activa de **PayPal** para recibir tus pagos en dólares (**$50 a $100 USD** al llegar a los **100K Diamantes**).
* 🆓 **Costo:** **¡Es 100% GRATIS!** No se cobra absolutamente nada por entrar ni por recibir capacitación.

Además, si perteneces a las ligas **D1, C o B**, Agencia Planeta es el **impulso perfecto para subir de nivel y proteger tu cuenta contra baneos**.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Los requisitos para ingresar son muy sencillos: tener ganas de crecer y ser constante en tus LIVES, ser mayor de 18 años y contar con una cuenta activa de PayPal para recibir tus pagos de 50 a 100 dólares mensuales. ¡El ingreso es 100 por ciento GRATIS! No cobramos nada por entrar. ${WHATSAPP_CLOSING_SPEECH}`,
    };
  }

  // 6. Benefits, Bans, Official Battles, Community
  if (
    normalized.includes('beneficio') ||
    normalized.includes('baneo') ||
    normalized.includes('bloqueo') ||
    normalized.includes('batalla') ||
    normalized.includes('evento') ||
    normalized.includes('ayuda') ||
    normalized.includes('soporte') ||
    normalized.includes('comunidad')
  ) {
    return {
      intentLabel: 'Beneficios Exclusivos • Ligas D1, C y B',
      markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. Nuestro objetivo es que nunca transmitas solo y que conviertas tus LIVEs en ingresos reales.

Si eres creador de **Liga D1, C o B**, nuestra agencia es el **impulso perfecto para subir de nivel y proteger tu cuenta contra baneos**:

### 💎 Beneficios Exclusivos:
* 🎯 **Asesoría y Capacitación:** Estrategias efectivas para retener audiencia y aumentar la recepción de regalos en cada transmisión.
* ⚔️ **Eventos y Batallas Oficiales:** Participación en dinámicas exclusivas de TikTok para escalar ligas rápidamente.
* 🛡️ **Soporte Personalizado:** Equipo dedicado a resolver **baneos**, problemas de cuenta y optimización de perfil.
* 🤝 **Comunidad de Creadores:** Conexión directa con otros talentos para colaboraciones, batallas PK y crecimiento mutuo.
* 💵 **Pagos Mensuales:** Desde **$50 hasta $100 USD** vía **PayPal** al alcanzar la meta de **100K Diamantes**. ¡Y todo el servicio es **100% GRATIS**!

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Al unirte gratis obtienes cuatro grandes beneficios para las ligas D1, C y B: asesoría y capacitación para recibir más regalos, participación en Eventos y Batallas Oficiales de TikTok, soporte personalizado para resolver baneos o problemas de cuenta, y una comunidad activa de creadores, además de pagos de 50 a 100 dólares por PayPal al alcanzar los 100 mil diamantes. ${WHATSAPP_CLOSING_SPEECH}`,
    };
  }

  // 7. Ready to register / WhatsApp / Human advisor
  if (
    normalized.includes('unirme') ||
    normalized.includes('registrar') ||
    normalized.includes('registro') ||
    normalized.includes('whatsapp') ||
    normalized.includes('asesor') ||
    normalized.includes('humano') ||
    normalized.includes('contacto') ||
    normalized.includes('entrar ya') ||
    normalized.includes('listo')
  ) {
    return {
      intentLabel: 'Registro Directo • Atención Humana en WhatsApp',
      markdown: `¡Excelente paso! 🤖 Soy el **Asistente de IA de Agencia Planeta** y me alegra mucho darte la bienvenida a nuestra comunidad de creadores.

Recuerda los puntos clave antes de hablar con nuestro equipo:
* ✅ Servicio **100% GRATUITO** (nunca te cobraremos por entrar).
* 💵 Pagos de **$50 a $100 USD** mensuales por **PayPal** al lograr **100K Diamantes**.
* 🛡️ El **impulso perfecto para subir de nivel en Ligas D1, C y B y proteger tu cuenta contra baneos**.
* 📋 Solo necesitas ser **+18 años**, tener **PayPal** y constancia en tus LIVEs.

${WHATSAPP_CLOSING_MARKDOWN}`,
      speechText: `¡Excelente paso! Soy el Asistente de IA de Agencia Planeta. Recuerda que nuestro servicio es 100 por ciento gratuito, protegemos tu cuenta contra baneos y recibes entre 50 y 100 dólares mensuales por PayPal al llegar a los 100 mil diamantes. Elige ahora mismo cualquiera de los dos enlaces oficiales de WhatsApp aquí abajo para que un asesor humano finalice tu registro.`,
    };
  }

  // 8. Comprehensive default response covering all essential knowledge
  return {
    intentLabel: 'Asesoría Oficial • Asistente IA Agencia Planeta',
    markdown: `¡Hola! 🤖 Soy el **Asistente de IA de Agencia Planeta**. Estoy aquí para ayudarte a profesionalizar tus transmisiones de **TikTok LIVE** y monetizar tu talento.

Si eres creador de las ligas **D1, C o B**, **Agencia Planeta es el impulso perfecto para subir de nivel y proteger tu cuenta contra baneos**:

* 💵 **Sistema de Pagos:** Ganancias mensuales recurrentes desde **$50 hasta $100 USD** al alcanzar los **100K Diamantes**, transferidos directamente a tu **PayPal** con transparencia total.
* 💎 **Beneficios Clave:** Capacitación para multiplicar regalos, **Eventos y Batallas Oficiales**, soporte personalizado contra baneos y comunidad de creadores.
* 📋 **Requisitos Simples:** Ser mayor de 18 años (**+18**), tener cuenta activa de **PayPal** y ser constante en tus LIVEs.
* 🆓 **Costo:** ¡Unirse es **100% GRATIS**!

${WHATSAPP_CLOSING_MARKDOWN}`,
    speechText: `¡Hola! Soy el Asistente de IA de Agencia Planeta. Si eres creador de TikTok LIVE en las ligas D1, C o B, somos el impulso perfecto para subir de nivel y proteger tu cuenta contra baneos. Ganarás desde 50 hasta 100 dólares mensuales directo a tu PayPal al alcanzar los 100 mil diamantes, con acceso a Batallas Oficiales y soporte técnico. Solo necesitas ser mayor de 18 años, ser constante y tener PayPal. ¡Unirse es 100 por ciento gratis! ${WHATSAPP_CLOSING_SPEECH}`,
  };
}
