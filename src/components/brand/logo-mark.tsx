import { cn } from "@/lib/utils";

// The St.School shield: grad cap / brain-circuit / live-session /
// growth-mindset quadrants stacked over a growth-arrow base band, with a
// small "st." mark tucked into the top seam — matching the brand crest
// supplied by the client. Pure SVG so it stays crisp at favicon size and
// as a large navbar/footer mark alike.
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
        {/* base bands: top quadrants, middle quadrants, bottom growth band */}
        <path d="M0 0H100V86C70 90 35 96 0 86V0Z" fill="var(--color-brand-red)" />
        <path d="M100 0H200V86C165 96 130 90 100 86V0Z" fill="var(--color-brand-mist)" />
        <path d="M0 86C35 96 70 90 100 86V150C70 150 35 150 0 150V86Z" fill="var(--color-brand-mist)" />
        <path d="M100 86C130 90 165 96 200 86V150C165 150 130 150 100 150V86Z" fill="var(--color-brand-charcoal)" />
        <path d="M0 150Q100 182 200 150V232H0V150Z" fill="var(--color-brand-red)" />

        {/* graduation cap, top-left */}
        <g fill="var(--color-brand-mist)">
          <path d="M50 26 L92 42 L50 58 L8 42 Z" />
          <path d="M28 49 V66 C28 71 38 76 50 76 C62 76 72 71 72 66 V49 L50 57.5 Z" />
          <rect x="90" y="42" width="3" height="24" rx="1.5" />
        </g>

        {/* brain / circuit, top-right */}
        <g fill="none" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
          <rect x="128" y="20" width="44" height="52" rx="10" />
          <path d="M150 20V72" />
          <path d="M136 32h6M136 44h6M136 56h6M158 32h6M158 44h6M158 56h6" />
          <circle cx="128" cy="32" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="172" cy="32" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="128" cy="60" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
          <circle cx="172" cy="60" r="3" fill="var(--color-brand-charcoal)" stroke="none" />
        </g>

        {/* live session, middle-left */}
        <g fill="var(--color-brand-charcoal)">
          <rect x="20" y="100" width="42" height="30" rx="4" />
          <rect x="28" y="132" width="26" height="4" rx="2" />
          <circle cx="41" cy="115" r="8" fill="var(--color-brand-mist)" />
          <path d="M41 111v8M37 119h8" stroke="var(--color-brand-charcoal)" strokeWidth="2" strokeLinecap="round" fill="none" />
          <path d="M14 102c-6 4-6 22 0 26" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M6 96c-10 7-10 33 0 40" stroke="var(--color-brand-charcoal)" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.6" />
        </g>

        {/* growth / idea, middle-right */}
        <g fill="var(--color-brand-mist)">
          <path d="M150 100c-9 0-16 6-16 15c0 7 4 11 8 14v6h16v-6c4-3 8-7 8-14c0-9-7-15-16-15Z" />
          <rect x="142" y="138" width="16" height="6" rx="2" />
          <path d="M133 98l-6-6M167 98l6-6M150 88v-8" stroke="var(--color-brand-mist)" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* growth arrow + gears, bottom band */}
        <g>
          <path
            d="M64 198 L86 178 L100 190 L134 158"
            fill="none"
            stroke="var(--color-brand-mist)"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M120 156 L137 154 L136 171Z" fill="var(--color-brand-mist)" />
          <g stroke="var(--color-brand-mist)" strokeWidth="2.5" strokeLinecap="round" fill="none">
            <circle cx="46" cy="196" r="6" />
            <circle cx="46" cy="196" r="1.8" fill="var(--color-brand-mist)" stroke="none" />
            <path d="M46 187v3M46 202v3M37 196h3M52 196h3M39.4 189.4l2.1 2.1M51.5 200.5l2.1 2.1M39.4 202.6l2.1-2.1M51.5 191.5l2.1-2.1" />
            <circle cx="152" cy="196" r="6" />
            <circle cx="152" cy="196" r="1.8" fill="var(--color-brand-mist)" stroke="none" />
            <path d="M152 187v3M152 202v3M143 196h3M158 196h3M145.4 189.4l2.1 2.1M157.5 200.5l2.1 2.1M145.4 202.6l2.1-2.1M157.5 191.5l2.1-2.1" />
          </g>
        </g>
      </g>

      {/* "st." mark tucked in the clear red space beside the cap */}
      <text
        x="76"
        y="66"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="700"
        fontSize="13"
        fontStyle="italic"
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
