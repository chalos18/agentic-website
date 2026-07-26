/**
 * Puzzle definitions: the solid, where it gets sliced, and what each twist grabs.
 *
 * Every puzzle is described the same way, so the engine, the renderer and the
 * trainer UI never need to special-case one shape over another:
 *   - `shell`  — the outward faces of the solid, each carrying a sticker colour
 *   - `cuts`   — the planes that carve the solid into pieces
 *   - `moves`  — a twist axis, a selection threshold along it, and a turn order
 */

import type { Plane, Vec3 } from './geometry';
import { normalize } from './geometry';

export type PuzzleId = '2x2' | '3x3' | '4x4' | '5x5' | 'pyraminx' | 'skewb' | 'megaminx' | 'mastermorphix' | 'ivy';

export interface MoveDef {
    /** Twist axis, pointing out of the face being turned. */
    axis: Vec3;
    /** Pieces with `dot(axis, position) > threshold` ride along with the twist. */
    threshold: number;
    /** Upper bound on that same dot product, for slice moves that grab a band. */
    ceiling?: number;
    /** Turns needed to return to start: 4 on a cube, 3 on a pyraminx, 5 on a megaminx. */
    order: number;
}

export interface ShellFace {
    plane: Plane;
    color: string;
}

export interface PuzzleDefinition {
    id: PuzzleId;
    label: string;
    /** One line on what makes this puzzle its own thing. */
    blurb: string;
    /** Beginner method walkthrough for this puzzle. */
    guideUrl: string;
    shell: ShellFace[];
    cuts: Plane[];
    moves: Record<string, MoveDef>;
    /** Move buttons, grouped for the control pad. */
    moveGroups: { label: string; moves: string[] }[];
    /** Moves the scrambler draws from. */
    scrambleMoves: string[];
    scrambleLength: number;
    /** Camera distance that frames the whole solid at the canvas field of view. */
    cameraDistance: number;
    /** Standard face notation (R/U/F…) — enables the algorithm parser and library. */
    supportsAlgorithms: boolean;
}

const STICKER = {
    white: '#F6F1E7',
    yellow: '#F0BE45',
    green: '#4F9D69',
    blue: '#3D6DAF',
    red: '#C4432C',
    orange: '#DF8636',
    pink: '#D98CA8',
    purple: '#7B5C9E',
    lime: '#A9C64C',
    grey: '#9FA6A0',
    cream: '#EADCC0',
    teal: '#3E9C97',
} as const;

/**
 * Distance at which a solid of the given bounding radius fills a comfortable
 * share of the canvas. Tied to the 42° field of view in `PuzzleCanvas`.
 */
function fitDistance(boundingRadius: number): number {
    return (boundingRadius / Math.tan((42 * Math.PI) / 360)) * 1.25;
}

const CUBE_FACES: { name: string; axis: Vec3; color: string }[] = [
    { name: 'U', axis: [0, 1, 0], color: STICKER.white },
    { name: 'D', axis: [0, -1, 0], color: STICKER.yellow },
    { name: 'F', axis: [0, 0, 1], color: STICKER.green },
    { name: 'B', axis: [0, 0, -1], color: STICKER.blue },
    { name: 'R', axis: [1, 0, 0], color: STICKER.red },
    { name: 'L', axis: [-1, 0, 0], color: STICKER.orange },
];

/* ------------------------------------------------------------------ NxN cubes */

