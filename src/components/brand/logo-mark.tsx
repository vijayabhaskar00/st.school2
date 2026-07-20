import { cn } from "@/lib/utils";

// The St.School shield: four quadrants (grad cap / brain-circuit /
// live-session / growth-mindset) around a central "st." seal, matching
// the brand crest supplied by the client. Pure SVG so it stays crisp at
// favicon size and as a large navbar/footer mark alike.
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 232"
      className={cn("h-8 w-auto", className)}
      role="img"
      aria-label="St.School"
    >
      <defs>
        <clipPath id="shieldClip">
          <path d="M100 0C55 0 15 8 4 18C1.5 20.3 0 23.6 0 27.5V120C0 165 35 205 100 232C165 205 200 165 200 120V27.5C200 23.6 198.5 20.3 196 18C185 8 145 0 100 0Z" />
        </clipPath>
      </defs>

      <g clipPath="url(#shieldClip)">
        {/* base quadrants */}
        <path d="M0 0H100V96C70 100 35 106 0 96V0Z" fill="var(--color-brand-red)" />
        <path d="M100 0H200V96C165 106 130 100 100 96V0Z" fill="var(--color-brand-mist)" />
        <path d="M0 96C35 106 70 100 100 96V232H0V96Z" fill="var(--color-brand-mist)" />
        <path d="M100 96C130 100 165 106 200 96V232H100V96Z" fill="var(--color-brand-charcoal)" />

        {/* graduation cap, top-left */}
        <g fill="var(--color-brand-mist)">
          <path d="M50 26 L92 42 L50 58 L8 42 Z" />
          <path d="M50 58 L78 47 V64 C78 72 65 78 50 78 C35 78 22 72 22 64 V47 Z" opacity="0.001" />
          <path d="M28 49 V66 C28 71 38 76 50 76 C62 76 72 71 72 66 V49 L50 57.5 Z" />
          <rect x="90" y="42" width="3" height="24" rx="1.5" />
        </g>

        {/* brain / circuit, top-right */}
        <g fill="none" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="128" y="24" width="44" height="52" rx="10" />
          <path d="M150 24V76" />
          <path d="M136 36h6M136 48h6M136 60h6M158 36h6M158 48h6M158 60h6" />
          <circle cx="128" cy="36" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="172" cy="36" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="128" cy="64" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="172" cy="64" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
        </g>

        {/* live session, bottom-left */}
        <g fill="var(--color-brand-charcoal)">
          <rect x="22" y="150" width="42" height="30" rx="4" />
          <rect x="30" y="182" width="26" height="4" rx="2" />
          <circle cx="43" cy="164" r="8" fill="var(--color-brand-mist)" />
          <path d="M43 160v8M39 168h8" stroke="var(--color-brand-charcoal)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M70 152c6 4 6 22 0 26" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M78 146c10 7 10 33 0 40" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>

        {/* growth / idea, bottom-right */}
        <g fill="var(--color-brand-mist)">
          <path d="M150 150c-9 0-16 6-16 15c0 7 4 11 8 14v6h16v-6c4-3 8-7 8-14c0-9-7-15-16-15Z" />
          <rect x="142" y="188" width="16" height="6" rx="2" />
          <path d="M133 148l-6-6M167 148l6-6M150 138v-8" stroke="var(--color-brand-mist)" strokeWidth="3" strokeLinecap="round" />
        </g>
      </g>

      {/* seal */}
      <circle cx="100" cy="98" r="21" fill="var(--color-brand-red)" stroke="var(--color-paper)" strokeWidth="3" />
      <text
        x="100"
        y="105"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="18"
        fill="var(--color-paper)"
      >
        st.
      </text>

      <path
        d="M100 0C55 0 15 8 4 18C1.5 20.3 0 23.6 0 27.5V120C0 165 35 205 100 232C165 205 200 165 200 120V27.5C200 23.6 198.5 20.3 196 18C185 8 145 0 100 0Z"
        fill="none"
        stroke="var(--color-paper)"
        strokeOpacity="0.12"
        strokeWidth="2"
      />
    </svg>
  );
}
