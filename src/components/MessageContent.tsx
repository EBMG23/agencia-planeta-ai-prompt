import React from 'react';
import { ExternalLink, MessageCircle, CheckCircle2 } from 'lucide-react';

interface MessageContentProps {
  markdown: string;
}

function renderInlineFormatting(text: string): React.ReactNode[] {
  // Split by markdown links first: [label](url)
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(...renderBoldSegments(text.slice(lastIndex, match.index), `pre-${match.index}`));
    }
    const label = match[1].replace(/\*\*/g, '');
    const url = match[2];
    const isWhatsApp = url.includes('wa.me');
    const isAdvisor1 = url.includes('584247418161');

    if (isWhatsApp) {
      parts.push(
        <a
          key={`wa-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`group my-1.5 flex items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${
            isAdvisor1
              ? 'border-[#25D366]/50 bg-gradient-to-r from-[#25D366]/20 via-[#25D366]/10 to-transparent hover:border-[#25D366] hover:from-[#25D366]/30 hover:shadow-[0_0_20px_rgba(37,211,102,0.25)]'
              : 'border-[#25F4EE]/40 bg-gradient-to-r from-[#25F4EE]/15 via-[#25D366]/10 to-transparent hover:border-[#25F4EE] hover:from-[#25F4EE]/25 hover:shadow-[0_0_20px_rgba(37,244,238,0.2)]'
          }`}
        >
          <span className="flex items-center gap-2.5 min-w-0">
            <span
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                isAdvisor1
                  ? 'bg-[#25D366] text-[#051B0E]'
                  : 'bg-[#25F4EE] text-[#06181A]'
              } shadow-sm transition-transform group-hover:scale-105`}
            >
              <MessageCircle className="h-4 w-4 fill-current" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs sm:text-sm font-bold text-[#F8FAFC] group-hover:text-white">
                {label}
              </span>
              <span className="flex items-center gap-1 text-[11px] text-[#94A3B8]">
                <CheckCircle2 className="h-3 w-3 text-[#25D366] shrink-0" />
                <span>Abre WhatsApp con mensaje automático listo</span>
              </span>
            </span>
          </span>
          <span className="flex shrink-0 items-center gap-1 rounded-lg bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white group-hover:bg-[#25D366] group-hover:text-[#04180B] transition-colors">
            <span>Abrir</span>
            <ExternalLink className="h-3 w-3" />
          </span>
        </a>
      );
    } else {
      parts.push(
        <a
          key={`link-${match.index}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#25F4EE] underline underline-offset-2 hover:text-[#FE2C55]"
        >
          {label}
          <ExternalLink className="h-3 w-3" />
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(...renderBoldSegments(text.slice(lastIndex), `post-${lastIndex}`));
  }

  return parts;
}

function renderBoldSegments(segment: string, keyPrefix: string): React.ReactNode[] {
  const boldRegex = /\*\*([^*]+)\*\*/g;
  const nodes: React.ReactNode[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  while ((match = boldRegex.exec(segment)) !== null) {
    if (match.index > lastIdx) {
      nodes.push(segment.slice(lastIdx, match.index));
    }
    const boldContent = match[1];
    const isMoneyOrFree =
      boldContent.includes('$') ||
      boldContent.includes('USD') ||
      boldContent.includes('GRATIS') ||
      boldContent.includes('GRATUITO') ||
      boldContent.includes('100K');

    nodes.push(
      <strong
        key={`${keyPrefix}-b-${match.index}`}
        className={
          isMoneyOrFree
            ? 'font-bold text-[#25F4EE] bg-[#25F4EE]/10 px-1.5 py-0.5 rounded-md border border-[#25F4EE]/25 font-mono-num'
            : 'font-bold text-white'
        }
      >
        {boldContent}
      </strong>
    );
    lastIdx = match.index + match[0].length;
  }

  if (lastIdx < segment.length) {
    nodes.push(segment.slice(lastIdx));
  }

  return nodes;
}

export const MessageContent: React.FC<MessageContentProps> = ({ markdown }) => {
  const lines = markdown.split('\n');

  return (
    <div className="space-y-2 text-[14.5px] leading-[1.6] text-[#E2E8F0]">
      {lines.map((rawLine, index) => {
        const line = rawLine.trim();
        if (!line) {
          return <div key={index} className="h-1" />;
        }

        // Heading ###
        if (line.startsWith('### ')) {
          const title = line.replace('### ', '');
          return (
            <h4
              key={index}
              className="pt-1 font-display text-sm font-bold uppercase tracking-wider text-[#25F4EE]"
            >
              {renderInlineFormatting(title)}
            </h4>
          );
        }

        // Bullet points * or -
        if (line.startsWith('* ') || line.startsWith('- ')) {
          const itemText = line.slice(2);
          return (
            <div
              key={index}
              className="flex items-start gap-2.5 rounded-lg bg-white/[0.025] px-3 py-1.5 border border-white/[0.05]"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-[#FE2C55] to-[#25F4EE]" />
              <div className="flex-1">{renderInlineFormatting(itemText)}</div>
            </div>
          );
        }

        // Pointer line 👉 with WhatsApp link
        if (line.startsWith('👉')) {
          const contentAfterArrow = line.replace(/^👉\s*/, '');
          return (
            <div key={index} className="pt-0.5">
              {renderInlineFormatting(contentAfterArrow)}
            </div>
          );
        }

        return (
          <p key={index} className="text-[#E2E8F0]">
            {renderInlineFormatting(line)}
          </p>
        );
      })}
    </div>
  );
};
