/**
 * Where each letter floats in the alphabet soup.
 *
 * Two rules the old layout broke: a letter must land inside the broth, and no
 * two letters may sit on top of each other. Skills are kept together as gently
 * curved runs so you can still read "Terraform" in the bowl rather than hunting
 * for loose letters. Placement is seeded, not random, so the server and the
 * browser lay out the same bowl.
 */

/** The ellipse letters are allowed to occupy, in SVG user units. */
export const FIELD = { cx: 130, cy: 74, rx: 93, ry: 24.5 } as const;

export const LETTER_SIZE = 9.5;
/** Distance between the centres of neighbouring letters in a word. */
const LETTER_SPACING = 6.9;
/** Half-extents of a letter's keep-out box. */
const KEEP_OUT_X = 3.3;
const KEEP_OUT_Y = 4.9;
/** How far a word bows away from a straight line, at its middle. */
const BOW = 1.6;
const MAX_TILT_DEG = 22;
const ATTEMPTS_PER_WORD = 900;

export interface SoupLetter {
    id: string;
    char: string;
    x: number;
    y: number;
    rotation: number;
    /** Index of the skill this letter belongs to — drives colour and bob phase. */
    skillIndex: number;
}

/** Small deterministic PRNG (mulberry32). */
function seeded(seed: number): () => number {
    let a = seed >>> 0;
    return () => {
        a = (a + 0x6d2b79f5) >>> 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function insideField(x: number, y: number): boolean {
    const dx = (x - FIELD.cx) / FIELD.rx;
    const dy = (y - FIELD.cy) / FIELD.ry;
    return dx * dx + dy * dy <= 1;
}

function collides(x: number, y: number, placed: SoupLetter[]): boolean {
    return placed.some(
        (l) => Math.abs(l.x - x) < KEEP_OUT_X * 2 && Math.abs(l.y - y) < KEEP_OUT_Y * 2,
    );
}

/** Distance to the closest already-placed letter; `Infinity` for the first word. */
function nearestDistance(c: { x: number; y: number }, placed: SoupLetter[]): number {
    let best = Infinity;
    for (const l of placed) best = Math.min(best, Math.hypot(l.x - c.x, l.y - c.y));
    return best;
}

interface Candidate {
    x: number;
    y: number;
    rotation: number;
}

/** Lay a word along a shallow arc through `(cx, cy)` at `tilt` radians. */
function wordCandidates(word: string, cx: number, cy: number, tilt: number): Candidate[] {
    const dirX = Math.cos(tilt);
    const dirY = Math.sin(tilt);
    const last = word.length - 1;

    return word.split('').map((_, i) => {
        const along = (i - last / 2) * LETTER_SPACING;
        // Bow peaks at the middle of the word and vanishes at both ends.
        const t = last === 0 ? 0 : (2 * i) / last - 1;
        const bow = BOW * (1 - t * t);
        return {
            x: cx + dirX * along - dirY * bow,
            y: cy + dirY * along + dirX * bow,
            rotation: (tilt * 180) / Math.PI + t * 6,
        };
    });
}

/**
 * Place every skill in the bowl. Longest first, because a long word needs the
 * clear space more than a short one does.
 */
export function layOutSoup(skills: string[], seed = 20260726): SoupLetter[] {
    const random = seeded(seed);
    const placed: SoupLetter[] = [];

    const order = skills
        .map((skill, skillIndex) => ({ skill, skillIndex, word: skill.replace(/[^A-Za-z0-9]/g, '') }))
        .sort((a, b) => b.word.length - a.word.length);

    for (const { word, skillIndex } of order) {
        let best: Candidate[] | null = null;
        let bestClearance = -1;

        for (let attempt = 0; attempt < ATTEMPTS_PER_WORD; attempt++) {
            // Sample uniformly over the field ellipse.
            const r = Math.sqrt(random());
            const theta = random() * Math.PI * 2;
            const cx = FIELD.cx + Math.cos(theta) * r * FIELD.rx;
            const cy = FIELD.cy + Math.sin(theta) * r * FIELD.ry;
            const tilt = ((random() * 2 - 1) * MAX_TILT_DEG * Math.PI) / 180;

            const candidates = wordCandidates(word, cx, cy, tilt);
            const fits = candidates.every(
                (c) => insideField(c.x, c.y) && !collides(c.x, c.y, placed),
            );
            if (!fits) continue;

            // Keep the roomiest fit rather than the first one, so words spread out
            // across the bowl instead of clumping wherever the first hit landed.
            const clearance = Math.min(...candidates.map((c) => nearestDistance(c, placed)));
            if (clearance > bestClearance) {
                bestClearance = clearance;
                best = candidates;
            }
        }

        best?.forEach((c, i) => {
            placed.push({
                id: `${skillIndex}-${i}`,
                char: word[i],
                x: c.x,
                y: c.y,
                rotation: c.rotation,
                skillIndex,
            });
        });
    }

    return placed;
}

/** Pull a stirred letter back inside the broth so nothing rides over the rim. */
export function clampToField(x: number, y: number): [number, number] {
    const dx = (x - FIELD.cx) / FIELD.rx;
    const dy = (y - FIELD.cy) / FIELD.ry;
    const r = Math.hypot(dx, dy);
    if (r <= 1) return [x, y];
    return [FIELD.cx + (dx / r) * FIELD.rx, FIELD.cy + (dy / r) * FIELD.ry];
}
