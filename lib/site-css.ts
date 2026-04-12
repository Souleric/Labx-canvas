// CSS injected into the iframe preview — Furutech Logistics design
const SITE_CSS = `
:root{
  --navy:#0B1628;--navy-2:#111E35;--navy-3:#162340;--navy-4:#1D2E50;--navy-5:#243660;
  --accent:#1A3FFF;--accent-2:#1230D6;
  --white:#FFFFFF;--off-white:#F6F7F9;--light:#EEF0F5;
  --muted:#6B7280;--muted-dark:#8892A4;--text-dark:#0B1628;--text-body-light:#4B5563;
  --border-light-bg:#E5E7EB;--border-dark:rgba(255,255,255,0.10);
  --font-display:'Barlow Condensed','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --font-heading:'Barlow','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --font-body:'Inter','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --font-ui:'Inter','Apple Color Emoji','Segoe UI Emoji','Noto Color Emoji',sans-serif;
  --font-mono:'DM Mono','Courier New',monospace;
}
body{font-family:var(--font-body);background:var(--white);color:var(--text-dark);font-size:15px;line-height:1.6;overflow-x:hidden}
.tag{font-size:11px;font-weight:500;letter-spacing:2px;text-transform:uppercase;color:var(--muted);margin-bottom:16px;display:block}
.tag::before{content:'/ ';color:var(--accent)}

/* ── NAV ── */
nav{position:sticky;top:0;left:0;right:0;z-index:1000;background:rgba(255,255,255,0.97);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);border-bottom:1px solid var(--border-light-bg)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:64px;padding:0 40px;max-width:1400px;margin:0 auto}
.nav-logo{font-size:18px;font-weight:700;letter-spacing:-0.3px;color:var(--navy);text-decoration:none;font-family:var(--font-ui)}
.nav-links{display:flex;gap:36px;list-style:none}
.nav-links a{text-decoration:none;font-size:13px;font-weight:500;color:var(--muted);transition:color 0.2s;cursor:pointer;font-family:var(--font-ui)}
.nav-links a:hover{color:var(--navy)}
.nav-actions{display:flex;gap:10px;align-items:center}
.btn-ghost{background:transparent;border:1px solid var(--border-light-bg);color:var(--navy);padding:7px 20px;border-radius:4px;font-size:13px;font-weight:500;cursor:pointer;transition:border-color 0.2s,background 0.2s;font-family:var(--font-ui)}
.btn-ghost:hover{background:var(--off-white);border-color:#C5C9D4}
.btn-primary-nav{background:var(--navy);border:1px solid var(--navy);color:var(--white);padding:7px 20px;border-radius:4px;font-size:13px;font-weight:600;cursor:pointer;transition:background 0.2s;font-family:var(--font-ui)}
.btn-primary-nav:hover{background:var(--navy-3)}
/* hamburger */
.nav-hamburger{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px;z-index:10;-webkit-tap-highlight-color:transparent}
.nav-hamburger span{display:block;width:22px;height:2px;background:var(--navy);border-radius:2px;transition:transform .22s ease,opacity .18s ease}
.nav-mobile-menu{display:none;border-top:1px solid var(--border-light-bg);background:rgba(255,255,255,0.98);padding:16px 24px 24px}
.nav-mobile-menu ul{list-style:none;margin:0 0 16px}
.nav-mobile-menu ul li{border-bottom:1px solid var(--border-light-bg)}
.nav-mobile-menu ul li a{display:block;padding:11px 0;font-size:14px;font-weight:500;color:var(--navy);cursor:pointer}
.nav-mobile-menu .btn-ghost,.nav-mobile-menu .btn-primary-nav{width:100%;text-align:center;justify-content:center;margin-top:8px;padding:10px 20px}
@media(max-width:900px){
  .nav-hamburger{display:flex}
  .nav-links{display:none}
  .nav-actions{display:none}
  .nav-inner{padding:0 20px}
}
nav.mobile-open .nav-mobile-menu{display:block}
nav.mobile-open .nav-hamburger span:nth-child(1){transform:translateY(7px) rotate(45deg)}
nav.mobile-open .nav-hamburger span:nth-child(2){opacity:0;transform:scaleX(0)}
nav.mobile-open .nav-hamburger span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* ── HERO ── */
.hero{min-height:100vh;display:flex;flex-direction:column;justify-content:flex-end;position:relative;overflow:hidden}
.hero-bg{position:absolute;inset:0;background:linear-gradient(180deg,transparent 0%,transparent 50%,rgba(11,22,40,0.6) 80%,var(--navy) 100%);z-index:1}
.hero-img-placeholder{position:absolute;inset:0;background:linear-gradient(135deg,#1D2E50 0%,#0D1F3C 40%,#162340 70%,#0B1628 100%);z-index:0;display:flex;align-items:center;justify-content:center;overflow:hidden}
.hero-img-placeholder::before{content:'';position:absolute;width:800px;height:800px;background:radial-gradient(ellipse,rgba(58,123,255,0.12) 0%,transparent 65%);top:50%;left:60%;transform:translate(-50%,-50%)}
.container-graphic{position:absolute;right:5%;bottom:15%;width:520px;opacity:0.85}
.container-row{display:flex;gap:8px;margin-bottom:8px}
.container-box{height:80px;border-radius:4px;border:1px solid rgba(255,255,255,0.15);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.35);position:relative;overflow:hidden}
.container-box::after{content:'';position:absolute;top:0;bottom:0;left:25%;right:25%;border-left:1px solid rgba(255,255,255,0.08);border-right:1px solid rgba(255,255,255,0.08)}
.c1{flex:2;background:#1E3A5F}.c2{flex:1.5;background:#162E4E}.c3{flex:1;background:#0F2238}
.c4{flex:1.5;background:#1A3558}.c5{flex:2.5;background:#152B4A}.c6{flex:1;background:#0D1E35}
.c-label{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:3px;color:rgba(255,255,255,0.25);white-space:nowrap}
.hero-content{position:relative;z-index:2;padding:0 40px 80px;max-width:1200px;margin:0 auto;width:100%;display:grid;grid-template-columns:1fr 1fr;align-items:flex-end;gap:60px}
.hero-headline{font-size:clamp(48px,6vw,88px);font-weight:800;line-height:1.0;letter-spacing:-2.5px;color:var(--white);font-family:var(--font-display)}
.hero-headline em{font-style:normal;color:var(--accent)}
.hero-right{padding-bottom:12px}
.hero-body{font-size:15px;font-weight:300;color:rgba(255,255,255,0.70);line-height:1.8;margin-bottom:32px;max-width:380px;font-family:var(--font-body)}
.btn-learn{display:inline-flex;align-items:center;gap:10px;background:var(--white);color:var(--navy);padding:13px 28px;border-radius:4px;font-size:14px;font-weight:700;cursor:pointer;border:none;transition:background 0.2s,transform 0.2s;text-decoration:none}
.btn-learn:hover{background:var(--off-white);transform:translateY(-1px)}
.btn-learn .arrow{width:20px;height:20px;background:var(--navy);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;flex-shrink:0;color:white}
.hero-scroll{position:absolute;bottom:30px;left:50%;transform:translateX(-50%);z-index:2;display:flex;flex-direction:column;align-items:center;gap:6px}
.scroll-line{width:1px;height:48px;background:linear-gradient(180deg,transparent,var(--accent),transparent);animation:scrollPulse 2s ease infinite}
@keyframes scrollPulse{0%,100%{opacity:0.3;transform:scaleY(0.8)}50%{opacity:1;transform:scaleY(1)}}
@media(max-width:900px){.hero-content{grid-template-columns:1fr;gap:32px;padding:0 24px 60px}.container-graphic{display:none}}

/* ── STATS BAR ── */
.stats-bar{background:var(--white);border-top:1px solid var(--border-light-bg);border-bottom:1px solid var(--border-light-bg)}
.stats-inner{display:grid;grid-template-columns:repeat(4,1fr);max-width:1200px;margin:0 auto;padding:0 40px}
.stat-item{padding:28px 0;border-right:1px solid var(--border-light-bg);text-align:center}
.stat-item:last-child{border-right:none}
.stat-num{font-size:36px;font-weight:800;color:var(--navy);line-height:1;margin-bottom:4px;font-family:var(--font-mono)}
.stat-num span{color:var(--accent)}
.stat-desc{font-size:13px;color:var(--muted)}

/* ── SERVICES / LOGISTICS ── */
.section-logistics{padding:80px 0;background:var(--white)}
.section-head{display:flex;align-items:flex-end;justify-content:space-between;margin-bottom:40px;padding:0 40px;max-width:1200px;margin-left:auto;margin-right:auto}
.section-title{font-size:clamp(28px,4vw,48px);font-weight:800;letter-spacing:-1.5px;line-height:1.05;color:var(--navy);font-family:var(--font-heading)}
.btn-see-all{background:transparent;border:1px solid var(--border-light-bg);color:var(--navy);padding:10px 24px;border-radius:4px;font-size:13px;font-weight:500;cursor:pointer;white-space:nowrap;transition:background 0.2s,border-color 0.2s}
.btn-see-all:hover{background:var(--off-white);border-color:#C5C9D4}
.services-grid{display:grid;grid-template-columns:1fr 1fr;grid-template-rows:auto;gap:2px;max-width:1200px;margin:0 auto;padding:0 40px}
.service-card{position:relative;overflow:hidden;cursor:pointer;background:var(--navy-3);min-height:260px}
.service-card:first-child{grid-row:span 2}
@media(max-width:700px){.services-grid{grid-template-columns:1fr}.service-card:first-child{grid-row:span 1}}
.service-card-img{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:0.12;transition:transform 0.5s ease,opacity 0.3s}
.service-card:hover .service-card-img{transform:scale(1.08);opacity:0.18}
.service-card-photo{opacity:1}
.service-card-photo img{width:100%;height:100%;object-fit:cover;display:block}
.service-card:hover .service-card-photo{transform:scale(1.05)}
.service-card-overlay{position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(11,22,40,0.9) 100%)}
.service-card-body{position:absolute;bottom:0;left:0;right:0;padding:24px;z-index:2}
.service-card-title{font-size:20px;font-weight:700;color:var(--white);margin-bottom:6px}
.service-card-desc{font-size:12px;color:rgba(255,255,255,0.55);line-height:1.5;max-width:280px}
.service-card-link{display:inline-flex;align-items:center;gap:6px;margin-top:10px;font-size:12px;font-weight:600;color:var(--accent);cursor:pointer;transition:gap 0.2s}
.service-card:hover .service-card-link{gap:10px}
.sc-ship{background:linear-gradient(135deg,#0D3060,#0B1E42)}
.sc-ware{background:linear-gradient(135deg,#1A2E55,#091830)}
.sc-last{background:linear-gradient(135deg,#0F2850,#0A1A38)}
.sc-sup{background:linear-gradient(135deg,#18285C,#0C1A3A)}
.sc-cust{background:linear-gradient(135deg,#142448,#0B1628)}

/* ── INDUSTRIES ── */
.section-industries{padding:80px 0;background:var(--off-white)}
.industries-layout{display:grid;grid-template-columns:320px 1fr;gap:60px;align-items:start;max-width:1200px;margin:0 auto;padding:0 40px}
.industries-title{font-size:clamp(24px,3vw,40px);font-weight:800;letter-spacing:-1.5px;line-height:1.1;margin-bottom:16px;color:var(--navy);font-family:var(--font-heading)}
.industries-body{font-size:14px;color:var(--text-body-light);line-height:1.8;margin-bottom:28px}
.slider-controls{display:flex;gap:8px}
.slider-btn{width:36px;height:36px;border-radius:50%;border:1px solid var(--border-light-bg);background:var(--white);color:var(--navy);font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:background 0.2s,border-color 0.2s}
.slider-btn:hover{background:var(--navy);color:var(--white);border-color:var(--navy)}
.industries-cards{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}
.industry-card{background:var(--white);border:1px solid var(--border-light-bg);border-radius:8px;padding:20px 16px;cursor:pointer;transition:border-color 0.2s,background 0.2s,transform 0.2s,box-shadow 0.2s;position:relative}
.industry-card:hover{border-color:var(--navy);box-shadow:0 4px 16px rgba(11,22,40,0.10);transform:translateY(-3px)}
.industry-card.active{background:var(--navy);border-color:var(--navy)}
.industry-card.active .industry-name{color:var(--white)}
.industry-card.active .industry-desc{color:rgba(255,255,255,0.55)}
.industry-card.active .ind-icon{background:rgba(255,255,255,0.12)}
.ind-icon{width:40px;height:40px;background:var(--off-white);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:14px;transition:background 0.2s}
.industry-name{font-size:14px;font-weight:700;color:var(--navy);margin-bottom:6px;line-height:1.3}
.industry-desc{font-size:12px;color:var(--muted);line-height:1.6}
@media(min-width:1100px){.industries-cards{grid-template-columns:repeat(4,1fr)}}
@media(max-width:900px){.industries-layout{grid-template-columns:1fr;gap:40px}.industries-cards{grid-template-columns:repeat(2,1fr)}}

/* ── TECHNOLOGY ── */
.section-tech{padding:80px 0;background:var(--white)}
.tech-layout{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;max-width:1200px;margin:0 auto;padding:0 40px}
@media(max-width:900px){.tech-layout{grid-template-columns:1fr}}
.tech-title{font-size:clamp(28px,3.5vw,44px);font-weight:800;letter-spacing:-1.5px;line-height:1.05;margin-bottom:16px;color:var(--navy);font-family:var(--font-heading)}
.tech-body-text{font-size:14px;color:var(--text-body-light);line-height:1.8;margin-bottom:28px}
.tech-img-block{background:var(--light);border:1px solid var(--border-light-bg);border-radius:12px;aspect-ratio:4/3;display:flex;align-items:center;justify-content:center;font-size:80px;opacity:0.5;overflow:hidden;position:relative}
.tech-img-block::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(26,63,255,0.07) 0%,transparent 60%)}
.tech-features{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.feature-card{background:var(--off-white);border:1px solid var(--border-light-bg);border-radius:8px;padding:24px;transition:border-color 0.2s,background 0.2s,box-shadow 0.2s,transform 0.2s;cursor:pointer}
.feature-card:hover{border-color:var(--navy);background:var(--white);box-shadow:0 4px 16px rgba(11,22,40,0.08);transform:translateY(-2px)}
.feature-icon{font-size:22px;margin-bottom:12px;display:block}
.feature-name{font-size:15px;font-weight:700;color:var(--navy);margin-bottom:8px}
.feature-desc{font-size:12px;color:var(--muted);line-height:1.6;margin-bottom:12px}
.feature-link{font-size:12px;font-weight:600;color:var(--accent);display:inline-flex;align-items:center;gap:5px;cursor:pointer;transition:gap 0.2s}
.feature-card:hover .feature-link{gap:8px}

/* ── CTA BAND ── */
.cta-band{padding:72px 40px;text-align:center;position:relative;overflow:hidden}
.cta-band::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(circle,rgba(255,255,255,0.1) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%)}
.cta-title{font-size:clamp(28px,4vw,52px);font-weight:800;color:white;letter-spacing:-1.5px;margin-bottom:16px;position:relative;z-index:1;font-family:var(--font-heading)}
.cta-sub{font-size:16px;color:rgba(255,255,255,0.75);margin-bottom:36px;position:relative;z-index:1}
.cta-btns{display:flex;gap:12px;justify-content:center;position:relative;z-index:1}
.btn-white{display:inline-flex;align-items:center;background:white;color:var(--accent);border:none;padding:13px 32px;border-radius:4px;font-size:14px;font-weight:700;cursor:pointer;transition:background 0.2s,transform 0.2s;text-decoration:none;font-family:var(--font-ui)}
.btn-white:hover{background:var(--off-white);transform:translateY(-1px)}
.btn-outline-white{display:inline-flex;align-items:center;background:transparent;color:white;border:2px solid rgba(255,255,255,0.5);padding:13px 32px;border-radius:4px;font-size:14px;font-weight:700;cursor:pointer;transition:border-color 0.2s,background 0.2s;text-decoration:none;font-family:var(--font-ui)}
.btn-outline-white:hover{border-color:white;background:rgba(255,255,255,0.1)}

/* ── FOOTER ── */
footer.site-footer{border-top:1px solid var(--border-dark);padding:60px 40px 32px}
.footer-grid{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:48px;max-width:1200px;margin:0 auto 48px}
@media(max-width:900px){.footer-grid{grid-template-columns:1fr 1fr;gap:32px}}
@media(max-width:600px){.footer-grid{grid-template-columns:1fr}}
.footer-brand-name{font-size:18px;font-weight:700;letter-spacing:-0.3px;color:var(--white);margin-bottom:12px;display:block}
.footer-desc{font-size:13px;color:var(--muted-dark);line-height:1.7;max-width:260px}
.footer-col-title{font-size:13px;font-weight:700;color:var(--white);letter-spacing:1px;margin-bottom:16px}
.footer-links-list{list-style:none}
.footer-links-list li{margin-bottom:10px}
.footer-links-list a{font-size:13px;color:var(--muted-dark);text-decoration:none;cursor:pointer;transition:color 0.2s}
.footer-links-list a:hover{color:var(--white)}
.footer-bottom{max-width:1200px;margin:0 auto;padding-top:24px;border-top:1px solid var(--border-dark);display:flex;justify-content:space-between;align-items:center}
.footer-copy{font-size:12px;color:var(--muted-dark)}
`;

export default SITE_CSS;
