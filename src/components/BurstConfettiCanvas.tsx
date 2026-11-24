import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useLiteEffects } from '../hooks/useLiteEffects'

type Density = 'gift' | 'normal' | 'heavy'

interface BurstConfettiCanvasProps {
  active: boolean
  lingering?: boolean
  density?: Density
  className?: string
}

const COLORS = [
  '#F7DCE5',
  '#E8B7C8',
  '#C67C98',
  '#80354D',
  '#FFF6F2',
  '#F3C9D6',
  '#FF8FB5',
  '#E85A8C',
  '#EFE0F5',
  '#D9A0B5',
]

type Shape = 'rect' | 'circle' | 'heart'

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  rotate: number
  spin: number
  size: number
  color: string
  shape: Shape
  life: number
  maxLife: number
  delay: number
}

function seeded(n: number) {
  const x = Math.sin(n * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

function countsFor(density: Density, lite: boolean) {
  if (density === 'gift') {
    return lite
      ? { burst: 48, waves: 0, linger: 0 }
      : { burst: 86, waves: 0, linger: 0 }
  }
  if (density === 'heavy') {
    return lite
      ? { burst: 70, waves: 40, linger: 18 }
      : { burst: 120, waves: 70, linger: 28 }
  }
  return lite
    ? { burst: 55, waves: 28, linger: 12 }
    : { burst: 90, waves: 50, linger: 20 }
}

function spawnWave(
  count: number,
  wave: number,
  width: number,
  height: number,
): Particle[] {
  const cx = width * 0.5
  const cy = height * 0.38
  return Array.from({ length: count }, (_, i) => {
    const r = seeded(i * 17 + wave * 91)
    const r2 = seeded(i * 31 + wave * 13)
    const r3 = seeded(i * 47 + wave * 7)
    const angle = r * Math.PI * 2
    const speed = 220 + r2 * 420
    const shape: Shape =
      i % 5 === 0 ? 'heart' : i % 3 === 0 ? 'circle' : 'rect'
    return {
      x: cx + (r3 - 0.5) * width * 0.28,
      y: cy + (r2 - 0.5) * height * 0.12,
      vx: Math.cos(angle) * speed * (0.55 + r3 * 0.7),
      vy: Math.sin(angle) * speed * 0.45 - (180 + r * 220),
      rotate: r * Math.PI * 2,
      spin: (r - 0.5) * 8,
      size: 7 + r2 * (shape === 'heart' ? 12 : 11),
      color: COLORS[i % COLORS.length],
      shape,
      life: 0,
      maxLife: 1.8 + r2 * 1.6,
      delay: r3 * 0.22 + wave * 0.18,
    }
  })
}

function drawHeart(
  ctx: CanvasRenderingContext2D,
  size: number,
  color: string,
) {
  const s = size * 0.55
  ctx.beginPath()
  ctx.moveTo(0, s * 0.35)
  ctx.bezierCurveTo(-s, -s * 0.2, -s * 0.5, -s, 0, -s * 0.45)
  ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.2, 0, s * 0.35)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

/**
 * One canvas + rAF particle burst. Avoids hundreds of Motion DOM nodes
 * that stall phones during the gift / final-surprise reveals.
 */
export function BurstConfettiCanvas({
  active,
  lingering = false,
  density = 'normal',
  className = '',
}: BurstConfettiCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()
  const lite = useLiteEffects()

  useEffect(() => {
    if (reduceMotion || (!active && !lingering)) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let raf = 0
    let running = true
    let last = performance.now()
    const particles: Particle[] = []

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, lite ? 1.5 : 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = Math.floor(w * dpr)
      canvas.height = Math.floor(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const { burst, waves, linger } = countsFor(density, lite)
    const w = window.innerWidth
    const h = window.innerHeight

    if (active) {
      particles.push(...spawnWave(burst, 0, w, h))
      if (waves > 0) particles.push(...spawnWave(waves, 1, w, h))
      if (density === 'heavy' && !lite) {
        particles.push(...spawnWave(Math.floor(waves * 0.7), 2, w, h))
      }
    }
    if (lingering) {
      particles.push(...spawnWave(linger, 4, w, h))
    }

    const gravity = 520
    const drag = 0.992

    const tick = (now: number) => {
      if (!running) return
      const dt = Math.min(0.033, (now - last) / 1000)
      last = now

      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

      let alive = 0
      for (const p of particles) {
        if (p.delay > 0) {
          p.delay -= dt
          alive += 1
          continue
        }
        p.life += dt
        if (p.life >= p.maxLife) continue
        alive += 1

        p.vy += gravity * dt
        p.vx *= drag
        p.vy *= drag
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.rotate += p.spin * dt

        const t = p.life / p.maxLife
        const opacity =
          t < 0.08 ? t / 0.08 : t > 0.72 ? Math.max(0, (1 - t) / 0.28) : 1

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotate)
        ctx.globalAlpha = opacity

        if (p.shape === 'heart') {
          drawHeart(ctx, p.size, p.color)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size * 0.5, 0, Math.PI * 2)
          ctx.fillStyle = p.color
          ctx.fill()
        } else {
          ctx.fillStyle = p.color
          ctx.fillRect(-p.size * 0.5, -p.size * 0.22, p.size, p.size * 0.44)
        }
        ctx.restore()
      }

      if (alive > 0) {
        raf = requestAnimationFrame(tick)
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
      }
    }

    raf = requestAnimationFrame(tick)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [active, lingering, density, lite, reduceMotion])

  if (reduceMotion || (!active && !lingering)) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none fixed inset-0 ${className}`}
      aria-hidden="true"
    />
  )
}
