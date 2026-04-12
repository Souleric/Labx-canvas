'use client'

import { useEffect } from 'react'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import './editor.css'
import SITE_CSS from '@/lib/site-css'
import { createClient } from '@/lib/supabase'

// ── TYPES ──
type SiteState = Record<string, unknown>
type PageConfig = { id: string; name: string; slug: string; status: 'live' | 'draft'; showInNav?: boolean }
type CustomFont = { name: string; url: string; category: string }

// ── DEFAULTS ──
const DEFAULTS: SiteState = {
  brandName:'FURUTECH', tagline:'Global Logistics Solutions', navCta:'Sign In',
  headline:"Let's Move Your Business Forward", headlineFont:'Inter', headlineSize:72,
  subtext:'We provide reliable shipping wherever you need it. With us, you get precision, speed, and confidence at every step of your supply chain journey.',
  btn1:'Learn More', btn2:'',
  heroColor:'#0B1628', heroImg:null, statsVisible:false,
  heroOverlayMode:'none', heroOverlayColor:'#000000', heroOverlayOpacity:50,
  heroGradientDir:270, heroGradientStart:70, heroGradientEnd:0,
  stat0:'50+ Countries', stat1:'12K Shipments', stat2:'99% On-Time',
  visTrust:true, trustLabel:'Certified & Tested',
  prodEyebrow:'What We Offer', prodH2:'Logistics Solutions',
  prod1Name:'International Shipping', prod1Desc:'We manage global shipping from origin to destination, providing end-to-end freight logistics for your timeline and budget.',
  prod1Icon:'🚢',
  prod2Name:'Warehousing & Distribution', prod2Desc:'Our strategically located warehouses ensure fast, secure storage and distribution of your products.',
  prod2Icon:'🏭',
  prod3Name:'Last-Mile Delivery', prod3Desc:'Our last-mile delivery services ensure products reach their final destination efficiently.',
  prod3Icon:'🚚',
  prod4Name:'Supply Chain Optimization', prod4Desc:'We analyze your supply chains and implement strategies that reduce costs while improving reliability.',
  prod4Icon:'📊',
  prod5Name:'Customs Clearance', prod5Desc:'We navigate the complexities of customs regulation, adopting your shipments and ensuring compliance.',
  prod5Icon:'📋',
  prodViewAll:'See All →',
  aboutH:'Built on Precision, Proven Globally',
  aboutP:'Established to serve the world\'s most demanding logistics needs, FURUTECH has grown into a trusted partner for businesses that move fast and think globally.',
  aboutColor:'#0b1f3a',
  appsEyebrow:'Industries We Serve', appsH2:'Tailored Logistics for Every Business',
  appsBody:'At FURUTECH, we understand that every industry has unique logistics challenges. That\'s why we offer customized solutions for a wide range of sectors.',
  visApps:true,
  app1Icon:'🛒', app1Title:'Retail & E-commerce',        app1Desc:'Streamline your fulfilment process, reduce delivery times, and boost customer satisfaction.',
  app2Icon:'🏗️', app2Title:'Manufacturing',              app2Desc:'Optimize your supply chain, from raw materials to finished goods with efficient transportation.',
  app3Icon:'💊', app3Title:'Healthcare & Pharmacy',      app3Desc:'Ensure the safe, timely delivery of temperature-sensitive products and critical shipments.',
  app4Icon:'💻', app4Title:'Technology & Electronics',   app4Desc:'Handle high-value, sensitive products with care ensuring secure delivery across global markets.',
  app5Icon:'', app5Title:'', app5Desc:'',
  app6Icon:'', app6Title:'', app6Desc:'',
  // Technology section
  visTech:true,
  techEyebrow:'Technology', techH:'Innovation that Moves Your Business',
  techBody:'We leverage the latest technology to improve the way we manage your shipments — from real-time tracking to intelligent analytics.',
  feat1Icon:'📡', feat1Name:'Real-Time Tracking',   feat1Desc:'Stay connected with your shipments from pick-up to delivery. Get live status updates at every checkpoint.',
  feat2Icon:'📊', feat2Name:'Data Analytics',        feat2Desc:'Gain insights from your supply chain data, identify bottlenecks, and make data-driven decisions.',
  feat3Icon:'🔔', feat3Name:'Automated Updates',    feat3Desc:'Receive intelligent notifications about your shipments including expected delivery times and delays.',
  feat4Icon:'🔐', feat4Name:'Secure Portal',         feat4Desc:'Access your account anytime with our secure client portal for creating, managing, and tracking shipments.',
  ctaH:'Ready to Scale Your Logistics?', ctaP:'Talk to our team and get a custom solution tailored to your business.',
  ctaBtn1:'Get a Free Quote', ctaBtn2:'Contact Us', ctaColor:'#1A3FFF',
  footerName:'FURUTECH',
  footerDesc:'Precision logistics and global freight solutions built for businesses that move fast and think globally.',
  footerCopy:'© 2025 FURUTECH Logistics. All rights reserved.',
  footerColor:'#0B1628',
  footerCol2Title:'Services',
  footerLink1:'International Shipping', footerLink2:'Warehousing', footerLink3:'Last-Mile Delivery', footerLink4:'Customs Clearance', footerLink5:'Supply Chain',
  footerCol3Title:'Company',
  footerCol3L1:'About Us', footerCol3L2:'Our Approach', footerCol3L3:'Technology', footerCol3L4:'Careers',
  footerCol4Title:'Contact',
  footerCol4L1:'Get a Quote', footerCol4L2:'Support', footerCol4L3:'Track Shipment', footerCol4L4:'Partner With Us',
  primaryColor:'#1A3FFF', bodyFont:'Inter',
  fontDisplay:'Barlow Condensed', fontHeading:'Barlow', fontBody:'Inter', fontUI:'Inter', fontMono:'DM Mono',
  customFonts:[] as CustomFont[],
  prodImg1:null, prodImg2:null, prodImg3:null, prodImg4:null, prodImg5:null, aboutImg:null,
  customHead:'', customBody:'',
  visNav:true, visHero:true, visProducts:true, visAbout:true, visContact:true, visFooter:true,
  visNavPage:true, visFooterPage:true,
  // Button link configs
  btn1LinkType:'none',    btn1LinkHref:'',  btn1LinkPageId:'', btn1LinkSectionId:'', btn1LinkNewTab:false,
  btn2LinkType:'none',    btn2LinkHref:'',  btn2LinkPageId:'', btn2LinkSectionId:'', btn2LinkNewTab:false,
  ctaBtn1LinkType:'none', ctaBtn1LinkHref:'',ctaBtn1LinkPageId:'',ctaBtn1LinkSectionId:'',ctaBtn1LinkNewTab:false,
  ctaBtn2LinkType:'none', ctaBtn2LinkHref:'',ctaBtn2LinkPageId:'',ctaBtn2LinkSectionId:'',ctaBtn2LinkNewTab:false,
  navCtaLinkType:'none',  navCtaLinkHref:'',navCtaLinkPageId:'',navCtaLinkSectionId:'',navCtaLinkNewTab:false,
  sections:['hero','stats','products','apps','tech','cta'],
  navHamburger: true,
  navEmail:'', navPhone:'', navLocation:'',
  navLink1:'About us', navLink2:'Services', navLink3:'Our Approach', navLink4:'Technology', navLink5:'',
  navSecBtn:'Contact Us', navSecBtnUrl:'',
  heroBadge:'',
  trust1:'', trust2:'', trust3:'', trust4:'', trust5:'', trust6:'',
  prod1Tag:'', prod2Tag:'', prod3Tag:'', prod4Tag:'',
  prodEnquireBtn:'Enquire',
  aboutBullet1:'', aboutBullet2:'', aboutBullet3:'', aboutBullet4:'',
  footerAddr:'',
  seoTitle:'FURUTECH — Global Logistics Solutions',
  seoDesc:'Precision logistics and global freight solutions built for businesses that move fast and think globally.',
  seoSlug:'/',
  pagesConfig: [
    { id:'home',     name:'Home',     slug:'/',         status:'live',  showInNav:false },
    { id:'products', name:'Products', slug:'/services', status:'live',  showInNav:true  },
    { id:'aboutUs',  name:'About Us', slug:'/about',    status:'draft', showInNav:true  },
    { id:'contact',  name:'Contact',  slug:'/contact',  status:'live',  showInNav:true  },
  ] as PageConfig[],
  // Clients block
  visClients:false, clientsEyebrow:'Our Clients', clientsH2:'Trusted by Industry Leaders',
  clientsSub:'',
  client1:'', client2:'', client3:'', client4:'', client5:'',
  client6:'', client7:'', client8:'', client9:'', client10:'', client11:'', client12:'',
  // FAQ block
  visFaq:false, faqEyebrow:'Common Questions', faqH2:'Frequently Asked Questions',
  faq1Q:'', faq1A:'', faq2Q:'', faq2A:'', faq3Q:'', faq3A:'', faq4Q:'', faq4A:'', faq5Q:'', faq5A:'',
  // Stats section block
  visStatsSec:true, statsSecColor:'#ffffff',
  statsSec0:'50+', statsSec0L:'Countries Served',
  statsSec1:'12K', statsSec1L:'Shipments Monthly',
  statsSec2:'99%', statsSec2L:'On-Time Delivery',
  statsSec3:'18+', statsSec3L:'Years Experience',
  // Testimonials block
  visTestimonials:false, testimonialsEyebrow:'What Our Clients Say', testimonialsH2:'Trusted by Businesses Worldwide',
  test1Quote:'FURUTECH delivered on time and within spec. The quality and technical support were exceptional throughout the project.',
  test1Name:'Alex Tan', test1Title:'Operations Director, FastCargo Asia', test1Co:'FastCargo',
  test2Quote:"We've used FURUTECH for cross-border shipments across 12 countries. Their customs clearance expertise is unmatched.",
  test2Name:'Sarah Chen', test2Title:'Supply Chain Manager, GlobalTrade Co', test2Co:'GlobalTrade',
  test3Quote:'The real-time tracking portal gives us full visibility. We know exactly where every shipment is at all times.',
  test3Name:'Raj Kumar', test3Title:'Logistics Head, TechDistrib Inc', test3Co:'TechDistrib',
  // Enquiry form block
  visForm:false, formEyebrow:'Get In Touch', formH2:'Send Us a Message',
  formDesc:'Fill in the form and our team will respond within 1 business day.',
  formEmail:'hello@furutech.com', formPhone:'+60 3-xxxx xxxx', formAddress:'',
  formSubmitLabel:'Send Message',
}

const DEFAULT_SECTIONS = ['hero','stats','products','apps','tech','cta']
const PAGE_KEYS = new Set(['headline','headlineSize','subtext','btn1','btn2','heroColor','statsVisible','stat0','stat1','stat2','seoTitle','seoDesc','seoSlug','sections','visNavPage','visFooterPage'])

const PAGE_DEFAULTS: Record<string, SiteState> = {
  home:     { headline:"Let's Move Your Business Forward",  headlineSize:72, subtext:'We provide reliable shipping wherever you need it. With us, you get precision, speed, and confidence at every step of your supply chain journey.', btn1:'Learn More',    btn2:'', heroColor:'#0B1628', statsVisible:false, stat0:'50+', stat1:'12K', stat2:'99%', seoTitle:'FURUTECH — Global Logistics Solutions', seoDesc:'Precision logistics and global freight solutions.', seoSlug:'/',         sections:['hero','stats','products','apps','tech','cta'], visNavPage:true, visFooterPage:true },
  products: { headline:'Our Logistics Services',            headlineSize:64, subtext:'End-to-end freight and logistics solutions tailored to your business needs.',                                                                    btn1:'Get a Quote',   btn2:'', heroColor:'#0B1628', statsVisible:false, stat0:'50+', stat1:'12K', stat2:'99%', seoTitle:'Services — FURUTECH Logistics',         seoDesc:'Explore our full range of logistics services.',   seoSlug:'/services', sections:['hero','products','cta'], visNavPage:true, visFooterPage:true },
  aboutUs:  { headline:'About FURUTECH Logistics',          headlineSize:64, subtext:'Trusted global logistics partner for businesses that move fast and think globally.',                                                             btn1:'Contact Us',    btn2:'', heroColor:'#0B1628', statsVisible:false, stat0:'50+', stat1:'12K', stat2:'99%', seoTitle:'About — FURUTECH Logistics',             seoDesc:'Learn about FURUTECH Logistics.',                 seoSlug:'/about',    sections:['hero','about','cta'], visNavPage:true, visFooterPage:true },
  contact:  { headline:'Get In Touch',                      headlineSize:64, subtext:'Our team is ready to design a custom logistics solution for your business.',                                                                     btn1:'Get a Quote',   btn2:'', heroColor:'#0B1628', statsVisible:false, stat0:'50+', stat1:'12K', stat2:'99%', seoTitle:'Contact — FURUTECH Logistics',           seoDesc:'Contact FURUTECH Logistics.',                     seoSlug:'/contact',  sections:['hero','form','cta'], visNavPage:true, visFooterPage:true },
}

// ── STATE ──
let STATE: SiteState = { ...DEFAULTS }
const LS_KEY = 'sitedash_logistics_v5'
let currentPage = 'home'
let pageStates: Record<string, SiteState> = { home:{}, products:{}, aboutUs:{}, contact:{} }

// ── HISTORY (UNDO) ──
const HISTORY_MAX = 50
type HistoryEntry = { state: SiteState; pages: Record<string, SiteState>; page: string }
let _history: HistoryEntry[] = []
let _historyTimer: ReturnType<typeof setTimeout> | null = null
let _historyPending = false
let _inUndo = false

function pushHistory() {
  _history.push({
    state: JSON.parse(JSON.stringify(STATE)),
    pages: JSON.parse(JSON.stringify(pageStates)),
    page: currentPage,
  })
  if (_history.length > HISTORY_MAX) _history.shift()
  updateUndoBtn()
}

function scheduleHistory() {
  if (_inUndo) return
  if (!_historyPending) {
    pushHistory()
    _historyPending = true
  }
  if (_historyTimer) clearTimeout(_historyTimer)
  _historyTimer = setTimeout(() => { _historyPending = false }, 800)
}

function updateUndoBtn() {
  const btn = document.getElementById('undoBtn') as HTMLButtonElement | null
  if (!btn) return
  const hasHistory = _history.length > 0
  btn.style.opacity = hasHistory ? '1' : '0.35'
  btn.style.pointerEvents = hasHistory ? '' : 'none'
}

function undo() {
  if (_history.length === 0) { toast('Nothing to undo'); return }
  _inUndo = true
  _historyPending = false
  if (_historyTimer) clearTimeout(_historyTimer)
  const snap = _history.pop()!
  Object.assign(STATE, snap.state)
  pageStates = snap.pages
  currentPage = snap.page
  const pd = getPageDefaults(currentPage)
  const ps = pageStates[currentPage] || {}
  PAGE_KEYS.forEach(k => { STATE[k] = ps[k] !== undefined ? ps[k] : pd[k] })
  localStorage.setItem(LS_KEY, JSON.stringify({ global: (() => { const g: SiteState = {}; Object.keys(STATE).forEach(k => { if (!PAGE_KEYS.has(k)) g[k] = STATE[k] }); return g })(), pages: pageStates, currentPage }))
  applyAll()
  populateInputs()
  renderSecStack()
  renderPageList()
  updateUndoBtn()
  _inUndo = false
  toast('Undo')
}

// ── SUPABASE ──
type SupabaseClient = ReturnType<typeof createClient>
let _supabase: SupabaseClient | null = null
let _clientId: string | null = null
let _sbTimer: ReturnType<typeof setTimeout> | null = null

function saveToSupabase() {
  if (!_supabase || !_clientId) return
  if (_sbTimer) clearTimeout(_sbTimer)
  _sbTimer = setTimeout(async () => {
    const global: SiteState = {}
    Object.keys(STATE).forEach(k => { if (!PAGE_KEYS.has(k)) global[k] = STATE[k] })
    await _supabase!.from('site_states').upsert(
      { client_id: _clientId!, state: { global, pages: pageStates } },
      { onConflict: 'client_id' }
    )
  }, 1500)
}

// ── IMAGE UPLOAD ──
function getClientSlug(): string {
  return String(STATE.brandName || 'site').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'site'
}

async function uploadImage(blob: Blob, filename: string): Promise<string> {
  const slug = getClientSlug()
  const path = `images/${slug}/${filename}`
  const res = await fetch('/api/upload?path=' + encodeURIComponent(path), {
    method: 'POST',
    headers: { 'Content-Type': blob.type || 'image/jpeg' },
    body: blob,
  })
  const json = await res.json()
  if (!res.ok) throw new Error(json.error || 'Upload failed')
  return json.url
}

