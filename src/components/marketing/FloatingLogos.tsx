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

      {/* Top Left 2 */}
      <div className="absolute top-20 left-1/4 w-12 h-12 opacity-10 animate-float" style={{ animationDelay: '2.5s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-cyan-400">
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

      {/* Top Right 2 */}
      <div className="absolute top-24 right-1/4 w-14 h-14 opacity-12 animate-float" style={{ animationDelay: '3s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-emerald-400">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Middle Left */}
      <div className="absolute top-1/2 left-16 w-16 h-16 opacity-18 animate-float" style={{ animationDelay: '1.8s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-indigo-400">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>

      {/* Middle Right */}
      <div className="absolute top-1/2 right-24 w-18 h-18 opacity-16 animate-float" style={{ animationDelay: '2.2s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-amber-400">
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

      {/* Bottom Left 2 */}
      <div className="absolute bottom-20 left-1/3 w-10 h-10 opacity-14 animate-float" style={{ animationDelay: '3.5s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-rose-400">
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

      {/* Bottom Right 2 */}
      <div className="absolute bottom-28 right-1/3 w-12 h-12 opacity-12 animate-float" style={{ animationDelay: '2.8s' }}>
        <svg viewBox="0 0 40 40" className="w-full h-full text-violet-400">
          <path
            fill="currentColor"
            d="M20 0L0 10v10l10 5 10-5V10l10-5-10-5zM10 25l10 5 10-5v10l-10 5-10-5V25z"
          />
        </svg>
      </div>
    </>
  );
}
