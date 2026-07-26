interface LogoProps {
    className?: string;
}

/**
 * Signature mark: noodles draped over a fork.
 *
 * A wound-up twirl reads as a lollipop at nav size — strands crossing visible
 * tines is the version that still says "fork" at 32px.
 * Keep this in sync with `src/app/icon.svg`.
 */
export default function Logo({ className = 'w-9 h-9' }: LogoProps) {
    return (
        <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
            <g stroke="#3A2E28" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 4 L15 19" />
                <path d="M24 4 L24 19" />
                <path d="M33 4 L33 19" />
                <path d="M13 19 C13 25 22 26 24 30 L24 43" />
                <path d="M35 19 C35 25 26 26 24 30" />
            </g>
            <g stroke="#E3A73B" strokeWidth={3.2} strokeLinecap="round" fill="none">
                <path d="M7 14 C13 11 19 17 25 14 C31 11 37 16 41 13" />
                <path d="M7 20 C13 17 19 23 25 20 C31 17 37 22 41 19" />
            </g>
        </svg>
    );
}
