// Layered mountain ranges with a pine-covered foreground, drawn as inline SVG
// so the colors follow the light/dark theme tokens in index.css.

// Small seeded PRNG so the trees land in the same places on every render.
function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

// A row of pine silhouettes along a gently rolling ground line. `clearings`
// are [from, to] x ranges left treeless (room for wildlife).
function pines(width: number, ground: (x: number) => number, minH: number, maxH: number, seed: number, clearings: [number, number][] = []) {
  const rand = rng(seed)
  let d = ''
  for (let x = -10; x < width + 10; x += 7 + rand() * 9) {
    const h = minH + rand() * (maxH - minH)
    if (clearings.some(([a, b]) => x > a && x < b)) continue
    const w = h * (0.32 + rand() * 0.1)
    const y = ground(x)
    // Two stacked triangles read as a conifer at small sizes.
    d += `M${x.toFixed(1)} ${(y - h).toFixed(1)}L${(x + w / 2).toFixed(1)} ${(y - h * 0.35).toFixed(1)}L${(x - w / 2).toFixed(1)} ${(y - h * 0.35).toFixed(1)}Z`
    d += `M${x.toFixed(1)} ${(y - h * 0.62).toFixed(1)}L${(x + w * 0.62).toFixed(1)} ${y.toFixed(1)}L${(x - w * 0.62).toFixed(1)} ${y.toFixed(1)}Z`
  }
  return d
}

type Pt = [number, number]
const ridgePath = (pts: Pt[]) => 'M' + pts.map(([x, y]) => `${x} ${y}`).join('L') + 'V180H0Z'

// Snow on every peak that rises above `snowline`: a cap following both slopes
// down `depth` units, with a ragged lower edge.
function snowCaps(pts: Pt[], snowline: number, depth: number) {
  const along = (from: Pt, to: Pt): Pt => {
    const t = Math.min(1, depth / (to[1] - from[1]))
    return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t]
  }
  let d = ''
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i]
    if (py > snowline || py > pts[i - 1][1] || py > pts[i + 1][1]) continue
    const [lx, ly] = along(pts[i], pts[i - 1])
    const [rx, ry] = along(pts[i], pts[i + 1])
    const f = (n: number) => n.toFixed(1)
    d += `M${px} ${py}L${f(rx)} ${f(ry)}L${f(px + (rx - px) * 0.45)} ${f(py + depth * 0.62)}` +
      `L${f(px + (rx - px) * 0.1)} ${f(py + depth * 0.95)}L${f(px - (px - lx) * 0.3)} ${f(py + depth * 0.6)}L${f(lx)} ${f(ly)}Z`
  }
  return d
}

const W = 720
const DEER_X = 262
const heroGround = (x: number) => 150 + Math.sin(x / 90) * 6 + Math.sin(x / 37) * 3
const heroPines = pines(W, heroGround, 16, 36, 406, [[DEER_X - 22, DEER_X + 26]])
const heroGroundPath = `M0 ${heroGround(0)}` + Array.from({ length: 37 }, (_, i) => `L${i * 20} ${heroGround(i * 20).toFixed(1)}`).join('') + `L${W} 180L0 180Z`

const FAR_PTS: Pt[] = [[0, 118], [48, 96], [92, 108], [150, 62], [196, 92], [238, 80], [290, 104], [352, 50], [404, 88], [452, 72], [500, 98], [566, 58], [612, 84], [664, 70], [720, 92]]
// The 330-352 shoulder is flat so the elk has somewhere to stand.
const MID_PTS: Pt[] = [[0, 140], [40, 122], [84, 132], [138, 100], [182, 126], [236, 108], [286, 132], [330, 100], [352, 99.5], [392, 124], [446, 110], [494, 134], [552, 102], [604, 128], [660, 112], [720, 126]]
const FAR = ridgePath(FAR_PTS)
const MID = ridgePath(MID_PTS)
const SNOW = snowCaps(FAR_PTS, 65, 13)

// Silhouettes in local units; feet rest on y = 46 (elk) and y = 40 (deer).
const ELK_BODY = 'M8 9L3.5 12.5L4.5 14.5L9 14.5C10 17.5 10.5 20.5 12.5 23.5C13.5 26.5 14.5 29.5 16 31L16 46L18 46L18.6 33L20 33.4L20.6 46L22.6 46L23.4 33.6C28 34.2 33 34.2 38 33.4L39 46L41 46L41.6 33L43 32L44 46L46 46L46.2 31C48 29 48.6 25 47.6 22L49.2 23.6L48.2 20.8C46 17 38 16.5 27 17.5C23 17.5 20 15.5 18 12.5L14 7.5L13 5L11.6 7.2Z'
const ELK_ANTLERS = 'M12 6C14 0 18 -6 24 -12M14 1L9 -2M16 -2L12 -7M19 -6L17 -12M22 -10L22 -16'
const DEER_BODY = 'M42 9L46 12L45 14L40 14C38.5 16.5 37 19.5 36.5 22C36 25 35.5 27 34.5 29L34 40L32.5 40L32 30L30.5 30L30 40L28.5 40L28 30L17 30L16.5 40L15 40L14.5 30L13 29.5L12 40L10.5 40L10.5 28C8.5 26 8 23 9 20L7 19L9.5 18C12 15.5 20 15 26 16C29 15.5 32 13 34 10L37 6L36 3L39 6L41 4L40 8Z'
const DEER_ANTLERS = 'M38 6C38 2 41 -1 44 -2M40 2L39 -2M42 0L43 -4'

function Animal({ body, antlers, x, y, scale, antlerWidth }: { body: string; antlers: string; x: number; y: number; scale: number; antlerWidth: number }) {
  return (
    <g className="animal" transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d={body} />
      <path d={antlers} fill="none" strokeWidth={antlerWidth} strokeLinecap="round" />
    </g>
  )
}

export function HeroRidge() {
  return (
    <div className="hero-ridge" aria-hidden="true">
      <svg className="ridgeline" viewBox={`0 0 ${W} 180`} preserveAspectRatio="xMidYMax slice">
        <circle className="sun" cx="560" cy="62" r="26" />
        <path className="far" d={FAR} />
        <path className="snow" d={SNOW} />
        <path className="mid" d={MID} />
        {/* Bull elk on the ridge shoulder, small with distance. */}
        <Animal body={ELK_BODY} antlers={ELK_ANTLERS} x={334} y={99.5 - 46 * 0.3} scale={0.3} antlerWidth={1.6} />
        <path className="near" d={heroGroundPath} />
        <path className="near" d={heroPines} />
        {/* Buck in a clearing among the pines. */}
        <Animal body={DEER_BODY} antlers={DEER_ANTLERS} x={DEER_X - 6} y={heroGround(DEER_X + 10) - 40 * 0.52 + 0.5} scale={0.52} antlerWidth={1.4} />
      </svg>
    </div>
  )
}

const treeGround = (x: number) => 40 + Math.sin(x / 120) * 2
const treelinePines = pines(W, treeGround, 10, 30, 59801)

export function Treeline() {
  return (
    <svg className="ridgeline treeline" viewBox={`0 0 ${W} 42`} preserveAspectRatio="none" aria-hidden="true">
      <path fill="currentColor" d={treelinePines} />
      <rect fill="currentColor" x="0" y="39" width={W} height="3" />
    </svg>
  )
}

// Small twin-peak mark used next to the name in the header.
export function PeakMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M1 20L8.5 7l3.6 6.2L15 8.5 23 20z" />
      <path fill="var(--bg)" d="M8.5 7l1.9 3.3-1.2-.7-1 1.4-.9-.6z" />
    </svg>
  )
}
