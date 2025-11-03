#!/usr/bin/env node
import { readFileSync } from 'node:fs'
import { JSDOM } from 'jsdom'
// @ts-ignore - axe provides UMD build we can import as any
import axe from 'axe-core'

type Findings = {
  violations: Array<{ id: string; impact?: string; description: string; nodes: number }>
}

function computeScore(violations: Findings['violations']): number {
  if (!violations.length) return 100
  // Penalização simples por violação ponderada pelo impacto
  const impactWeight: Record<string, number> = { critical: 5, serious: 3, moderate: 2, minor: 1 }
  let penalty = 0
  for (const v of violations) {
    const w = v.impact ? (impactWeight[v.impact] || 1) : 1
    penalty += w
  }
  // Mapeia penalidade para 0–100 (clamped)
  const score = Math.max(0, 100 - penalty * 5)
  return Math.round(score)
}

async function runAxeOnHtml(html: string) {
  const dom = new JSDOM(html, { url: 'http://localhost/' })
  const { window } = dom
  const { document, Node } = window as any
  // axe.run espera window/document globais
  ;(global as any).window = window
  ;(global as any).document = document
  ;(global as any).Node = Node

  const results = await axe.run(document)
  const violations = results.violations.map((v: any) => ({
    id: v.id,
    impact: v.impact,
    description: v.description,
    nodes: v.nodes?.length || 0
  }))
  const score = computeScore(violations)
  const findings: Findings = { violations }
  return { score, findings }
}

async function main() {
  const args = process.argv.slice(2)
  let html = ''
  if (args.includes('--stdin')) {
    html = await new Promise<string>((resolve, reject) => {
      let data = ''
      process.stdin.setEncoding('utf8')
      process.stdin.on('data', chunk => (data += chunk))
      process.stdin.on('end', () => resolve(data))
      process.stdin.on('error', reject)
    })
  } else if (args[0]) {
    html = readFileSync(args[0], 'utf8')
  } else {
    console.error('Usage: cli.js [--stdin] | <path-to-html>')
    process.exit(2)
  }

  const { score, findings } = await runAxeOnHtml(html)
  const out = { accessibility_score: score, wcag_findings: findings }
  process.stdout.write(JSON.stringify(out))
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})


