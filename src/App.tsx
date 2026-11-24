import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  Square,
  MessageCircle,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Radio,
  CheckCircle2,
  Headphones,
} from 'lucide-react';
import {
  CreatorLeague,
  INITIAL_WELCOME_MESSAGE,
  QUICK_PROMPT_CHIPS,
  WHATSAPP_CHANNELS,
  generateAIResponse,
} from './data/agenciaPlanetaAI';
import { BotLogoAvatar } from './components/BotLogoAvatar';
import { MessageContent } from './components/MessageContent';
import { CreatorConversionPanel } from './components/CreatorConversionPanel';
import agenciaPlanetaLogo from './assets/agencia-planeta-logo.png';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  markdown: string;
  speechText?: string;
  intentLabel?: string;
  isVoiceInput?: boolean;
  timestamp: string;
}

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

const DEFAULT_LOGO_PATH = agenciaPlanetaLogo;
const CUSTOM_LOGO_STORAGE_KEY = 'agencia_planeta_custom_logo_v1';

function getCurrentTimeFormatted(): string {
  try {
    return new Date().toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return 'Ahora';
  }
}

export function App() {
  // Logo state (defaults to the official generated Agencia Planeta bot logo)
  const [logoSrc, setLogoSrc] = useState<string>(() => {
    try {
      return localStorage.getItem(CUSTOM_LOGO_STORAGE_KEY) || DEFAULT_LOGO_PATH;
    } catch {
      return DEFAULT_LOGO_PATH;
    }
  });
  const isCustomLogo = logoSrc !== DEFAULT_LOGO_PATH;

  // Conversation state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      markdown: INITIAL_WELCOME_MESSAGE.markdown,
      speechText: INITIAL_WELCOME_MESSAGE.speechText,
      intentLabel: INITIAL_WELCOME_MESSAGE.intentLabel,
      timestamp: getCurrentTimeFormatted(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedLeague, setSelectedLeague] = useState<CreatorLeague>('D1');

  // Voice Recognition & Speech Synthesis state
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(true);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [liveTranscript, setLiveTranscript] = useState<string>('');
  const [voiceStatusMsg, setVoiceStatusMsg] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [speechSupported, setSpeechSupported] = useState<boolean>(true);

  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const latestTranscriptRef = useRef<string>('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, scrollToBottom]);

  // Preload Spanish voices for SpeechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.getVoices();
      const handleVoicesChanged = () => {
        window.speechSynthesis.getVoices();
      };
      window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
      };
    }
  }, []);

  // Stop speaking helper
  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingMessageId(null);
  }, []);

  // Speak text aloud in Spanish
  const speakResponse = useCallback(
    (textToSpeak: string, messageId: string, forceSpeak = false) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        return;
      }
      if (!voiceEnabled && !forceSpeak) {
        return;
      }

      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'es-ES';
        utterance.rate = 1.03;
        utterance.pitch = 1.0;

        // Pick best Spanish voice available
        const voices = window.speechSynthesis.getVoices();
        const spanishVoices = voices.filter((v) =>
          v.lang.toLowerCase().startsWith('es')
        );
        const preferredVoice =
          spanishVoices.find(
            (v) =>
              v.name.toLowerCase().includes('google') ||
              v.name.toLowerCase().includes('natural') ||
              v.name.toLowerCase().includes('paulina') ||
              v.name.toLowerCase().includes('sabina') ||
              v.name.toLowerCase().includes('monica') ||
              v.name.toLowerCase().includes('helena')
          ) || spanishVoices[0];

        if (preferredVoice) {
          utterance.voice = preferredVoice;
          utterance.lang = preferredVoice.lang;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          setSpeakingMessageId(messageId);
        };
        utterance.onend = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        };
        utterance.onerror = () => {
          setIsSpeaking(false);
          setSpeakingMessageId(null);
        };

        window.speechSynthesis.speak(utterance);
      } catch {
        setIsSpeaking(false);
        setSpeakingMessageId(null);
      }
    },
    [voiceEnabled]
  );

  // Process user query (from text, quick chip, or voice command)
  const handleSendMessage = useCallback(
    (rawText: string, fromVoice = false) => {
      const trimmed = rawText.trim();
      if (!trimmed) return;

      stopSpeaking();

      const userMsg: ChatMessage = {
        id: `user-${Date.now()}`,
        sender: 'user',
        markdown: trimmed,
        isVoiceInput: fromVoice,
        timestamp: getCurrentTimeFormatted(),
      };

      setMessages((prev) => [...prev, userMsg]);
      setInputText('');
      setLiveTranscript('');
      latestTranscriptRef.current = '';
      setIsTyping(true);

      setTimeout(() => {
        const aiResult = generateAIResponse(trimmed);
        if (aiResult.detectedLeague) {
          setSelectedLeague(aiResult.detectedLeague);
        }

        const aiMsgId = `ai-${Date.now()}`;
        const aiMsg: ChatMessage = {
          id: aiMsgId,
          sender: 'ai',
          markdown: aiResult.markdown,
          speechText: aiResult.speechText,
          intentLabel: aiResult.intentLabel,
          timestamp: getCurrentTimeFormatted(),
        };

        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);

        // Speak the AI response automatically if voiceEnabled or if triggered by voice command
        speakResponse(aiResult.speechText, aiMsgId, fromVoice);
      }, 380);
    },
    [speakResponse, stopSpeaking]
  );

  // Check Web Speech API support on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
    }
  }, []);

  // Toggle Microphone Voice Recognition
  const toggleListening = useCallback(() => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    stopSpeaking();

    const SpeechRecognitionAPI =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognitionInstance })
        .SpeechRecognition ||
      (
        window as unknown as {
          webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
        }
      ).webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setSpeechSupported(false);
      setVoiceStatusMsg(
        'Tu navegador actual no soporta micrófono directo. Usa los botones de Comandos de Voz Rápidos para hablar con el Asistente.'
      );
      return;
    }

    try {
      const recognition = new SpeechRecognitionAPI();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onstart = () => {
        setIsListening(true);
        setLiveTranscript('');
        latestTranscriptRef.current = '';
        setVoiceStatusMsg('🎙️ Escuchando tu comando de voz... Habla ahora');
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPiece = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcriptPiece;
          } else {
            interim += transcriptPiece;
          }
        }

        const currentText = (finalTranscript || interim).trim();
        setLiveTranscript(currentText);
        latestTranscriptRef.current = currentText;
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        if (event.error === 'not-allowed') {
          setVoiceStatusMsg(
            'Permiso de micrófono denegado en el navegador. Puedes tocar cualquier comando de voz sugerido para que el asistente te responda con voz.'
          );
        } else if (event.error === 'no-speech') {
          setVoiceStatusMsg('No se detectó voz. Toca el micrófono e intenta de nuevo.');
        } else {
          setVoiceStatusMsg('Micrófono finalizado. Puedes volver a tocar para hablar.');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        const recognizedText = latestTranscriptRef.current.trim();
        if (recognizedText) {
          setVoiceStatusMsg(`Comando reconocido: “${recognizedText}”`);
          handleSendMessage(recognizedText, true);
        } else {
          setVoiceStatusMsg('');
        }
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch {
      setIsListening(false);
      setVoiceStatusMsg(
        'No se pudo iniciar el micrófono. Prueba los comandos de voz interactivos.'
      );
    }
  }, [handleSendMessage, isListening, stopSpeaking]);

  // Handle custom logo upload & reset
  const handleUploadCustomLogo = (newDataUrl: string) => {
    setLogoSrc(newDataUrl);
    try {
      localStorage.setItem(CUSTOM_LOGO_STORAGE_KEY, newDataUrl);
    } catch {
      // ignore storage quota errors
    }
  };

  const handleResetLogo = () => {
    setLogoSrc(DEFAULT_LOGO_PATH);
    try {
      localStorage.removeItem(CUSTOM_LOGO_STORAGE_KEY);
    } catch {
      // ignore
    }
  };

  const handleResetConversation = () => {
    stopSpeaking();
    const resetMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'ai',
      markdown: INITIAL_WELCOME_MESSAGE.markdown,
      speechText: INITIAL_WELCOME_MESSAGE.speechText,
      intentLabel: INITIAL_WELCOME_MESSAGE.intentLabel,
      timestamp: getCurrentTimeFormatted(),
    };
    setMessages([resetMsg]);
    speakResponse(INITIAL_WELCOME_MESSAGE.speechText, resetMsg.id, false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    handleSendMessage(inputText, false);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-[#F8FAFC] flex flex-col relative selection:bg-[#FE2C55]/30 selection:text-[#25F4EE]">
      {/* Ambient Studio Lighting Backdrop */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div
          className="absolute -top-32 left-1/4 h-96 w-96 rounded-full opacity-15 blur-[110px]"
          style={{ background: '#FE2C55' }}
        />
        <div
          className="absolute top-1/3 -right-24 h-96 w-96 rounded-full opacity-12 blur-[120px]"
          style={{ background: '#25F4EE' }}
        />
        <div
          className="absolute -bottom-32 left-1/3 h-80 w-80 rounded-full opacity-10 blur-[100px]"
          style={{ background: '#25D366' }}
        />
      </div>

      {/* Top Studio Header Bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#090A0F]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Left: Official Bot Logo + Brand Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <BotLogoAvatar
              logoSrc={logoSrc}
              size="md"
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="truncate font-display text-base sm:text-lg font-bold tracking-tight text-white">
                  Agencia Planeta
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-[#FE2C55]/40 bg-[#FE2C55]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#FF5E7E]">
                  <Radio className="h-2.5 w-2.5 animate-pulse" />
                  <span>TikTok LIVE</span>
                </span>
              </div>
              <p className="truncate text-xs text-[#94A3B8]">
                Asistente de IA Oficial • Ligas <strong className="text-white">D1, C y B</strong> •{' '}
                <strong className="text-[#10B981]">100% Gratis</strong>
              </p>
            </div>
          </div>

          {/* Right: Voice Status Controls & Quick WhatsApp Header Links */}
          <div className="flex items-center gap-2">
            {/* Active Speaking Indicator / Stop Audio Button */}
            {isSpeaking && (
              <button
                type="button"
                onClick={stopSpeaking}
                className="inline-flex items-center gap-2 rounded-xl border border-[#25F4EE]/50 bg-[#25F4EE]/15 px-3 py-1.5 text-xs font-bold text-[#25F4EE] hover:bg-[#25F4EE]/25 transition-all cursor-pointer"
                title="Detener respuesta de voz"
              >
                <span className="flex items-end gap-0.5 h-3.5">
                  <span className="w-0.5 bg-[#25F4EE] rounded-full animate-eq-1" />
                  <span className="w-0.5 bg-[#FE2C55] rounded-full animate-eq-2" />
                  <span className="w-0.5 bg-[#25F4EE] rounded-full animate-eq-3" />
                </span>
                <span className="hidden md:inline">IA Hablando</span>
                <Square className="h-3 w-3 fill-current" />
              </button>
            )}

            {/* Toggle Voice Synthesis On/Off */}
            <button
              type="button"
              onClick={() => {
                if (voiceEnabled) {
                  stopSpeaking();
                }
                setVoiceEnabled((prev) => !prev);
              }}
              className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                voiceEnabled
                  ? 'border-[#25F4EE]/40 bg-[#25F4EE]/10 text-[#25F4EE] hover:bg-[#25F4EE]/20'
                  : 'border-white/10 bg-white/5 text-[#94A3B8] hover:text-white'
              }`}
              title={
                voiceEnabled
                  ? 'Respuesta por voz activada (clic para silenciar)'
                  : 'Respuesta por voz silenciada (clic para activar)'
              }
            >
              {voiceEnabled ? (
                <>
                  <Volume2 className="h-4 w-4 text-[#25F4EE]" />
                  <span className="hidden sm:inline">Voz IA: Activa</span>
                </>
              ) : (
                <>
                  <VolumeX className="h-4 w-4 text-[#94A3B8]" />
                  <span className="hidden sm:inline">Voz IA: Silenciada</span>
                </>
              )}
            </button>

            {/* Quick WhatsApp Header Direct CTA */}
            <a
              href={WHATSAPP_CHANNELS[0].url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-[#25D366] px-3.5 py-1.5 text-xs font-bold text-[#041B0D] shadow-[0_0_20px_rgba(37,211,102,0.3)] hover:bg-[#22c35e] transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp 1 (+58 424-7418161)</span>
              <ExternalLink className="h-3 w-3" />
            </a>

            <a
              href={WHATSAPP_CHANNELS[1].url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden xl:inline-flex items-center gap-1.5 rounded-xl border border-[#25D366]/50 bg-[#25D366]/15 px-3 py-1.5 text-xs font-bold text-[#25D366] hover:bg-[#25D366]/25 transition-all"
            >
              <MessageCircle className="h-3.5 w-3.5 fill-current" />
              <span>WhatsApp 2 (+58 4129126548)</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Workspace Grid (2 Columns on Desktop, Stacked on Mobile) */}
      <main className="relative z-10 mx-auto flex-1 w-full max-w-[1280px] px-4 py-5 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT / PRIMARY COLUMN: Interactive AI Assistant Voice & Chat Console (7 cols) */}
          <section className="lg:col-span-7 flex flex-col rounded-2xl border border-white/10 bg-[#12141D]/90 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden">
            {/* Console Subheader with Bot Logo & Voice Command Trigger */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-[#090A0F]/60 px-4 py-3.5 sm:px-5">
              <div className="flex items-center gap-3">
                <BotLogoAvatar
                  logoSrc={logoSrc}
                  size="sm"
                  isSpeaking={isSpeaking}
                  isListening={isListening}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display text-sm font-bold text-white">
                      Asistente de IA de Agencia Planeta
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md bg-[#10B981]/15 px-1.5 py-0.5 text-[10px] font-bold text-[#10B981]">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Verificado
                    </span>
                  </div>
                  <p className="text-[11px] text-[#94A3B8]">
                    Reconocimiento de comandos de voz y respuesta hablada en español
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    speakResponse(
                      messages[messages.length - 1]?.speechText ||
                        INITIAL_WELCOME_MESSAGE.speechText,
                      messages[messages.length - 1]?.id || 'welcome-msg',
                      true
                    )
                  }
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#25F4EE]/30 bg-[#25F4EE]/10 px-2.5 py-1.5 text-xs font-semibold text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-colors cursor-pointer"
                  title="Escuchar última respuesta con voz"
                >
                  <Headphones className="h-3.5 w-3.5" />
                  <span>Escuchar IA</span>
                </button>
                <button
                  type="button"
                  onClick={handleResetConversation}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs text-[#94A3B8] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  title="Reiniciar conversación"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Active Voice Command HUD Banner */}
            {(isListening || liveTranscript || voiceStatusMsg) && (
              <div
                className={`flex items-center justify-between gap-3 border-b px-4 py-2.5 text-xs transition-all ${
                  isListening
                    ? 'border-[#FE2C55]/50 bg-gradient-to-r from-[#FE2C55]/20 via-[#25F4EE]/10 to-[#FE2C55]/20 text-white'
                    : 'border-white/10 bg-[#090A0F]/80 text-[#CBD5E1]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {isListening ? (
                    <span className="flex items-end gap-0.5 h-4 shrink-0">
                      <span className="w-1 bg-[#FE2C55] rounded-full animate-eq-1" />
                      <span className="w-1 bg-[#25F4EE] rounded-full animate-eq-2" />
                      <span className="w-1 bg-[#FE2C55] rounded-full animate-eq-3" />
                      <span className="w-1 bg-[#25F4EE] rounded-full animate-eq-4" />
                      <span className="w-1 bg-[#FE2C55] rounded-full animate-eq-5" />
                    </span>
                  ) : (
                    <Mic className="h-4 w-4 text-[#25F4EE] shrink-0" />
                  )}
                  <p className="truncate font-medium">
                    {liveTranscript ? (
                      <span>
                        Escuchando: <strong className="text-[#25F4EE]">“{liveTranscript}”</strong>
                      </span>
                    ) : (
                      voiceStatusMsg
                    )}
                  </p>
                </div>
                {isListening && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className="shrink-0 rounded-lg bg-[#FE2C55] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#e0244a] cursor-pointer"
                  >
                    Listo
                  </button>
                )}
              </div>
            )}

            {/* Chat Messages Stream */}
            <div className="flex-1 space-y-5 overflow-y-auto p-4 sm:p-5 max-h-[540px] min-h-[380px]">
              {messages.map((msg) => {
                const isAI = msg.sender === 'ai';
                const isThisMessageSpeaking = speakingMessageId === msg.id && isSpeaking;

                if (isAI) {
                  return (
                    <div key={msg.id} className="flex items-start gap-3">
                      <BotLogoAvatar
                        logoSrc={logoSrc}
                        size="sm"
                        isSpeaking={isThisMessageSpeaking}
                        showStatusDot={true}
                        className="mt-1"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              Asistente de IA • Agencia Planeta
                            </span>
                            {msg.intentLabel && (
                              <span className="rounded-md border border-[#25F4EE]/30 bg-[#25F4EE]/10 px-2 py-0.5 text-[10px] font-semibold text-[#25F4EE]">
                                {msg.intentLabel}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            {msg.speechText && (
                              <button
                                type="button"
                                onClick={() =>
                                  isThisMessageSpeaking
                                    ? stopSpeaking()
                                    : speakResponse(msg.speechText!, msg.id, true)
                                }
                                className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors cursor-pointer ${
                                  isThisMessageSpeaking
                                    ? 'bg-[#25F4EE] text-[#05191A]'
                                    : 'bg-white/5 text-[#94A3B8] hover:bg-white/10 hover:text-white'
                                }`}
                              >
                                {isThisMessageSpeaking ? (
                                  <>
                                    <Square className="h-2.5 w-2.5 fill-current" />
                                    <span>Detener voz</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="h-3 w-3 text-[#25F4EE]" />
                                    <span>Escuchar voz</span>
                                  </>
                                )}
                              </button>
                            )}
                            <span className="text-[10px] text-[#64748B]">{msg.timestamp}</span>
                          </div>
                        </div>

                        <div
                          className={`rounded-2xl rounded-tl-sm border p-4 transition-all ${
                            isThisMessageSpeaking
                              ? 'border-[#25F4EE]/50 bg-[#171A26] shadow-[0_0_25px_rgba(37,244,238,0.12)]'
                              : 'border-white/10 bg-[#171A26]/90'
                          }`}
                        >
                          <MessageContent markdown={msg.markdown} />
                        </div>
                      </div>
                    </div>
                  );
                }

                // User Message Bubble
                return (
                  <div key={msg.id} className="flex flex-col items-end">
                    <div className="mb-1 flex items-center gap-1.5 text-[11px] text-[#94A3B8]">
                      {msg.isVoiceInput && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-[#FE2C55]/20 border border-[#FE2C55]/40 px-1.5 py-0.5 text-[10px] font-semibold text-[#FF5E7E]">
                          <Mic className="h-2.5 w-2.5" />
                          Comando de Voz
                        </span>
                      )}
                      <span>Tú • {msg.timestamp}</span>
                    </div>
                    <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-gradient-to-r from-[#FE2C55] to-[#D91E47] px-4 py-2.5 text-sm font-medium text-white shadow-[0_8px_20px_rgba(254,44,85,0.25)]">
                      {msg.markdown}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-3">
                  <BotLogoAvatar logoSrc={logoSrc} size="sm" isSpeaking={true} />
                  <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-[#171A26] px-4 py-3 text-xs text-[#94A3B8]">
                    <Sparkles className="h-3.5 w-3.5 animate-spin text-[#25F4EE]" />
                    <span>El Asistente de IA de Agencia Planeta está preparando tu respuesta...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Quick Voice & Question Chips */}
            <div className="border-t border-white/10 bg-[#090A0F]/70 px-4 py-2.5">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-semibold text-[#94A3B8]">
                  ⚡ Preguntas rápidas y comandos (toca o dilo por micrófono):
                </span>
                {!speechSupported && (
                  <span className="text-[10px] text-[#F59E0B]">
                    Modo voz interactivo activo
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {QUICK_PROMPT_CHIPS.map((chip) => (
                  <button
                    key={chip.id}
                    type="button"
                    onClick={() => handleSendMessage(chip.voicePhrase, true)}
                    className="shrink-0 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-[#E2E8F0] hover:border-[#25F4EE]/50 hover:bg-[#25F4EE]/15 hover:text-white transition-all cursor-pointer"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Voice Command & Text Input Bar */}
            <form
              onSubmit={handleFormSubmit}
              className="border-t border-white/10 bg-[#090A0F] p-3 sm:p-4"
            >
              <div className="flex items-center gap-2.5">
                {/* Primary Neon Microphone Voice Command Button */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className={`relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl font-bold transition-all cursor-pointer ${
                    isListening
                      ? 'bg-[#FE2C55] text-white shadow-[0_0_25px_rgba(254,44,85,0.7)] scale-105'
                      : 'border border-[#FE2C55]/50 bg-gradient-to-br from-[#FE2C55]/25 to-[#25F4EE]/20 text-white hover:border-[#FE2C55] hover:shadow-[0_0_20px_rgba(254,44,85,0.4)]'
                  }`}
                  title={
                    isListening
                      ? 'Detener grabación y enviar comando de voz'
                      : 'Hablar por micrófono (Reconocimiento de Comandos de Voz)'
                  }
                >
                  {isListening ? (
                    <MicOff className="h-5 w-5 animate-pulse" />
                  ) : (
                    <Mic className="h-5 w-5 text-[#25F4EE]" />
                  )}
                </button>

                {/* Text / Voice Transcript Input */}
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={isListening && liveTranscript ? liveTranscript : inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      isListening
                        ? 'Escuchando tu comando de voz en español...'
                        : 'Escribe tu duda o toca el micrófono 🎙️ (ej. "¿Cómo puedo entrar y cuánto pagan?")'
                    }
                    className="w-full rounded-xl border border-white/15 bg-[#12141D] px-4 py-3 text-sm text-white placeholder-[#64748B] focus:border-[#25F4EE] focus:outline-none focus:ring-1 focus:ring-[#25F4EE]"
                  />
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputText.trim() && !liveTranscript.trim()}
                  className="flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-[#FE2C55] to-[#FF476E] px-4 sm:px-5 text-xs sm:text-sm font-bold text-white shadow-[0_4px_20px_rgba(254,44,85,0.35)] hover:opacity-95 disabled:opacity-40 transition-all cursor-pointer"
                >
                  <span className="hidden sm:inline">Enviar</span>
                  <Send className="h-4 w-4" />
                </button>
              </div>

              {/* Bottom Persistent Dual WhatsApp Bar inside Chat Console for Mobile & Desktop */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2.5 border-t border-white/10">
                {WHATSAPP_CHANNELS.map((channel, index) => (
                  <a
                    key={channel.id}
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 rounded-xl border px-3 py-2 text-xs font-bold transition-all ${
                      index === 0
                        ? 'border-[#25D366]/60 bg-[#25D366]/20 text-[#F8FAFC] hover:bg-[#25D366] hover:text-[#041B0D]'
                        : 'border-[#25F4EE]/40 bg-[#25F4EE]/10 text-[#F8FAFC] hover:bg-[#25F4EE] hover:text-[#041B0D]'
                    }`}
                  >
                    <MessageCircle className="h-3.5 w-3.5 fill-current text-[#25D366] shrink-0" />
                    <span className="truncate">{channel.advisorTitle}</span>
                    <ExternalLink className="h-3 w-3 shrink-0 opacity-80" />
                  </a>
                ))}
              </div>
            </form>
          </section>

          {/* RIGHT / SECONDARY COLUMN: Bot Logo Showcase, WhatsApp Conversion Cards & League Simulator (5 cols) */}
          <aside className="lg:col-span-5">
            <CreatorConversionPanel
              selectedLeague={selectedLeague}
              onSelectLeague={setSelectedLeague}
              onAskLeagueStrategy={(league) =>
                handleSendMessage(
                  `Soy creador de Liga ${league} en TikTok LIVE, ¿cómo me ayuda Agencia Planeta a subir de nivel y cuánto puedo ganar?`,
                  true
                )
              }
              onTriggerVoiceCommand={(phrase) => handleSendMessage(phrase, true)}
              logoSrc={logoSrc}
              onUploadCustomLogo={handleUploadCustomLogo}
              onResetLogo={handleResetLogo}
              isCustomLogo={isCustomLogo}
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default App;
