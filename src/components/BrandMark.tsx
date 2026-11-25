interface BrandMarkProps {
  size?: number;
  className?: string;
}

export function BrandMark({ size = 32, className = '' }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`shrink-0 ${className}`}
      role="img"
      aria-hidden="true"
    >
      <rect
        x="1.5"
        y="1.5"
        width="97"
        height="97"
        rx="22"
        fill="#07131f"
        stroke="#f5c14a"
        strokeWidth="2.6"
      />
      <rect x="27" y="31.2" width="46" height="5.4" rx="1.15" fill="#f5c14a" />
      <rect x="27" y="40.6" width="36" height="5.4" rx="1.15" fill="#f5c14a" />
      <path d="M36.6 23.2h6.6V56.5h-6.6z" fill="#f5c14a" />
      <path d="M36.6 54H43.2L62.4 74.6H55.8z" fill="#f5c14a" />
      <path d="M50.06 67.42L55.8 74.6h6.6l-5.74-7.18z" fill="#2dd4bf" />
    </svg>
  );
}

export function BrandWordmark() {
  return (
    <span className="inline-flex items-center gap-2.5 whitespace-nowrap shrink-0">
      <BrandMark size={30} />
      <span className="text-[1.125rem] font-extrabold tracking-[-0.04em] leading-none text-[#1C1917] dark:text-[#F4F7FB]">
        Grow
        <span className="text-[#B87D0B] dark:text-[#F5C14A] underline decoration-[#B87D0B] dark:decoration-[#F5C14A] decoration-2 underline-offset-[3px]">
          Ur
        </span>
        <span className="text-[#0F766E] dark:text-[#2DD4BF]">Dhan</span>
      </span>
    </span>
  );
}
