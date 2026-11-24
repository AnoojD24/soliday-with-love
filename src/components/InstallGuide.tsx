interface InstallGuideProps {
  standalone: boolean
}

export function InstallGuide({ standalone }: InstallGuideProps) {
  if (standalone) {
    return (
      <section className="rounded-[1.5rem] border border-sage bg-sage/40 p-4">
        <p className="font-display text-lg text-berry">You&apos;re home ♡</p>
        <p className="mt-1 text-sm text-berry/75">
          Soliday is already on your home screen. Enjoy your companion anytime.
        </p>
      </section>
    )
  }

  return (
    <section className="rounded-[1.5rem] border border-blush bg-white/90 p-4 shadow-[var(--shadow-soft)]">
      <div className="flex items-start gap-3">
        <img
          src="/icons/icon-192.png"
          alt="Soliday With Love app icon"
          className="h-14 w-14 rounded-[1.1rem] shadow-[var(--shadow-soft)]"
        />
        <div>
          <h3 className="font-display text-xl text-berry">Take me with you ♡</h3>
          <p className="mt-1 text-sm leading-relaxed text-berry/75">
            Add your little Soliday companion to your home screen so it&apos;s
            always just a tap away.
          </p>
        </div>
      </div>
      <ol className="mt-4 space-y-2 text-sm text-berry/85">
        <li>
          <span className="font-medium text-berry">1.</span> Open Soliday With
          Love in Safari.
        </li>
        <li>
          <span className="font-medium text-berry">2.</span> Tap the Share
          button.
        </li>
        <li>
          <span className="font-medium text-berry">3.</span> Select Add to Home
          Screen.
        </li>
        <li>
          <span className="font-medium text-berry">4.</span> Confirm the
          application name and tap Add.
        </li>
      </ol>
      <p className="mt-3 text-xs text-rose">
        Best experienced in Safari on iPhone. Other browsers may offer similar
        options.
      </p>
    </section>
  )
}

export function isStandaloneDisplay(): boolean {
  if (typeof window === 'undefined') return false
  const media = window.matchMedia('(display-mode: standalone)').matches
  const iosStandalone =
    'standalone' in navigator &&
    Boolean((navigator as Navigator & { standalone?: boolean }).standalone)
  return media || iosStandalone
}
