import React from 'react';

export const GCCI_LOGO_SRC = '/assets/aistudio/GcciLogo_f68a2d53.png';

interface GcciLogoProps {
  className?: string;
  variant?: 'full' | 'mark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
  alt?: string;
}

export const GcciLogo: React.FC<GcciLogoProps> = ({ 
  className = '', 
  variant = 'full',
  size = 'md',
  style,
  alt = 'Gambia Chamber of Commerce and Industry'
}) => {
  // Height sizing classes for the exact official image
  const sizeClasses: Record<string, string> = {
    sm: 'h-8 sm:h-9',
    md: 'h-11 sm:h-12',
    lg: 'h-16 sm:h-20',
    xl: 'h-24 sm:h-28'
  };

  if (variant === 'mark') {
    // When used in compact badges or icon slots, display the exact GCCI emblem
    return (
      <img
        src={GCCI_LOGO_SRC}
        alt={alt}
        className={`object-contain object-left shrink-0 ${className || 'h-6 w-auto'}`}
        style={style}
        loading="eager"
      />
    );
  }

  return (
    <img
      src={GCCI_LOGO_SRC}
      alt={alt}
      className={`w-auto object-contain shrink-0 ${sizeClasses[size] || sizeClasses.md} ${className}`}
      style={style}
      loading="eager"
    />
  );
};
