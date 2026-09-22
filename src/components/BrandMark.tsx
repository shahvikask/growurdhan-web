interface BrandMarkProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export function BrandMark({ size = 'md', showTagline = false }: BrandMarkProps) {
  const icon = {
    sm: 'w-8 h-8 rounded-lg',
    md: 'w-10 h-10 rounded-xl',
    lg: 'w-12 h-12 rounded-2xl',
  }[size];
  const text = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  }[size];

  return (
    <div className="flex items-center gap-3">
      <div
        className={`${icon} flex items-center justify-center border relative overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, rgba(45,212,191,0.18), #0c1c2c 45%, rgba(245,193,74,0.28))',
          borderColor: 'rgba(245,193,74,0.4)',
        }}
      >
        <svg className="w-6 h-6 relative z-10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M5 4V12C5 15.3137 7.68629 18 11 18C14.3137 18 17 15.3137 17 12V4"
            stroke="#2dd4bf"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
          <path d="M5 8H14" stroke="#F5C14A" strokeWidth="2" strokeLinecap="round" />
          <path d="M5 4H14" stroke="#F5C14A" strokeWidth="2" strokeLinecap="round" />
          <path d="M11 12L18 20" stroke="#F5C14A" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
      <div>
        <div className={`font-serif font-bold tracking-tight leading-none ${text}`}>
          Grow<span style={{ color: 'var(--accent)' }}>Ur</span>
          <span style={{ color: 'var(--accent-2)' }}>Dhan</span>
        </div>
        {showTagline && (
          <p className="text-[11px] mt-1 hidden sm:block" style={{ color: 'var(--muted)' }}>
            Private Indian family wealth
          </p>
        )}
      </div>
    </div>
  );
}
