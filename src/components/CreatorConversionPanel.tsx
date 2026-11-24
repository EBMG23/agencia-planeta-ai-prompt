import React, { useRef } from 'react';
import {
  ShieldCheck,
  Swords,
  Gem,
  DollarSign,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Mic,
  Volume2,
  Sparkles,
  ImagePlus,
  RotateCcw,
  Users,
  Award,
} from 'lucide-react';
import {
  CreatorLeague,
  LEAGUES_DATA,
  WHATSAPP_CHANNELS,
  VOICE_COMMANDS_GUIDE,
} from '../data/agenciaPlanetaAI';
import { BotLogoAvatar } from './BotLogoAvatar';

interface CreatorConversionPanelProps {
  selectedLeague: CreatorLeague;
  onSelectLeague: (league: CreatorLeague) => void;
  onAskLeagueStrategy: (league: CreatorLeague) => void;
  onTriggerVoiceCommand: (phrase: string) => void;
  logoSrc: string;
  onUploadCustomLogo: (newDataUrl: string) => void;
  onResetLogo: () => void;
  isCustomLogo: boolean;
  isSpeaking: boolean;
  isListening: boolean;
}

export const CreatorConversionPanel: React.FC<CreatorConversionPanelProps> = ({
  selectedLeague,
  onSelectLeague,
  onAskLeagueStrategy,
  onTriggerVoiceCommand,
  logoSrc,
  onUploadCustomLogo,
  onResetLogo,
  isCustomLogo,
  isSpeaking,
  isListening,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const currentLeague = LEAGUES_DATA[selectedLeague];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUploadCustomLogo(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 1. Official Bot Identity Card & Logo Showcase */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#12141D]/90 p-5 backdrop-blur-xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
        {/* Ambient radial glow */}
        <div
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-25 blur-2xl"
          style={{
            background: 'radial-gradient(circle, #FE2C55 0%, #25F4EE 60%, transparent 100%)',
          }}
        />

        <div className="relative flex flex-col sm:flex-row lg:flex-col xl:flex-row items-center gap-4">
          <div className="relative group">
            <BotLogoAvatar
              logoSrc={logoSrc}
              size="xl"
              isSpeaking={isSpeaking}
              isListening={isListening}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </div>

          <div className="flex-1 text-center sm:text-left lg:text-center xl:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[#25F4EE]/30 bg-[#25F4EE]/10 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-[#25F4EE]">
              <Sparkles className="h-3 w-3" />
              <span>IA Oficial TikTok LIVE</span>
            </div>
            <h2 className="mt-1.5 font-display text-lg font-bold text-white">
              Agencia Planeta AI Bot
            </h2>
            <p className="mt-0.5 text-xs text-[#94A3B8] leading-relaxed">
              Reclutamiento y asesoría para creadores de ligas{' '}
              <span className="font-semibold text-white">D1, C y B</span>. Ingreso{' '}
              <span className="font-semibold text-[#10B981]">100% GRATUITO</span>.
            </p>

            {/* Option to customize bot logo image if desired */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center sm:justify-start lg:justify-center xl:justify-start gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-[#CBD5E1] hover:border-[#25F4EE]/40 hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
                title="Subir o cambiar imagen del logo del bot"
              >
                <ImagePlus className="h-3.5 w-3.5 text-[#25F4EE]" />
                <span>Cambiar imagen de logo</span>
              </button>
              {isCustomLogo && (
                <button
                  type="button"
                  onClick={onResetLogo}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1 text-[11px] text-[#94A3B8] hover:text-white transition-colors cursor-pointer"
                  title="Restaurar logo oficial de Agencia Planeta"
                >
                  <RotateCcw className="h-3 w-3" />
                  <span>Restaurar</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Quick Value Pill Row */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3.5 text-center">
          <div className="rounded-xl bg-white/[0.03] px-2 py-2 border border-white/[0.05]">
            <p className="font-mono-num text-xs sm:text-sm font-bold text-[#25F4EE]">100K 💎</p>
            <p className="text-[10px] text-[#94A3B8]">Meta Diamantes</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] px-2 py-2 border border-white/[0.05]">
            <p className="font-mono-num text-xs sm:text-sm font-bold text-[#10B981]">$50-$100</p>
            <p className="text-[10px] text-[#94A3B8]">USD / PayPal</p>
          </div>
          <div className="rounded-xl bg-white/[0.03] px-2 py-2 border border-white/[0.05]">
            <p className="font-mono-num text-xs sm:text-sm font-bold text-[#FE2C55]">100% GRATIS</p>
            <p className="text-[10px] text-[#94A3B8]">Costo Ingreso</p>
          </div>
        </div>
      </div>

      {/* 2. Direct WhatsApp Registration Hub (Primary Conversion Card) */}
      <div className="rounded-2xl border border-[#25D366]/35 bg-gradient-to-b from-[#12141D] to-[#0D1916] p-5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#25D366]/20 text-[#25D366]">
              <MessageCircle className="h-4 w-4 fill-current" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white">
                Canales Oficiales de Registro
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Enlaces directos con mensaje automático listo
              </p>
            </div>
          </div>
          <span className="rounded-full bg-[#25D366]/15 border border-[#25D366]/40 px-2.5 py-0.5 text-[10px] font-bold text-[#25D366]">
            ACTIVOS 24/7
          </span>
        </div>

        <div className="mt-3.5 space-y-2.5">
          {WHATSAPP_CHANNELS.map((channel, idx) => (
            <a
              key={channel.id}
              href={channel.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`group flex items-center justify-between gap-3 rounded-xl border p-3.5 transition-all duration-200 ${
                idx === 0
                  ? 'border-[#25D366]/60 bg-[#25D366]/15 hover:bg-[#25D366]/25 hover:border-[#25D366] hover:shadow-[0_0_25px_rgba(37,211,102,0.3)]'
                  : 'border-[#25F4EE]/40 bg-white/[0.04] hover:bg-[#25F4EE]/15 hover:border-[#25F4EE] hover:shadow-[0_0_25px_rgba(37,244,238,0.2)]'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl font-bold shadow-md transition-transform group-hover:scale-105 ${
                    idx === 0
                      ? 'bg-[#25D366] text-[#041B0D]'
                      : 'bg-gradient-to-br from-[#25F4EE] to-[#25D366] text-[#041B0D]'
                  }`}
                >
                  <MessageCircle className="h-5 w-5 fill-current" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#25D366]">
                      {idx === 0 ? 'Opción 1 • Principal' : 'Opción 2 • Alternativo'}
                    </span>
                  </div>
                  <p className="truncate font-mono-num text-sm font-bold text-white">
                    {channel.phoneDisplay}
                  </p>
                  <p className="truncate text-[11px] text-[#94A3B8]">
                    Clic para enviar mensaje automático de ingreso
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white group-hover:bg-[#25D366] group-hover:text-[#041B0D] transition-colors">
                <span>Unirme</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* 3. Interactive League D1, C, B & Payment Simulator */}
      <div className="rounded-2xl border border-white/10 bg-[#12141D]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FE2C55]">
              Impulso Especializado
            </span>
            <h3 className="font-display text-base font-bold text-white">
              Beneficios por Liga (D1, C y B)
            </h3>
          </div>
          <Award className="h-5 w-5 text-[#25F4EE]" />
        </div>

        {/* League Tabs */}
        <div className="mt-3 grid grid-cols-3 gap-2 rounded-xl bg-[#090A0F] p-1 border border-white/10">
          {(['D1', 'C', 'B'] as CreatorLeague[]).map((league) => {
            const active = selectedLeague === league;
            return (
              <button
                key={league}
                type="button"
                onClick={() => onSelectLeague(league)}
                className={`rounded-lg py-2 text-xs font-bold transition-all cursor-pointer ${
                  active
                    ? 'bg-gradient-to-r from-[#FE2C55] to-[#FF4B72] text-white shadow-[0_0_15px_rgba(254,44,85,0.4)]'
                    : 'text-[#94A3B8] hover:text-white hover:bg-white/5'
                }`}
              >
                Liga {league}
              </button>
            );
          })}
        </div>

        {/* Selected League Details */}
        <div className="mt-3.5 rounded-xl border border-white/10 bg-[#090A0F]/70 p-3.5">
          <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
            <div>
              <p className="text-xs font-bold text-[#25F4EE]">{currentLeague.name}</p>
              <p className="text-[11px] text-[#94A3B8]">{currentLeague.tagline}</p>
            </div>
            <span className="rounded-lg bg-[#10B981]/15 border border-[#10B981]/30 px-2.5 py-1 font-mono-num text-xs font-bold text-[#10B981]">
              {currentLeague.estimatedRange}
            </span>
          </div>

          <ul className="mt-3 space-y-2 text-xs text-[#CBD5E1]">
            {currentLeague.highlights.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#25F4EE]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <ShieldCheck className="h-4 w-4 text-[#FE2C55] shrink-0" />
              <span>Anti-Baneos Activo</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Swords className="h-4 w-4 text-[#25F4EE] shrink-0" />
              <span>Batallas Oficiales</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Gem className="h-4 w-4 text-[#25F4EE] shrink-0" />
              <span>Meta: 100K Diamantes</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <DollarSign className="h-4 w-4 text-[#10B981] shrink-0" />
              <span>Pago Directo PayPal</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onAskLeagueStrategy(selectedLeague)}
            className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#25F4EE]/40 bg-[#25F4EE]/10 px-3 py-2 text-xs font-bold text-[#25F4EE] hover:bg-[#25F4EE]/20 transition-colors cursor-pointer"
          >
            <Volume2 className="h-3.5 w-3.5" />
            <span>Preguntar a la IA por mi {currentLeague.name}</span>
          </button>
        </div>
      </div>

      {/* 4. Interactive Voice Commands Guide Card */}
      <div className="rounded-2xl border border-white/10 bg-[#12141D]/90 p-5 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FE2C55]/20 text-[#FE2C55]">
              <Mic className="h-4 w-4" />
            </span>
            <div>
              <h3 className="font-display text-sm font-bold text-white">
                Comandos de Voz Reconocidos
              </h3>
              <p className="text-[11px] text-[#94A3B8]">
                Dilos con tu micrófono o tócalos para escuchar a la IA
              </p>
            </div>
          </div>
        </div>

        <div className="mt-3 space-y-2">
          {VOICE_COMMANDS_GUIDE.map((item, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onTriggerVoiceCommand(item.sampleTrigger)}
              className="group flex w-full items-center justify-between gap-2 rounded-xl border border-white/[0.07] bg-white/[0.02] px-3 py-2 text-left hover:border-[#FE2C55]/40 hover:bg-[#FE2C55]/10 transition-all cursor-pointer"
            >
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#F8FAFC] group-hover:text-[#25F4EE] transition-colors">
                  🎙️ {item.command}
                </p>
                <p className="truncate text-[11px] text-[#94A3B8]">{item.description}</p>
              </div>
              <span className="shrink-0 rounded-md bg-white/5 px-2 py-1 text-[10px] font-semibold text-[#CBD5E1] group-hover:bg-[#FE2C55] group-hover:text-white transition-colors">
                Probar
              </span>
            </button>
          ))}
        </div>

        {/* Requirements quick checklist footer */}
        <div className="mt-4 rounded-xl border border-white/10 bg-[#090A0F]/60 p-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-white">
            <Users className="h-3.5 w-3.5 text-[#25F4EE]" />
            <span>Requisitos de Ingreso (100% Gratis):</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-[#CBD5E1] border border-white/10">
              ✅ Ser mayor de 18 años (+18)
            </span>
            <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-[#CBD5E1] border border-white/10">
              ✅ Cuenta activa de PayPal
            </span>
            <span className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-[#CBD5E1] border border-white/10">
              ✅ Constancia en tus LIVEs
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
