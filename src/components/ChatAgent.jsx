// Lightweight on-site assistant for FAQs and booking guidance.
// Uses simple intent matching; can be upgraded to a real LLM/API later.
import { useEffect, useMemo, useRef, useState } from 'react'
import availabilityService from '../services/availabilityService'
import './ChatAgent.css'

function matchIntent(message) {
  const text = message.toLowerCase()
  if (/hi|hello|hey|howdy/.test(text)) return 'greeting'
  if (/book|schedule|meeting|availability|available|calendar/.test(text)) return 'booking'
  if (/call|phone|ring|dial/.test(text)) return 'call'
  if (/price|cost|rate|how much/.test(text)) return 'pricing'
  if (/service|offer|what.*do.*you.*do/.test(text)) return 'services'
  if (/email|contact|reach/.test(text)) return 'contact'
  if (/end|finish|done|that.*helpful|close chat/.test(text)) return 'end'
  return 'fallback'
}

function getReply(intent, calendlyUrl, options) {
  const url = calendlyUrl || import.meta.env.VITE_CALENDLY_URL
  const phone = (import.meta.env.VITE_PHONE || '0672089491').replace(/\s+/g, '')
  const { suggestedDatesText } = options || {}
  switch (intent) {
    case 'greeting':
      return 'Hi! I\'m here to help with inquiries and scheduling. How can I help today?'
    case 'booking':
      if (suggestedDatesText) {
        return `Great! I can see our availability. We're open Monday to Friday, 9 AM - 5 PM. Here are some upcoming times that work: ${suggestedDatesText}. You can also visit our Booking page to see the full calendar and select your preferred time.`
      }
      if (url) {
        return `You can see live availability and book instantly here: ${url}. We're available Monday to Friday, 9 AM - 5 PM. You\'ll get a confirmation email right away.`
      }
      return 'We\'d love to meet! We\'re available Monday to Friday, 9 AM - 5 PM. Visit our Booking page to see our calendar and available time slots. You can also call us directly for immediate assistance.'
    case 'call':
      return `You can call us directly at ${phone}. Tap to dial: tel:${phone}`
    case 'pricing':
      return 'Pricing varies by scope. Share a bit about your project, and we\'ll tailor a quote. Many projects start with a free 15-minute discovery call.'
    case 'services':
      return 'We offer: Web Development (fast, conversion-focused sites), Film & Editing (concept to final cut), and Photography (product, lifestyle, events). Ask about any for details.'
    case 'contact':
      return 'You can email us at aidenwilliams336@gmail.com or book a call from the Booking page.'
    case 'end':
      return 'Thanks for chatting! Was that helpful? (yes/no)'
    default:
      return 'Got it. I\'ll do my best to help. You can also book a quick call if that\'s easier.'
  }
}

function ChatAgent() {
  // UI state: open/close panel, input value, and message history
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState(() => [
    { id: 1, role: 'agent', text: "Hi! I\'m the SOT Assistant. Ask about services, pricing, or availability." }
  ])
  const messagesEndRef = useRef(null)

  // Read Calendly URL once; injected via Vite env var
  const calendlyUrl = useMemo(() => import.meta.env.VITE_CALENDLY_URL || '', [])
  const icsUrl = useMemo(() => import.meta.env.VITE_ICS_FEED_URL || '', [])
  const phone = useMemo(() => (import.meta.env.VITE_PHONE || '0672089491').replace(/\s+/g, ''), [])

  // Basic busy dates loaded from ICS (optional). If not available, we fall back to suggestions
  const [busyDates, setBusyDates] = useState(() => new Set())

  // Parse a minimal subset of ICS just to collect busy YYYY-MM-DD days
  function parseIcsBusyDates(text) {
    const lines = text.split(/\r?\n/)
    const days = new Set()
    let current = null
    for (const line of lines) {
      if (line.startsWith('BEGIN:VEVENT')) current = {}
      else if (line.startsWith('DTSTART')) current.start = line.split(':')[1]
      else if (line.startsWith('DTEND')) current.end = line.split(':')[1]
      else if (line.startsWith('END:VEVENT') && current && current.start) {
        const y = current.start.substring(0, 4)
        const m = current.start.substring(4, 6)
        const d = current.start.substring(6, 8)
        days.add(`${y}-${m}-${d}`)
        current = null
      }
    }
    return days
  }

  useEffect(() => {
    if (!icsUrl) return
    // Best-effort fetch; may be blocked by CORS depending on provider
    fetch(icsUrl)
      .then((r) => (r.ok ? r.text() : ''))
      .then((t) => {
        if (!t) return
        const days = parseIcsBusyDates(t)
        setBusyDates(days)
      })
      .catch(() => {})
  }, [icsUrl])

  // Get suggested dates from availability service
  function getSuggestedDates() {
    return availabilityService.getSuggestedDatesForBot()
  }

  // Keep the latest message in view when chat opens or messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [messages, open])

  function sendMessage(e) {
    e.preventDefault()
    const trimmed = input.trim()
    if (!trimmed) return
    // Append user message, derive intent, and append assistant reply
    const userMsg = { id: Date.now(), role: 'user', text: trimmed }
    const intent = matchIntent(trimmed)
    // Prepare optional suggested dates
    const suggestedDates = getSuggestedDates()
    const suggestedDatesText = suggestedDates.length ? suggestedDates.join(', ') : ''
    const reply = getReply(intent, calendlyUrl, { suggestedDatesText })
    const items = [userMsg, { id: Date.now() + 1, role: 'agent', text: reply }]
    // If user answered the helpfulness prompt
    if (/\b(yes|yep|yeah|helpful|great|good)\b/i.test(trimmed)) {
      items.push({ id: Date.now() + 2, role: 'agent', text: 'Awesome. I\'m here if you need anything else!' })
    } else if (/\b(no|not really|nope)\b/i.test(trimmed)) {
      items.push({ id: Date.now() + 2, role: 'agent', text: 'Thanks for the feedback. What\'s missing or what can I clarify?' })
    }
    setMessages((prev) => [...prev, ...items])
    setInput('')
  }

  return (
    <>
      <button className="chat-fab" aria-label="Open chat" onClick={() => setOpen((v) => !v)}>
        {open ? '✖' : '💬'}
      </button>
      {open && (
        <div className="chat-panel" role="dialog" aria-label="Chat with SOT Assistant">
          <div className="chat-header">
            <div className="chat-title">SOT Assistant</div>
            <button className="chat-close" onClick={() => setOpen(false)} aria-label="Close chat">✖</button>
          </div>
          <div className="chat-body">
            {messages.map((m) => (
              <div key={m.id} className={m.role === 'agent' ? 'msg agent' : 'msg user'}>
                {m.text}
              </div>
            ))}
            <div className="chat-cta">
              <a className="btn primary" href="/booking" target="_blank" rel="noreferrer">View Calendar & Book</a>
            </div>
            <div className="chat-cta">
              <a className="btn" href={`tel:${phone}`}>Quick call: {phone}</a>
            </div>
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" onSubmit={sendMessage}>
            <input
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              aria-label="Message"
            />
            <button className="btn" type="submit">Send</button>
          </form>
        </div>
      )}
    </>
  )
}

export default ChatAgent


