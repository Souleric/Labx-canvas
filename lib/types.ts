export interface SiteState {
  // Brand
  brandName: string
  tagline: string
  primaryColor: string
  bodyFont: string

  // Nav
  navCta: string
  navEmail: string
  navPhone: string
  navLocation: string
  navLink1: string
  navLink2: string
  navLink3: string
  navLink4: string
  navLink5: string
  navSecBtn: string

  // Hero
  heroBadge: string
  headline: string
  headlineFont: string
  headlineSize: number
  subtext: string
  btn1: string
  btn2: string
  heroColor: string
  heroImg: string | null
  heroOverlayOpacity: number
  statsVisible: boolean
  stat0: string
  stat1: string
  stat2: string

  // Trust
  visTrust: boolean
  trustLabel: string
  trust1: string
  trust2: string
  trust3: string
  trust4: string
  trust5: string
  trust6: string

  // Products
  visProducts: boolean
  prodEyebrow: string
  prodH2: string
  prodViewAll: string
  prodEnquireBtn: string
  prod1Name: string; prod1Desc: string; prod1Tag: string; prodImg1: string | null
  prod2Name: string; prod2Desc: string; prod2Tag: string; prodImg2: string | null
  prod3Name: string; prod3Desc: string; prod3Tag: string; prodImg3: string | null
  prod4Name: string; prod4Desc: string; prod4Tag: string; prodImg4: string | null

  // About
  visAbout: boolean
  aboutH: string
  aboutP: string
  aboutColor: string
  aboutImg: string | null
  aboutBullet1: string
  aboutBullet2: string
  aboutBullet3: string
  aboutBullet4: string

  // Applications
  visApps: boolean
  appsEyebrow: string
  appsH2: string
  app1Icon: string; app1Title: string; app1Desc: string
  app2Icon: string; app2Title: string; app2Desc: string
  app3Icon: string; app3Title: string; app3Desc: string
  app4Icon: string; app4Title: string; app4Desc: string
  app5Icon: string; app5Title: string; app5Desc: string
  app6Icon: string; app6Title: string; app6Desc: string

  // CTA
  visContact: boolean
  ctaH: string
  ctaP: string
  ctaBtn1: string
  ctaBtn2: string
  ctaColor: string

  // Footer
  visFooter: boolean
  footerName: string
  footerAddr: string
  footerColor: string
  footerLink1: string
  footerLink2: string
  footerLink3: string
  footerLink4: string

  // SEO
  seoTitle: string
  seoDesc: string
  seoSlug: string

  // Custom code
  customHead: string
  customBody: string

  // Section order (per page)
  sections: string[]

  // Visibility
  visNav: boolean
  visHero: boolean
  visFooter2?: boolean
}

export interface Client {
  id: string
  user_id: string
  name: string
  slug: string
  industry: string | null
  created_at: string
}

export interface SiteStateRow {
  id: string
  client_id: string
  state: SiteState
  updated_at: string
}