function nxnDefinition(
    n: number,
    id: PuzzleId,
    label: string,
    blurb: string,
    guideUrl: string,
): PuzzleDefinition {
    const half = n / 2;

    const shell: ShellFace[] = CUBE_FACES.map(({ axis, color }) => ({
        plane: { n: axis, d: half },
        color,
    }));

    // One cut between every pair of neighbouring layers, on all three axes.
    const cuts: Plane[] = [];
    for (const axis of [[1, 0, 0], [0, 1, 0], [0, 0, 1]] as Vec3[]) {
        for (let i = 1; i < n; i++) cuts.push({ n: axis, d: -half + i });
    }

    // Outer layer for every face, plus a wide (two-layer) turn once the puzzle is
    // big enough for the inner slices to matter.
    const maxDepth = Math.floor(n / 2);
    const moves: Record<string, MoveDef> = {};
    const outer: string[] = [];
    const wide: string[] = [];
    for (const { name, axis } of CUBE_FACES) {
        for (let depth = 1; depth <= maxDepth; depth++) {
            const moveName = depth === 1 ? name : depth === 2 ? `${name}w` : `${depth}${name}w`;
            moves[moveName] = { axis, threshold: half - depth, order: 4 };
            (depth === 1 ? outer : wide).push(moveName);
        }
    }

    // Whole-puzzle reorientations: everything is on the far side of any threshold
    // below the solid's own extent.
    const rotations: Record<string, Vec3> = { x: [1, 0, 0], y: [0, 1, 0], z: [0, 0, 1] };
    for (const [name, axis] of Object.entries(rotations)) {
        moves[name] = { axis, threshold: -Infinity, order: 4 };
    }

    // Slice moves only exist where there is a true middle layer to grab.
    const slices: string[] = [];
    if (n % 2 === 1) {
        const sliceAxes: [string, Vec3][] = [
            ['M', [-1, 0, 0]], // follows L
            ['E', [0, -1, 0]], // follows D
            ['S', [0, 0, 1]], // follows F
        ];
        for (const [name, axis] of sliceAxes) {
            moves[name] = { axis, threshold: -0.5, ceiling: 0.5, order: 4 };
            slices.push(name);
        }
    }

    const moveGroups = [{ label: 'Faces', moves: outer }];
    if (wide.length) moveGroups.push({ label: 'Wide turns', moves: wide });
    if (slices.length) moveGroups.push({ label: 'Slices', moves: slices });
    moveGroups.push({ label: 'Rotate the whole cube', moves: ['x', 'y', 'z'] });

    return {
        id,
        label,
        blurb,
        guideUrl,
        shell,
        cuts,
        moves,
        moveGroups,
        scrambleMoves: [...outer, ...wide],
        scrambleLength: n <= 2 ? 11 : n === 3 ? 20 : 40,
        cameraDistance: fitDistance((n / 2) * Math.sqrt(3)),
        supportsAlgorithms: true,
    };
}

/* ------------------------------------------------------------------- Pyraminx */

function pyraminxDefinition(): PuzzleDefinition {
    // A regular tetrahedron on four alternating cube corners. Each face plane sits
    // opposite one vertex, so vertex directions double as the four twist axes.
    const vertices: Vec3[] = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ];
    const names = ['U', 'L', 'R', 'B'];
    const colors = [STICKER.yellow, STICKER.green, STICKER.red, STICKER.blue];
    const axes = vertices.map(normalize);

    // Along each axis the solid spans from the vertex (√3) to the far face (-1/√3);
    // two evenly spaced cuts give the tip, the axial piece and the bottom layer.
    const vertexReach = Math.sqrt(3);
    const faceReach = 1 / Math.sqrt(3);
    const slab = (vertexReach + faceReach) / 3;
    const tipCut = vertexReach - slab;
    const layerCut = vertexReach - 2 * slab;

    const shell: ShellFace[] = axes.map((axis, i) => ({
        // The face opposite vertex i faces away from it.
        plane: { n: [-axis[0], -axis[1], -axis[2]], d: faceReach },
        color: colors[i],
    }));

    const cuts: Plane[] = [];
    const moves: Record<string, MoveDef> = {};
    axes.forEach((axis, i) => {
        cuts.push({ n: axis, d: tipCut }, { n: axis, d: layerCut });
        moves[names[i]] = { axis, threshold: layerCut, order: 3 };
        moves[names[i].toLowerCase()] = { axis, threshold: tipCut, order: 3 };
    });

    return {
        id: 'pyraminx',
        label: 'Pyraminx',
        blurb: 'A tetrahedron with four corner axes. Capital turns take a whole layer, lowercase turns take just the tip.',
        guideUrl:
            'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-pyraminx-easy-to-follow-beginners-steps',
        shell,
        cuts,
        moves,
        moveGroups: [
            { label: 'Layers', moves: names },
            { label: 'Tips', moves: names.map((n) => n.toLowerCase()) },
        ],
        scrambleMoves: [...names, ...names.map((n) => n.toLowerCase())],
        scrambleLength: 14,
        // Its bounding sphere reaches the vertices, but the silhouette is far
        // smaller — frame the shape you see, not the sphere around it.
        cameraDistance: fitDistance(1.35),
        supportsAlgorithms: false,
    };
}

/* ------------------------------------------------------------- Mastermorphix */

