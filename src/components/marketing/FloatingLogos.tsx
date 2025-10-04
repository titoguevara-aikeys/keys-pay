export default function FloatingLogos() {
  return (
    <>
      {/* Top Left */}
      <div className="absolute top-32 left-12 w-20 h-20 opacity-20 animate-float">
        <svg viewBox="0 0 40 40" className="w-full h-full text-purple-500">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Top Right */}
      <div className="absolute top-48 right-32 w-16 h-16 opacity-15 animate-float" style={{ animationDelay: '1s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-pink-500">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Bottom Left */}
      <div className="absolute bottom-32 left-24 w-14 h-14 opacity-25 animate-float" style={{ animationDelay: '2s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-blue-500">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Bottom Center */}
      <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-24 h-24 opacity-20 animate-float" style={{ animationDelay: '1.5s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-purple-400">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Bottom Right */}
      <div className="absolute bottom-40 right-20 w-18 h-18 opacity-15 animate-float" style={{ animationDelay: '0.5s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-teal-500">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>
    </>
  );
}
