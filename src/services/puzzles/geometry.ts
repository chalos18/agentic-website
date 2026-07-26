/**
 * Minimal 3D maths + convex-polytope carving.
 *
 * Every twisty puzzle here is built the same way a real one is moulded: take a
 * solid (cube, tetrahedron, dodecahedron) and slice it with planes. What falls
 * out are the pieces. That's why this file exists — `splitPolytope` is the only
 * geometry primitive the puzzle definitions need.
 */

export type Vec3 = readonly [number, number, number];
/** Quaternion, `[x, y, z, w]` — same component order as three.js. */
export type Quat = readonly [number, number, number, number];

/** Half-space: points `p` with `dot(n, p) <= d` are inside. */
export interface Plane {
    n: Vec3;
    d: number;
}

export interface Polygon {
    plane: Plane;
    points: Vec3[];
}

export type Polytope = Polygon[];

const EPS = 1e-6;

export function add(a: Vec3, b: Vec3): Vec3 {
    return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

export function sub(a: Vec3, b: Vec3): Vec3 {
    return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

export function scale(a: Vec3, s: number): Vec3 {
    return [a[0] * s, a[1] * s, a[2] * s];
}

export function dot(a: Vec3, b: Vec3): number {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

export function cross(a: Vec3, b: Vec3): Vec3 {
    return [
        a[1] * b[2] - a[2] * b[1],
        a[2] * b[0] - a[0] * b[2],
        a[0] * b[1] - a[1] * b[0],
    ];
}

export function length(a: Vec3): number {
    return Math.sqrt(dot(a, a));
}

export function normalize(a: Vec3): Vec3 {
    const l = length(a);
    return l < EPS ? [0, 0, 0] : scale(a, 1 / l);
}

function lerp(a: Vec3, b: Vec3, t: number): Vec3 {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export function quatFromAxisAngle(axis: Vec3, angle: number): Quat {
    const a = normalize(axis);
    const h = angle / 2;
    const s = Math.sin(h);
    return [a[0] * s, a[1] * s, a[2] * s, Math.cos(h)];
}

/** Hamilton product — applying `b` then `a`. */
export function quatMul(a: Quat, b: Quat): Quat {
    const [ax, ay, az, aw] = a;
    const [bx, by, bz, bw] = b;
    return [
        aw * bx + ax * bw + ay * bz - az * by,
        aw * by - ax * bz + ay * bw + az * bx,
        aw * bz + ax * by - ay * bx + az * bw,
        aw * bw - ax * bx - ay * by - az * bz,
    ];
}

export function applyQuat(q: Quat, v: Vec3): Vec3 {
    const [x, y, z, w] = q;
    // t = 2 * (q_vec x v); v' = v + w*t + q_vec x t
    const tx = 2 * (y * v[2] - z * v[1]);
    const ty = 2 * (z * v[0] - x * v[2]);
    const tz = 2 * (x * v[1] - y * v[0]);
    return [
        v[0] + w * tx + y * tz - z * ty,
        v[1] + w * ty + z * tx - x * tz,
        v[2] + w * tz + x * ty - y * tx,
    ];
}

export const IDENTITY_QUAT: Quat = [0, 0, 0, 1];

function dedupe(points: Vec3[]): Vec3[] {
    const out: Vec3[] = [];
    for (const p of points) {
        const last = out[out.length - 1];
        if (!last || length(sub(p, last)) > EPS) out.push(p);
    }
    while (out.length > 1 && length(sub(out[0], out[out.length - 1])) < EPS) out.pop();
    return out;
}

/** Two vectors perpendicular to `n` and to each other, for flattening a face. */
function planeBasis(n: Vec3): [Vec3, Vec3] {
    const seed: Vec3 = Math.abs(n[0]) < 0.9 ? [1, 0, 0] : [0, 1, 0];
    const u = normalize(cross(n, seed));
    return [u, cross(n, u)];
}

/** Wind a cloud of coplanar points into a convex polygon, counter-clockwise about `plane.n`. */
function orderRing(points: Vec3[], plane: Plane): Vec3[] {
    if (points.length < 3) return [];
    const unique: Vec3[] = [];
    for (const p of points) {
        if (!unique.some((q) => length(sub(p, q)) < EPS)) unique.push(p);
    }
    if (unique.length < 3) return [];

    const centre = scale(unique.reduce(add, [0, 0, 0] as Vec3), 1 / unique.length);
    const [u, v] = planeBasis(plane.n);
    return unique
        .map((p) => ({ p, angle: Math.atan2(dot(sub(p, centre), v), dot(sub(p, centre), u)) }))
        .sort((a, b) => a.angle - b.angle)
        .map(({ p }) => p);
}

/**
 * Keep the part of `poly` inside `plane`, sealing the cut with a new face.
 * Returns `null` when the plane removes everything.
 */
export function clipPolytope(poly: Polytope, plane: Plane): Polytope | null {
    const kept: Polytope = [];
    const capPoints: Vec3[] = [];
    let anyOutside = false;
    let anyInside = false;

    for (const face of poly) {
        const ring: Vec3[] = [];
        const n = face.points.length;
        for (let i = 0; i < n; i++) {
            const a = face.points[i];
            const b = face.points[(i + 1) % n];
            const da = dot(plane.n, a) - plane.d;
            const db = dot(plane.n, b) - plane.d;

            if (da <= EPS) {
                ring.push(a);
                // A vertex already sitting on the plane is a corner of the cut
                // face too — miss these and the seal comes out short a point.
                if (da >= -EPS) capPoints.push(a);
            } else {
                anyOutside = true;
            }
            if (da < -EPS) anyInside = true;

            if ((da < -EPS && db > EPS) || (da > EPS && db < -EPS)) {
                const point = lerp(a, b, da / (da - db));
                ring.push(point);
                capPoints.push(point);
            }
        }
        const cleaned = dedupe(ring);
        if (cleaned.length >= 3) kept.push({ plane: face.plane, points: cleaned });
    }

    if (!anyOutside) return poly;
    if (!anyInside) return null;

    const cap = orderRing(capPoints, plane);
    if (cap.length >= 3) kept.push({ plane, points: cap });
    return kept;
}

/** `[inside, outside]` halves of `poly`; either side is `null` when the plane misses it. */
export function splitPolytope(poly: Polytope, plane: Plane): [Polytope | null, Polytope | null] {
    const flipped: Plane = { n: scale(plane.n, -1), d: -plane.d };
    return [clipPolytope(poly, plane), clipPolytope(poly, flipped)];
}

/** A point strictly inside a convex polytope — good enough to test which layer it sits in. */
export function interiorPoint(poly: Polytope): Vec3 {
    let sum: Vec3 = [0, 0, 0];
    let count = 0;
    for (const face of poly) {
        for (const p of face.points) {
            sum = add(sum, p);
            count++;
        }
    }
    return count === 0 ? [0, 0, 0] : scale(sum, 1 / count);
}

export function translatePolytope(poly: Polytope, offset: Vec3): Polytope {
    return poly.map((face) => ({
        plane: { n: face.plane.n, d: face.plane.d + dot(face.plane.n, offset) },
        points: face.points.map((p) => add(p, offset)),
    }));
}

/** An axis-aligned box, as a polytope. Used as the raw stock every solid is carved from. */
export function boxPolytope(half: number): Polytope {
    const axes: Vec3[] = [
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
    ];
    return axes.map((n) => {
        const [u, v] = planeBasis(n);
        const c = scale(n, half);
        return {
            plane: { n, d: half },
            points: [
                add(c, add(scale(u, half), scale(v, half))),
                add(c, add(scale(u, -half), scale(v, half))),
                add(c, add(scale(u, -half), scale(v, -half))),
                add(c, add(scale(u, half), scale(v, -half))),
            ],
        };
    });
}

export function samePlane(a: Plane, b: Plane, tolerance = 1e-4): boolean {
    return Math.abs(a.d - b.d) < tolerance && length(sub(a.n, b.n)) < tolerance;
}