function mastermorphixDefinition(): PuzzleDefinition {
    // Unlike a Pyraminx, the Mastermorphix is a genuine shape-mod of the 3x3:
    // the exact same six face axes, two-layer cuts and order-4 turns as a
    // Rubik's Cube (reused wholesale from `nxnDefinition`), just bounded by a
    // tetrahedral shell instead of a cube's. A tetrahedron's four faces don't
    // line up with the cube's own grid lines, so a piece that was a small cube
    // corner ends up filling a whole tetrahedron tip, and a piece that was a
    // cube edge ends up as an oddly-angled sliver on a face — which is exactly
    // why every piece changes size and outline as it turns, even though the
    // turns themselves are pure 3x3 logic. See:
    // https://www.speedsolving.com/wiki/index.php/Mastermorphix
    const base = nxnDefinition(
        3,
        'mastermorphix',
        'Mastermorphix',
        "A 3x3 mechanism wearing a tetrahedron's shape: the moves are pure Rubik's Cube, but the tetrahedral shell doesn't line up with the cube's own grid, so pieces change size and outline every time they turn.",
        'https://www.speedsolving.com/wiki/index.php/Mastermorphix',
    );

    // Regular tetrahedron with vertices sitting exactly on four alternating
    // corners of the same cube `nxnDefinition(3, ...)` carves (half-width 1.5)
    // — the classic "stella octangula" tetrahedron-in-a-cube construction.
    const half = 1.5;
    const vertices: Vec3[] = [
        [half, half, half],
        [half, -half, -half],
        [-half, half, -half],
        [-half, -half, half],
    ];
    const colors = [STICKER.cream, STICKER.red, STICKER.green, STICKER.yellow];
    const faceReach = half / Math.sqrt(3);
    const shell: ShellFace[] = vertices.map((v, i) => {
        const axis = normalize(v);
        return { plane: { n: [-axis[0], -axis[1], -axis[2]], d: faceReach }, color: colors[i] };
    });

    return {
        ...base,
        shell,
        cameraDistance: fitDistance(half * Math.sqrt(3)),
    };
}

/* ---------------------------------------------------------------------- Skewb */

function skewbDefinition(): PuzzleDefinition {
    // Cube-shaped, but cut through the centre along all four body diagonals —
    // so every twist rotates a whole corner half of the puzzle.
    const diagonals: Vec3[] = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ];
    const names = ['U', 'R', 'L', 'B'];
    const axes = diagonals.map(normalize);

    const moves: Record<string, MoveDef> = {};
    axes.forEach((axis, i) => {
        moves[names[i]] = { axis, threshold: 0, order: 3 };
    });

    return {
        id: 'skewb',
        label: 'Skewb',
        blurb: 'Cube-shaped but cut corner to corner: every turn swings half the puzzle at once.',
        guideUrl:
            'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-skewb-in-4-steps-easy-to-follow-beginners-steps',
        shell: CUBE_FACES.map(({ axis, color }) => ({ plane: { n: axis, d: 1 }, color })),
        cuts: axes.map((n) => ({ n, d: 0 })),
        moves,
        moveGroups: [{ label: 'Corner twists', moves: names }],
        scrambleMoves: names,
        scrambleLength: 12,
        cameraDistance: fitDistance(Math.sqrt(3)),
        supportsAlgorithms: false,
    };
}

/* ----------------------------------------------------------------- Ivy Cube */

function ivyDefinition(): PuzzleDefinition {
    // Same body-diagonal corner axes as a Skewb, but each turn only grabs the
    // small corner tip (a 180°-only twist) rather than half the puzzle — the
    // mechanical difference that makes an Ivy Cube its own thing, not just a
    // recolored Skewb.
    const diagonals: Vec3[] = [
        [1, 1, 1],
        [1, -1, -1],
        [-1, 1, -1],
        [-1, -1, 1],
    ];
    const names = ['U', 'R', 'L', 'B'];
    const axes = diagonals.map(normalize);

    const moves: Record<string, MoveDef> = {};
    axes.forEach((axis, i) => {
        moves[names[i]] = { axis, threshold: 1, order: 2 };
    });

    return {
        id: 'ivy',
        label: 'Ivy Cube',
        blurb: 'Corner-turning like a Skewb, but each twist only takes the corner tip, and only spins it halfway around.',
        guideUrl: 'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-skewb-in-4-steps-easy-to-follow-beginners-steps',
        shell: CUBE_FACES.map(({ axis, color }) => ({ plane: { n: axis, d: 1 }, color })),
        cuts: axes.map((n) => ({ n, d: 1 })),
        moves,
        moveGroups: [{ label: 'Corner tips', moves: names }],
        scrambleMoves: names,
        scrambleLength: 10,
        cameraDistance: fitDistance(Math.sqrt(3)),
        supportsAlgorithms: false,
    };
}

/* ------------------------------------------------------------------- Megaminx */

/**
 * How deep each face cut bites, as a distance along the face normal (the solid
 * has inradius 1). Sets how large the centre pentagon looks; anywhere in roughly
 * 0.6–0.8 yields a well-formed 12/30/20 centre/edge/corner split.
 */
const MEGAMINX_CUT_DEPTH = 0.7;

