"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"

// Demo mode support (aligns with rest of app)
type DemoMode = "outages" | "bids" | "communications" | "complaints"
const demoMode: DemoMode = (process.env.NEXT_PUBLIC_DEMO_MODE as DemoMode) || "outages"

type Role = "user" | "bot" | "thinking"
type Kind = "text" | "summary" | "card"

type Message = {
  id: string
  role: Role
  kind: Kind
  text?: string
  card?: {
    title: string
    tags: string[]
    location: string
    created: string // dd/MM/yyyy
    impacted: number // semantic meaning depends on mode
    description: string
  }
  ts: string // HH:mm
}

interface ChatModeConfig {
  breadcrumb: string
  placeholder: string
  impactedLabel: string // label for card impacted field
  summaryLabel: (impacted: number) => string
  buildMock: (query: string) => { narrative: string; summary: string; card: Message["card"] }
}

const CHAT_CONFIG: Record<DemoMode, ChatModeConfig> = {
  outages: {
    breadcrumb: "AI Search › Outages",
    placeholder: "Ask anything about network outages",
    impactedLabel: "services impacted",
    summaryLabel: (n) => `1 outage • ${n.toLocaleString()} services impacted`,
    buildMock: (q) => {
      const outageId = parseOutageId(q) ?? "NO-506"
      const impacted = 120_000
      const created = "18/08/2025"
      const title = "Network connectivity issue in Sydney CBD area"
      const location = "Sydney CBD, NSW"
      const tags = ["Major", "Major", "Classified"]
      const description =
        "Around 3:20 AM local time, monitoring detected a disruption affecting broadband and fixed-line voice services across Sydney CBD. Field reports point to fibre damage during scheduled road works. Initial restoration estimate: ~8 hours. Primary impact: Sydney Metro."
      const narrative = `Outage ${outageId} is a major network connectivity issue affecting the Sydney CBD area. Detected at approximately 3:20 AM local time on 2025-08-18, the incident disrupted around ${impacted.toLocaleString()} broadband and fixed-line voice services. Repairs are estimated at ~8 hours. The outage is currently in 'STAGE 1' with elevated customer impact risk.`
      return { narrative, summary: `1 outages • ${impacted.toLocaleString()} services impacted`, card: { title, tags, location, created, impacted, description } }
    },
  },
  bids: {
    breadcrumb: "AI Search › Bids",
    placeholder: "Ask about pipeline, value or review cycles",
    impactedLabel: "est. value (USD)",
    summaryLabel: (n) => `1 bid • $${(n / 1_000_000).toFixed(1)}M total value`,
    buildMock: (q) => {
      const id = (q.match(/BID[-\s]?(\d{3,})/i)?.[0] ?? "BID-1002").toUpperCase()
      const impacted = 2_245_000 // value
      const created = "14/08/2025"
      const title = "NextGen Fiber Backbone (Phase II)"
      const location = "Northeast Region"
      const tags = ["In Review", "Network", "Strategic"]
      const description = `Bid ${id} targets expansion of resilient fiber backbone capacity across secondary metros to support low-latency applications. Evaluation focus: scalability, sustainability metrics, projected regional economic uplift.`
      const narrative = `Bid ${id} is currently in 'In Review' stage with an estimated value of $${impacted.toLocaleString()}. Review cycle time is tracking 3 days faster than median. Primary differentiation: modular deployment model and strong sustainability scoring.`
      return { narrative, summary: `1 bid • $${impacted.toLocaleString()} value in review`, card: { title, tags, location, created, impacted, description } }
    },
  },
  communications: {
    breadcrumb: "AI Search › Communications",
    placeholder: "Ask about campaigns, channels or engagement",
    impactedLabel: "messages sent",
    summaryLabel: (n) => `1 campaign • ${n.toLocaleString()} messages sent`,
    buildMock: (q) => {
      const impacted = 164_250 // messages
      const created = "16/08/2025"
      const title = "API Latency Advisory (Developers Segment)"
      const location = "Channels: Email + SMS"
      const tags = ["Active", "Multi-channel", "Targeted"]
      const description = `Advisory campaign notifying developer accounts of intermittent API latency in critical endpoints. Open rate trending above baseline (+4.2%). SMS fallback engaged for 12% of audience after deferred email delivery.`
      const narrative = `The latency advisory campaign is active with ${impacted.toLocaleString()} cumulative deliveries. Engagement uplift driven by segmented subject line testing. CTR is outperforming the rolling 30‑day average.`
      return { narrative, summary: `1 campaign • ${impacted.toLocaleString()} deliveries`, card: { title, tags, location, created, impacted, description } }
    },
  },
  complaints: {
    breadcrumb: "AI Search › Complaints",
    placeholder: "Ask about SLA, categories or escalations",
    impactedLabel: "cases affected",
    summaryLabel: (n) => `1 case cluster • ${n.toLocaleString()} cases affected`,
    buildMock: (q) => {
      const impacted = 312 // cases
      const created = "16/08/2025"
      const title = "Billing Discrepancy Escalations – West"
      const location = "Region: West"
      const tags = ["Escalated", "Billing", "SLA Risk"]
      const description = `Cluster of billing discrepancy complaints nearing SLA thresholds. Root cause linked to proration logic regression in invoice microservice. Temporary remediation deployed; monitoring stabilization metrics.`
      const narrative = `Billing escalation cluster shows ${impacted.toLocaleString()} active cases with rising SLA exposure. Mean first response: 42m. Recommend expedited regression patch validation and proactive outbound status messaging.`
      return { narrative, summary: `1 escalation cluster • ${impacted.toLocaleString()} open cases`, card: { title, tags, location, created, impacted, description } }
    },
  },
}

