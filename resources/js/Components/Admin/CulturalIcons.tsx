import React from 'react'

// Traditional Indonesian Scroll (Lontar) Icon
const LontarIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 2V22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 6H16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 10H16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 14H16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 18H16" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Wayang Kulit (Shadow Puppet) Icon
const WayangIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 4 6 4 10C4 14 8 18 12 18C16 18 20 14 20 10C20 6 16 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 10C14 10 16 8 16 6C16 4 14 2 12 2" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 18C10 18 8 20 8 22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 18C18 18 20 20 20 22" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="10" cy="8" r="1" fill="currentColor"/>
    <circle cx="14" cy="8" r="1" fill="currentColor"/>
  </svg>
)

// Batik Pattern Icon
const BatikIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H8V8H4V4Z" fill="currentColor"/>
    <path d="M10 4H14V8H10V4Z" fill="currentColor"/>
    <path d="M16 4H20V8H16V4Z" fill="currentColor"/>
    <path d="M4 10H8V14H4V10Z" fill="currentColor"/>
    <path d="M10 10H14V14H10V10Z" fill="currentColor"/>
    <path d="M16 10H20V14H16V10Z" fill="currentColor"/>
    <path d="M4 16H8V20H4V16Z" fill="currentColor"/>
    <path d="M10 16H14V20H10V16Z" fill="currentColor"/>
    <path d="M16 16H20V20H16V16Z" fill="currentColor"/>
  </svg>
)

// Traditional Indonesian Document (Prasasti) Icon
const PrasastiIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 2H18C19.1046 2 20 2.89543 20 4V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V4C4 2.89543 4.89543 2 6 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 6H18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 10H18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 14H18" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 18H18" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="8" cy="8" r="1" fill="currentColor"/>
    <circle cx="16" cy="8" r="1" fill="currentColor"/>
    <circle cx="8" cy="16" r="1" fill="currentColor"/>
    <circle cx="16" cy="16" r="1" fill="currentColor"/>
  </svg>
)

// Balinese Offering Bowl (Canang Sari) Icon
const CanangSariIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C8 2 4 6 4 10C4 14 8 18 12 18C16 18 20 14 20 10C20 6 16 2 12 2Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 10C14 10 16 8 16 6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 10C10 10 8 8 8 6" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 10V14" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="16" r="2" fill="currentColor"/>
  </svg>
)

// Traditional Indonesian House (Rumah Adat) Icon
const RumahAdatIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 18H20V14H4V18Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M6 14V8H18V14" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 8V4H16V8" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 18V22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M14 18V22" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 6V2" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Traditional Indonesian Writing (Cepat Menulis) Icon
const CepatMenulisIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4 4H8V8H4V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 4H14V8H10V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 4H20V8H16V4Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 10H12V14H4V10Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 10H20V14H16V10Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M4 16H16V20H4V16Z" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M18 6L22 10" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

// Traditional Indonesian Community (Gotong Royong) Icon
const GotongRoyongIcon: React.FC<{ className?: string }> = ({ className = 'h-6 w-6' }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="16" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <circle cx="12" cy="16" r="3" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M8 11V16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M16 11V16" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M12 5V8" stroke="currentColor" strokeWidth="1.5"/>
  </svg>
)

export {
  LontarIcon,
  WayangIcon,
  BatikIcon,
  PrasastiIcon,
  CanangSariIcon,
  RumahAdatIcon,
  CepatMenulisIcon,
  GotongRoyongIcon
}