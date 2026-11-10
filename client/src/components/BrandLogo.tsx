import React from 'react';

interface BrandLogoProps {
  variant?: 'full' | 'icon';
  theme?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
}

export const BrandLogo: React.FC<BrandLogoProps> = ({
  variant = 'full',
  theme = 'dark',
  size = 'md',
  showTagline = true,
  className = '',
}) => {
  const isLight = theme === 'light';

  // Dimension mappings
  const iconSizeMap = {
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  const titleSizeMap = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizeMap = {
    sm: 'text-xs sm:text-[13px] tracking-[0.24em]',
    md: 'text-sm sm:text-base tracking-[0.28em]',
    lg: 'text-base sm:text-lg tracking-[0.32em]',
  };

  const taglineSizeMap = {
    sm: 'text-[8.5px] sm:text-[9.5px]',
    md: 'text-[9.5px] sm:text-[10.5px]',
    lg: 'text-[11px] sm:text-xs',
  };

  // Official Kavi's Lifestyle Express "K" Shopping Bag Emblem
  const ExpressKEmblem = (
    <div
      className={`${iconSizeMap[size]} shrink-0 relative flex items-center justify-center transition-transform duration-300 group-hover:scale-105 select-none`}
    >
      <svg
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-sm"
      >
        {/* Navy Blue Rounded App Tile Background with crisp gold accent border */}
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx="22"
          fill="#0C2038"
          stroke="#FFBA00"
          strokeWidth="2.5"
          strokeOpacity="0.55"
        />

        {/* Speed/Express Motion Lines on Left */}
        <g stroke="#FFBA00" strokeWidth="3.5" strokeLinecap="round">
          <line x1="9" y1="46" x2="31" y2="46" />
          <line x1="5" y1="55" x2="28" y2="55" />
          <line x1="10" y1="64" x2="26" y2="64" />
          <line x1="14" y1="73" x2="25" y2="73" />
        </g>

        {/* Express Bag Handle */}
        <path
          d="M47 37 C47 23, 70 23, 70 37"
          fill="none"
          stroke="#FFBA00"
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Express Shopping Bag Body (tilted ~4 deg) */}
        <path
          d="M38 37 L79 35 C82.5 35, 84.5 37.5, 84 41 L78 81 C77.5 84.5, 74.5 86.5, 71 86.5 L36 86.5 C32.5 86.5, 30 84.5, 30.5 81 L35.5 41 C36 37.5, 37 37, 38 37 Z"
          fill="#0C2038"
          stroke="#FFBA00"
          strokeWidth="5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Bold Italic "K" Lettermark */}
        {/* Stem */}
        <path d="M45 47.5 L53 47.5 L47 75 L39 75 Z" fill="#FFFFFF" />
        {/* Upper Arm */}
        <path d="M48.5 61.5 L64.5 47.5 L73.5 47.5 L55 63 Z" fill="#FFFFFF" />
        {/* Lower Leg */}
        <path d="M53 60 L68.5 75 L59.5 75 L46.5 62 Z" fill="#FFFFFF" />
      </svg>
    </div>
  );

  if (variant === 'icon') {
    return ExpressKEmblem;
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {ExpressKEmblem}
      <div className="flex flex-col text-left">
        <div className="flex flex-col leading-tight">
          <span
            className={`font-black ${titleSizeMap[size]} tracking-tight uppercase ${
              isLight ? 'text-white' : 'text-[#0C2038]'
            }`}
          >
            Kavi’s
          </span>
          <span
            className={`font-black uppercase ${subtitleSizeMap[size]} text-[#FFBA00] -mt-0.5`}
          >
            Lifestyle
          </span>
        </div>
        {showTagline && (
          <span
            className={`${taglineSizeMap[size]} font-medium tracking-tight mt-0.5 ${
              isLight ? 'text-[#E2E8F0]' : 'text-[#5C554E]'
            }`}
          >
            Everything You Love, Under One Roof.
          </span>
        )}
      </div>
    </div>
  );
};

export default BrandLogo;
