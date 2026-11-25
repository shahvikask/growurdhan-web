import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { GuideArticle, LegalDocument } from '../data/growurdhanData';

interface DocumentModalProps {
  guide: GuideArticle | null;
  legal: LegalDocument | null;
  onClose: () => void;
}

export function DocumentModal({ guide, legal, onClose }: DocumentModalProps) {
  const isOpen = Boolean(guide || legal);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#07131F]/75 backdrop-blur-xs"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-doc-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl max-h-[88vh] overflow-y-auto bg-white dark:bg-[#0C1C2C] text-[#1C1917] dark:text-[#F4F7FB] rounded-2xl border border-[#E3D9C8] dark:border-[#1C374F] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-8 py-5 bg-white/95 dark:bg-[#0C1C2C]/95 backdrop-blur-sm border-b border-[#E3D9C8] dark:border-[#1C374F]">
          <div>
            {guide && (
              <p className="text-xs font-medium text-[#6B5E52] dark:text-[#9BB3C7] mb-1">
                {guide.category} · {guide.readTime} · GrowUrDhan Guide
              </p>
            )}
            {legal && (
              <p className="text-xs font-mono text-[#B87D0B] dark:text-[#F5C14A] mb-1">
                {legal.versionTag}
              </p>
            )}
            <h2
              id="modal-doc-title"
              className="text-xl sm:text-2xl font-bold tracking-tight text-[#1C1917] dark:text-[#F4F7FB] leading-snug"
            >
              {guide ? guide.title : legal?.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close document"
            className="inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#E3D9C8] dark:border-[#1C374F] text-[#6B5E52] dark:text-[#9BB3C7] hover:text-[#1C1917] dark:hover:text-[#F4F7FB] hover:bg-[#FBF8F2] dark:hover:bg-[#102536] transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 sm:px-8 py-6 space-y-6">
          <p className="text-base text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed">
            {guide ? guide.summary : legal?.subtitle}
          </p>

          {guide &&
            guide.sections.map((section) => (
              <section
                key={section.heading}
                className="space-y-3 pt-4 border-t border-[#E3D9C8]/70 dark:border-[#1C374F]"
              >
                <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  {section.heading}
                </h3>
                {section.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pt-1">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[15px] text-[#1C1917] dark:text-[#F4F7FB] leading-relaxed"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#0F766E] dark:bg-[#2DD4BF] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}

          {legal &&
            legal.sections.map((section) => (
              <section
                key={section.heading}
                className="space-y-3 pt-4 border-t border-[#E3D9C8]/70 dark:border-[#1C374F]"
              >
                <h3 className="text-base font-bold text-[#1C1917] dark:text-[#F4F7FB]">
                  {section.heading}
                </h3>
                {section.paragraphs.map((p, idx) => (
                  <p
                    key={idx}
                    className="text-[15px] text-[#6B5E52] dark:text-[#9BB3C7] leading-relaxed"
                  >
                    {p}
                  </p>
                ))}
                {section.bullets && (
                  <ul className="space-y-2 pt-1">
                    {section.bullets.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-2.5 text-[15px] text-[#1C1917] dark:text-[#F4F7FB] leading-relaxed"
                      >
                        <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#B87D0B] dark:bg-[#F5C14A] shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {section.steps && (
                  <ol className="space-y-2.5 pt-1 list-decimal list-inside text-[15px] text-[#1C1917] dark:text-[#F4F7FB] leading-relaxed">
                    {section.steps.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}

          <div className="pt-5 border-t border-[#E3D9C8] dark:border-[#1C374F] flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs text-[#6B5E52] dark:text-[#9BB3C7]">
              GrowUrDhan · Private family record-keeping app, not investment or tax advice.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-[#F6EFE3] dark:text-[#07131F] bg-[#0C2338] dark:bg-[#F5C14A] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