function formatHHmm(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, { hour: "2-digit", minute: "2-digit", hour12: false }).format(date)
}

function parseOutageId(q: string): string | undefined {
  const m = q.match(/NO[-\s]?(\d{3,})/i)
  return m ? `NO-${m[1]}` : undefined
}

export default function AiChat({ initialQuery }: { initialQuery?: string }) {
  const cfg = CHAT_CONFIG[demoMode]
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: "smooth" })
  }, [messages.length])

  // Auto-send initial query when provided
  useEffect(() => {
    if (initialQuery) {
      setInput(initialQuery)
      const t = setTimeout(() => handleSend(initialQuery), 0)
      return () => clearTimeout(t)
    }
  }, [initialQuery])

  function handleSend(arg?: string | React.FormEvent) {
    const isEvent = typeof arg !== "string" && !!arg
    if (isEvent) (arg as React.FormEvent).preventDefault()
    const q = (typeof arg === "string" ? arg : input).trim()
    if (!q) return
    setInput("")

    const now = formatHHmm()
    const userMsg: Message = { id: crypto.randomUUID(), role: "user", kind: "text", text: q, ts: now }
    const thinkMsg: Message = { id: crypto.randomUUID(), role: "thinking", kind: "text", text: "Thinking…", ts: now }
    setMessages((m) => [...m, userMsg, thinkMsg])

    // Mocked AI flow: after a short delay, replace thinking with summary, stats, and a rich card
    setTimeout(() => {
      setMessages((m) => {
        const withoutThinking = m.filter((x) => x.role !== "thinking")
  const built = cfg.buildMock(q)
  const botText: Message = { id: crypto.randomUUID(), role: "bot", kind: "text", text: built.narrative, ts: formatHHmm() }
  const botStats: Message = { id: crypto.randomUUID(), role: "bot", kind: "summary", text: built.summary, ts: formatHHmm() }
  const botCard: Message = { id: crypto.randomUUID(), role: "bot", kind: "card", card: built.card, ts: formatHHmm() }
  return [...withoutThinking, botText, botStats, botCard]
      })
    }, 3000)
  }

  return (
    <section className="ai-view">
      <div className="ai-header">
  <div className="crumbs">{cfg.breadcrumb}</div>
        <button className="btn" onClick={() => setMessages([])}>
          Clear
        </button>
      </div>
      <div className="ai-body">
        <div className="chat" ref={chatRef}>
          {messages.map((m) => (
            <ChatMessage key={m.id} msg={m} />
          ))}
        </div>
        <form className="ai-input" onSubmit={handleSend}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={cfg.placeholder}
            aria-label="Chat input"
          />
          <button type="submit" aria-label="Send">
            ➤
          </button>
        </form>
      </div>
    </section>
  )
}

function ChatMessage({ msg }: { msg: Message }) {
  const isUser = msg.role === "user"
  const isBot = msg.role === "bot"
  const classes = ["msg"]
  if (isUser) classes.push("user")
  if (isBot) classes.push("bot")
  if (msg.role === "thinking") classes.push("thinking")

  return (
    <div className={classes.join(" ")}>
      <div className="avatar">{isUser ? "👤" : "🤖"}</div>
      <div className={`stack ${isUser ? "right" : ""}`}>
        <div className="bubble reveal">
          {msg.kind === "card" && msg.card ? (
            <RichOutageCard card={msg.card} />
          ) : msg.kind === "summary" ? (
            <div className="chip">{msg.text}</div>
          ) : (
            <span>
              {msg.role === "thinking" ? (
                <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                  <span
                    className="spin"
                    style={{
                      width: 16,
                      height: 16,
                      border: "2px solid #cbd5e1",
                      borderTopColor: "#4338ca",
                      borderRadius: 999,
                      display: "inline-block",
                      animation: "sp 0.8s linear infinite",
                    }}
                  />
                  Thinking…
                </span>
              ) : (
                msg.text
              )}
            </span>
          )}
        </div>
        <div className="ts">{msg.ts}</div>
      </div>
    </div>
  )
}

function RichOutageCard({ card }: { card: NonNullable<Message["card"]> }) {
  // Render label adaptively based on demoMode
  const impactedLabels: Record<DemoMode, string> = {
    outages: "services impacted",
    bids: "est. value (USD)",
    communications: "messages sent",
    complaints: "cases affected",
  }
  const label = impactedLabels[demoMode]
  const impactedDisplay =
    demoMode === "bids"
      ? `$${card.impacted.toLocaleString()}`
      : card.impacted.toLocaleString()
  return (
    <div className="outage-card">
      <div className="oc-title">{card.title}</div>
      <div className="oc-sub">
        {card.tags.map((t, i) => (
          <span className="lozenge" key={i} style={{ marginRight: 8 }}>
            {t}
          </span>
        ))}
        <span>• {card.location}</span>
      </div>
      <div className="oc-meta">
        <span>Created {card.created}</span>
        <span className="right">{impactedDisplay} {label}</span>
      </div>
      <div className="oc-desc">{card.description}</div>
      <div className="oc-actions">
        <button className="btn" onClick={() => window.alert("Details panel coming soon")}>Open details</button>
      </div>
    </div>
  )
}
