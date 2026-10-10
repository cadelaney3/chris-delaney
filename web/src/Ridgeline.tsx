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

// A row of pine silhouettes along a gently rolling ground line.
function pines(width: number, ground: (x: number) => number, minH: number, maxH: number, seed: number) {
  const rand = rng(seed)
  let d = ''
  for (let x = -10; x < width + 10; x += 7 + rand() * 9) {
    const h = minH + rand() * (maxH - minH)
    const w = h * (0.32 + rand() * 0.1)
    const y = ground(x)
    // Two stacked triangles read as a conifer at small sizes.
    d += `M${x.toFixed(1)} ${(y - h).toFixed(1)}L${(x + w / 2).toFixed(1)} ${(y - h * 0.35).toFixed(1)}L${(x - w / 2).toFixed(1)} ${(y - h * 0.35).toFixed(1)}Z`
    d += `M${x.toFixed(1)} ${(y - h * 0.62).toFixed(1)}L${(x + w * 0.62).toFixed(1)} ${y.toFixed(1)}L${(x - w * 0.62).toFixed(1)} ${y.toFixed(1)}Z`
  }
  return d
}

const W = 720
const heroGround = (x: number) => 150 + Math.sin(x / 90) * 6 + Math.sin(x / 37) * 3
const heroPines = pines(W, heroGround, 16, 36, 406)
const heroGroundPath = `M0 ${heroGround(0)}` + Array.from({ length: 37 }, (_, i) => `L${i * 20} ${heroGround(i * 20).toFixed(1)}`).join('') + `L${W} 180L0 180Z`

const FAR = 'M0 118L48 96L92 108L150 62L196 92L238 80L290 104L352 50L404 88L452 72L500 98L566 58L612 84L664 70L720 92V180H0Z'
const MID = 'M0 140L40 122L84 132L138 100L182 126L236 108L286 132L340 98L392 124L446 110L494 134L552 102L604 128L660 112L720 126V180H0Z'

export function HeroRidge() {
  return (
    <div className="hero-ridge" aria-hidden="true">
      <svg className="ridgeline" viewBox={`0 0 ${W} 180`} preserveAspectRatio="xMidYMax slice">
        <circle className="sun" cx="560" cy="62" r="26" />
        <path className="far" d={FAR} />
        <path className="mid" d={MID} />
        <path className="near" d={heroGroundPath} />
        <path className="near" d={heroPines} />
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
