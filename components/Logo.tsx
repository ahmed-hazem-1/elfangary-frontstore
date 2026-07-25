import Image from "next/image";

export default function Logo({ className = "h-8 w-8" }: { className?: string }) {
  const svgMask = `data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='-5 -5 110 110'%3E%3Cpolygon points='72.5,11.03 95,50 72.5,88.97 27.5,88.97 5,50 27.5,11.03' fill='black' stroke='black' stroke-width='14' stroke-linejoin='round'/%3E%3C/svg%3E`;

  return (
    <div 
      className={`relative flex-shrink-0 ${className}`}
      style={{ 
        WebkitMaskImage: `url("${svgMask}")`,
        maskImage: `url("${svgMask}")`,
        WebkitMaskSize: 'contain',
        maskSize: 'contain',
        WebkitMaskPosition: 'center',
        maskPosition: 'center',
        WebkitMaskRepeat: 'no-repeat',
        maskRepeat: 'no-repeat'
      }}
    >
      <Image 
        src="/logo.jpg" 
        alt="الفنجري" 
        fill 
        sizes="64px"
        className="object-cover" 
        priority
      />
    </div>
  );
}