function megaminxDefinition(): PuzzleDefinition {
    // Dodecahedron face normals = icosahedron vertices, laid out as a pentagonal
    // antiprism so one face points cleanly up.
    const ringTilt = Math.acos(1 / Math.sqrt(5)); // 63.43°, the icosahedral ring angle
    const upper: Vec3[] = [];
    const lower: Vec3[] = [];
    for (let k = 0; k < 5; k++) {
        const a = (k * 72 * Math.PI) / 180;
        const b = ((36 + k * 72) * Math.PI) / 180;
        upper.push([Math.sin(ringTilt) * Math.cos(a), Math.cos(ringTilt), Math.sin(ringTilt) * Math.sin(a)]);
        lower.push([
            Math.sin(ringTilt) * Math.cos(b),
            -Math.cos(ringTilt),
            Math.sin(ringTilt) * Math.sin(b),
        ]);
    }

    const faceSpecs: { name: string; axis: Vec3; color: string }[] = [
        { name: 'U', axis: [0, 1, 0], color: STICKER.white },
        { name: 'R', axis: upper[0], color: STICKER.red },
        { name: 'F', axis: upper[1], color: STICKER.green },
        { name: 'L', axis: upper[2], color: STICKER.purple },
        { name: 'BL', axis: upper[3], color: STICKER.yellow },
        { name: 'BR', axis: upper[4], color: STICKER.blue },
        { name: 'DR', axis: lower[0], color: STICKER.pink },
        { name: 'DF', axis: lower[1], color: STICKER.lime },
        { name: 'DL', axis: lower[2], color: STICKER.teal },
        { name: 'DBL', axis: lower[3], color: STICKER.orange },
        { name: 'DBR', axis: lower[4], color: STICKER.cream },
        { name: 'D', axis: [0, -1, 0], color: STICKER.grey },
    ];
    const faces = faceSpecs.map((f) => ({ ...f, axis: normalize(f.axis) }));

    const moves: Record<string, MoveDef> = {};
    for (const { name, axis } of faces) {
        moves[name] = { axis, threshold: MEGAMINX_CUT_DEPTH, order: 5 };
    }

    return {
        id: 'megaminx',
        label: 'Megaminx',
        blurb: 'Twelve pentagonal faces, seventy-two degrees a turn. Same layer-by-layer thinking as a 3x3, one dimension wider.',
        guideUrl:
            'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-megaminx-layer-by-layer-easy-to-follow-beginners-steps',
        shell: faces.map(({ axis, color }) => ({ plane: { n: axis, d: 1 }, color })),
        cuts: faces.map(({ axis }) => ({ n: axis, d: MEGAMINX_CUT_DEPTH })),
        moves,
        moveGroups: [
            { label: 'Top half', moves: ['U', 'F', 'R', 'BR', 'BL', 'L'] },
            { label: 'Bottom half', moves: ['DF', 'DR', 'DBR', 'DBL', 'DL', 'D'] },
        ],
        scrambleMoves: faces.map((f) => f.name),
        scrambleLength: 30,
        cameraDistance: fitDistance(1.402),
        supportsAlgorithms: false,
    };
}

/* ----------------------------------------------------------------- The roster */

export const PUZZLES: Record<PuzzleId, PuzzleDefinition> = {
    '2x2': nxnDefinition(
        2,
        '2x2',
        '2x2',
        'All corners, no centres to anchor you — the whole puzzle is the last layer.',
        'https://nz.speedcube.com.au/blogs/speedcubing-solutions/pages-how-to-solve-a-2x2-cube-step-by-step-beginners-instructions',
    ),
    '3x3': nxnDefinition(
        3,
        '3x3',
        '3x3',
        'The original. Fixed centres mean every piece has one home, and every algorithm has a reason.',
        'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-rubiks-cube-beginners-method',
    ),
    '4x4': nxnDefinition(
        4,
        '4x4',
        '4x4',
        'Floating centres and paired edges. Reduce it to a 3x3, then solve it like one — parity permitting.',
        'https://nz.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-4x4-rubiks-cube-complete-beginners-guide',
    ),
    '5x5': nxnDefinition(
        5,
        '5x5',
        '5x5',
        'Reduction again, with three-wide centres and triple edges to build first.',
        'https://www.speedcube.com.au/blogs/speedcubing-solutions/how-to-solve-a-5x5-using-the-reduction-method',
    ),
    pyraminx: pyraminxDefinition(),
    skewb: skewbDefinition(),
    megaminx: megaminxDefinition(),
    mastermorphix: mastermorphixDefinition(),
    ivy: ivyDefinition(),
};

export const PUZZLE_ORDER: PuzzleId[] = ['2x2', '3x3', '4x4', '5x5', 'pyraminx', 'skewb', 'megaminx', 'mastermorphix', 'ivy'];