// ── SECTION METADATA ──
const SEC_META: Record<string, { label: string; sub: string; fields: string; visKey: string; icon: string }> = {
  nav:      { label:'Navigation',   sub:'Logo · Tagline · CTA',           fields:'secFields-nav',      visKey:'visNav',      icon:'<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>' },
  hero:     { label:'Hero Banner',  sub:'Headline · Image · Color',       fields:'secFields-hero',     visKey:'visHero',     icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/>' },
  trust:    { label:'Trust Bar',    sub:'Certifications · Toggle',        fields:'secFields-trust',    visKey:'visTrust',    icon:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>' },
  products: { label:'Products',     sub:'Heading · Cards · Images',       fields:'secFields-products', visKey:'visProducts', icon:'<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/>' },
  about:    { label:'About Us',     sub:'Heading · Body · Image · Color', fields:'secFields-about',    visKey:'visAbout',    icon:'<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>' },
  apps:     { label:'Applications', sub:'Industry grid · Toggle',         fields:'secFields-apps',     visKey:'visApps',     icon:'<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>' },
  cta:      { label:'Contact CTA',  sub:'Heading · Buttons · Color',      fields:'secFields-cta',      visKey:'visContact',  icon:'<path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.43 2 2 0 013.6 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.72 6.72l.95-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>' },
  footer:   { label:'Footer',       sub:'Company · Address · Color',      fields:'secFields-footer',   visKey:'visFooter',   icon:'<path d="M3 15h18M3 19h18"/>' },
  stats:    { label:'Stats Bar',     sub:'4 key numbers · White bar', fields:'secFields-stats',     visKey:'visStatsSec', icon:'<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>' },
  tech:     { label:'Technology',    sub:'Features · Innovation · Image', fields:'secFields-tech', visKey:'visTech', icon:'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 21V9"/>' },
  testimonials: { label:'Testimonials', sub:'3 quote cards · Client names', fields:'secFields-testimonials', visKey:'visTestimonials', icon:'<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>' },
  clients:  { label:'Client Logos', sub:'Reference clients · Name chips',  fields:'secFields-clients',  visKey:'visClients',  icon:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>' },
  faq:      { label:'FAQ',          sub:'Questions · Accordion',           fields:'secFields-faq',      visKey:'visFaq',      icon:'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>' },
  form:     { label:'Enquiry Form', sub:'Contact form · Email · Fields',   fields:'secFields-form',     visKey:'visForm',     icon:'<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>' },
}

// ── HELPERS ──
const $  = (id: string) => document.getElementById(id)

function escHtml(s: unknown): string {
  return String(s ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;')
}
function shade(hex: string, amt: number): string {
  const n = parseInt(hex.replace('#',''), 16)
  const r = Math.max(0, Math.min(255, (n >> 16) + amt))
  const g = Math.max(0, Math.min(255, ((n >> 8) & 0xff) + amt))
  const b = Math.max(0, Math.min(255, (n & 0xff) + amt))
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}
function toast(msg: string) {
  const el = $('toastEl'); const msgEl = $('toastMsg')
  if (!el || !msgEl) return
  msgEl.textContent = msg; el.classList.add('show')
  clearTimeout((window as unknown as Record<string, unknown>)._t as number)
  ;(window as unknown as Record<string, unknown>)._t = setTimeout(() => el.classList.remove('show'), 2400)
}

// ── PERSISTENCE ──
function saveAll() {
  const global: SiteState = {}
  Object.keys(STATE).forEach(k => { if (!PAGE_KEYS.has(k)) global[k] = STATE[k] })
  localStorage.setItem(LS_KEY, JSON.stringify({ global, pages: pageStates, currentPage }))
  saveToSupabase()
}
function save(key: string, val: unknown) {
  scheduleHistory()
  STATE[key] = val
  if (PAGE_KEYS.has(key)) {
    if (!pageStates[currentPage]) pageStates[currentPage] = {}
    pageStates[currentPage][key] = val
  }
  saveAll()
}

// ── PREVIEW ──
let _pvTimer: ReturnType<typeof setTimeout> | null = null
function updatePreview(delay = 280) {
  if (_pvTimer) clearTimeout(_pvTimer)
  _pvTimer = setTimeout(() => {
    const f = document.getElementById('siteFrame') as HTMLIFrameElement | null
    if (f) {
      const scrollY = f.contentWindow?.scrollY || 0
      f.onload = () => { if (scrollY > 0) f.contentWindow?.scrollTo(0, scrollY); f.onload = null }
      f.srcdoc = generateSiteHTML()
    }
    const urlEl = document.querySelector('.url-bar')
    if (urlEl) urlEl.textContent = 'https://www.furutech.com' + (STATE.seoSlug as string || '/')
  }, delay)
}

// ── FONT CATEGORIES ──
const MONO_FONTS = new Set(['DM Mono','Roboto Mono','JetBrains Mono','Fira Code','Source Code Pro'])
const FONT_CATS: Record<string, { label: string; hint: string; key: string; fonts: string[] }> = {
  display: { label:'Display',  hint:'H1, Hero headlines',           key:'fontDisplay', fonts:['Barlow Condensed','Oswald','Anton','Raleway','Playfair Display','Montserrat','Inter','Roboto'] },
  heading: { label:'Heading',  hint:'H2 – H5, Section titles',      key:'fontHeading', fonts:['Barlow','Montserrat','Inter','Poppins','Raleway','Nunito','Lato','Roboto','DM Sans','Open Sans'] },
  body:    { label:'Body',     hint:'Paragraphs, descriptions',      key:'fontBody',    fonts:['Inter','Lato','DM Sans','Roboto','Nunito','Open Sans','Poppins','Source Sans 3'] },
  ui:      { label:'UI',       hint:'Labels, buttons, badges',       key:'fontUI',      fonts:['Inter','Roboto','Barlow','DM Sans','Work Sans','Nunito Sans'] },
  mono:    { label:'Mono',     hint:'Code, stats, serial numbers',   key:'fontMono',    fonts:['DM Mono','Roboto Mono','JetBrains Mono','Fira Code','Source Code Pro'] },
}

function buildFontStyles(): string {
  const customFonts = (STATE.customFonts as CustomFont[]) || []
  const gfNeeded = new Set<string>()
  Object.values(FONT_CATS).forEach(cat => {
    const name = STATE[cat.key] as string
    if (name && !customFonts.some(f => f.name === name)) gfNeeded.add(name)
  })
  const gfParams = Array.from(gfNeeded).map(f => {
    const enc = f.replace(/ /g, '+')
    return MONO_FONTS.has(f) ? `family=${enc}:wght@400;500` : `family=${enc}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900`
  }).join('&')
  const gfLink = gfNeeded.size ? `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?${gfParams}&display=swap" rel="stylesheet">` : ''
  const fontFaces = customFonts.map(f => `@font-face{font-family:'${escHtml(f.name)}';src:url('${escHtml(f.url)}');font-weight:100 900;font-display:swap}`).join('\n')
  const stack = (name: string) => MONO_FONTS.has(name) ? `'${name}','Courier New',monospace` : `'${name}','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif`
  const cssVars = `:root{--font-display:${stack(STATE.fontDisplay as string||'Barlow Condensed')};--font-heading:${stack(STATE.fontHeading as string||'Barlow')};--font-body:${stack(STATE.fontBody as string||'Inter')};--font-ui:${stack(STATE.fontUI as string||'Inter')};--font-mono:${stack(STATE.fontMono as string||'DM Mono')}}`
  return `${gfLink}\n<style>${fontFaces}${cssVars}</style>`
}

// ── SITE HTML GENERATION ──
function generateSiteHTML(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>${escHtml(STATE.seoTitle)}</title>
<style>*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
${SITE_CSS}</style>
${buildFontStyles()}
${STATE.customHead || ''}
</head>
<body>
${buildSiteHTML()}
${STATE.customBody || ''}
</body>
</html>`
}

function buildSiteHTML(): string {
  const ac = STATE.aboutColor as string || '#0b1f3a'
  const scClasses = ['sc-ship','sc-ware','sc-last','sc-sup','sc-cust']

  function statNum(val: string): string {
    const m = String(val || '').match(/^(\d[\d,.]*)(.*)/); if (!m) return `<div class="stat-num">${escHtml(val)}</div>`
    const sfx = m[2].trim(); return `<div class="stat-num">${m[1]}${sfx ? `<span>${escHtml(sfx)}</span>` : ''}</div>`
  }

  // Resolve a button link href from state prefix
  function resolveHref(prefix: string): { href: string; target: string } {
    const type = STATE[prefix + 'LinkType'] as string || 'none'
    const newTab = STATE[prefix + 'LinkNewTab'] === true
    const target = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
    if (type === 'url') {
      return { href: STATE[prefix + 'LinkHref'] as string || '', target }
    }
    if (type === 'page') {
      const p = (STATE.pagesConfig as PageConfig[])?.find(p => p.id === STATE[prefix + 'LinkPageId'])
      return { href: p?.slug || '', target }
    }
    if (type === 'section') {
      const p = (STATE.pagesConfig as PageConfig[])?.find(p => p.id === STATE[prefix + 'LinkPageId'])
      const sec = STATE[prefix + 'LinkSectionId'] as string || ''
      const slug = p?.slug || ''
      return { href: slug + (sec ? '#' + sec : ''), target }
    }
    return { href: '', target }
  }

  // Wrap content as button or <a> based on link config
  function btnEl(content: string, cls: string, prefix: string, style = ''): string {
    const { href, target } = resolveHref(prefix)
    const styleAttr = style ? ` style="${style}"` : ''
    if (href) return `<a href="${escHtml(href)}"${target} class="${cls}"${styleAttr}>${content}</a>`
    return `<button class="${cls}"${styleAttr}>${content}</button>`
  }

  const navLinks = (STATE.pagesConfig as PageConfig[] || [])
    .filter(p => p.showInNav !== false)
    .map(p => `<li><a>${escHtml(p.name)}</a></li>`).join('')
  const NAV = (STATE.visNav === false || STATE.visNavPage === false) ? '' : `
<nav data-sec-id="nav">
  <div class="nav-inner">
    <div class="nav-logo">${escHtml(STATE.brandName as string || 'FURUTECH')}</div>
    <ul class="nav-links">
      ${navLinks}
    </ul>
    <div class="nav-actions">
      ${STATE.navSecBtn ? `<button class="btn-ghost">${escHtml(STATE.navSecBtn)}</button>` : ''}
      <button class="btn-primary-nav">${escHtml(STATE.navCta || 'Sign In')}</button>
    </div>
    ${STATE.navHamburger !== false ? `<button class="nav-hamburger" aria-label="Toggle menu" onclick="this.closest('nav').classList.toggle('mobile-open')"><span></span><span></span><span></span></button>` : ''}
  </div>
  ${STATE.navHamburger !== false ? `<div class="nav-mobile-menu">
    <ul>${navLinks}</ul>
    ${STATE.navSecBtn ? `<button class="btn-ghost">${escHtml(STATE.navSecBtn)}</button>` : ''}
    <button class="btn-primary-nav">${escHtml(STATE.navCta || 'Sign In')}</button>
  </div>` : ''}
</nav>`

  const HERO = STATE.visHero === false ? '' : `
<section class="hero" id="hero" data-sec-id="hero">
  <div class="hero-img-placeholder">
    ${STATE.heroImg
      ? `<img src="${STATE.heroImg}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover">`
      : `<div class="container-graphic">
      <div class="container-row"><div class="container-box c1"><span class="c-label">${escHtml((STATE.brandName as string || 'FURUTECH').toUpperCase())}</span></div><div class="container-box c2"></div><div class="container-box c3"></div></div>
      <div class="container-row"><div class="container-box c6"></div><div class="container-box c5"><span class="c-label">FREIGHT</span></div><div class="container-box c4"></div></div>
      <div class="container-row"><div class="container-box c3"></div><div class="container-box c1"></div><div class="container-box c2"></div></div>
    </div>`}
  </div>
  ${STATE.heroImg ? '' : '<div class="hero-bg"></div>'}
  ${(() => {
    const mode = STATE.heroOverlayMode as string || 'none'
    if (!STATE.heroImg || mode === 'none') return ''
    const color = STATE.heroOverlayColor as string || '#000000'
    const r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16)
    const op = (n: number) => (n/100).toFixed(2)
    if (mode === 'solid') return `<div style="position:absolute;inset:0;z-index:2;background:rgba(${r},${g},${b},${op(STATE.heroOverlayOpacity as number || 50)})"></div>`
    if (mode === 'gradient') {
      const dir = STATE.heroGradientDir as number ?? 270
      const start = (STATE.heroGradientStart as number ?? 70) / 100
      const end = (STATE.heroGradientEnd as number ?? 0) / 100
      const stops = [0, 0.1, 0.2, 0.35, 0.5, 0.65, 0.8, 0.9, 1].map(t => {
        const e = t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2
        const a = (start + (end - start) * e).toFixed(3)
        return `rgba(${r},${g},${b},${a}) ${(t*100).toFixed(0)}%`
      }).join(',')
      return `<div style="position:absolute;inset:0;z-index:2;background:linear-gradient(${dir}deg,${stops})"></div>`
    }
    return ''
  })()}
  <div class="hero-content">
    <div class="hero-left">
      <h1 class="hero-headline" style="font-size:${STATE.headlineSize || 72}px">${escHtml(STATE.headline as string || '')}</h1>
    </div>
    <div class="hero-right">
      <p class="hero-body">${escHtml(STATE.subtext as string || '')}</p>
      ${btnEl(`${escHtml(STATE.btn1 as string || 'Learn More')}<span class="arrow">→</span>`,'btn-learn','btn1')}
    </div>
  </div>
  <div class="hero-scroll"><div class="scroll-line"></div></div>
</section>`

  const TRUST = STATE.visTrust === false ? '' : `
<div data-sec-id="trust" style="padding:12px 40px;background:#f6f7f9;border-bottom:1px solid #e5e7eb;display:flex;align-items:center;gap:24px;flex-wrap:wrap">
  ${STATE.trustLabel ? `<span style="font-size:11px;font-weight:700;color:#6b7280;letter-spacing:.5px;text-transform:uppercase">${escHtml(STATE.trustLabel)}</span>` : ''}
  ${[1,2,3,4,5,6].filter(i => STATE['trust'+i]).map(i => `<span style="font-size:12px;font-weight:600;color:#0b1628;background:#fff;border:1px solid #e5e7eb;padding:4px 12px;border-radius:20px">${escHtml(STATE['trust'+i])}</span>`).join('')}
</div>`

  const STATS_SEC = STATE.visStatsSec === false ? '' : `
<div class="stats-bar" id="stats" data-sec-id="stats">
  <div class="stats-inner">
    ${[0,1,2,3].filter(i => STATE['statsSec'+i]).map(i => `
    <div class="stat-item">
      ${statNum(String(STATE['statsSec'+i] || ''))}
      <div class="stat-desc">${escHtml(STATE['statsSec'+i+'L'] || '')}</div>
    </div>`).join('')}
  </div>
</div>`

  const PRODUCTS = STATE.visProducts === false ? '' : `
<section class="section-logistics" id="products" data-sec-id="products">
  <div class="section-head">
    <div>
      ${STATE.prodEyebrow ? `<span class="tag">${escHtml(STATE.prodEyebrow)}</span>` : ''}
      <h2 class="section-title">${escHtml(STATE.prodH2 as string || '')}</h2>
    </div>
    ${STATE.prodViewAll ? `<button class="btn-see-all">${escHtml(STATE.prodViewAll)}</button>` : ''}
  </div>
  <div class="services-grid">
    ${[1,2,3,4,5].map((i, idx) => STATE['prod'+i+'Name'] ? `
    <div class="service-card ${scClasses[idx]}">
      <div class="service-card-img${STATE['prodImg'+i] ? ' service-card-photo' : ''}">${STATE['prodImg'+i] ? `<img src="${STATE['prodImg'+i]}" alt="${escHtml(STATE['prod'+i+'Name'] as string || '')}">` : escHtml(STATE['prod'+i+'Icon'] as string || '')}</div>
      <div class="service-card-overlay"></div>
      <div class="service-card-body">
        <div class="service-card-title">${escHtml(STATE['prod'+i+'Name'] as string || '')}</div>
        <div class="service-card-desc">${escHtml(STATE['prod'+i+'Desc'] as string || '')}</div>
        <div class="service-card-link">Learn More →</div>
      </div>
    </div>` : '').join('')}
  </div>
</section>`

  const ABOUT = STATE.visAbout === false ? '' : `
<section data-sec-id="about" style="padding:80px 40px;background:linear-gradient(160deg,${ac} 0%,${shade(ac, 18)} 100%);color:#fff">
  <div style="max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center">
    <div>
      <h2 style="font-size:36px;font-weight:800;letter-spacing:-1px;margin-bottom:16px">${escHtml(STATE.aboutH as string || '')}</h2>
      <p style="font-size:14px;line-height:1.8;opacity:.8;margin-bottom:20px">${escHtml(STATE.aboutP as string || '')}</p>
      ${[1,2,3,4].filter(i => STATE['aboutBullet'+i]).map(i => `<div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:10px;font-size:13px"><span style="color:#1A3FFF;font-weight:700;flex-shrink:0">✓</span>${escHtml(STATE['aboutBullet'+i])}</div>`).join('')}
    </div>
    <div style="background:rgba(255,255,255,.08);border-radius:12px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;font-size:80px;overflow:hidden">
      ${STATE.aboutImg ? `<img src="${STATE.aboutImg}" style="width:100%;height:100%;object-fit:cover;border-radius:12px">` : '🏭'}
    </div>
  </div>
</section>`

  const APPS = STATE.visApps === false ? '' : `
<section class="section-industries" id="apps" data-sec-id="apps">
  <div class="industries-layout">
    <div class="industries-left">
      ${STATE.appsEyebrow ? `<span class="tag">${escHtml(STATE.appsEyebrow)}</span>` : ''}
      <h2 class="industries-title">${escHtml(STATE.appsH2 as string || '')}</h2>
      ${STATE.appsBody ? `<p class="industries-body">${escHtml(STATE.appsBody)}</p>` : ''}
    </div>
    <div class="industries-cards">
      ${[1,2,3,4].filter(i => STATE['app'+i+'Title']).map(i => `
      <div class="industry-card">
        <div class="ind-icon">${escHtml(STATE['app'+i+'Icon'] as string || '')}</div>
        <div class="industry-name">${escHtml(STATE['app'+i+'Title'])}</div>
        <div class="industry-desc">${escHtml(STATE['app'+i+'Desc'] as string || '')}</div>
      </div>`).join('')}
    </div>
  </div>
</section>
<script>(function(){document.querySelectorAll('.industry-card').forEach(function(c){c.addEventListener('click',function(){document.querySelectorAll('.industry-card').forEach(function(x){x.classList.remove('active')});c.classList.add('active')})})})()<\/script>`

  const TECH = STATE.visTech === false ? '' : `
<section class="section-tech" id="tech" data-sec-id="tech">
  <div class="tech-layout">
    <div class="tech-left">
      ${STATE.techEyebrow ? `<span class="tag">${escHtml(STATE.techEyebrow)}</span>` : ''}
      <h2 class="tech-title">${escHtml(STATE.techH as string || '')}</h2>
      ${STATE.techBody ? `<p class="tech-body-text">${escHtml(STATE.techBody)}</p>` : ''}
      <div class="tech-img-block">🚢</div>
    </div>
    <div class="tech-features">
      ${[1,2,3,4].filter(i => STATE['feat'+i+'Name']).map(i => `
      <div class="feature-card">
        <span class="feature-icon">${escHtml(STATE['feat'+i+'Icon'] as string || '')}</span>
        <div class="feature-name">${escHtml(STATE['feat'+i+'Name'])}</div>
        <div class="feature-desc">${escHtml(STATE['feat'+i+'Desc'] as string || '')}</div>
        <div class="feature-link">Learn More →</div>
      </div>`).join('')}
    </div>
  </div>
</section>`

  const CTA = STATE.visContact === false ? '' : `
<div class="cta-band" id="cta" data-sec-id="cta" style="background:${escHtml(STATE.ctaColor as string || '#1A3FFF')}">
  <h2 class="cta-title">${escHtml(STATE.ctaH as string || '')}</h2>
  <p class="cta-sub">${escHtml(STATE.ctaP as string || '')}</p>
  <div class="cta-btns">
    ${STATE.ctaBtn1 ? btnEl(escHtml(STATE.ctaBtn1),'btn-white','ctaBtn1') : ''}
    ${STATE.ctaBtn2 ? btnEl(escHtml(STATE.ctaBtn2),'btn-outline-white','ctaBtn2') : ''}
  </div>
</div>`

  const FOOTER = (STATE.visFooter === false || STATE.visFooterPage === false) ? '' : `
<footer class="site-footer" data-sec-id="footer" style="background:${escHtml(STATE.footerColor as string || '#0B1628')}">
  <div class="footer-grid">
    <div>
      <span class="footer-brand-name">${escHtml(STATE.footerName as string || 'FURUTECH')}</span>
      ${STATE.footerDesc ? `<p class="footer-desc">${escHtml(STATE.footerDesc)}</p>` : ''}
    </div>
    <div>
      <div class="footer-col-title">${escHtml(STATE.footerCol2Title as string || 'Services')}</div>
      <ul class="footer-links-list">
        ${[1,2,3,4,5].filter(i => STATE['footerLink'+i]).map(i => `<li><a>${escHtml(STATE['footerLink'+i])}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <div class="footer-col-title">${escHtml(STATE.footerCol3Title as string || 'Company')}</div>
      <ul class="footer-links-list">
        ${[1,2,3,4].filter(i => STATE['footerCol3L'+i]).map(i => `<li><a>${escHtml(STATE['footerCol3L'+i])}</a></li>`).join('')}
      </ul>
    </div>
    <div>
      <div class="footer-col-title">${escHtml(STATE.footerCol4Title as string || 'Contact')}</div>
      <ul class="footer-links-list">
        ${[1,2,3,4].filter(i => STATE['footerCol4L'+i]).map(i => `<li><a>${escHtml(STATE['footerCol4L'+i])}</a></li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="footer-copy">${escHtml(STATE.footerCopy as string || '© 2025 ' + String(STATE.footerName || 'FURUTECH') + '. All rights reserved.')}</div>
  </div>
</footer>`

  const TESTIMONIALS = STATE.visTestimonials === false ? '' : `
<div class="s-testimonials" data-sec-id="testimonials">
  <div class="s-eyebrow">${escHtml(STATE.testimonialsEyebrow)}</div>
  <div class="s-h2">${escHtml(STATE.testimonialsH2)}</div>
  <div class="test-grid">
    ${[1,2,3].filter(i => STATE['test'+i+'Quote'] || STATE['test'+i+'Name']).map(i => {
      const initials = String(STATE['test'+i+'Name'] || '?').split(' ').map((w: string) => w[0]).join('').slice(0,2).toUpperCase()
      return `<div class="test-card">
      <div class="test-quote-mark">&ldquo;</div>
      <div class="test-body">${escHtml(STATE['test'+i+'Quote'])}</div>
      <div class="test-footer">
        <div class="test-avatar">${initials}</div>
        <div>
          <div class="test-name">${escHtml(STATE['test'+i+'Name'])}</div>
          <div class="test-title">${escHtml(STATE['test'+i+'Title'] || '')}${STATE['test'+i+'Co'] ? ' · ' + escHtml(STATE['test'+i+'Co']) : ''}</div>
        </div>
      </div>
    </div>`
    }).join('')}
  </div>
</div>`

  const CLIENTS = STATE.visClients === false ? '' : `
<div class="s-clients" data-sec-id="clients">
  <div class="s-eyebrow">${escHtml(STATE.clientsEyebrow)}</div>
  <div class="s-h2">${escHtml(STATE.clientsH2)}</div>
  ${STATE.clientsSub ? `<div class="s-clients-sub">${escHtml(STATE.clientsSub)}</div>` : ''}
  <div class="clients-grid">
    ${[1,2,3,4,5,6,7,8,9,10,11,12].filter(i => STATE['client'+i]).map(i => `<div class="client-chip">${escHtml(STATE['client'+i])}</div>`).join('')}
  </div>
</div>`

  const FAQ = STATE.visFaq === false ? '' : `
<div class="s-faq" data-sec-id="faq">
  <div class="s-faq-inner">
    <div class="s-eyebrow">${escHtml(STATE.faqEyebrow)}</div>
    <div class="s-h2">${escHtml(STATE.faqH2)}</div>
    <div class="faq-list">
      ${[1,2,3,4,5].filter(i => STATE['faq'+i+'Q']).map(i => `
      <div class="faq-item">
        <div class="faq-q">
          <span>${escHtml(STATE['faq'+i+'Q'])}</span>
          <div class="faq-ico"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></div>
        </div>
        <div class="faq-a"><div class="faq-a-inner">${escHtml(STATE['faq'+i+'A'])}</div></div>
      </div>`).join('')}
    </div>
  </div>
</div>
<script>(function(){document.querySelectorAll('.faq-q').forEach(function(q){q.addEventListener('click',function(){q.closest('.faq-item').classList.toggle('open')})})})()<\/script>`

  const FORM = STATE.visForm === false ? '' : `
<div class="s-form" data-sec-id="form">
  <div class="s-form-inner">
    <div class="s-form-left">
      <div class="s-eyebrow">${escHtml(STATE.formEyebrow)}</div>
      <div class="s-h2">${escHtml(STATE.formH2)}</div>
      ${STATE.formDesc ? `<div class="s-form-desc">${escHtml(STATE.formDesc)}</div>` : ''}
      <div class="s-form-contact">
        ${STATE.formEmail ? `<div class="s-form-ci"><div class="s-form-ci-icon"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div><div class="s-form-ci-text"><strong>Email</strong>${escHtml(STATE.formEmail)}</div></div>` : ''}
        ${STATE.formPhone ? `<div class="s-form-ci"><div class="s-form-ci-icon"><svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.61 3.43 2 2 0 013.6 1.27h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L7.91 8.91a16 16 0 006.72 6.72l.95-.96a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div><div class="s-form-ci-text"><strong>Phone</strong>${escHtml(STATE.formPhone)}</div></div>` : ''}
        ${STATE.formAddress ? `<div class="s-form-ci"><div class="s-form-ci-icon"><svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div><div class="s-form-ci-text"><strong>Address</strong>${escHtml(STATE.formAddress)}</div></div>` : ''}
      </div>
    </div>
    <div class="s-form-right">
      <form action="mailto:${escHtml(STATE.formEmail)}" method="post" enctype="text/plain">
        <div class="form-row">
          <div class="form-field"><label class="form-lbl">Full Name</label><input class="form-inp" name="name" placeholder="Your name" /></div>
          <div class="form-field"><label class="form-lbl">Company</label><input class="form-inp" name="company" placeholder="Company name" /></div>
        </div>
        <div class="form-row">
          <div class="form-field"><label class="form-lbl">Email</label><input class="form-inp" name="email" type="email" placeholder="work@company.com" /></div>
          <div class="form-field"><label class="form-lbl">Phone</label><input class="form-inp" name="phone" placeholder="+60 xx-xxx xxxx" /></div>
        </div>
        <div class="form-field"><label class="form-lbl">Project Type</label>
          <select class="form-inp form-select" name="project_type">
            <option value="">Select project type...</option>
            <option>Data Centre</option>
            <option>Industrial Plant</option>
            <option>Commercial Building</option>
            <option>Construction Project</option>
            <option>Renewable Energy</option>
            <option>Other</option>
          </select>
        </div>
        <div class="form-field"><label class="form-lbl">Message / Requirements</label><textarea class="form-inp form-ta" name="message" placeholder="Describe your project, current rating required, installation length, timeline..."></textarea></div>
        <button type="submit" class="form-submit">${escHtml(STATE.formSubmitLabel || 'Send Enquiry')}</button>
        <div class="form-note">We typically respond within 1 business day.</div>
      </form>
    </div>
  </div>
</div>`

  const CMS_TOOLBAR = [
    '<style>',
    '.cms-sec-wrap{position:relative;isolation:isolate}',
    '.cms-sec-wrap:hover{outline:1.5px solid rgba(26,63,255,0.45);outline-offset:-1px;z-index:10;position:relative}',
    '.cms-sec-wrap:hover>.cms-toolbar{opacity:1;pointer-events:all}',
    '.cms-sec-wrap:hover>.cms-sec-label{opacity:1}',
    /* toolbar floats above the section, overlapping the bottom of the section above */
    '.cms-toolbar{position:absolute;top:0;right:14px;z-index:1000;display:flex;gap:6px;align-items:center;opacity:0;pointer-events:none;transition:opacity .18s ease;transform:translateY(-100%);padding-bottom:8px}',
    '.cms-tb-btn{padding:5px 13px;font-size:11px;font-weight:600;border-radius:999px;cursor:pointer;font-family:-apple-system,BlinkMacSystemFont,"Helvetica Neue",sans-serif;display:flex;align-items:center;gap:4px;letter-spacing:0.1px;transition:all .15s ease;white-space:nowrap}',
    '.cms-tb-edit{background:rgba(26,63,255,0.72);color:#fff;border:1px solid rgba(120,160,255,0.45);box-shadow:0 2px 12px rgba(26,63,255,0.35),inset 0 1px 0 rgba(255,255,255,0.22);backdrop-filter:blur(16px) saturate(200%);-webkit-backdrop-filter:blur(16px) saturate(200%)}',
    '.cms-tb-edit:hover{background:rgba(26,63,255,0.92);box-shadow:0 4px 20px rgba(26,63,255,0.5),inset 0 1px 0 rgba(255,255,255,0.25)}',
    '.cms-tb-add{background:rgba(255,255,255,0.14);color:rgba(255,255,255,0.9);border:1px solid rgba(255,255,255,0.22);box-shadow:0 2px 10px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.18);backdrop-filter:blur(16px) saturate(200%);-webkit-backdrop-filter:blur(16px) saturate(200%)}',
    '.cms-tb-add:hover{background:rgba(255,255,255,0.24)}',
    /* label pill — top-left, also floating above section */
    '.cms-sec-label{position:absolute;top:0;left:14px;z-index:1000;transform:translateY(-100%);padding-bottom:8px;display:flex;align-items:flex-end;opacity:0;pointer-events:none;transition:opacity .18s ease}',
    '.cms-sec-label::after{content:attr(data-label);font-size:9px;font-weight:700;text-transform:uppercase;letter-spacing:1px;color:rgba(255,255,255,0.75);background:rgba(11,22,40,0.55);border:1px solid rgba(255,255,255,0.14);backdrop-filter:blur(16px) saturate(200%);-webkit-backdrop-filter:blur(16px) saturate(200%);padding:3px 10px;border-radius:999px;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-family:-apple-system,BlinkMacSystemFont,sans-serif}',
    '<\/style>',
    '<scr'+'ipt>',
    '(function(){',
    '  var labels={nav:"Navigation",hero:"Hero Banner",trust:"Trust Bar",products:"Services",about:"About Us",apps:"Industries",tech:"Technology",cta:"CTA",footer:"Footer",stats:"Stats Bar",testimonials:"Testimonials",clients:"Client Logos",faq:"FAQ",form:"Enquiry Form"};',
    '  document.querySelectorAll("[data-sec-id]").forEach(function(el){',
    '    var sid=el.getAttribute("data-sec-id");',
    '    el.classList.add("cms-sec-wrap");',
    '    el.style.position="relative";',
    '    var lbl=document.createElement("div");',
    '    lbl.className="cms-sec-label";',
    '    lbl.setAttribute("data-label",labels[sid]||sid);',
    '    el.prepend(lbl);',
    '    var bar=document.createElement("div");',
    '    bar.className="cms-toolbar";',
    '    bar.innerHTML=\'<button class="cms-tb-btn cms-tb-edit" onclick="window.parent.postMessage({type:\\\'openEditor\\\',secId:\\\'\'+sid+\'\\\'},\\\'*\\\')">&#9998; Edit<\/button>\'',
    '      +\'<button class="cms-tb-btn cms-tb-add" onclick="window.parent.postMessage({type:\\\'addBelow\\\',secId:\\\'\'+sid+\'\\\'},\\\'*\\\')">+ Add<\/button>\';',
    '    el.prepend(bar);',
    '  });',
    '})();',
    '<\/sc'+'ript>',
  ].join('\n')

  const SEC_BLOCKS: Record<string, string> = { hero:HERO, trust:TRUST, products:PRODUCTS, about:ABOUT, apps:APPS, tech:TECH, cta:CTA, stats:STATS_SEC, testimonials:TESTIMONIALS, clients:CLIENTS, faq:FAQ, form:FORM }
  const secs = (STATE.sections as string[] || DEFAULT_SECTIONS).filter(id => id !== 'nav' && id !== 'footer')
  return NAV + '\n' + secs.map(id => SEC_BLOCKS[id] || '').join('\n') + '\n' + FOOTER + CMS_TOOLBAR
}

// ── UI FUNCTIONS ──
function applyAll() { updatePreview(0) }

function populateInputs() {
  document.querySelectorAll('[data-key]').forEach(el => {
    const input = el as HTMLInputElement
    const key = input.dataset.key
    if (!key || STATE[key] === undefined || input.type === 'file') return
    input.value = String(STATE[key] ?? '')
  })
  const szEl = $('sizeVal'); if (szEl) szEl.textContent = STATE.headlineSize + 'px'
  document.querySelectorAll('.font-opt').forEach(f => {
    f.classList.toggle('active', (f as HTMLElement).dataset.font === STATE.headlineFont)
  })
  document.querySelectorAll('.body-font-opt').forEach(f => {
    (f as HTMLElement).style.borderColor = (f as HTMLElement).dataset.font === STATE.bodyFont ? 'var(--blue)' : 'var(--border)'
  })
  document.querySelectorAll('.tgl[data-key]').forEach(el => {
    el.classList.toggle('on', STATE[(el as HTMLElement).dataset.key as string] !== false)
  })
  ;[['heroSwatches','heroColor'],['aboutSwatches','aboutColor'],['ctaSwatches','ctaColor'],['footerSwatches','footerColor'],['brandSwatches','primaryColor']].forEach(([sid,key]) => {
    const wrap = $(sid); if (!wrap) return
    wrap.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', (s as HTMLElement).dataset.c === STATE[key]))
  })
  renderAllLinkConfigs()
  renderHeroOverlayUI()
  renderTypographyPanel()
  // Load fonts used into editor for live preview
  Object.values(FONT_CATS).forEach(meta => { const f = STATE[meta.key] as string; if (f) loadEditorFont(f) })
}

const SECTION_ANCHOR_OPTIONS = [
  { id:'hero',     label:'Hero Banner' },
  { id:'stats',    label:'Stats Bar' },
  { id:'products', label:'Products / Services' },
  { id:'apps',     label:'Applications' },
  { id:'tech',     label:'Tech Stack' },
  { id:'cta',      label:'Contact CTA' },
]

function renderLinkConfig(prefix: string): string {
  const type      = (STATE[prefix + 'LinkType']      as string)  || 'none'
  const href      = (STATE[prefix + 'LinkHref']      as string)  || ''
  const pageId    = (STATE[prefix + 'LinkPageId']    as string)  || ''
  const sectionId = (STATE[prefix + 'LinkSectionId'] as string)  || ''
  const newTab    =  STATE[prefix + 'LinkNewTab']    === true

  const pills = [['none','None'],['url','URL'],['page','Page'],['section','Section']]
    .map(([t, label]) => `<button class="ltype-btn${type === t ? ' active' : ''}" onclick="window.__setLinkType('${prefix}','${t}')">${label}</button>`)
    .join('')

  const pagesConf = (STATE.pagesConfig as PageConfig[]) || []
  const pageOptions = pagesConf.map(p =>
    `<option value="${escHtml(p.id)}"${p.id === pageId ? ' selected' : ''}>${escHtml(p.name)}</option>`
  ).join('')
  const secOptions = SECTION_ANCHOR_OPTIONS.map(s =>
    `<option value="${s.id}"${s.id === sectionId ? ' selected' : ''}>${escHtml(s.label)}</option>`
  ).join('')
  const newTabChk = `<label class="ltype-check"><input type="checkbox"${newTab ? ' checked' : ''} onchange="window.__toggleLinkNewTab('${prefix}')"> Open in new tab</label>`

  let fields = ''
  if (type === 'url') {
    fields = `<input class="fi" placeholder="https://..." value="${escHtml(href)}" style="margin-top:4px" oninput="window.__saveLinkField('${prefix}','LinkHref',this.value)" />${newTabChk}`
  } else if (type === 'page') {
    fields = `<select class="fi" style="margin-top:4px" onchange="window.__saveLinkField('${prefix}','LinkPageId',this.value)"><option value="">— Select page —</option>${pageOptions}</select>${newTabChk}`
  } else if (type === 'section') {
    fields = `<select class="fi" style="margin-top:4px" onchange="window.__saveLinkField('${prefix}','LinkPageId',this.value)"><option value="">— Select page —</option>${pageOptions}</select><select class="fi" style="margin-top:4px" onchange="window.__saveLinkField('${prefix}','LinkSectionId',this.value)"><option value="">— Select section —</option>${secOptions}</select>`
  }

  return `<div class="ltype-wrap">${pills}</div>${fields}`
}

function renderAllLinkConfigs() {
  ;[
    ['btn1',    'btn1-link-wrap'],
    ['btn2',    'btn2-link-wrap'],
    ['ctaBtn1', 'ctaBtn1-link-wrap'],
    ['ctaBtn2', 'ctaBtn2-link-wrap'],
    ['navCta',  'navCta-link-wrap'],
  ].forEach(([prefix, wrapId]) => {
    const el = $(wrapId); if (el) el.innerHTML = renderLinkConfig(prefix)
  })
}

function setLinkType(prefix: string, type: string) {
  STATE[prefix + 'LinkType'] = type
  saveAll(); applyAll(); renderAllLinkConfigs()
}
function saveLinkField(prefix: string, field: string, value: string) {
  STATE[prefix + field] = value
  saveAll(); applyAll()
}
function toggleLinkNewTab(prefix: string) {
  STATE[prefix + 'LinkNewTab'] = !STATE[prefix + 'LinkNewTab']
  saveAll(); applyAll(); renderAllLinkConfigs()
}

function applyLoadedData(data: { global?: SiteState; pages?: Record<string, SiteState>; currentPage?: string } | null) {
  if (data?.global) {
    Object.assign(STATE, data.global)
    if (data.pages) pageStates = { ...pageStates, ...data.pages }
    if (data.currentPage) currentPage = data.currentPage
  } else if (data && !data.global) {
    Object.assign(STATE, data)
  }
}

function loadState(sbData?: { global?: SiteState; pages?: Record<string, SiteState> } | null) {
  if (sbData) {
    applyLoadedData(sbData)
  } else {
    const saved = localStorage.getItem(LS_KEY)
    if (saved) {
      try { applyLoadedData(JSON.parse(saved)) } catch {}
    }
  }
  if (!STATE.pagesConfig) STATE.pagesConfig = DEFAULTS.pagesConfig
  const pd = getPageDefaults(currentPage)
  const ps = pageStates[currentPage] || {}
  PAGE_KEYS.forEach(key => { STATE[key] = ps[key] !== undefined ? ps[key] : pd[key] })
  applyAll()
  populateInputs()
  renderSecStack()
  renderPageList()
}

// ── TABS ──
function switchRailPanel(ctxId: string) {
  const ctxPanels = ['ctxSections','ctxPages','ctxBlocks','ctxMedia','ctxSettings']
  ctxPanels.forEach(id => {
    const el = $(id); if (el) el.style.display = id === ctxId ? 'flex' : 'none'
  })
  // Keep Sections rail button active when blocks sub-panel is shown
  const sectionsActive = ctxId === 'ctxSections' || ctxId === 'ctxBlocks'
  document.querySelectorAll('.rail-btn').forEach(btn => {
    const b = btn as HTMLElement
    const target = b.dataset.ctx
    b.classList.toggle('active',
      (target === 'ctxSections' && sectionsActive) ||
      (target === ctxId && !sectionsActive)
    )
  })
  if (ctxId === 'ctxMedia') loadMediaSidebar()
}
function switchTabTo(panelId: string) {
  const map: Record<string,string> = {
    'panelPages':'ctxSections','panelBlocks':'ctxBlocks','panelMedia':'ctxMedia','panelSettings':'ctxSettings'
  }
  switchRailPanel(map[panelId] || 'ctxSections')
}
// legacy – keep so any old callers don't crash
function switchTab(_btn: HTMLElement) { switchRailPanel('ctxSections') }

// ── PAGE DEFAULTS (dynamic) ──
function getPageDefaults(id: string): SiteState {
  if (PAGE_DEFAULTS[id]) return PAGE_DEFAULTS[id]
  const cfg = (STATE.pagesConfig as PageConfig[] || []).find(p => p.id === id)
  return {
    headline: cfg?.name || 'New Page', headlineSize: 64, subtext: '', btn1: 'Learn More', btn2: '',
    heroColor: '#0B1628', statsVisible: false, stat0: '50+', stat1: '12K', stat2: '99%',
    seoTitle: (cfg?.name || 'New Page') + ' — FURUTECH Logistics', seoDesc: '', seoSlug: cfg?.slug || '/',
    sections: ['hero','cta'], visNavPage: true, visFooterPage: true,
  }
}

// ── PAGE SWITCH ──
function switchPage(pageId: string) {
  currentPage = pageId
  const pd = getPageDefaults(pageId)
  const ps = pageStates[pageId] || {}
  PAGE_KEYS.forEach(key => { STATE[key] = ps[key] !== undefined ? ps[key] : pd[key] })
  renderPageList()
  applyAll()
  populateInputs()
  renderSecStack()
  saveAll()
}

// ── PAGE LIST RENDER ──
function renderPageList() {
  const list = $('pageList'); if (!list) return
  const pages = (STATE.pagesConfig as PageConfig[]) || []
  list.innerHTML = pages.map(p => {
    const isActive = p.id === currentPage
    const badge = p.status === 'live'
      ? `<span class="pi-badge">Live</span>`
      : `<span class="pi-badge draft">Draft</span>`
    const dotCls = p.status === 'live' ? 'pi-dot live' : 'pi-dot'
    const hiddenFromNav = p.showInNav === false
    return `<div class="page-item${isActive ? ' active' : ''}" data-page="${p.id}" onclick="window.__switchPage('${p.id}')">
      <div class="pi-left"><div class="${dotCls}"></div><span class="pi-name${hiddenFromNav ? ' pi-name-muted' : ''}">${escHtml(p.name)}</span></div>
      <div class="pi-right">
        ${badge}
        <button class="pi-menu-btn" onclick="event.stopPropagation();window.__openPageMenu('${p.id}',this)" title="Page options">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="5" r="1.2" fill="currentColor"/><circle cx="12" cy="12" r="1.2" fill="currentColor"/><circle cx="12" cy="19" r="1.2" fill="currentColor"/></svg>
        </button>
      </div>
    </div>`
  }).join('')
}

let _pageMenuId: string | null = null
function openPageMenu(id: string, btn: HTMLElement) {
  // close any open menu first
  closePageMenu()
  _pageMenuId = id
  const pages = STATE.pagesConfig as PageConfig[]
  const canDelete = pages.length > 1
  const page = pages.find(p => p.id === id)
  const inNav = page?.showInNav !== false
  const menu = document.createElement('div')
  menu.id = 'pageContextMenu'
  menu.innerHTML = `
    <button class="pcm-item" onclick="window.__renamePage('${id}')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
      Rename
    </button>
    <button class="pcm-item" onclick="window.__togglePageNav('${id}')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      ${inNav ? 'Hide from Nav' : 'Show in Nav'}
    </button>
    <button class="pcm-item" onclick="window.__togglePageStatus('${id}')">
      ${page?.status === 'live'
        ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg> Set as Draft`
        : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg> Set as Live`}
    </button>
    ${canDelete ? `<div class="pcm-divider"></div>
    <button class="pcm-item pcm-danger" onclick="window.__removePage('${id}')">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>
      Delete Page
    </button>` : ''}
  `
  menu.style.cssText = 'position:fixed;z-index:9999;background:#fff;border:1px solid #dde3ed;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,.14);padding:4px;min-width:150px;font-family:-apple-system,BlinkMacSystemFont,sans-serif'
  document.body.appendChild(menu)
  // Position below the button
  const r = btn.getBoundingClientRect()
  const mw = 160
  let left = r.right - mw
  let top = r.bottom + 4
  if (left < 4) left = 4
  if (top + 100 > window.innerHeight) top = r.top - 4 - menu.offsetHeight
  menu.style.left = left + 'px'
  menu.style.top = top + 'px'
  setTimeout(() => document.addEventListener('click', closePageMenu, { once: true }), 0)
}
function closePageMenu() {
  $('pageContextMenu')?.remove()
  _pageMenuId = null
}
function renamePage(id: string) {
  closePageMenu()
  const pages = STATE.pagesConfig as PageConfig[]
  const page = pages.find(p => p.id === id); if (!page) return
  const name = prompt('Rename page:', page.name)?.trim()
  if (!name || name === page.name) return
  page.name = name
  STATE.pagesConfig = [...pages]
  saveAll()
  renderPageList()
  updatePreview()
  toast('Page renamed')
}
function togglePageStatus(id: string) {
  closePageMenu()
  const pages = STATE.pagesConfig as PageConfig[]
  const page = pages.find(p => p.id === id); if (!page) return
  page.status = page.status === 'live' ? 'draft' : 'live'
  STATE.pagesConfig = [...pages]
  saveAll()
  renderPageList()
  toast(page.name + ' set to ' + page.status)
}
function togglePageNav(id: string) {
  closePageMenu()
  const pages = STATE.pagesConfig as PageConfig[]
  const page = pages.find(p => p.id === id); if (!page) return
  page.showInNav = page.showInNav === false ? true : false
  STATE.pagesConfig = [...pages]
  saveAll()
  renderPageList()
  updatePreview()
  toast(page.showInNav ? page.name + ' shown in nav' : page.name + ' hidden from nav')
}

// ── ADD / REMOVE PAGE ──
function toggleAddPageForm() {
  const form = $('addPageForm'); if (!form) return
  const isHidden = form.style.display === 'none' || !form.style.display
  form.style.display = isHidden ? 'flex' : 'none'
  if (isHidden) { const inp = $('newPageName') as HTMLInputElement | null; inp?.focus() }
}
function closeAddPageForm() {
  const form = $('addPageForm'); if (form) form.style.display = 'none'
  const inp = $('newPageName') as HTMLInputElement | null; if (inp) inp.value = ''
}
function confirmAddPage() {
  const inp = $('newPageName') as HTMLInputElement | null
  const name = inp?.value?.trim() || ''; if (!name) return
  const id = 'page_' + Date.now()
  const slug = '/' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  const pages = [...(STATE.pagesConfig as PageConfig[] || [])]
  pages.push({ id, name, slug, status: 'draft' })
  STATE.pagesConfig = pages
  pageStates[id] = {}
  closeAddPageForm()
  saveAll()
  switchPage(id)
  toast('Page added: ' + name)
}
function removePage(id: string) {
  closePageMenu()
  const pages = (STATE.pagesConfig as PageConfig[]).filter(p => p.id !== id)
  if (pages.length === 0) { toast('Cannot remove the last page'); return }
  const pageName = (STATE.pagesConfig as PageConfig[]).find(p => p.id === id)?.name || 'this page'
  if (!confirm(`Delete "${pageName}"? This cannot be undone.`)) return
  STATE.pagesConfig = pages
  delete pageStates[id]
  if (currentPage === id) { switchPage(pages[0].id) } else { renderPageList(); saveAll() }
  toast('Page deleted')
}

// ── SECTION STACK ──
function renderSecStack() {
  const stack = $('secStack'); if (!stack) return
  const secs = (STATE.sections as string[] || DEFAULT_SECTIONS).filter(id => id !== 'nav' && id !== 'footer')
  const eyeSvg = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>'

  const globalCard = (id: string) => {
    const m = SEC_META[id]; if (!m) return ''
    const globalOff = STATE[m.visKey] === false
    const pageOff = id === 'nav' ? STATE.visNavPage === false : STATE.visFooterPage === false
    const hiddenOnPage = pageOff && !globalOff
    const fullyOff = globalOff
    const cardCls = fullyOff ? ' hidden-sec' : ''
    const nameStyle = hiddenOnPage ? 'text-decoration:line-through;opacity:.5' : ''
    const subLabel = fullyOff ? 'Hidden globally' : hiddenOnPage ? 'Hidden on this page' : 'Global'
    const subColor = (fullyOff || hiddenOnPage) ? '#9ca3af' : 'var(--blue)'
    return `<div class="sec-card${cardCls}" data-sec="${id}" onclick="window.__openEditor('${id}')" style="background:#EEF3FF;border-color:#C5D4FF;border-left:3px solid var(--blue)">
      <div class="sc-drag" style="opacity:.15;cursor:default">⠿</div>
      <div class="sc-ico" style="color:var(--blue)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m.icon}</svg></div>
      <div class="sc-info"><div class="sc-name" style="${nameStyle}">${m.label}</div><div class="sc-sub" style="color:${subColor};font-weight:700;font-size:9px;letter-spacing:.8px;text-transform:uppercase">${subLabel}</div></div>
      <button class="sc-eye" onclick="event.stopPropagation();window.__eyeToggle('${id}')">${eyeSvg}</button>
    </div>`
  }

  const pageCards = secs.map(id => {
    const m = SEC_META[id]; if (!m) return ''
    const hidden = STATE[m.visKey] === false
    return `<div class="sec-card${hidden ? ' hidden-sec' : ''}" data-sec="${id}" draggable="true" onclick="window.__openEditor('${id}')">
      <div class="sc-drag">⠿</div>
      <div class="sc-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">${m.icon}</svg></div>
      <div class="sc-info"><div class="sc-name">${m.label}</div><div class="sc-sub">${m.sub}</div></div>
      <button class="sc-eye" onclick="event.stopPropagation();window.__eyeToggle('${id}')">${eyeSvg}</button>
    </div>`
  }).join('')

  stack.innerHTML = globalCard('nav') + pageCards + globalCard('footer')
  initDrag()
}

// ── DRAG TO REORDER ──
function initDrag() {
  const stack = $('secStack'); if (!stack) return
  let dragSrc: HTMLElement | null = null
  stack.querySelectorAll('.sec-card').forEach(card => {
    const c = card as HTMLElement
    c.addEventListener('dragstart', e => {
      dragSrc = c; c.style.opacity = '0.4'
      ;(e as DragEvent).dataTransfer!.effectAllowed = 'move'
    })
    c.addEventListener('dragend', () => {
      stack.querySelectorAll('.sec-card').forEach(x => {
        (x as HTMLElement).style.opacity = ''; x.classList.remove('drag-over')
      })
      dragSrc = null
    })
    c.addEventListener('dragover', e => {
      e.preventDefault()
      ;(e as DragEvent).dataTransfer!.dropEffect = 'move'
      stack.querySelectorAll('.sec-card').forEach(x => x.classList.remove('drag-over'))
      if (c !== dragSrc) c.classList.add('drag-over')
    })
    c.addEventListener('drop', e => {
      e.preventDefault()
      if (!dragSrc || dragSrc === c) return
      const fromId = dragSrc.dataset.sec!
      const toId = c.dataset.sec!
      if (fromId === 'nav' || fromId === 'footer' || toId === 'nav' || toId === 'footer') return
      const secs = [...(STATE.sections as string[] || DEFAULT_SECTIONS)].filter(id => id !== 'nav' && id !== 'footer')
      const fi = secs.indexOf(fromId); const ti = secs.indexOf(toId)
      if (fi < 0 || ti < 0) return
      secs.splice(fi, 1); secs.splice(ti, 0, fromId)
      save('sections', secs)
      renderSecStack()
      updatePreview()
    })
  })
}

// ── EDITOR ──
let _editingSecId: string | null = null
let _insertAfter: string | null = null

function openEditor(secId: string) {
  const meta = SEC_META[secId]; if (!meta) return
  _editingSecId = secId
  document.querySelectorAll('.sec-card').forEach(c => c.classList.toggle('active', (c as HTMLElement).dataset.sec === secId))
  const fieldsEl = $(meta.fields)
  const content = $('editorContent')
  if (fieldsEl && content) content.appendChild(fieldsEl)
  const title = $('propsTitle'); if (title) title.textContent = meta.label
  const removeBtn = $('editorRemoveBtn')
  if (removeBtn) {
    const isGlobal = secId === 'nav' || secId === 'footer'
    const canRemove = !isGlobal && (STATE.sections as string[] || DEFAULT_SECTIONS).filter(id => id !== 'nav' && id !== 'footer').length > 2
    removeBtn.style.display = canRemove ? '' : 'none'
  }
  const props = $('propsPanel'); if (props) props.classList.add('open')
  populateInputs()
}

function removeSection() {
  if (!_editingSecId) return
  const secs = [...(STATE.sections as string[] || DEFAULT_SECTIONS)].filter(id => id !== 'nav' && id !== 'footer')
  if (secs.length <= 2) { toast('Need at least 2 sections'); return }
  const idx = secs.indexOf(_editingSecId)
  if (idx < 0) return
  secs.splice(idx, 1)
  save('sections', secs)
  closeEditor()
  renderSecStack()
  updatePreview()
  toast((SEC_META[_editingSecId]?.label || _editingSecId) + ' removed')
  _editingSecId = null
}

function closeEditor() {
  const pool = $('secFieldsPool')
  const content = $('editorContent')
  if (pool && content) while (content.firstChild) pool.appendChild(content.firstChild)
  document.querySelectorAll('.sec-card').forEach(c => c.classList.remove('active'))
  const props = $('propsPanel'); if (props) props.classList.remove('open')
}

// ── EYE TOGGLE ──
function eyeToggle(secId: string) {
  const m = SEC_META[secId]; if (!m || !m.visKey) return
  const nowVisible = STATE[m.visKey] === false
  save(m.visKey, nowVisible)
  renderSecStack()
  updatePreview()
  toast(nowVisible ? 'Section visible' : 'Section hidden')
}

// ── ADD PANEL ──
function renderAddPanel() {
  const panel = $('addSecPanel'); if (!panel) return
  const secs = STATE.sections as string[] || DEFAULT_SECTIONS
  const available = Object.keys(SEC_META).filter(id => id !== 'nav' && id !== 'footer' && !secs.includes(id))
  if (!available.length) {
    panel.style.display = 'block'
    panel.innerHTML = '<div style="font-size:11px;color:var(--muted);padding:2px 0">All sections are already on this page.</div>'
    return
  }
  const afterLabel = _insertAfter ? (SEC_META[_insertAfter]?.label || _insertAfter) : 'end'
  panel.style.display = 'block'
  panel.innerHTML = `<div style="font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:.8px;color:var(--blue);margin-bottom:7px">Add after ${afterLabel}</div>`
    + available.map(id => {
      const m = SEC_META[id]
      return `<button onclick="window.__insertSection('${id}')" style="display:flex;align-items:center;gap:7px;width:100%;padding:6px 8px;margin-bottom:4px;border:1px solid var(--border);border-radius:7px;background:#fff;cursor:pointer;font-size:11.5px;font-weight:600;color:var(--text);text-align:left;transition:background .12s" onmouseover="this.style.background='#e8eef8'" onmouseout="this.style.background='#fff'">
        <span style="font-size:9px;background:var(--off);border:1px solid var(--border);border-radius:4px;padding:3px 6px;font-weight:700;color:var(--muted)">+</span>${m.label}
      </button>`
    }).join('')
}

function insertSection(secId: string) {
  const secs = [...(STATE.sections as string[] || DEFAULT_SECTIONS)].filter(id => id !== 'nav' && id !== 'footer')
  if (secs.includes(secId)) { toast((SEC_META[secId]?.label || secId) + ' already on this page'); return }
  const afterIdx = _insertAfter ? secs.indexOf(_insertAfter) : -1
  secs.splice(afterIdx >= 0 ? afterIdx + 1 : secs.length, 0, secId)
  save('sections', secs)
  renderSecStack()
  updatePreview()
  switchTabTo('panelPages')
  toast((SEC_META[secId]?.label || secId) + ' added')
  _insertAfter = null
}

// ── BLOCK LIBRARY ──
const BLK_TO_SEC: Record<string, string> = {
  'client-logos': 'clients',
  'faq': 'faq',
  'contact-form': 'form',
  'hero-fullbleed': 'hero',
  'hero-split': 'hero',
  'hero-minimal': 'hero',
  'cta-banner': 'cta',
  'certs': 'trust',
  'prod-grid4': 'products',
  'prod-grid3': 'products',
  'footer-simple': 'footer',
  'footer-multi': 'footer',
  'stats-bar': 'stats',
  'testimonials': 'testimonials',
  'tech': 'tech',
}
function addBlock(type: string) {
  const secId = BLK_TO_SEC[type]
  if (secId) { insertSection(secId); return }
  toast('Block coming soon: ' + type)
}
function filterBlocks(q: string) {
  const lower = q.toLowerCase()
  document.querySelectorAll('.blk-lib-item').forEach(item => {
    const name = item.querySelector('.blk-lib-name')?.textContent?.toLowerCase() || ''
    ;(item as HTMLElement).style.display = (!q || name.includes(lower)) ? '' : 'none'
  })
  document.querySelectorAll('.blk-cat-hdr').forEach(hdr => {
    const grid = hdr.nextElementSibling
    if (!grid) return
    const visible = [...grid.querySelectorAll('.blk-lib-item')].some(i => (i as HTMLElement).style.display !== 'none')
    ;(hdr as HTMLElement).style.display = visible ? '' : 'none'
  })
}

// ── VIEW TOGGLE ──
function setView(mode: string, btn: HTMLElement) {
  document.querySelectorAll('.vbtn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  const f = $('previewFrame'); if (!f) return
  f.className = 'frame'
  const badge = $('vBadge')
  if (mode === 'mobile') { f.classList.add('mobile'); if (badge) badge.textContent = 'Mobile 390px' }
  else if (mode === 'tablet') { f.classList.add('tablet'); if (badge) badge.textContent = 'Tablet 768px' }
  else if (badge) badge.textContent = 'Desktop'
}

// ── FULL-SCREEN PREVIEW ──
const PREVIEW_SIZES: Array<{ label: string; width: number | null; icon: string }> = [
  { label: 'Mobile',  width: 390,  icon: '<rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="18" r="1"/>' },
  { label: 'Tablet',  width: 768,  icon: '<rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1"/>' },
  { label: 'Laptop',  width: 1280, icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>' },
  { label: 'Full',    width: null, icon: '<rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/><line x1="2" y1="3" x2="22" y2="3"/>' },
]
let _pvActiveSize = 3 // default Full

function openFullPreview() {
  const modal = $('fullPreviewModal'); if (!modal) return
  const iframe = $('fullPreviewFrame') as HTMLIFrameElement | null; if (!iframe) return
  iframe.srcdoc = generateSiteHTML()
  modal.style.display = 'flex'
  applyPreviewSize(_pvActiveSize)
  document.addEventListener('keydown', _pvKeyHandler)
}

function closeFullPreview() {
  const modal = $('fullPreviewModal'); if (!modal) return
  modal.style.display = 'none'
  document.removeEventListener('keydown', _pvKeyHandler)
}

function _pvKeyHandler(e: KeyboardEvent) { if (e.key === 'Escape') closeFullPreview() }

function applyPreviewSize(idx: number) {
  _pvActiveSize = idx
  const s = PREVIEW_SIZES[idx]
  const wrap = $('fullPreviewWrap'); if (!wrap) return
  const iframe = $('fullPreviewFrame') as HTMLIFrameElement | null; if (!iframe) return
  if (s.width === null) {
    wrap.style.width = '100%'
    wrap.style.maxWidth = '100%'
    wrap.style.boxShadow = 'none'
    wrap.style.borderRadius = '0'
  } else {
    wrap.style.width = s.width + 'px'
    wrap.style.maxWidth = s.width + 'px'
    wrap.style.boxShadow = '0 0 0 1px rgba(255,255,255,.1), 0 24px 80px rgba(0,0,0,.5)'
    wrap.style.borderRadius = '8px'
  }
  document.querySelectorAll('.pv-size-btn').forEach((b, i) => {
    (b as HTMLElement).style.background = i === idx ? 'rgba(255,255,255,.15)' : 'transparent'
    ;(b as HTMLElement).style.color = i === idx ? '#fff' : 'rgba(255,255,255,.5)'
  })
  const lbl = $('pvSizeLbl')
  if (lbl) lbl.textContent = s.width ? `${s.label} · ${s.width}px` : 'Full Width'
}

function pvOpenExternal() {
  const html = generateSiteHTML()
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  window.open(url, '_blank')
  setTimeout(() => URL.revokeObjectURL(url), 10000)
}

// ── PUBLISH ──
function togglePub(e: MouseEvent) { e.stopPropagation(); $('pubDrop')?.classList.toggle('open') }
function doDraft() { $('pubDrop')?.classList.remove('open'); toast('Saved as draft') }
function doSchedule() { $('pubDrop')?.classList.remove('open'); toast('Schedule feature coming soon') }

function generatePageHTML(pageId: string): string {
  // Temporarily apply page state without touching the DOM
  const saved: SiteState = {}
  PAGE_KEYS.forEach(k => { saved[k] = STATE[k] })
  const pd = getPageDefaults(pageId)
  const ps = pageStates[pageId] || {}
  PAGE_KEYS.forEach(k => { STATE[k] = ps[k] !== undefined ? ps[k] : pd[k] })
  const html = generateSiteHTML()
  PAGE_KEYS.forEach(k => { STATE[k] = saved[k] })
  return html
}

async function doPublish() {
  $('pubDrop')?.classList.remove('open')
  toast('Publishing…')

  const slug = getClientSlug()
  const pagesConf = (STATE.pagesConfig as PageConfig[]) || []
  const slugToFilename = (s: string) => s === '/' ? 'index.html' : s.replace(/^\//, '').replace(/\//g, '-') + '.html'
  const pages = pagesConf.map(p => ({ filename: slugToFilename(p.slug), html: generatePageHTML(p.id) }))

  try {
    const res = await fetch('/api/publish', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pages, slug }),
    })
    const { url, error } = await res.json()
    if (error) { toast('Publish failed: ' + error); return }
    showPublishedModal(url)
  } catch {
    toast('Publish failed')
  }
}

function showPublishedModal(url: string) {
  const modal = $('pubModal'); if (!modal) return
  const urlEl = $('pubModalUrl'); if (urlEl) urlEl.textContent = url
  const linkEl = $('pubModalLink') as HTMLAnchorElement | null; if (linkEl) linkEl.href = url
  modal.style.display = 'flex'
}
function closePubModal() {
  const modal = $('pubModal'); if (modal) modal.style.display = 'none'
}
function copyPubUrl() {
  const urlEl = $('pubModalUrl'); if (!urlEl) return
  navigator.clipboard.writeText(urlEl.textContent || '').then(() => toast('URL copied!'))
}

// ── HTML IMPORT ──
async function openImport() {
  const modal = $('importModal'); if (!modal) return
  const ta = $('importTA') as HTMLTextAreaElement | null; if (ta) ta.value = ''
  const status = $('importStatus'); if (status) { status.textContent = ''; status.style.color = '' }
  modal.style.display = 'flex'
  setTimeout(() => ta?.focus(), 50)
  // Load file list from Websites folder
  try {
    const res = await fetch('/api/websites')
    const { files } = await res.json() as { files: string[] }
    const fileList = $('importFileList')
    if (fileList && files?.length) {
      fileList.style.display = 'flex'
      fileList.innerHTML = files.map(f =>
        `<button onclick="window.__loadWebsiteFile('${f}')" style="padding:6px 12px;background:#f4f5f7;border:1px solid #dde3ed;border-radius:6px;font-size:11px;font-weight:600;color:#0b1f3a;cursor:pointer;display:flex;align-items:center;gap:5px;transition:background .12s" onmouseover="this.style.background='#e8eef8'" onmouseout="this.style.background='#f4f5f7'">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          ${f}
        </button>`
      ).join('')
    } else if (fileList) {
      fileList.style.display = 'none'
    }
  } catch { /* Websites folder not available */ }
}

async function loadWebsiteFile(filename: string) {
  const status = $('importStatus')
  if (status) { status.textContent = `Loading ${filename}…`; status.style.color = 'var(--muted)' }
  try {
    const res = await fetch(`/api/websites?file=${encodeURIComponent(filename)}`)
    const { content, error } = await res.json() as { content?: string; error?: string }
    if (error || !content) throw new Error(error || 'Empty response')
    const ta = $('importTA') as HTMLTextAreaElement | null
    if (ta) ta.value = content
    if (status) { status.textContent = `${filename} loaded — click Import to continue`; status.style.color = '#1553a0' }
  } catch (err) {
    if (status) { status.textContent = 'Load failed: ' + String(err); status.style.color = '#dc2626' }
  }
}
function closeImport() {
  const modal = $('importModal'); if (modal) modal.style.display = 'none'
}

function parseAndImportHTML() {
  const ta = $('importTA') as HTMLTextAreaElement | null
  const raw = ta?.value?.trim()
  if (!raw) { toast('No HTML loaded — click a file or paste HTML first'); return }

  const status = $('importStatus')
  if (status) { status.textContent = 'Parsing…'; status.style.color = 'var(--muted)' }

  try {
    const doc = new DOMParser().parseFromString(raw, 'text/html')
    // Normalise whitespace so <br>-joined text doesn't smash words together
    const txt = (el: Element | null) => (el?.textContent || '').replace(/\s+/g, ' ').trim()
    const attr = (el: Element | null, a: string) => el?.getAttribute(a) || ''

    pushHistory() // allow undo of entire import

    const imp: SiteState = {}
    const detectedSecs: string[] = []

    // ── SEO ──
    const titleEl = doc.querySelector('title')
    if (titleEl) imp.seoTitle = txt(titleEl)
    const metaDesc = doc.querySelector('meta[name="description"]')
    if (metaDesc) imp.seoDesc = attr(metaDesc, 'content')

    // ── COLORS — scan <style> for CSS variables ──
    const styleText = [...doc.querySelectorAll('style')].map(s => s.textContent || '').join('\n')
    const firstHex = (pattern: RegExp) => { const m = styleText.match(pattern); return m?.[1]?.trim() }
    const primaryColor = firstHex(/--primary(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/)
      || firstHex(/--brand(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/)
      || firstHex(/--accent(?:-color)?:\s*(#[0-9a-fA-F]{3,6})/)
      || firstHex(/--color-primary:\s*(#[0-9a-fA-F]{3,6})/)
    if (primaryColor) {
      imp.primaryColor = primaryColor
      imp.ctaColor = primaryColor
      imp.aboutColor = primaryColor
    }

    // ── NAV ──
    const navEl = doc.querySelector('nav, header')
    if (navEl) {
      detectedSecs.push('nav')
      // Brand name: first text node that looks like a company name
      const logoEl = navEl.querySelector('[class*="logo"],[class*="brand"],[class*="name"],[class*="site"]')
      if (logoEl) imp.brandName = txt(logoEl).split('\n')[0].trim().slice(0, 50)
      // Nav links
      const links = [...navEl.querySelectorAll('a')].filter(a => txt(a).length > 0 && txt(a).length < 25)
      links.slice(0, 5).forEach((a, i) => { imp[`navLink${i+1}`] = txt(a) })
      // CTA button (last button or link with cta/btn class)
      const ctaEl = navEl.querySelector('button,[class*="cta"],[class*="btn"]')
      if (ctaEl) imp.navCta = txt(ctaEl).slice(0, 30)
    }

    // ── HERO — first prominent section with an h1 ──
    const heroEl = doc.querySelector(
      '[class*="hero"],[id*="hero"],[class*="banner"],[id*="banner"],[class*="jumbotron"]'
    ) || doc.querySelector('main > section:first-of-type, main > div:first-of-type')
      || doc.querySelector('body > section:first-of-type')
    if (heroEl) {
      detectedSecs.push('hero')
      const h1 = heroEl.querySelector('h1') || doc.querySelector('h1')
      if (h1) imp.headline = txt(h1).slice(0, 100)
      // Subtext: first <p> after h1
      const pEls = [...heroEl.querySelectorAll('p')].filter(p => txt(p).length > 20)
      if (pEls[0]) imp.subtext = txt(pEls[0]).slice(0, 300)
      // Buttons
      const herobtns = [...heroEl.querySelectorAll('button,a[class*="btn"],a[class*="cta"],a[href]')]
        .filter(b => txt(b).length > 0 && txt(b).length < 40)
      if (herobtns[0]) imp.btn1 = txt(herobtns[0]).slice(0, 35)
      if (herobtns[1]) imp.btn2 = txt(herobtns[1]).slice(0, 35)
      // Background color hint
      const bgStyle = (heroEl as HTMLElement).style?.background || (heroEl as HTMLElement).style?.backgroundColor
      if (bgStyle && bgStyle.startsWith('#')) imp.heroColor = bgStyle
    } else if (doc.querySelector('h1')) {
      detectedSecs.push('hero')
      imp.headline = txt(doc.querySelector('h1')).slice(0, 100)
    }

    // ── STATS BAR ──
    const statsBarEl = doc.querySelector('[class*="stat"],[id*="stat"]')
    if (statsBarEl) {
      const statItems = [...statsBarEl.querySelectorAll('[class*="stat-item"],[class*="stat_item"],[class*="stat "],.stat')]
        .filter(el => txt(el).length > 0)
      // fallback: direct children with a number-like element
      const items = statItems.length ? statItems : [...statsBarEl.children].filter(c => /\d/.test(txt(c)))
      if (items.length >= 2) {
        detectedSecs.push('stats')
        items.slice(0, 4).forEach((item, i) => {
          const numEl = item.querySelector('[class*="num"],[class*="count"],[class*="value"],h2,h3,strong') || item.firstElementChild
          const lblEl = item.querySelector('[class*="desc"],[class*="label"],[class*="text"],p,span:last-child') || item.lastElementChild
          if (numEl && numEl !== lblEl) {
            imp[`statsSec${i}`] = txt(numEl).slice(0, 20)
            imp[`statsSec${i}L`] = txt(lblEl).slice(0, 50)
          }
        })
        imp.visStatsSec = true
      }
    }

    // ── PRODUCTS / SERVICES ──
    // Look for the section/div that contains a grid of service/product cards
    const prodEl = doc.querySelector(
      '[class*="section-logistics"],[class*="section-service"],[class*="section-product"],' +
      '[class*="services-grid"],[class*="products-grid"],[class*="product-grid"],' +
      '[class*="product"],[id*="product"],[class*="service"],[id*="service"],[class*="solution"],[id*="solution"]'
    )
    if (prodEl) {
      detectedSecs.push('products')
      // Heading may be in this element or its parent section
      const headingScope = prodEl.closest('section') || prodEl
      const h2 = headingScope.querySelector('h2,h3')
      if (h2) imp.prodH2 = txt(h2).slice(0, 80)
      const eye = headingScope.querySelector('[class*="eyebrow"],[class*="subtitle"],[class*="label"],[class*="tag"]')
      if (eye && eye !== h2) imp.prodEyebrow = txt(eye).slice(0, 60)
      // Cards: accept any card/item that has a title-like child (even a div with title/name class)
      const cards = [...prodEl.querySelectorAll('[class*="card"],[class*="item"],article,li')]
        .filter(c => c.querySelector('h3,h4,strong,[class*="title"],[class*="name"],[class*="card-title"]'))
      cards.slice(0, 4).forEach((card, i) => {
        const name = card.querySelector('h3,h4,strong,[class*="title"],[class*="name"],[class*="card-title"]')
        const desc = card.querySelector('p,[class*="desc"],[class*="body"],[class*="text"]')
        if (name) imp[`prod${i+1}Name`] = txt(name).slice(0, 80)
        if (desc) imp[`prod${i+1}Desc`] = txt(desc).slice(0, 200)
      })
    }

    // ── ABOUT ──
    const aboutEl = doc.querySelector(
      '[class*="about"],[id*="about"],[class*="company"],[id*="company"],[class*="story"],[class*="who-we"]'
    )
    if (aboutEl) {
      detectedSecs.push('about')
      const h2 = aboutEl.querySelector('h2,h3')
      if (h2) imp.aboutH = txt(h2).slice(0, 100)
      const ps = [...aboutEl.querySelectorAll('p')].filter(p => txt(p).length > 30)
      if (ps[0]) imp.aboutP = txt(ps[0]).slice(0, 400)
      // Bullets: li items inside about
      const lis = aboutEl.querySelectorAll('li')
      lis.forEach((li, i) => { if (i < 4) imp[`aboutBullet${i+1}`] = txt(li).slice(0, 100) })
    }

    // ── APPLICATIONS / FEATURES / INDUSTRIES ──
    const appsEl = doc.querySelector(
      '[class*="application"],[id*="application"],[class*="feature"],[id*="feature"],' +
      '[class*="industry"],[id*="industry"],[class*="use-case"],[class*="section-industries"],' +
      '[class*="section-tech"],[class*="section-feature"]'
    )
    if (appsEl) {
      detectedSecs.push('apps')
      const headingScope = appsEl.closest('section') || appsEl
      const h2 = headingScope.querySelector('h2,h3')
      if (h2) imp.appsH2 = txt(h2).slice(0, 80)
      const eye = headingScope.querySelector('[class*="eyebrow"],[class*="subtitle"],[class*="label"],[class*="tag"]')
      if (eye && eye !== h2) imp.appsEyebrow = txt(eye).slice(0, 60)
      const cards = [...appsEl.querySelectorAll('[class*="card"],[class*="item"],li,[class*="feature-card"],[class*="industry-card"]')]
        .filter(c => c.querySelector('h3,h4,strong,[class*="title"],[class*="name"],[class*="-name"],[class*="feature-name"],[class*="industry-name"]'))
      cards.slice(0, 6).forEach((card, i) => {
        const title = card.querySelector('h3,h4,strong,[class*="title"],[class*="name"],[class*="feature-name"],[class*="industry-name"]')
        const desc = card.querySelector('p,[class*="desc"],[class*="body"],[class*="text"]')
        const icon = card.querySelector('[class*="icon"],span:first-child')
        if (title) imp[`app${i+1}Title`] = txt(title).slice(0, 50)
        if (desc) imp[`app${i+1}Desc`] = txt(desc).slice(0, 150)
        if (icon && txt(icon).length <= 4) imp[`app${i+1}Icon`] = txt(icon) // emoji icons
      })
    }

    // ── FAQ ──
    const faqEl = doc.querySelector('[class*="faq"],[id*="faq"],[class*="accordion"],[id*="accordion"]')
    if (faqEl) {
      detectedSecs.push('faq')
      const h2 = faqEl.querySelector('h2,h3')
      if (h2) imp.faqH2 = txt(h2).slice(0, 80)
      // Try details/summary pattern
      const details = faqEl.querySelectorAll('details')
      if (details.length) {
        details.forEach((d, i) => {
          if (i >= 5) return
          const q = d.querySelector('summary'); const a = d.querySelector('p,div:not(summary)')
          if (q) imp[`faq${i+1}Q`] = txt(q).slice(0, 200)
          if (a) imp[`faq${i+1}A`] = txt(a).slice(0, 400)
        })
      } else {
        // Generic Q&A pattern: pairs of heading + paragraph
        const items = [...faqEl.querySelectorAll('[class*="item"],[class*="question"],[class*="entry"]')]
        items.slice(0, 5).forEach((item, i) => {
          const q = item.querySelector('h3,h4,button,strong,[class*="q"]')
          const a = item.querySelector('p,[class*="a"],[class*="answer"]')
          if (q) imp[`faq${i+1}Q`] = txt(q).slice(0, 200)
          if (a) imp[`faq${i+1}A`] = txt(a).slice(0, 400)
        })
      }
    }

    // ── CONTACT / FORM ──
    const contactEl = doc.querySelector('[class*="contact"],[id*="contact"],[class*="enquir"]')
    if (contactEl) {
      detectedSecs.push('form')
      const h2 = contactEl.querySelector('h2,h3')
      if (h2) imp.formH2 = txt(h2).slice(0, 80)
      const eye = contactEl.querySelector('[class*="eyebrow"],[class*="label"],[class*="subtitle"]')
      if (eye) imp.formEyebrow = txt(eye).slice(0, 60)
      const desc = contactEl.querySelector('p')
      if (desc) imp.formDesc = txt(desc).slice(0, 250)
      const emailLink = contactEl.querySelector('a[href^="mailto:"]')
      if (emailLink) imp.formEmail = attr(emailLink, 'href').replace('mailto:', '')
      const phoneLink = contactEl.querySelector('a[href^="tel:"]')
      if (phoneLink) imp.formPhone = attr(phoneLink, 'href').replace('tel:', '').replace(/(\d{2})(\d+)/, '+$1 $2')
      const addrEl = contactEl.querySelector('address,[class*="address"],[class*="addr"]')
      if (addrEl) imp.formAddress = txt(addrEl).slice(0, 200)
    }

    // ── CTA ──
    const ctaEl = doc.querySelector(
      '[class*="-cta"],[id*="-cta"],[class*="cta-"],[id*="cta-"],' +
      '[class*="call-to"],[class*="callout"],[class*="cta-band"],[class*="cta_band"],' +
      '[class="cta"],[id="cta"]'
    )
    if (ctaEl && !doc.querySelector('[class*="contact"]')?.contains(ctaEl)) {
      detectedSecs.push('cta')
      const h2 = ctaEl.querySelector('h2,h3')
      if (h2) imp.ctaH = txt(h2).slice(0, 100)
      const p = ctaEl.querySelector('p')
      if (p) imp.ctaP = txt(p).slice(0, 200)
      const btns = ctaEl.querySelectorAll('button,a[class*="btn"],a[class*="cta"]')
      if (btns[0]) imp.ctaBtn1 = txt(btns[0]).slice(0, 35)
      if (btns[1]) imp.ctaBtn2 = txt(btns[1]).slice(0, 35)
    }

    // ── CLIENTS / LOGOS ──
    const clientsEl = doc.querySelector('[class*="client"],[id*="client"],[class*="logo-grid"],[class*="partners"]')
    if (clientsEl) {
      detectedSecs.push('clients')
      const h2 = clientsEl.querySelector('h2,h3')
      if (h2) imp.clientsH2 = txt(h2).slice(0, 80)
      const names = [...clientsEl.querySelectorAll('img,span,[class*="name"],[class*="logo"]')]
        .map(el => el.tagName === 'IMG' ? (attr(el, 'alt') || '') : txt(el))
        .filter(n => n.length > 1 && n.length < 40)
      names.slice(0, 12).forEach((n, i) => { imp[`client${i+1}`] = n })
    }

    // ── FOOTER ──
    const footerEl = doc.querySelector('footer,[class*="footer"],[id*="footer"]')
    if (footerEl) {
      detectedSecs.push('footer')
      const nameEl = footerEl.querySelector('[class*="logo"],[class*="brand"],[class*="name"],strong')
      if (nameEl) imp.footerName = txt(nameEl).split('\n')[0].trim().slice(0, 60)
      const addrEl = footerEl.querySelector('address,[class*="address"],[class*="addr"]')
      if (addrEl) imp.footerAddr = txt(addrEl).slice(0, 200)
      const flinks = [...footerEl.querySelectorAll('a')].filter(a => txt(a).length > 1 && txt(a).length < 25)
      flinks.slice(0, 4).forEach((a, i) => { imp[`footerLink${i+1}`] = txt(a) })
    }

    // ── BUILD SECTIONS ARRAY ──
    const ORDER = ['hero','trust','products','about','apps','testimonials','clients','stats','cta','form','faq']
    const finalSecs = ORDER.filter(s => {
      if (s === 'trust' || s === 'testimonials' || s === 'stats') return false // don't auto-add decorative
      return detectedSecs.includes(s)
    })
    if (finalSecs.length < 2) finalSecs.push(...DEFAULT_SECTIONS)
    imp.sections = finalSecs

    // ── APPLY ──
    Object.assign(STATE, imp)
    const pageState: SiteState = {}
    PAGE_KEYS.forEach(k => { if (imp[k] !== undefined) pageState[k] = imp[k] })
    pageStates[currentPage] = { ...(pageStates[currentPage] || {}), ...pageState }
    saveAll()
    applyAll()
    populateInputs()
    renderSecStack()

    const fieldCount = Object.keys(imp).filter(k => k !== 'sections').length
    closeImport()
    toast(`Imported ${fieldCount} fields · ${finalSecs.length} sections loaded`)
  } catch (err) {
    const status = $('importStatus')
    if (status) { status.textContent = 'Error: ' + String(err); status.style.color = '#dc2626' }
    toast('Import failed — check console for details')
    console.error('HTML import error:', err)
  }
}

// ── BRAND ──
function applyBrandColor(c: string) {
  scheduleHistory()
  STATE.primaryColor = c; STATE.aboutColor = c; STATE.ctaColor = c
  STATE.footerColor = shade(c, -15); STATE.heroColor = c
  if (!pageStates[currentPage]) pageStates[currentPage] = {}
  pageStates[currentPage].heroColor = c
  document.querySelectorAll('[data-key="heroColor"],[data-key="aboutColor"],[data-key="ctaColor"],[data-key="primaryColor"]').forEach(el => (el as HTMLInputElement).value = c)
  document.querySelectorAll('[data-key="footerColor"]').forEach(el => (el as HTMLInputElement).value = STATE.footerColor as string)
  ;[['heroSwatches','heroColor'],['aboutSwatches','aboutColor'],['ctaSwatches','ctaColor'],['footerSwatches','footerColor'],['brandSwatches','primaryColor']].forEach(([sid,key]) => {
    const wrap = $(sid); if (!wrap) return
    wrap.querySelectorAll('.swatch').forEach(s => s.classList.toggle('active', (s as HTMLElement).dataset.c === STATE[key]))
  })
  saveAll(); updatePreview()
  toast('Brand color updated')
}
function syncBrand(val: string) { save('brandName', val); updatePreview() }

// ── TYPOGRAPHY ──
function renderTypographyPanel() {
  const wrap = $('typographyPanel'); if (!wrap) return
  const customFonts = (STATE.customFonts as CustomFont[]) || []
  wrap.innerHTML = Object.entries(FONT_CATS).map(([cat, meta]) => {
    const current = (STATE[meta.key] as string) || meta.fonts[0]
    const customInCat = customFonts.filter(f => f.category === cat)
    const options = [
      `<optgroup label="Built-in">`,
      ...meta.fonts.map(f => `<option value="${escHtml(f)}"${f === current ? ' selected' : ''}>${escHtml(f)}</option>`),
      `</optgroup>`,
      ...(customInCat.length ? [
        `<optgroup label="Custom">`,
        ...customInCat.map(f => `<option value="${escHtml(f.name)}"${f.name === current ? ' selected' : ''}>${escHtml(f.name)}</option>`),
        `</optgroup>`,
      ] : []),
    ].join('')
    return `
      <div class="typo-row">
        <div class="typo-meta">
          <span class="typo-label">${meta.label}</span>
          <span class="typo-hint">${meta.hint}</span>
        </div>
        <div class="typo-controls">
          <select class="fi typo-select" onchange="window.__setTypoFont('${cat}',this.value)">${options}</select>
          <div class="typo-preview" style="font-family:'${escHtml(current)}',sans-serif">Aa Bb Cc 123</div>
          <label class="muz-btn" style="cursor:pointer;font-size:10px;padding:5px 8px">
            Upload
            <input type="file" accept=".woff,.woff2,.ttf,.otf" style="display:none" onchange="window.__uploadCustomFont('${cat}',this)" />
          </label>
        </div>
        ${customInCat.length ? `<div class="typo-custom-list">${customInCat.map(f => `<span class="typo-custom-tag">${escHtml(f.name)}<button onclick="window.__removeCustomFont('${cat}','${escHtml(f.name)}')">✕</button></span>`).join('')}</div>` : ''}
      </div>
    `
  }).join('<div class="set-divider" style="margin:0"></div>')
}

function setTypoFont(cat: string, name: string) {
  const key = FONT_CATS[cat]?.key; if (!key) return
  STATE[key] = name; saveAll(); updatePreview()
  // update preview div immediately without full re-render
  const rows = document.querySelectorAll('.typo-row')
  const idx = Object.keys(FONT_CATS).indexOf(cat)
  const preview = rows[idx]?.querySelector('.typo-preview') as HTMLElement | null
  if (preview) preview.style.fontFamily = `'${name}',sans-serif`
  // load font in editor too for live preview
  loadEditorFont(name)
}

function loadEditorFont(name: string) {
  if (MONO_FONTS.has(name)) return
  const id = 'ef-' + name.replace(/ /g, '-')
  if (document.getElementById(id)) return
  const link = document.createElement('link')
  link.id = id; link.rel = 'stylesheet'
  link.href = `https://fonts.googleapis.com/css2?family=${name.replace(/ /g, '+')}:wght@400;700&display=swap`
  document.head.appendChild(link)
}

async function uploadCustomFont(cat: string, input: HTMLInputElement) {
  const file = input.files?.[0]; if (!file) return
  toast('Uploading font…')
  const slug = getClientSlug()
  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '-')
  const path = `fonts/${slug}/${filename}`
  const res = await fetch('/api/upload?path=' + encodeURIComponent(path), {
    method: 'POST', headers: { 'Content-Type': file.type || 'font/woff2' }, body: file,
  })
  const json = await res.json()
  if (!res.ok) { toast('Upload failed: ' + json.error); return }
  const customFonts = (STATE.customFonts as CustomFont[]) || []
  const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ')
  customFonts.push({ name: fontName, url: json.url, category: cat })
  STATE.customFonts = customFonts
  STATE[FONT_CATS[cat].key] = fontName
  saveAll(); updatePreview(); renderTypographyPanel()
  toast('Font uploaded: ' + fontName)
}

function removeCustomFont(cat: string, name: string) {
  const customFonts = (STATE.customFonts as CustomFont[]) || []
  STATE.customFonts = customFonts.filter(f => !(f.name === name && f.category === cat))
  if (STATE[FONT_CATS[cat].key] === name) STATE[FONT_CATS[cat].key] = FONT_CATS[cat].fonts[0]
  saveAll(); updatePreview(); renderTypographyPanel()
}

function setFontSize(v: string) {
  const lbl = $('sizeVal'); if (lbl) lbl.textContent = v + 'px'
}

// ── COLORS ──
function setHeroColor(el: HTMLElement) {
  document.querySelectorAll('#heroSwatches .swatch').forEach(s => s.classList.remove('active'))
  el.classList.add('active')
  save('heroColor', el.dataset.c); updatePreview()
}
function applyHeroColor(c: string) { save('heroColor', c); updatePreview() }

function setAboutColor(el: HTMLElement) {
  document.querySelectorAll('#aboutSwatches .swatch').forEach(s => s.classList.remove('active'))
  el.classList.add('active')
  save('aboutColor', el.dataset.c); updatePreview()
}
function applyAboutColor(c: string) { save('aboutColor', c); updatePreview() }

function setSecColor(sectionId: string, swatchesId: string, el: HTMLElement) {
  document.querySelectorAll(`#${swatchesId} .swatch`).forEach(s => s.classList.remove('active'))
  el.classList.add('active')
  const key = sectionId === 'sContact' ? 'ctaColor' : 'footerColor'
  save(key, el.dataset.c); updatePreview()
}

// ── TOGGLE SECTION VISIBILITY ──
function toggleSection(el: HTMLElement, _visId: string, stateKey: string) {
  el.classList.toggle('on')
  const on = el.classList.contains('on')
  save(stateKey, on); updatePreview()
}

// ── HERO OVERLAY ──
function renderHeroOverlayUI() {
  const wrap = $('heroOverlayCtrl'); if (!wrap) return
  const mode = (STATE.heroOverlayMode as string) || 'none'
  const color = (STATE.heroOverlayColor as string) || '#000000'
  const opacity = (STATE.heroOverlayOpacity as number) ?? 50
  const dir = (STATE.heroGradientDir as number) ?? 270
  const gStart = (STATE.heroGradientStart as number) ?? 70
  const gEnd = (STATE.heroGradientEnd as number) ?? 0

  const compass = [
    [315,'↖'],[0,'↑'],[45,'↗'],
    [270,'←'],[null,null],[90,'→'],
    [225,'↙'],[180,'↓'],[135,'↘'],
  ].map(([d, lbl]) => d === null
    ? `<div></div>`
    : `<button class="ovl-dir-btn${dir === d ? ' active' : ''}" onclick="window.__setOverlayDir(${d})">${lbl}</button>`
  ).join('')

  wrap.innerHTML = `
    <div style="height:1px;background:var(--border);margin:4px 0"></div>
    <div class="fl">Image Overlay</div>
    <div class="ltype-wrap" style="margin-bottom:0">
      <button class="ltype-btn${mode==='none'?' active':''}" onclick="window.__setOverlayMode('none')">None</button>
      <button class="ltype-btn${mode==='solid'?' active':''}" onclick="window.__setOverlayMode('solid')">Solid</button>
      <button class="ltype-btn${mode==='gradient'?' active':''}" onclick="window.__setOverlayMode('gradient')">Gradient</button>
    </div>
    ${mode === 'none' ? '' : `
      <div style="display:flex;gap:8px;align-items:center;margin-top:4px">
        <div class="fl" style="flex-shrink:0;margin-bottom:0">Color</div>
        <input type="color" value="${color}" style="width:36px;height:28px;padding:1px 2px;border:1px solid var(--border);border-radius:4px;cursor:pointer;background:none" onchange="window.__setOverlayColor(this.value)" oninput="window.__setOverlayColor(this.value)" />
      </div>
    `}
    ${mode === 'solid' ? `
      <div class="fl">Opacity <span id="ovlOpacityLbl">${opacity}%</span></div>
      <input type="range" class="fi" min="0" max="90" step="5" value="${opacity}" style="padding:0;height:20px" oninput="window.__setOverlayOpacity(this.value)" />
    ` : ''}
    ${mode === 'gradient' ? `
      <div class="fl">Direction</div>
      <div class="ovl-compass">${compass}</div>
      <div class="fl">Start Opacity <span id="ovlStartLbl">${gStart}%</span></div>
      <input type="range" class="fi" min="0" max="90" step="5" value="${gStart}" style="padding:0;height:20px" oninput="window.__setGradientStart(this.value)" />
      <div class="fl">End Opacity <span id="ovlEndLbl">${gEnd}%</span></div>
      <input type="range" class="fi" min="0" max="90" step="5" value="${gEnd}" style="padding:0;height:20px" oninput="window.__setGradientEnd(this.value)" />
    ` : ''}
  `
}

function setOverlayMode(mode: string) { STATE.heroOverlayMode = mode; saveAll(); updatePreview(); renderHeroOverlayUI() }
function setOverlayColor(color: string) { STATE.heroOverlayColor = color; saveAll(); updatePreview() }
function setOverlayOpacity(val: string) {
  const pct = parseInt(val); STATE.heroOverlayOpacity = pct
  const lbl = $('ovlOpacityLbl'); if (lbl) lbl.textContent = pct + '%'
  saveAll(); updatePreview()
}
function setOverlayDir(deg: number) { STATE.heroGradientDir = deg; saveAll(); updatePreview(); renderHeroOverlayUI() }
function setGradientStart(val: string) {
  const pct = parseInt(val); STATE.heroGradientStart = pct
  const lbl = $('ovlStartLbl'); if (lbl) lbl.textContent = pct + '%'
  saveAll(); updatePreview()
}
function setGradientEnd(val: string) {
  const pct = parseInt(val); STATE.heroGradientEnd = pct
  const lbl = $('ovlEndLbl'); if (lbl) lbl.textContent = pct + '%'
  saveAll(); updatePreview()
}

function setHeroOverlay(val: string, doSave = true) {
  const pct = parseInt(val)
  if (doSave) { STATE.heroOverlayOpacity = pct; saveAll(); updatePreview() }
}

// ── MEDIA LIBRARY ──
type MediaFile = { name: string; path: string; url: string; created_at: string; size: number }
let mediaPickerCallback: ((url: string) => void) | null = null
let mediaCache: MediaFile[] = []

async function fetchMedia(): Promise<MediaFile[]> {
  try {
    const res = await fetch('/api/media')
    const json = await res.json()
    mediaCache = json.files || []
  } catch { mediaCache = [] }
  return mediaCache
}

function openMediaPicker(callback: (url: string) => void) {
  mediaPickerCallback = callback
  const overlay = $('mediaPickerOverlay')
  if (overlay) { overlay.style.display = 'flex'; renderMediaPickerGrid(mediaCache) }
  fetchMedia().then(files => renderMediaPickerGrid(files))
}

function closeMediaPicker() {
  const overlay = $('mediaPickerOverlay')
  if (overlay) overlay.style.display = 'none'
  mediaPickerCallback = null
}

function selectMediaFile(url: string) {
  if (mediaPickerCallback) mediaPickerCallback(url)
  closeMediaPicker()
}

async function deleteMediaFile(path: string) {
  if (!confirm('Delete this image? This cannot be undone.')) return
  await fetch('/api/media', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path }) })
  mediaCache = mediaCache.filter(f => f.path !== path)
  renderMediaPickerGrid(mediaCache)
  renderMediaSidebarGrid(mediaCache)
  toast('Image deleted')
}

function renderMediaPickerGrid(files: MediaFile[]) {
  const grid = $('mediaPickerGrid'); if (!grid) return
  if (!files.length) { grid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:#9ca3af;font-size:13px">No images uploaded yet</div>'; return }
  grid.innerHTML = files.map(f => `
    <div class="mpk-item" onclick="window.__selectMedia('${escHtml(f.url)}')">
      <img src="${escHtml(f.url)}" loading="lazy" />
      <div class="mpk-name">${escHtml(f.name)}</div>
    </div>
  `).join('')
}

function renderMediaSidebarGrid(files: MediaFile[]) {
  const grid = $('mediaSidebarGrid'); if (!grid) return
  if (!files.length) { grid.innerHTML = '<div style="text-align:center;padding:32px 12px;color:#9ca3af;font-size:12px">No images uploaded yet.<br>Upload via a section panel.</div>'; return }
  grid.innerHTML = files.map(f => `
    <div class="msb-item">
      <img src="${escHtml(f.url)}" loading="lazy" />
      <button class="msb-del" onclick="window.__deleteMedia('${escHtml(f.path)}')" title="Delete">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="msb-name">${escHtml(f.name)}</div>
    </div>
  `).join('')
}

function loadMediaSidebar() {
  fetchMedia().then(files => renderMediaSidebarGrid(files))
}

// ── CROPPER ──
let cropperInst: Cropper | null = null
let cropCallback: ((dataUrl: string) => void) | null = null

function openCropper(file: File, title: string, defaultRatio: number, callback: (dataUrl: string) => void) {
  if (!file || !file.type.startsWith('image/')) return
  cropCallback = callback
  const titleEl = $('cropTitle'); if (titleEl) titleEl.textContent = title
  document.querySelectorAll('.crop-ratio-btn').forEach(b => {
    const r = parseFloat((b as HTMLElement).dataset.ratio || '')
    b.classList.toggle('active', isNaN(r) ? isNaN(defaultRatio) : Math.abs(r - defaultRatio) < 0.01)
  })
  const zs = $('cropZoomSlider') as HTMLInputElement | null; if (zs) zs.value = '0'
  const zl = $('cropZoomLbl'); if (zl) zl.textContent = '100%'
  const qs = $('cropQualitySlider') as HTMLInputElement | null; if (qs) qs.value = '85'
  const ql = $('cropQualityLbl'); if (ql) ql.textContent = '85%'
  const reader = new FileReader()
  reader.onload = ev => {
    const img = $('cropImg') as HTMLImageElement | null; if (!img) return
    img.src = ev.target!.result as string
    $('cropOverlay')?.classList.add('open')
    if (cropperInst) { cropperInst.destroy(); cropperInst = null }
    cropperInst = new Cropper(img, {
      aspectRatio: defaultRatio,
      viewMode: 1,
      autoCropArea: 0.85,
      responsive: true,
      background: false,
      zoom(e) {
        const pct = Math.round(e.detail.ratio * 100)
        const lbl = $('cropZoomLbl'); if (lbl) lbl.textContent = pct + '%'
        const sl = $('cropZoomSlider') as HTMLInputElement | null; if (sl) sl.value = String((e.detail.ratio - 1).toFixed(2))
      }
    })
  }
  reader.readAsDataURL(file)
}
function closeCropper() {
  $('cropOverlay')?.classList.remove('open')
  if (cropperInst) { cropperInst.destroy(); cropperInst = null }
  cropCallback = null
}
function applyCrop() {
  if (!cropperInst || !cropCallback) return
  const quality = parseInt(($('cropQualitySlider') as HTMLInputElement | null)?.value || '85') / 100
  const canvas = cropperInst.getCroppedCanvas({ maxWidth: 2400, maxHeight: 2400, imageSmoothingEnabled: true, imageSmoothingQuality: 'high' })
  const cb = cropCallback
  const title = ($('cropTitle') as HTMLElement | null)?.textContent || 'image'
  closeCropper()
  toast('Uploading image…')
  canvas.toBlob(async blob => {
    if (!blob) { toast('Upload failed'); return }
    try {
      const filename = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now() + '.jpg'
      const url = await uploadImage(blob, filename)
      cb(url)
    } catch (err) {
      toast('Upload failed: ' + (err instanceof Error ? err.message : String(err)))
    }
  }, 'image/jpeg', quality)
}
function setCropRatio(ratio: number, btn: HTMLElement) {
  document.querySelectorAll('.crop-ratio-btn').forEach(b => b.classList.remove('active'))
  btn.classList.add('active')
  if (cropperInst) cropperInst.setAspectRatio(ratio)
}
function onCropZoom(val: string) {
  const pct = Math.round((parseFloat(val) + 1) * 100)
  const lbl = $('cropZoomLbl'); if (lbl) lbl.textContent = pct + '%'
  if (cropperInst) cropperInst.zoomTo(parseFloat(val) + 1)
}

// ── HERO MEDIA ──
function handleHeroMedia(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  if (file.type.startsWith('video/')) {
    STATE.heroImg = null; STATE.heroVideoUrl = URL.createObjectURL(file)
    const oc = $('heroOverlayCtrl'); if (oc) oc.style.display = 'block'
    renderHeroOverlayUI(); updatePreview(); toast('Hero video updated'); return
  }
  openCropper(file, 'Crop Hero Image', 16/9, url => {
    STATE.heroImg = url; STATE.heroVideoUrl = null
    const th = $('heroThumb') as HTMLImageElement | null
    if (th) { th.src = url; th.style.display = 'block' }
    const oc = $('heroOverlayCtrl'); if (oc) oc.style.display = 'block'
    renderHeroOverlayUI(); saveAll(); updatePreview(); toast('Hero image updated')
  })
}
function clearHeroMedia() {
  STATE.heroImg = null; STATE.heroVideoUrl = null
  const th = $('heroThumb') as HTMLImageElement | null; if (th) th.style.display = 'none'
  const oc = $('heroOverlayCtrl'); if (oc) oc.style.display = 'none'
  saveAll(); updatePreview(); toast('Media removed')
}

// ── PRODUCT CARD IMAGES ──
const PROD_IMG_MAP: Record<string, string> = { 'oProdImg1':'prodImg1', 'oProdImg2':'prodImg2', 'oProdImg3':'prodImg3', 'oProdImg4':'prodImg4', 'oProdImg5':'prodImg5' }
function handleCardImg(e: Event, targetId: string) {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  openCropper(file, 'Crop Product Image', 1, url => {
    const stateKey = PROD_IMG_MAP[targetId]; if (!stateKey) return
    STATE[stateKey] = url; saveAll(); updatePreview(); toast('Product image updated')
  })
}

// ── ABOUT IMAGE ──
function handleAboutImg(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return
  openCropper(file, 'Crop About Image', 4/3, url => {
    STATE.aboutImg = url; saveAll(); updatePreview(); toast('About image updated')
  })
}

// ── INPUT LISTENER ──
function handleInput(e: Event) {
  const target = e.target as HTMLInputElement
  const key = target.dataset.key
  if (!key || target.type === 'file') return
  save(key, target.type === 'range' ? Number(target.value) : target.value)
  updatePreview()
}

// ── POSTMESSAGE LISTENER ──
function handleMessage(e: MessageEvent) {
  const d = e.data; if (!d || !d.type) return
  if (d.type === 'openEditor') { switchTabTo('panelPages'); openEditor(d.secId) }
  if (d.type === 'addBelow') {
    _insertAfter = d.secId
    switchTabTo('panelBlocks')
    renderAddPanel()
    toast('Choose a section to add after ' + (SEC_META[d.secId]?.label || d.secId))
  }
}

// ── REACT COMPONENT ──
export default function EditorPage() {
  useEffect(() => {
    // Expose functions that are called from dynamically rendered innerHTML
    ;(window as unknown as Record<string, unknown>).__openEditor = openEditor
    ;(window as unknown as Record<string, unknown>).__eyeToggle = eyeToggle
    ;(window as unknown as Record<string, unknown>).__insertSection = insertSection
    ;(window as unknown as Record<string, unknown>).__loadWebsiteFile = loadWebsiteFile
    ;(window as unknown as Record<string, unknown>).__switchPage = switchPage
    ;(window as unknown as Record<string, unknown>).__removePage = removePage
    ;(window as unknown as Record<string, unknown>).__openPageMenu = openPageMenu
    ;(window as unknown as Record<string, unknown>).__renamePage = renamePage
    ;(window as unknown as Record<string, unknown>).__togglePageNav = togglePageNav
    ;(window as unknown as Record<string, unknown>).__togglePageStatus = togglePageStatus
    ;(window as unknown as Record<string, unknown>).__setLinkType = setLinkType
    ;(window as unknown as Record<string, unknown>).__saveLinkField = saveLinkField
    ;(window as unknown as Record<string, unknown>).__toggleLinkNewTab = toggleLinkNewTab
    ;(window as unknown as Record<string, unknown>).__selectMedia = selectMediaFile
    ;(window as unknown as Record<string, unknown>).__deleteMedia = deleteMediaFile
    ;(window as unknown as Record<string, unknown>).__setTypoFont = setTypoFont
    ;(window as unknown as Record<string, unknown>).__uploadCustomFont = uploadCustomFont
    ;(window as unknown as Record<string, unknown>).__removeCustomFont = removeCustomFont
    ;(window as unknown as Record<string, unknown>).__setOverlayMode = setOverlayMode
    ;(window as unknown as Record<string, unknown>).__setOverlayColor = setOverlayColor
    ;(window as unknown as Record<string, unknown>).__setOverlayOpacity = setOverlayOpacity
    ;(window as unknown as Record<string, unknown>).__setOverlayDir = setOverlayDir
    ;(window as unknown as Record<string, unknown>).__setGradientStart = setGradientStart
    ;(window as unknown as Record<string, unknown>).__setGradientEnd = setGradientEnd

    // Hero drop zone
    const heroDz = $('heroDz')
    if (heroDz) {
      heroDz.addEventListener('dragover', e => { e.preventDefault(); heroDz.classList.add('over') })
      heroDz.addEventListener('dragleave', () => heroDz.classList.remove('over'))
      heroDz.addEventListener('drop', e => {
        e.preventDefault(); heroDz.classList.remove('over')
        const f = (e as DragEvent).dataTransfer?.files[0]
        if (f) handleHeroMedia({ target: { files: [f] } } as unknown as Event)
      })
    }

    document.addEventListener('input', handleInput)
    window.addEventListener('message', handleMessage)
    document.addEventListener('click', () => $('pubDrop')?.classList.remove('open'))

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }
    }
    document.addEventListener('keydown', handleKeyDown)

    loadState()
    updateUndoBtn()

    return () => {
      document.removeEventListener('input', handleInput)
      window.removeEventListener('message', handleMessage)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  return (
    <>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="logo">
          <div className="logo-box">
            <svg viewBox="0 0 20 20" fill="none">
              <rect x="2" y="2" width="7" height="7" rx="1" fill="white"/>
              <rect x="11" y="2" width="7" height="7" rx="1" fill="white"/>
              <rect x="2" y="11" width="7" height="7" rx="1" fill="white"/>
              <rect x="11" y="11" width="7" height="3" rx="1" fill="white" opacity=".6"/>
              <rect x="11" y="15" width="7" height="3" rx="1" fill="white" opacity=".3"/>
            </svg>
          </div>
          LabX Canvas
        </div>
        <div className="top-center">
          <button className="vbtn active" onClick={e => setView('desktop', e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>Desktop
          </button>
          <button className="vbtn" onClick={e => setView('tablet', e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2"/><circle cx="12" cy="18" r="1"/></svg>Tablet
          </button>
          <button className="vbtn" onClick={e => setView('mobile', e.currentTarget)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="3"/><circle cx="12" cy="18" r="1"/></svg>Mobile
          </button>
        </div>
        <div className="top-right">
          <button onClick={() => openFullPreview()} title="Full-screen preview" style={{padding:'6px 12px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'7px',color:'rgba(255,255,255,.7)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',transition:'all .15s'}} onMouseOver={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)'} onMouseOut={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.1)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M1 3h6v6H1zM17 3h6v6h-6zM1 15h6v6H1zM17 15h6v6h-6z"/></svg>Preview
          </button>
          <button onClick={() => openImport()} title="Import HTML" style={{padding:'6px 12px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'7px',color:'rgba(255,255,255,.7)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',transition:'all .15s'}} onMouseOver={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)'} onMouseOut={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.1)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Import
          </button>
          <button id="undoBtn" onClick={() => undo()} title="Undo (⌘Z)" style={{padding:'6px 12px',background:'rgba(255,255,255,.1)',border:'1px solid rgba(255,255,255,.15)',borderRadius:'7px',color:'rgba(255,255,255,.7)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',transition:'all .15s',opacity:.35,pointerEvents:'none'}} onMouseOver={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.18)'} onMouseOut={e => (e.currentTarget as HTMLElement).style.background='rgba(255,255,255,.1)'}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M3 7v6h6"/><path d="M3 13C5.5 7 11 4 17 6s9 9 6 15"/></svg>Undo
          </button>
          <div className="live-pill"><div className="live-dot"></div>Live Preview</div>
          <div className="pub-wrap">
            <button className="pub-main" onClick={() => doPublish()}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12l7-7 7 7"/><path d="M12 5v14"/></svg>Publish
            </button>
            <button className="pub-caret" onClick={e => togglePub(e.nativeEvent)}>▾</button>
            <div className="pub-drop" id="pubDrop">
              <button className="pub-item" onClick={() => doPublish()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12l7-7 7 7"/><path d="M12 5v14"/></svg>Publish Now
              </button>
              <button className="pub-item" onClick={() => doDraft()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v14a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save as Draft
              </button>
              <div className="pub-sep"></div>
              <button className="pub-item" onClick={() => doSchedule()}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>Schedule Publish
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="editor-body">

        {/* ICON RAIL */}
        <div className="editor-rail">
          <button className="rail-btn active" data-ctx="ctxSections" title="Sections" onClick={() => switchRailPanel('ctxSections')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="4" rx="1"/><rect x="3" y="10" width="18" height="4" rx="1"/><rect x="3" y="17" width="18" height="4" rx="1"/></svg>
            <span className="rail-label">Sections</span>
          </button>
          <button className="rail-btn" data-ctx="ctxPages" title="Pages" onClick={() => switchRailPanel('ctxPages')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <span className="rail-label">Pages</span>
          </button>
          <button className="rail-btn" data-ctx="ctxMedia" title="Media" onClick={() => switchRailPanel('ctxMedia')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span className="rail-label">Media</span>
          </button>
          <div className="rail-divider"></div>
          <button className="rail-btn" data-ctx="ctxSettings" title="Settings" onClick={() => switchRailPanel('ctxSettings')}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
            <span className="rail-label">Settings</span>
          </button>
        </div>

        {/* CONTEXT PANEL */}
        <div className="editor-context">

          {/* SECTIONS ctx panel */}
          <div id="ctxSections" className="ctx-panel">
            <div className="ctx-hdr">
              <span className="ctx-hdr-title">Sections</span>
              <button className="ctx-hdr-btn" onClick={() => { _insertAfter = null; renderAddPanel(); switchRailPanel('ctxBlocks') }}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                Add
              </button>
            </div>
            <div className="sec-stack-hdr" style={{fontSize:'9px',fontWeight:700,color:'var(--muted)',padding:'8px 14px 6px',textTransform:'uppercase',letterSpacing:'1px',flexShrink:0}}>Current Page</div>
            <div className="sec-stack" id="secStack" style={{flex:1,overflowY:'auto'}}></div>
          </div>

          {/* PAGES ctx panel */}
          <div id="ctxPages" className="ctx-panel" style={{display:'none'}}>
            <div className="ctx-hdr">
              <span className="ctx-hdr-title">Pages</span>
              <button className="ctx-hdr-btn" onClick={() => toggleAddPageForm()}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                New
              </button>
            </div>
            <div id="pageList" className="page-list" style={{flexShrink:0}}></div>
            <div id="addPageForm" style={{display:'none',flexDirection:'column',gap:'6px',padding:'10px 12px',borderBottom:'1px solid var(--border)',background:'#f8faff',flexShrink:0}}>
              <div style={{fontSize:'10px',fontWeight:700,color:'var(--blue)',textTransform:'uppercase',letterSpacing:'.5px'}}>New Page</div>
              <input id="newPageName" className="fi" placeholder="e.g. Careers" style={{fontSize:'12px'}}
                onKeyDown={e => { if (e.key === 'Enter') confirmAddPage(); if (e.key === 'Escape') closeAddPageForm() }} />
              <div style={{display:'flex',gap:'6px'}}>
                <button onClick={() => confirmAddPage()} style={{flex:1,padding:'6px',background:'var(--blue)',color:'#fff',border:'none',borderRadius:'6px',fontSize:'11px',fontWeight:700,cursor:'pointer'}}>Add Page</button>
                <button onClick={() => closeAddPageForm()} style={{padding:'6px 10px',background:'none',color:'var(--muted)',border:'1px solid var(--border)',borderRadius:'6px',fontSize:'11px',fontWeight:600,cursor:'pointer'}}>Cancel</button>
              </div>
            </div>
          </div>

          {/* BLOCKS / ADD SECTION ctx panel (sub-view of Sections) */}
          <div id="ctxBlocks" className="ctx-panel" style={{display:'none'}}>
            <div className="ctx-hdr">
              <button className="ctx-back-btn" onClick={() => switchRailPanel('ctxSections')}>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="15 18 9 12 15 6"/></svg>
                Back
              </button>
              <span className="ctx-hdr-title">Add Section</span>
            </div>
            <div id="addSecPanel" style={{flexShrink:0,padding:'10px',borderBottom:'1px solid var(--border)',background:'#f0f5ff'}}></div>
            <div className="blk-search"><input placeholder="Search blocks..." onInput={e => filterBlocks((e.target as HTMLInputElement).value)} /></div>
            <div style={{flex:1,overflowY:'auto'}}>
              <div className="blk-cat-hdr">Hero</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('hero-fullbleed')}><div className="blk-lib-thumb bt-hero-full"></div><div className="blk-lib-name">Full Bleed</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('hero-split')}><div className="blk-lib-thumb bt-split"></div><div className="blk-lib-name">Split</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('hero-minimal')}><div className="blk-lib-thumb bt-minimal"></div><div className="blk-lib-name">Minimal</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('hero-video')}><div className="blk-lib-thumb bt-video"></div><div className="blk-lib-name">Video BG</div></div>
              </div>
              <div className="blk-cat-hdr">Content</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('text-block')}><div className="blk-lib-thumb bt-text"></div><div className="blk-lib-name">Text Block</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('text-image')}><div className="blk-lib-thumb bt-text-img"></div><div className="blk-lib-name">Text + Image</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('image-text')}><div className="blk-lib-thumb bt-img-text"></div><div className="blk-lib-name">Image + Text</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('rich-text')}><div className="blk-lib-thumb bt-rich"></div><div className="blk-lib-name">Rich Text</div></div>
              </div>
              <div className="blk-cat-hdr">Features</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('tech')}><div className="blk-lib-thumb bt-feat-grid"></div><div className="blk-lib-name">Technology</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('stats-bar')}><div className="blk-lib-thumb bt-stats"></div><div className="blk-lib-name">Stats Bar</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('checklist')}><div className="blk-lib-thumb bt-check"></div><div className="blk-lib-name">Checklist</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('icon-list')}><div className="blk-lib-thumb bt-icon-list"></div><div className="blk-lib-name">Icon List</div></div>
              </div>
              <div className="blk-cat-hdr">Products</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('prod-grid4')}><div className="blk-lib-thumb bt-prod4"></div><div className="blk-lib-name">4-Col Grid</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('prod-grid3')}><div className="blk-lib-thumb bt-prod3"></div><div className="blk-lib-name">3-Col Grid</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('prod-list')}><div className="blk-lib-thumb bt-prod-list"></div><div className="blk-lib-name">List View</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('prod-feature')}><div className="blk-lib-thumb bt-prod-feat"></div><div className="blk-lib-name">Featured</div></div>
              </div>
              <div className="blk-cat-hdr">Social Proof</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('testimonials')}><div className="blk-lib-thumb bt-quote"></div><div className="blk-lib-name">Testimonials</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('client-logos')}><div className="blk-lib-thumb bt-logos"></div><div className="blk-lib-name">Client Logos</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('certs')}><div className="blk-lib-thumb bt-cert"></div><div className="blk-lib-name">Certifications</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('awards')}><div className="blk-lib-thumb bt-awards"></div><div className="blk-lib-name">Awards</div></div>
              </div>
              <div className="blk-cat-hdr">Call to Action</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('cta-banner')}><div className="blk-lib-thumb bt-cta"></div><div className="blk-lib-name">CTA Banner</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('cta-form')}><div className="blk-lib-thumb bt-cta-form"></div><div className="blk-lib-name">CTA + Form</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('newsletter')}><div className="blk-lib-thumb bt-newsletter"></div><div className="blk-lib-name">Newsletter</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('popup-cta')}><div className="blk-lib-thumb bt-popup"></div><div className="blk-lib-name">Popup CTA</div></div>
              </div>
              <div className="blk-cat-hdr">Contact</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('contact-form')}><div className="blk-lib-thumb bt-contact"></div><div className="blk-lib-name">Contact Form</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('contact-map')}><div className="blk-lib-thumb bt-map"></div><div className="blk-lib-name">Map + Details</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('faq')}><div className="blk-lib-thumb bt-faq"></div><div className="blk-lib-name">FAQ</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('contact-split')}><div className="blk-lib-thumb bt-contact-split"></div><div className="blk-lib-name">Split Layout</div></div>
              </div>
              <div className="blk-cat-hdr">Footer</div>
              <div className="blk-lib-grid">
                <div className="blk-lib-item" onClick={() => addBlock('footer-simple')}><div className="blk-lib-thumb bt-footer"></div><div className="blk-lib-name">Simple</div></div>
                <div className="blk-lib-item" onClick={() => addBlock('footer-multi')}><div className="blk-lib-thumb bt-footer-multi"></div><div className="blk-lib-name">Multi-column</div></div>
              </div>
            </div>
          </div>

          {/* MEDIA ctx panel */}
          <div id="ctxMedia" className="ctx-panel" style={{display:'none'}}>
            <div className="ctx-hdr">
              <span className="ctx-hdr-title">Media</span>
              <button className="ctx-hdr-btn" onClick={() => loadMediaSidebar()}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>
                Refresh
              </button>
            </div>
            <div id="mediaSidebarGrid" className="msb-grid"></div>
          </div>

          {/* SETTINGS ctx panel */}
          <div id="ctxSettings" className="ctx-panel" style={{display:'none',overflowY:'auto'}}>
            <div className="ctx-hdr">
              <span className="ctx-hdr-title">Settings</span>
            </div>
            <div className="set-group">
              <div className="set-group-hdr">Brand Color</div>
              <div className="swatch-row" id="brandSwatches">
                {['#1553a0','#1d6edf','#0f766e','#7c3aed','#dc2626','#d97706','#16a34a','#0b1f3a'].map(c => (
                  <div key={c} className="swatch" data-c={c} style={{background:c}} onClick={e => applyBrandColor((e.currentTarget as HTMLElement).dataset.c!)}></div>
                ))}
              </div>
              <div className="set-field"><div className="fl">Custom Color</div><input type="color" className="fi" data-key="primaryColor" style={{height:'36px',padding:'2px 4px',cursor:'pointer'}} onInput={e => applyBrandColor((e.target as HTMLInputElement).value)} /></div>
            </div>
            <div className="set-divider"></div>
            <div className="set-group">
              <div className="set-group-hdr">Typography</div>
              <div id="typographyPanel"></div>
            </div>
            <div className="set-divider"></div>
            <div className="set-group">
              <div className="set-group-hdr">Page SEO</div>
              <div className="set-field"><div className="fl">Page Title</div><input className="fi" data-key="seoTitle" placeholder="Page title for search engines" /></div>
              <div className="set-field"><div className="fl">Meta Description</div><textarea className="fi" data-key="seoDesc" placeholder="Brief description for search results" rows={2} style={{resize:'none'}}></textarea></div>
              <div className="set-field"><div className="fl">URL Slug</div><input className="fi" data-key="seoSlug" placeholder="/page-url" /></div>
            </div>
            <div className="set-divider"></div>
            <div className="set-group" style={{paddingBottom:'20px'}}>
              <div className="set-group-hdr">Custom Code</div>
              <div className="set-field">
                <div className="fl">&lt;head&gt; Code</div>
                <div className="set-hint">Load libraries, fonts, meta tags</div>
                <textarea className="fi set-code" data-key="customHead" rows={4}></textarea>
              </div>
              <div className="set-field">
                <div className="fl">&lt;/body&gt; Code</div>
                <div className="set-hint">Scripts, animations, scroll effects</div>
                <textarea className="fi set-code" data-key="customBody" rows={5}></textarea>
              </div>
            </div>
          </div>

        </div>{/* end editor-context */}

        {/* SECTION FIELDS POOL (hidden parking spot) */}
        <div id="secFieldsPool" style={{display:'none'}}>

          {/* Nav */}
          <div id="secFields-nav" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Brand Name</div><input className="fi" data-key="brandName" onInput={e => syncBrand((e.target as HTMLInputElement).value)} /></div>
            <div><div className="fl">Tagline</div><input className="fi" data-key="tagline" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Top Bar</div>
            <div><div className="fl">Email</div><input className="fi" data-key="navEmail" placeholder="contact@company.com" /></div>
            <div><div className="fl">Phone</div><input className="fi" data-key="navPhone" placeholder="+60 3-xxxx xxxx" /></div>
            <div><div className="fl">Location</div><input className="fi" data-key="navLocation" placeholder="City, Country" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Nav Links</div>
            <div><div className="fl">Link 1</div><input className="fi" data-key="navLink1" placeholder="Home" /></div>
            <div><div className="fl">Link 2</div><input className="fi" data-key="navLink2" placeholder="Products" /></div>
            <div><div className="fl">Link 3</div><input className="fi" data-key="navLink3" placeholder="Leave blank to hide" /></div>
            <div><div className="fl">Link 4</div><input className="fi" data-key="navLink4" placeholder="About" /></div>
            <div><div className="fl">Link 5</div><input className="fi" data-key="navLink5" placeholder="Contact" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div><div className="fl">Secondary Button</div><input className="fi" data-key="navSecBtn" placeholder="Leave blank to hide" /></div>
            <div><div className="fl">Primary Button</div><input className="fi" data-key="navCta" /></div>
            <div className="link-config-wrap"><div className="fl" style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)',marginBottom:'4px'}}>Primary Button Link</div><div id="navCta-link-wrap"></div></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="tgl-row"><span className="tgl-lbl">Hamburger menu on mobile/tablet</span><div className="tgl on" data-key="navHamburger" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'navHamburger')}></div></div>
            <div className="tgl-row"><span className="tgl-lbl">Show on this page</span><div className="tgl on" data-key="visNavPage" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visNavPage')}></div></div>
            <div className="tgl-row"><span className="tgl-lbl">Show globally</span><div className="tgl on" data-key="visNav" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'siteNav', 'visNav')}></div></div>
          </div>

          {/* Hero */}
          <div id="secFields-hero" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Badge Text</div><input className="fi" data-key="heroBadge" placeholder="Leave blank to hide" /></div>
            <div><div className="fl">Headline</div><input className="fi" data-key="headline" /></div>
            <div>
              <div className="fl">Headline Size <span id="sizeVal">48px</span></div>
              <input type="range" className="fi" data-key="headlineSize" min="24" max="80" step="2" defaultValue="48" onInput={e => setFontSize((e.target as HTMLInputElement).value)} style={{padding:'0',height:'20px'}} />
            </div>
            <div><div className="fl">Subtext</div><textarea className="fi" data-key="subtext"></textarea></div>
            <div><div className="fl">Button 1</div><input className="fi" data-key="btn1" /></div>
            <div className="link-config-wrap"><div className="fl" style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)',marginBottom:'4px'}}>Button 1 Link</div><div id="btn1-link-wrap"></div></div>
            <div><div className="fl">Button 2</div><input className="fi" data-key="btn2" /></div>
            <div className="link-config-wrap"><div className="fl" style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)',marginBottom:'4px'}}>Button 2 Link</div><div id="btn2-link-wrap"></div></div>
            <div className="tgl-row"><span className="tgl-lbl">Show Stats Bar</span><div className="tgl on" data-key="statsVisible" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'oStats', 'statsVisible')}></div></div>
            <div><div className="fl">Stat 1</div><input className="fi" data-key="stat0" /></div>
            <div><div className="fl">Stat 2</div><input className="fi" data-key="stat1" /></div>
            <div><div className="fl">Stat 3</div><input className="fi" data-key="stat2" /></div>
            <div>
              <div className="fl">Background Color</div>
              <div id="heroSwatches" className="swatch-row" style={{marginBottom:'6px'}}>
                {['#0b1f3a','#1553a0','#0f766e','#7c3aed','#dc2626','#1a0e00'].map(c => (
                  <div key={c} className={`swatch${c === '#0b1f3a' ? ' active' : ''}`} data-c={c} style={{background:c}} onClick={e => setHeroColor(e.currentTarget as HTMLElement)}></div>
                ))}
              </div>
              <input type="color" className="fi" data-key="heroColor" style={{height:'36px',padding:'2px 4px',cursor:'pointer'}} onInput={e => applyHeroColor((e.target as HTMLInputElement).value)} />
            </div>
            <div>
              <div className="fl">Hero Image / Video</div>
              <div className="media-upload-zone" id="heroDz">
                <img className="mthumb" id="heroThumb" style={{display:'none'}} alt="" />
                <div className="muz-btns">
                  <label className="muz-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                    <input type="file" accept="image/*,video/*" style={{display:'none'}} onChange={e => handleHeroMedia(e.nativeEvent)} />
                  </label>
                  <button className="muz-btn" onClick={() => openMediaPicker(url => { STATE.heroImg = url; STATE.heroVideoUrl = null; const th = $('heroThumb') as HTMLImageElement|null; if(th){th.src=url;th.style.display='block'} const oc=$('heroOverlayCtrl');if(oc)oc.style.display='block'; renderHeroOverlayUI(); saveAll();updatePreview();toast('Hero image updated') })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Media
                  </button>
                </div>
              </div>
              <div id="heroOverlayCtrl" style={{display:'none',flexDirection:'column',gap:'6px'}}></div>
              <div style={{marginTop:'6px'}}><button className="mini-btn" onClick={() => clearHeroMedia()}>Remove Media</button></div>
            </div>
            <div className="tgl-row"><span className="tgl-lbl">Show Hero</span><div className="tgl on" data-key="visHero" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sHero', 'visHero')}></div></div>
          </div>

          {/* Trust */}
          <div id="secFields-trust" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Label</div><input className="fi" data-key="trustLabel" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Badges (leave blank to hide)</div>
            {[1,2,3,4,5,6].map(i => <div key={i}><div className="fl">Badge {i}</div><input className="fi" data-key={`trust${i}`} /></div>)}
            <div className="tgl-row"><span className="tgl-lbl">Show Trust Bar</span><div className="tgl on" data-key="visTrust" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sTrust', 'visTrust')}></div></div>
          </div>

          {/* Products / Services */}
          <div id="secFields-products" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="prodEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="prodH2" /></div>
            <div><div className="fl">View All Link</div><input className="fi" data-key="prodViewAll" placeholder="Leave blank to hide" /></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Service Cards (leave name blank to hide)</div>
            {[1,2,3,4,5].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Card {i}</div>
                <div><div className="fl">Name</div><input className="fi" data-key={`prod${i}Name`} /></div>
                <div><div className="fl">Description</div><textarea className="fi" rows={2} data-key={`prod${i}Desc`}></textarea></div>
                <div>
                  <div className="fl">Card Image</div>
                  <div className="media-upload-zone">
                    <div className="muz-btns">
                      <label className="muz-btn">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                        Upload
                        <input type="file" accept="image/*" style={{display:'none'}} onChange={e => { const file = (e.target as HTMLInputElement).files?.[0]; if (file) openCropper(file, `Crop Card ${i} Image`, 4/3, url => { STATE[`prodImg${i}`] = url; saveAll(); updatePreview(); toast(`Card ${i} image updated`) }) }} />
                      </label>
                      <button className="muz-btn" onClick={() => openMediaPicker(url => { STATE[`prodImg${i}`] = url; saveAll(); updatePreview(); toast(`Card ${i} image updated`) })}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        Media
                      </button>
                      <button className="muz-btn" style={{color:'var(--danger)'}} onClick={() => { STATE[`prodImg${i}`] = null; saveAll(); updatePreview(); toast(`Card ${i} image removed`) }}>Remove</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visProducts" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sProducts', 'visProducts')}></div></div>
          </div>

          {/* About */}
          <div id="secFields-about" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Heading</div><input className="fi" data-key="aboutH" /></div>
            <div><div className="fl">Body Copy</div><textarea className="fi" rows={3} data-key="aboutP"></textarea></div>
            <div>
              <div className="fl">Background Color</div>
              <div id="aboutSwatches" className="swatch-row" style={{marginBottom:'6px'}}>
                {['#0b1f3a','#1553a0','#0f766e','#7c3aed','#dc2626','#1a0e00'].map(c => (
                  <div key={c} className={`swatch${c === '#0b1f3a' ? ' active' : ''}`} data-c={c} style={{background:c}} onClick={e => setAboutColor(e.currentTarget as HTMLElement)}></div>
                ))}
              </div>
              <input type="color" className="fi" data-key="aboutColor" style={{height:'36px',padding:'2px 4px',cursor:'pointer'}} onInput={e => applyAboutColor((e.target as HTMLInputElement).value)} />
            </div>
            <div>
              <div className="fl">About Image</div>
              <div className="media-upload-zone">
                <div className="muz-btns">
                  <label className="muz-btn">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    Upload
                    <input type="file" accept="image/*" style={{display:'none'}} onChange={e => handleAboutImg(e.nativeEvent)} />
                  </label>
                  <button className="muz-btn" onClick={() => openMediaPicker(url => { STATE.aboutImg = url; saveAll(); updatePreview(); toast('About image updated') })}>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                    Media
                  </button>
                </div>
              </div>
            </div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Bullet Points (leave blank to hide)</div>
            {[1,2,3,4].map(i => <div key={i}><div className="fl">Bullet {i}</div><input className="fi" data-key={`aboutBullet${i}`} /></div>)}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visAbout" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sAbout', 'visAbout')}></div></div>
          </div>

          {/* Industries / Applications */}
          <div id="secFields-apps" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="appsEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="appsH2" /></div>
            <div><div className="fl">Body Text</div><textarea className="fi" rows={3} data-key="appsBody"></textarea></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Industry Cards (leave title blank to hide)</div>
            {[1,2,3,4,5,6].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Card {i}</div>
                <div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'6px'}}>
                  <div><div className="fl">Icon</div><input className="fi" data-key={`app${i}Icon`} placeholder="🏢" /></div>
                  <div><div className="fl">Title</div><input className="fi" data-key={`app${i}Title`} /></div>
                </div>
                <div><div className="fl">Description</div><textarea className="fi" rows={2} data-key={`app${i}Desc`}></textarea></div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visApps" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sApps', 'visApps')}></div></div>
          </div>

          {/* Contact CTA */}
          <div id="secFields-cta" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Heading</div><input className="fi" data-key="ctaH" /></div>
            <div><div className="fl">Subtext</div><input className="fi" data-key="ctaP" /></div>
            <div><div className="fl">Button 1</div><input className="fi" data-key="ctaBtn1" /></div>
            <div className="link-config-wrap"><div className="fl" style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)',marginBottom:'4px'}}>Button 1 Link</div><div id="ctaBtn1-link-wrap"></div></div>
            <div><div className="fl">Button 2</div><input className="fi" data-key="ctaBtn2" /></div>
            <div className="link-config-wrap"><div className="fl" style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)',marginBottom:'4px'}}>Button 2 Link</div><div id="ctaBtn2-link-wrap"></div></div>
            <div>
              <div className="fl">Background Color</div>
              <div id="ctaSwatches" className="swatch-row" style={{marginBottom:'6px'}}>
                {['#1553a0','#0b1f3a','#0f766e','#7c3aed','#dc2626'].map(c => (
                  <div key={c} className={`swatch${c === '#1553a0' ? ' active' : ''}`} data-c={c} style={{background:c}} onClick={e => setSecColor('sContact', 'ctaSwatches', e.currentTarget as HTMLElement)}></div>
                ))}
              </div>
              <input type="color" className="fi" data-key="ctaColor" style={{height:'36px',padding:'2px 4px',cursor:'pointer'}} onInput={e => { save('ctaColor', (e.target as HTMLInputElement).value); updatePreview() }} />
            </div>
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visContact" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sContact', 'visContact')}></div></div>
          </div>

          {/* Stats Section */}
          <div id="secFields-stats" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Stats (leave blank to hide)</div>
            {[0,1,2,3].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Stat {i+1}</div>
                <div><div className="fl">Number</div><input className="fi" data-key={`statsSec${i}`} placeholder="e.g. 30+" /></div>
                <div><div className="fl">Label</div><input className="fi" data-key={`statsSec${i}L`} placeholder="e.g. Years Experience" /></div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visStatsSec" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visStatsSec')}></div></div>
          </div>

          {/* Testimonials */}
          <div id="secFields-testimonials" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="testimonialsEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="testimonialsH2" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Testimonial Cards</div>
            {[1,2,3].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Card {i}</div>
                <div><div className="fl">Quote</div><textarea className="fi" rows={3} data-key={`test${i}Quote`}></textarea></div>
                <div><div className="fl">Name</div><input className="fi" data-key={`test${i}Name`} placeholder="Full name" /></div>
                <div><div className="fl">Title</div><input className="fi" data-key={`test${i}Title`} placeholder="Job title, Company" /></div>
                <div><div className="fl">Company (for avatar)</div><input className="fi" data-key={`test${i}Co`} placeholder="Company abbreviation" /></div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visTestimonials" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visTestimonials')}></div></div>
          </div>

          {/* Technology */}
          <div id="secFields-tech" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="techEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="techH" /></div>
            <div><div className="fl">Body Copy</div><textarea className="fi" rows={3} data-key="techBody"></textarea></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Feature Cards (4 cards)</div>
            {[1,2,3,4].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Feature {i}</div>
                <div style={{display:'grid',gridTemplateColumns:'60px 1fr',gap:'6px'}}>
                  <div><div className="fl">Icon</div><input className="fi" data-key={`feat${i}Icon`} placeholder="📡" /></div>
                  <div><div className="fl">Name</div><input className="fi" data-key={`feat${i}Name`} /></div>
                </div>
                <div><div className="fl">Description</div><textarea className="fi" rows={2} data-key={`feat${i}Desc`}></textarea></div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visTech" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visTech')}></div></div>
          </div>

          {/* Client Logos */}
          <div id="secFields-clients" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="clientsEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="clientsH2" /></div>
            <div><div className="fl">Subtext</div><input className="fi" data-key="clientsSub" placeholder="Optional tagline below heading" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Client Names (leave blank to hide)</div>
            {[1,2,3,4,5,6,7,8,9,10,11,12].map(i => (
              <div key={i}><div className="fl">Client {i}</div><input className="fi" data-key={`client${i}`} placeholder="Company name" /></div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visClients" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visClients')}></div></div>
          </div>

          {/* FAQ */}
          <div id="secFields-faq" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="faqEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="faqH2" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>FAQ Items (leave question blank to hide)</div>
            {[1,2,3,4,5].map(i => (
              <div key={i}>
                <div style={{height:'1px',background:'var(--border)'}}></div>
                <div className="fl" style={{fontSize:'10px',fontWeight:800,letterSpacing:'.5px',color:'var(--muted)',marginTop:'4px'}}>Q{i}</div>
                <div><div className="fl">Question</div><input className="fi" data-key={`faq${i}Q`} /></div>
                <div><div className="fl">Answer</div><textarea className="fi" rows={3} data-key={`faq${i}A`}></textarea></div>
              </div>
            ))}
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visFaq" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visFaq')}></div></div>
          </div>

          {/* Enquiry Form */}
          <div id="secFields-form" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Eyebrow</div><input className="fi" data-key="formEyebrow" /></div>
            <div><div className="fl">Heading</div><input className="fi" data-key="formH2" /></div>
            <div><div className="fl">Description</div><textarea className="fi" rows={2} data-key="formDesc"></textarea></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Contact Details</div>
            <div><div className="fl">Email</div><input className="fi" data-key="formEmail" placeholder="enquiries@company.com" /></div>
            <div><div className="fl">Phone</div><input className="fi" data-key="formPhone" placeholder="+60 3-xxxx xxxx" /></div>
            <div><div className="fl">Address</div><textarea className="fi" rows={2} data-key="formAddress"></textarea></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div><div className="fl">Submit Button Label</div><input className="fi" data-key="formSubmitLabel" placeholder="Send Enquiry" /></div>
            <div className="tgl-row"><span className="tgl-lbl">Show Section</span><div className="tgl on" data-key="visForm" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visForm')}></div></div>
          </div>

          {/* Footer */}
          <div id="secFields-footer" style={{display:'flex',flexDirection:'column',gap:'9px',padding:'12px'}}>
            <div><div className="fl">Brand Name</div><input className="fi" data-key="footerName" /></div>
            <div><div className="fl">Brand Description</div><textarea className="fi" rows={2} data-key="footerDesc"></textarea></div>
            <div><div className="fl">Copyright Text</div><input className="fi" data-key="footerCopy" /></div>
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Column 2</div>
            <div><div className="fl">Column Title</div><input className="fi" data-key="footerCol2Title" placeholder="Services" /></div>
            {[1,2,3,4,5].map(i => <div key={i}><div className="fl">Link {i}</div><input className="fi" data-key={`footerLink${i}`} placeholder="Leave blank to hide" /></div>)}
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Column 3</div>
            <div><div className="fl">Column Title</div><input className="fi" data-key="footerCol3Title" placeholder="Company" /></div>
            {[1,2,3,4].map(i => <div key={i}><div className="fl">Link {i}</div><input className="fi" data-key={`footerCol3L${i}`} placeholder="Leave blank to hide" /></div>)}
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div className="fl" style={{fontSize:'10px',fontWeight:800,textTransform:'uppercase',letterSpacing:'.5px',color:'var(--muted)'}}>Column 4</div>
            <div><div className="fl">Column Title</div><input className="fi" data-key="footerCol4Title" placeholder="Contact" /></div>
            {[1,2,3,4].map(i => <div key={i}><div className="fl">Link {i}</div><input className="fi" data-key={`footerCol4L${i}`} placeholder="Leave blank to hide" /></div>)}
            <div style={{height:'1px',background:'var(--border)'}}></div>
            <div>
              <div className="fl">Background Color</div>
              <div id="footerSwatches" className="swatch-row" style={{marginBottom:'6px'}}>
                {['#0B1628','#1A3FFF','#111827','#0f766e','#7c3aed'].map(c => (
                  <div key={c} className={`swatch${c === '#0B1628' ? ' active' : ''}`} data-c={c} style={{background:c}} onClick={e => setSecColor('sFooter', 'footerSwatches', e.currentTarget as HTMLElement)}></div>
                ))}
              </div>
              <input type="color" className="fi" data-key="footerColor" style={{height:'36px',padding:'2px 4px',cursor:'pointer'}} onInput={e => { save('footerColor', (e.target as HTMLInputElement).value); updatePreview() }} />
            </div>
            <div className="tgl-row"><span className="tgl-lbl">Show on this page</span><div className="tgl on" data-key="visFooterPage" onClick={e => toggleSection(e.currentTarget as HTMLElement, '', 'visFooterPage')}></div></div>
            <div className="tgl-row"><span className="tgl-lbl">Show globally</span><div className="tgl on" data-key="visFooter" onClick={e => toggleSection(e.currentTarget as HTMLElement, 'sFooter', 'visFooter')}></div></div>
          </div>
        </div>

        {/* PREVIEW */}
        <div className="preview-area">
          <div className="browser-bar">
            <div className="bdots">
              <div className="bdot" style={{background:'#ff5f57'}}></div>
              <div className="bdot" style={{background:'#ffbd2e'}}></div>
              <div className="bdot" style={{background:'#28ca42'}}></div>
            </div>
            <div className="url-bar">https://www.furutech.com</div>
            <span className="vbadge" id="vBadge">Desktop</span>
          </div>
          <div className="frame-wrap">
            <div className="frame" id="previewFrame">
              <iframe id="siteFrame" style={{width:'100%',height:'100%',border:'none',display:'block'}}></iframe>
            </div>
          </div>
        </div>

        {/* PROPERTIES PANEL (right, slides in when section selected) */}
        <div className="editor-props" id="propsPanel">
          <div className="props-hdr">
            <span className="props-title" id="propsTitle">Section</span>
            <button id="editorRemoveBtn" className="props-remove" onClick={() => removeSection()}>Remove</button>
            <button className="props-close" onClick={() => closeEditor()} title="Close">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div id="editorContent" className="editor-content"></div>
        </div>

      </div>{/* end editor-body */}

      {/* MEDIA PICKER OVERLAY */}
      <div id="mediaPickerOverlay" style={{display:'none',position:'fixed',inset:0,zIndex:900,background:'rgba(11,31,58,.55)',backdropFilter:'blur(3px)',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'#fff',borderRadius:'12px',width:'860px',maxWidth:'95vw',maxHeight:'85vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:'0 20px 60px rgba(0,0,0,.25)'}}>
          <div style={{padding:'16px 20px',borderBottom:'1px solid var(--border)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0}}>
            <span style={{fontWeight:700,fontSize:'15px'}}>Media Library</span>
            <button onClick={() => closeMediaPicker()} style={{background:'none',border:'none',cursor:'pointer',fontSize:'18px',color:'var(--muted)',lineHeight:1}}>✕</button>
          </div>
          <div id="mediaPickerGrid" className="mpk-grid"></div>
        </div>
      </div>

      {/* CROP MODAL */}
      <div className="crop-overlay" id="cropOverlay">
        <div className="crop-modal">
          <div className="crop-topbar">
            <div className="crop-title" id="cropTitle">Crop Image</div>
            <button className="crop-close" onClick={() => closeCropper()}>✕</button>
          </div>
          <div className="crop-body">
            <div className="crop-canvas-wrap">
              <img id="cropImg" alt="" />
            </div>
            <div className="crop-sidebar">
              <div>
                <div className="crop-section-lbl">Aspect Ratio</div>
                <div className="crop-ratio-grid">
                  {[['Free',NaN],['1:1',1],['16:9',16/9],['4:3',4/3],['3:2',3/2],['2:1',2]].map(([label, ratio]) => (
                    <button key={String(label)} className="crop-ratio-btn" data-ratio={String(ratio)} onClick={e => setCropRatio(Number(ratio), e.currentTarget as HTMLElement)}>{label}</button>
                  ))}
                </div>
              </div>
              <div>
                <div className="crop-section-lbl">Actions</div>
                <div className="crop-action-row">
                  <button className="crop-icon-btn" onClick={() => cropperInst?.rotate(-90)}>↺ Rotate</button>
                  <button className="crop-icon-btn" onClick={() => cropperInst?.scaleX(cropperInst.getData().scaleX === -1 ? 1 : -1)}>↔ Flip</button>
                </div>
              </div>
              <div>
                <div className="crop-slider-lbl">Zoom <span id="cropZoomLbl">100%</span></div>
                <input type="range" className="crop-slider" id="cropZoomSlider" min="-0.5" max="2" step="0.05" defaultValue="0" onInput={e => onCropZoom((e.target as HTMLInputElement).value)} />
              </div>
              <div>
                <div className="crop-slider-lbl">Quality <span id="cropQualityLbl">85%</span></div>
                <input type="range" className="crop-slider" id="cropQualitySlider" min="30" max="100" step="5" defaultValue="85" onInput={e => { const lbl = $('cropQualityLbl'); if(lbl) lbl.textContent = (e.target as HTMLInputElement).value + '%' }} />
              </div>
            </div>
          </div>
          <div className="crop-footer">
            <button className="crop-cancel" onClick={() => closeCropper()}>Cancel</button>
            <button className="crop-apply" onClick={() => applyCrop()}>Apply Crop</button>
          </div>
        </div>
      </div>

      {/* PUBLISH MODAL */}
      <div id="pubModal" style={{display:'none',position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.55)',alignItems:'center',justifyContent:'center'}}>
        <div style={{background:'#fff',borderRadius:'14px',padding:'32px',width:'100%',maxWidth:'480px',boxShadow:'0 20px 60px rgba(0,0,0,.25)',fontFamily:"'Inter',sans-serif"}}>
          <div style={{display:'flex',alignItems:'center',gap:'10px',marginBottom:'20px'}}>
            <div style={{width:'36px',height:'36px',background:'#16a34a',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <div>
              <div style={{fontSize:'16px',fontWeight:'800',color:'#0b1f3a'}}>Site Published</div>
              <div style={{fontSize:'12px',color:'#6b7a96'}}>Your site is live and publicly accessible</div>
            </div>
            <button onClick={() => closePubModal()} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'#6b7a96',fontSize:'18px',lineHeight:1}}>✕</button>
          </div>
          <div style={{background:'#f4f5f7',borderRadius:'8px',padding:'12px 14px',display:'flex',alignItems:'center',gap:'10px',marginBottom:'16px'}}>
            <span id="pubModalUrl" style={{flex:1,fontSize:'12px',color:'#0b1f3a',wordBreak:'break-all',fontFamily:"'DM Mono',monospace"}}></span>
          </div>
          <div style={{display:'flex',gap:'8px'}}>
            <button onClick={() => copyPubUrl()} style={{flex:1,padding:'10px',background:'#0b1f3a',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer'}}>
              Copy URL
            </button>
            <a id="pubModalLink" href="#" target="_blank" rel="noopener noreferrer" style={{flex:1,padding:'10px',background:'#1553a0',color:'#fff',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer',textDecoration:'none',display:'flex',alignItems:'center',justifyContent:'center',gap:'6px'}}>
              Open Site
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </div>
        </div>
      </div>

      {/* IMPORT MODAL */}
      <div id="importModal" style={{display:'none',position:'fixed',inset:0,zIndex:9999,background:'rgba(0,0,0,.6)',alignItems:'center',justifyContent:'center'}} onClick={e => { if (e.target === e.currentTarget) closeImport() }}>
        <div style={{background:'#fff',borderRadius:'14px',width:'100%',maxWidth:'680px',boxShadow:'0 20px 60px rgba(0,0,0,.3)',fontFamily:"'Inter',sans-serif",display:'flex',flexDirection:'column',maxHeight:'80vh'}}>
          <div style={{padding:'24px 28px 16px',borderBottom:'1px solid #e8edf5',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
            <div style={{width:'36px',height:'36px',background:'#1553a0',borderRadius:'8px',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div>
              <div style={{fontSize:'16px',fontWeight:'800',color:'#0b1f3a'}}>Import HTML</div>
              <div style={{fontSize:'12px',color:'#6b7a96'}}>Paste HTML built by Claude — content will be extracted and loaded into the editor</div>
            </div>
            <button onClick={() => closeImport()} style={{marginLeft:'auto',background:'none',border:'none',cursor:'pointer',color:'#6b7a96',fontSize:'20px',lineHeight:1,flexShrink:0}}>✕</button>
          </div>
          <div style={{padding:'20px 28px',flex:1,overflow:'hidden',display:'flex',flexDirection:'column',gap:'12px'}}>
            <div id="importFileList" style={{display:'none',flexWrap:'wrap',gap:'6px',padding:'10px 14px',background:'#f0f5ff',border:'1px solid #c7d9f5',borderRadius:'8px',alignItems:'center'}}>
              <span style={{fontSize:'10px',fontWeight:700,textTransform:'uppercase',letterSpacing:'.6px',color:'#1553a0',marginRight:'4px'}}>Websites folder:</span>
            </div>
            <textarea id="importTA" placeholder="Paste your full HTML here…" style={{flex:1,minHeight:'280px',width:'100%',padding:'12px',border:'1.5px solid #dde3ed',borderRadius:'8px',fontSize:'12px',fontFamily:"'DM Mono',monospace",resize:'none',outline:'none',lineHeight:1.5,color:'#0b1f3a',background:'#fafbfc'}} onFocus={e => (e.target as HTMLTextAreaElement).style.borderColor='#1553a0'} onBlur={e => (e.target as HTMLTextAreaElement).style.borderColor='#dde3ed'}></textarea>
          </div>
          <div style={{padding:'16px 28px 24px',borderTop:'1px solid #e8edf5',display:'flex',alignItems:'center',gap:'12px',flexShrink:0}}>
            <span id="importStatus" style={{fontSize:'12px',flex:1}}></span>
            <button onClick={() => closeImport()} style={{padding:'9px 20px',background:'#f4f5f7',border:'1px solid #e0e6f0',borderRadius:'7px',fontSize:'13px',fontWeight:600,cursor:'pointer',color:'#0b1f3a'}}>Cancel</button>
            <button onClick={() => parseAndImportHTML()} style={{padding:'9px 22px',background:'#1553a0',color:'#fff',border:'none',borderRadius:'7px',fontSize:'13px',fontWeight:700,cursor:'pointer',display:'flex',alignItems:'center',gap:'6px'}} onMouseOver={e => (e.currentTarget as HTMLElement).style.background='#0b1f3a'} onMouseOut={e => (e.currentTarget as HTMLElement).style.background='#1553a0'}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import
            </button>
          </div>
        </div>
      </div>

      {/* FULL-SCREEN PREVIEW MODAL */}
      <div id="fullPreviewModal" style={{display:'none',position:'fixed',inset:0,zIndex:9998,background:'#0d0d12',flexDirection:'column'}}>
        {/* Preview topbar */}
        <div style={{height:'52px',background:'rgba(255,255,255,.04)',borderBottom:'1px solid rgba(255,255,255,.08)',display:'flex',alignItems:'center',padding:'0 16px',gap:'8px',flexShrink:0}}>
          <button onClick={() => closeFullPreview()} style={{padding:'6px 10px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:'6px',color:'rgba(255,255,255,.7)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px'}} title="Close (Esc)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>Close
          </button>
          <div style={{width:'1px',height:'20px',background:'rgba(255,255,255,.1)',margin:'0 4px'}}></div>
          {PREVIEW_SIZES.map((s, i) => (
            <button key={i} className="pv-size-btn" onClick={() => applyPreviewSize(i)}
              style={{padding:'5px 12px',background:'transparent',border:'1px solid rgba(255,255,255,.1)',borderRadius:'6px',color:'rgba(255,255,255,.5)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px',transition:'all .15s'}}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" dangerouslySetInnerHTML={{__html:s.icon}}></svg>
              {s.label}
            </button>
          ))}
          <span id="pvSizeLbl" style={{fontSize:'11px',color:'rgba(255,255,255,.3)',marginLeft:'4px'}}>Full Width</span>
          <div style={{flex:1}}></div>
          <button onClick={() => pvOpenExternal()} style={{padding:'6px 12px',background:'rgba(255,255,255,.08)',border:'1px solid rgba(255,255,255,.12)',borderRadius:'6px',color:'rgba(255,255,255,.6)',cursor:'pointer',fontSize:'12px',fontWeight:600,display:'flex',alignItems:'center',gap:'5px'}}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>Open in Tab
          </button>
        </div>
        {/* Preview canvas */}
        <div style={{flex:1,display:'flex',alignItems:'flex-start',justifyContent:'center',overflow:'auto',padding:'32px 24px'}}>
          <div id="fullPreviewWrap" style={{width:'100%',maxWidth:'100%',height:'100%',minHeight:'600px',background:'#fff',flexShrink:0,transition:'width .25s ease, box-shadow .25s ease',overflow:'hidden'}}>
            <iframe id="fullPreviewFrame" style={{width:'100%',height:'100%',minHeight:'600px',border:'none',display:'block'}}></iframe>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div className="toast" id="toastEl">
        <span id="toastMsg"></span>
      </div>
    </>
  )
}
