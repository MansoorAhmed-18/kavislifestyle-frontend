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
    lg: 'w-18 h-18 sm:w-20 sm:h-20',
  };

  const titleSizeMap = {
    sm: 'text-base sm:text-lg',
    md: 'text-xl sm:text-2xl',
    lg: 'text-2xl sm:text-3xl',
  };

  const subtitleSizeMap = {
    sm: 'text-[10px] sm:text-[11px] tracking-[0.28em]',
    md: 'text-xs sm:text-[13px] tracking-[0.32em]',
    lg: 'text-sm sm:text-base tracking-[0.35em]',
  };

  const taglineSizeMap = {
    sm: 'text-[8.5px]',
    md: 'text-[9.5px]',
    lg: 'text-[11px]',
  };

  // High-Visibility Speedy Delivery Mascot Emblem
  const MascotEmblem = (
    <div
      className={`${iconSizeMap[size]} shrink-0 relative flex items-center justify-center p-1 sm:p-1.5 rounded-2xl bg-white shadow-sm ring-2 ${
        isLight ? 'ring-white/40 border border-white' : 'ring-black/5 border border-[#F0E4D8]'
      } transition-transform duration-300 group-hover:scale-105`}
    >
      <img
        src="/logo-mascot-icon.png"
        alt="Kavi's Lifestyle Delivery Mascot"
        className="w-full h-full object-contain select-none filter contrast-125"
      />
    </div>
  );

  if (variant === 'icon') {
    return MascotEmblem;
  }

  return (
    <div className={`flex items-center gap-2.5 sm:gap-3 ${className}`}>
      {MascotEmblem}
      <div className="flex flex-col text-left">
        <div className="flex flex-col leading-tight">
          <span
            className={`font-black ${titleSizeMap[size]} tracking-tight uppercase ${
              isLight ? 'text-white' : 'text-[#14213D]'
            }`}
          >
            Kavi’s
          </span>
          <span
            className={`font-extrabold uppercase ${subtitleSizeMap[size]} text-[#FF6B5B] -mt-0.5`}
          >
            Lifestyle
          </span>
        </div>
        {showTagline && (
          <span
            className={`${taglineSizeMap[size]} font-medium tracking-tight mt-0.5 ${
              isLight ? 'text-[#CBD5E1]' : 'text-[#5C554E]'
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
