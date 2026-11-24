import React from 'react';

interface BotLogoAvatarProps {
  logoSrc: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isSpeaking?: boolean;
  isListening?: boolean;
  showStatusDot?: boolean;
  className?: string;
}

export const BotLogoAvatar: React.FC<BotLogoAvatarProps> = ({
  logoSrc,
  size = 'md',
  isSpeaking = false,
  isListening = false,
  showStatusDot = true,
  className = '',
}) => {
  const sizeMap = {
    sm: 'h-9 w-9',
    md: 'h-11 w-11',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24',
  };

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${className}`}>
      {/* Outer reactive glow ring */}
      <div
        className={`absolute -inset-1 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-gradient-to-tr from-[#FE2C55] via-[#FF5E7E] to-[#25F4EE] opacity-90 blur-sm animate-pulse'
            : isSpeaking
              ? 'bg-gradient-to-tr from-[#25F4EE] via-[#FE2C55] to-[#25F4EE] opacity-85 blur-sm animate-pulse-ring'
              : 'bg-gradient-to-tr from-[#25F4EE]/55 to-[#FE2C55]/55 opacity-60'
        }`}
      />

      {/* Crisp metallic/neon border container */}
      <div
        className={`relative ${sizeMap[size]} overflow-hidden rounded-full border-2 ${
          isListening
            ? 'border-[#FE2C55] shadow-[0_0_18px_rgba(254,44,85,0.65)]'
            : isSpeaking
              ? 'border-[#25F4EE] shadow-[0_0_18px_rgba(37,244,238,0.65)]'
              : 'border-[#25F4EE]/60 shadow-[0_0_12px_rgba(37,244,238,0.25)]'
        } bg-[#090A0F]`}
      >
        <img
          src={logoSrc}
          alt="Logo Oficial Asistente IA Agencia Planeta"
          className="h-full w-full object-cover object-center transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Live status indicator */}
      {showStatusDot && (
        <span
          className={`absolute -bottom-0.5 -right-0.5 flex items-center justify-center rounded-full border-2 border-[#090A0F] ${
            size === 'xl' || size === 'lg' ? 'h-4 w-4' : 'h-3 w-3'
          } ${
            isListening
              ? 'bg-[#FE2C55]'
              : isSpeaking
                ? 'bg-[#25F4EE]'
                : 'bg-[#10B981]'
          }`}
          title={
            isListening
              ? 'Escuchando tu voz...'
              : isSpeaking
                ? 'Asistente IA hablando...'
                : 'Asistente IA En Línea'
          }
        >
          {(isListening || isSpeaking) && (
            <span
              className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${
                isListening ? 'bg-[#FE2C55]' : 'bg-[#25F4EE]'
              }`}
            />
          )}
        </span>
      )}
    </div>
  );
};
