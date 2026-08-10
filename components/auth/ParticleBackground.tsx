'use client'

import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 70
const COLORS = ['#93c5fd', '#60a5fa', '#3b82f6', '#a5b4fc', '#818cf8', '#bfdbfe']
const REPEL_RADIUS = 130

type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  baseR: number
  color: string
  drift: number
}

export function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = canvas?.parentElement
    if (!canvas || !container) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    let width = 0
    let height = 0
    let particles: Particle[] = []

    const rand = (min: number, max: number) => min + Math.random() * (max - min)

    const createParticles = () => {
      particles = Array.from({ length: PARTICLE_COUNT }, () => {
        const baseR = rand(1.2, 3.4)
        return {
          x: rand(0, width),
          y: rand(0, height),
          vx: rand(-0.18, 0.18),
          vy: rand(-0.18, 0.18),
          r: baseR,
          baseR,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          drift: rand(0, Math.PI * 2),
        }
      })
    }

    const resize = () => {
      width = container.clientWidth
      height = container.clientHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      createParticles()
    }

    resize()
    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(container)

    const mouse = { x: -9999, y: -9999, vx: 0, vy: 0, speed: 0, lastX: -9999, lastY: -9999, lastT: performance.now() }

    const handleMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top

      const now = performance.now()
      const dt = Math.max(now - mouse.lastT, 1)
      if (mouse.lastX > -9999) {
        const dx = e.clientX - mouse.lastX
        const dy = e.clientY - mouse.lastY
        mouse.speed = Math.min(Math.sqrt(dx * dx + dy * dy) / dt, 2.5)
      }
      mouse.lastX = e.clientX
      mouse.lastY = e.clientY
      mouse.lastT = now
    }
    const handleLeave = () => {
      mouse.x = -9999
      mouse.y = -9999
      mouse.speed = 0
    }

    window.addEventListener('mousemove', handleMove)
    container.addEventListener('mouseleave', handleLeave)

    let frameId: number
    let t = 0

    const step = () => {
      t += 1
      ctx.clearRect(0, 0, width, height)

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy + Math.sin(t * 0.01 + p.drift) * 0.03

        if (p.x < -10) p.x = width + 10
        if (p.x > width + 10) p.x = -10
        if (p.y < -10) p.y = height + 10
        if (p.y > height + 10) p.y = -10

        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)

        let targetR = p.baseR
        if (dist < REPEL_RADIUS) {
          const force = (1 - dist / REPEL_RADIUS) * 0.6
          const angle = Math.atan2(dy, dx)
          p.x += Math.cos(angle) * force
          p.y += Math.sin(angle) * force
          targetR = p.baseR * (1 + (1 - dist / REPEL_RADIUS) * (1 + mouse.speed))
        }
        p.r += (targetR - p.r) * 0.15

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.4)
        gradient.addColorStop(0, `${p.color}99`)
        gradient.addColorStop(1, `${p.color}00`)
        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r * 2.4, 0, Math.PI * 2)
        ctx.fill()
      }

      frameId = requestAnimationFrame(step)
    }

    if (reduceMotion) {
      step()
      cancelAnimationFrame(frameId!)
    } else {
      step()
    }

    return () => {
      cancelAnimationFrame(frameId)
      resizeObserver.disconnect()
      window.removeEventListener('mousemove', handleMove)
      container.removeEventListener('mouseleave', handleLeave)
    }
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
