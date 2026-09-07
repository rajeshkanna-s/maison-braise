import React, { useState, useEffect, useRef } from 'react';
import {
  Flame,
  CalendarBlank as Calendar,
  Users,
  Clock,
  ArrowRight,
  Plus,
  CheckCircle,
  X,
  SpeakerHigh as Volume2,
  SpeakerSimpleSlash as VolumeX,
  Sparkle as Sparkles,
  Compass,
  Wine,
  List as MenuIcon,
  Medal as Award
} from '@phosphor-icons/react';

const MENU_ITEMS = [
  {
    id: 'scallop',
    name: 'Seared Scallop',
    category: 'starters',
    description: 'Celeriac Purée, Brown Butter',
    fullDetail: 'Hand-dived Atlantic sea scallops caramelized over white oak embers, served atop silky celeriac purée, infused hazelnut brown butter, and crisp samphire.',
    price: '$26',
    image: './images/menu-scallops.png',
    pairing: '2021 Domaine Leflaive Puligny-Montrachet',
    origin: 'Isle of Skye, Scotland',
    allergens: 'Molluscs, Dairy'
  },
  {
    id: 'octopus',
    name: 'Charred Octopus',
    category: 'starters',
    description: 'Smoked Paprika, Lemon Oil',
    fullDetail: 'Galician octopus slow-braised for 6 hours then flash-seared over glowing binchotan charcoal. Dressed with smoked pimentón de la Vera, confit garlic cream, and cold-pressed citrus oil.',
    price: '$28',
    image: './images/menu-octopus.png',
    pairing: '2020 Albariño de Fefiñanes',
    origin: 'Rías Baixas, Spain',
    allergens: 'Molluscs'
  },
  {
    id: 'wagyu',
    name: 'Wagyu Bavette',
    category: 'mains',
    description: 'Fermented Garlic, Jus',
    fullDetail: 'Kagoshima A5 Wagyu flank rested over smoldering applewood embers. Glazed in 30-day black fermented garlic jus and served with charred baby leeks and bone marrow reduction.',
    price: '$46',
    image: './images/menu-wagyu.png',
    pairing: '2018 Château Pontet-Canet Pauillac',
    origin: 'Kagoshima Prefecture, Japan',
    allergens: 'None'
  },
  {
    id: 'chocolate',
    name: 'Dark Chocolate Torte',
    category: 'desserts',
    description: 'Blackberry, Crème Fraîche',
    fullDetail: '72% single-origin Venezuelan dark chocolate torte gently warm-smoked over cherrywood. Accompanied by wild forest blackberry compote, cultured crème fraîche, and gold leaf dust.',
    price: '$18',
    image: './images/menu-chocolate.png',
    pairing: '2017 Taylor Fladgate Late Bottled Vintage Port',
    origin: 'Chuao, Venezuela',
    allergens: 'Dairy, Eggs'
  }
];

const TASTING_COURSES = [
  { step: '01', title: 'L’Ouverture', desc: 'Smoked Oyster, Sea Fennel & Pine Ash' },
  { step: '02', title: 'La Mer', desc: 'Charred Hokkaido Scallop with Brown Butter Foam' },
  { step: '03', title: 'La Terre', desc: 'A5 Wagyu Bavette over Binchotan with Fermented Garlic' },
  { step: '04', title: 'Le Frais', desc: 'Smoked Citrus Granita with Wild Thyme' },
  { step: '05', title: 'Le Feu Final', desc: 'Smoked 72% Venezuelan Chocolate Ganache' }
];

export function App() {
  // Navigation & Scroll State
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundActive, setSoundActive] = useState(false);
  const [parallaxMode, setParallaxMode] = useState(false);

  // Menu Filters & Modals
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedDish, setSelectedDish] = useState(null);
  
  // Reservation Modal & State
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '19:30',
    guests: '2',
    seating: "Chef's Counter (Fire View)",
    name: '',
    email: '',
    phone: '',
    notes: ''
  });

  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Scrollspy & Progress handler
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      
      setScrollProgress(totalScroll > 0 ? (currentScroll / totalScroll) * 100 : 0);
      setIsScrolled(currentScroll > 40);

      const sections = ['hero', 'story', 'menu', 'tasting', 'reservations', 'chef', 'parallax'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 160 && rect.bottom >= 160) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Ambient sound synthesizer
  const audioContextRef = useRef(null);
  const toggleSound = () => {
    if (!soundActive) {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          audioContextRef.current = ctx;
          // Create gentle crackling campfire / hearth ambient drone
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(110, ctx.currentTime);
          gain.gain.setValueAtTime(0.015, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
        }
      } catch (e) {
        console.warn('Audio context init failed', e);
      }
      setSoundActive(true);
    } else {
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      setSoundActive(false);
    }
  };

  // Reservation Submission
  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#9E4A28', '#D4AF37', '#FAF7F2', '#E08E45']
    });
  };

  const openBookingModalWithDish = (dish) => {
    setSelectedDish(null);
    setBookingData((prev) => ({
      ...prev,
      notes: `Special tasting request: ${dish.name}`
    }));
    setIsBookingModalOpen(true);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setNewsletterSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const filteredDishes = activeCategory === 'all'
    ? MENU_ITEMS
    : MENU_ITEMS.filter(d => d.category === activeCategory);

  return (
    <div className="site-shell">
      {/* Scroll Progress Bar */}
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} aria-hidden="true" />

      {/* ====================================================================
          HEADER & NAVIGATION (Frozen / Sticky with ScrollSpy)
          ==================================================================== */}
      <header className={`header-wrapper ${isScrolled ? 'is-scrolled' : ''}`}>
        <div className="header">
          {/* Brand Logo */}
          <a href="#hero" className="brand" aria-label="Maison Braise Home">
            <svg className="brand-crest" viewBox="0 0 24 30" fill="none">
              <path d="M12 2C15 7 20 11 20 18C20 23.5 16.5 28 12 28C7.5 28 4 23.5 4 18C4 11 9 7 12 2Z" fill="#9E4A28" opacity="0.9" />
              <path d="M12 8C14 12 17 15 17 19C17 22 14.5 25 12 25C9.5 25 7 22 7 19C7 15 10 12 12 8Z" fill="#FAF7F2" />
              <circle cx="12" cy="19" r="2" fill="#9E4A28" />
            </svg>
            <div className="brand-text">
              <span>Maison</span>
              <strong>Braise</strong>
            </div>
          </a>

          {/* Desktop Navigation Links (ScrollSpy Active) */}
          <nav className="nav-menu" aria-label="Primary Navigation">
            <a
              href="#menu"
              className={`nav-link ${activeSection === 'menu' ? 'is-active' : ''}`}
            >
              Menu
            </a>
            <a
              href="#story"
              className={`nav-link ${activeSection === 'story' ? 'is-active' : ''}`}
            >
              Our Story
            </a>
            <a
              href="#tasting"
              className={`nav-link ${activeSection === 'tasting' ? 'is-active' : ''}`}
            >
              Tasting Menu
            </a>
            <a
              href="#reservations"
              className={`nav-link ${activeSection === 'reservations' ? 'is-active' : ''}`}
            >
              Reservations
            </a>
            <a
              href="#chef"
              className={`nav-link ${activeSection === 'chef' ? 'is-active' : ''}`}
            >
              Chef
            </a>
            <a
              href="#parallax"
              className={`nav-link ${activeSection === 'parallax' ? 'is-active' : ''}`}
            >
              Depth Story
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="header-actions">
            <button
              className={`icon-circle-btn ${soundActive ? 'is-active' : ''}`}
              onClick={toggleSound}
              title={soundActive ? "Mute Hearth Ambience" : "Play Woodfire Ambience"}
              aria-label="Toggle ambient hearth sounds"
            >
              {soundActive ? <Volume2 size={16} /> : <VolumeX size={16} />}
            </button>
            <button
              className="btn-terracotta"
              onClick={() => {
                setBookingSuccess(false);
                setIsBookingModalOpen(true);
              }}
            >
              Reserve a Table
            </button>
            <button
              className="menu-toggle-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              <MenuIcon size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          HERO SECTION (Image 1 reference)
          ==================================================================== */}
      <section id="hero" className="hero-section">
        <div className="site-wrapper">
          <div className="hero-grid">
            {/* Left Copy */}
            <div className="hero-copy">
              <div className="eyebrow-flame">
                <Flame size={18} />
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.22em', textTransform: 'uppercase', fontWeight: 600 }}>
                  Savor · Season · Story
                </span>
              </div>
              <h1 className="hero-title">
                Stories of flavor,<br />
                <em>crafted with fire.</em>
              </h1>
              <p className="hero-description">
                Maison Braise is a modern fine-dining restaurant where fire, finesse, and seasonal ingredients come together to create unforgettable moments.
              </p>
              <div className="hero-ctas">
                <a href="#menu" className="btn-hero-primary">
                  Explore Menu
                </a>
                <a href="#story" className="btn-hero-story">
                  <span>Our Story</span>
                  <span className="circle-plus">⊕</span>
                </a>
              </div>
            </div>

            {/* Right Visual (Signature Dish Plate with curved rotating text) */}
            <div className="hero-visual-wrapper">
              <div className="hero-plate-container">
                <img
                  src="./images/hero-plated-entree.png"
                  alt="Maison Braise signature woodfired meat entrée served on an ivory ceramic plate"
                  className="hero-plate-img"
                />
                
                {/* Curved SVG Text Orbiting Top Right */}
                <svg className="hero-orbit-svg" viewBox="0 0 200 200">
                  <path
                    id="textPathOrbit"
                    d="M 100, 100 m -75, 0 a 75,75 0 1,1 150,0 a 75,75 0 1,1 -150,0"
                    fill="none"
                  />
                  <text>
                    <textPath href="#textPathOrbit" startOffset="0%">
                      SAVOR • SEASON • STORY • MAISON BRAISE •
                    </textPath>
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          STORY & PHILOSOPHY SECTION (A celebration of fire and finesse)
          ==================================================================== */}
      <section id="story" className="story-section">
        <div className="site-wrapper">
          <div className="story-grid">
            {/* Left Media Box */}
            <div className="story-media-box">
              <img
                src="./images/fire-kitchen.png"
                alt="Woodfire embers and copper pan in Maison Braise kitchen"
              />
              <span className="story-media-tag">01 / The Hearth</span>
            </div>

            {/* Right Story Text */}
            <div className="story-copy">
              <div className="eyebrow-flame">
                <Flame size={16} />
              </div>
              <h2 className="story-headline">
                A celebration <em>of fire and finesse.</em>
              </h2>
              <p className="story-text">
                Rooted in technique and driven by curiosity, our kitchen blends time-honored methods with a modern perspective. Every dish is a story—of origin, of season, and of the craft behind the flame.
              </p>
              <a href="#tasting" className="story-link">
                <span>Discover Our Story</span>
                <span style={{ fontSize: '1.1rem' }}>⊕</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          MENU HIGHLIGHTS SECTION (4 Signature Dishes)
          ==================================================================== */}
      <section id="menu" className="menu-section">
        <div className="site-wrapper">
          <div className="section-header-centered">
            <div className="eyebrow-flame">
              <Flame size={18} />
            </div>
            <h2>Menu Highlights</h2>
          </div>

          {/* Filter Bar */}
          <div className="menu-filter-bar">
            {['all', 'starters', 'mains', 'desserts'].map((cat) => (
              <button
                key={cat}
                className={`filter-tab ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* 4 Dish Cards */}
          <div className="dishes-grid">
            {filteredDishes.map((dish) => (
              <article
                key={dish.id}
                className="dish-card"
                onClick={() => setSelectedDish(dish)}
                role="button"
                tabIndex={0}
              >
                <div className="dish-thumb-box">
                  <img src={dish.image} alt={dish.name} />
                  <span className="dish-price-badge">{dish.price}</span>
                </div>
                <div className="dish-info-box">
                  <h3 className="dish-name">{dish.name}</h3>
                  <p className="dish-ingredients">{dish.description}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Center CTA */}
          <div className="menu-full-cta">
            <button
              className="view-full-menu-btn"
              onClick={() => {
                setBookingSuccess(false);
                setIsBookingModalOpen(true);
              }}
            >
              <span>View Full Menu & Reserve</span>
              <span style={{ fontSize: '1.1rem' }}>⊕</span>
            </button>
          </div>
        </div>
      </section>

      {/* ====================================================================
          TASTING MENU CONTAINER (Dark Charcoal & Gold Masterpiece)
          ==================================================================== */}
      <section id="tasting" className="site-wrapper tasting-container-wrapper">
        <div className="tasting-card">
          {/* Watermark Crest */}
          <svg className="tasting-crest-bg" viewBox="0 0 24 30" fill="currentColor">
            <path d="M12 2C15 7 20 11 20 18C20 23.5 16.5 28 12 28C7.5 28 4 23.5 4 18C4 11 9 7 12 2Z" />
          </svg>

          {/* Left Copy */}
          <div className="tasting-copy">
            <div className="eyebrow-flame">
              <Flame size={16} />
            </div>
            <h2 className="tasting-title">Tasting Menu</h2>
            <p className="tasting-description">
              A curated journey through the season. Five courses. Endless memories.
            </p>
            <button
              className="btn-tasting-link"
              onClick={() => {
                setBookingData(prev => ({ ...prev, seating: "Tasting Menu Experience (5 Courses)" }));
                setIsBookingModalOpen(true);
              }}
            >
              <span>Explore Tasting Menu</span>
              <span style={{ fontSize: '1.1rem' }}>⊕</span>
            </button>
          </div>

          {/* Right Visual Image */}
          <div className="tasting-media-box">
            <img
              src="./images/tasting-menu.png"
              alt="Artfully plated course on dark ceramic bowl"
              className="tasting-plate-img"
            />
          </div>
        </div>
      </section>

      {/* ====================================================================
          RESERVE YOUR TABLE WIDGET STRIP
          ==================================================================== */}
      <section id="reservations" className="reservation-widget-section">
        <div className="site-wrapper">
          <div className="reservation-bar-card">
            <div className="reservation-header">
              <h3>Reserve Your Table</h3>
              <p>We look forward to welcoming you.</p>
            </div>

            <form
              className="reservation-inputs-row"
              onSubmit={(e) => {
                e.preventDefault();
                setIsBookingModalOpen(true);
              }}
            >
              <div className="reserve-field">
                <Calendar size={16} />
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  aria-label="Select reservation date"
                  required
                />
              </div>

              <div className="reserve-field">
                <Users size={16} />
                <select
                  value={bookingData.guests}
                  onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                  aria-label="Select number of guests"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4 Guests</option>
                  <option value="5">5 Guests</option>
                  <option value="6">6 Guests</option>
                  <option value="8">Private Dining (8+)</option>
                </select>
              </div>

              <button type="submit" className="btn-find-table">
                Find a Table
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ====================================================================
          CHEF QUOTE & SIGNATURE SECTION
          ==================================================================== */}
      <section id="chef" className="chef-section">
        <div className="site-wrapper">
          <div className="chef-grid">
            {/* Left Photo */}
            <div className="chef-photo-box">
              <img
                src="./images/chef-julien.png"
                alt="Executive Chef Julien Moreau delicately plating culinary creation"
              />
            </div>

            {/* Right Quote */}
            <div className="chef-quote-content">
              <div className="quote-mark">“</div>
              <blockquote className="chef-quote-text">
                Every dish begins with respect—for the ingredient, the fire, and the guests we cook for.
              </blockquote>
              <div className="chef-meta-row">
                <div className="chef-info">
                  <h4>Chef Julien Moreau</h4>
                  <p>Executive Chef & Co-Founder</p>
                </div>
                
                {/* Script Signature SVG */}
                <svg className="chef-signature-svg" viewBox="0 0 160 50" fill="none" stroke="currentColor">
                  <path
                    d="M10 35 C20 10, 25 5, 30 20 C35 35, 40 45, 45 25 C50 15, 60 18, 70 24 C80 30, 95 10, 110 22 C125 34, 140 15, 155 20 M25 40 L5 48"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          PARALLAX & 3D DEPTH FLOATING STAGE (Images 2, 3, 4, 5)
          ==================================================================== */}
      <section id="parallax" className="parallax-showcase-section">
        <div className="site-wrapper">
          <div className="parallax-header-box">
            <span className="parallax-eyebrow">Parallax by Design</span>
            <h2 className="parallax-headline">
              Depth that serves the story.
            </h2>
            <p className="parallax-subtext">
              A scroll experience shaped by flavor, atmosphere, and memory.
            </p>
          </div>

          {/* Interactive 3D Depth Stage */}
          <div className="depth-stage">
            {/* Left Floating Card 1 (Dark Flame) */}
            <div className="floating-card card-dark-flame">
              <img src="./images/fire-kitchen.png" alt="Fire embers" />
              <div className="card-content">
                <h5>Fire is our first ingredient.</h5>
                <p>It brings depth, aroma, and soul to every plate.</p>
              </div>
            </div>

            {/* Left Floating Card 2 (Ivory Season) */}
            <div className="floating-card card-ivory-season">
              <div className="eyebrow-flame" style={{ marginBottom: '0.5rem' }}>
                <Flame size={14} />
              </div>
              <h5>Seasonal by nature.</h5>
              <p>We follow what's at its peak to bring you honest, vibrant flavors.</p>
            </div>

            {/* Left Floating Card 3 (Rust Atmosphere) */}
            <div className="floating-card card-rust-atmosphere">
              <img src="./images/dining-room.png" alt="Dimly lit dining room" />
              <div className="card-content">
                <h5>Atmosphere that lingers.</h5>
                <p>Warm light, thoughtful details, and the sound of stories shared.</p>
              </div>
            </div>

            {/* Center Main Web Portal Frame */}
            <div className="center-frame-wrapper">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div className="brand-text">
                  <span>Maison</span>
                  <strong style={{ fontSize: '1rem' }}>Braise</strong>
                </div>
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--terracotta)' }}>
                  Interactive 3D Stage
                </span>
              </div>
              <img
                src="./images/hero-plated-entree.png"
                alt="Signature Dish"
                style={{ borderRadius: '50%', width: '180px', height: '180px', margin: '0 auto 1.5rem', boxShadow: 'var(--shadow-md)' }}
              />
              <h4 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', textAlign: 'center', marginBottom: '0.5rem' }}>
                Stories of flavor, crafted with fire.
              </h4>
              <p style={{ textAlign: 'center', fontSize: '0.85rem' }}>
                Explore the multisensory symphony of woodfire gastronomy.
              </p>
            </div>

            {/* Right Floating Card 1 (Chef Plating) */}
            <div className="floating-card card-right-chef">
              <img src="./images/chef-julien.png" alt="Chef Julien" />
            </div>

            {/* Right Floating Card 2 (Dark Intention) */}
            <div className="floating-card card-right-intention">
              <div className="eyebrow-flame" style={{ marginBottom: '0.4rem', color: '#D4AF37' }}>
                <Flame size={14} />
              </div>
              <h5>Crafted with intention.</h5>
              <p>Each element is considered, each plate composed with purpose.</p>
            </div>

            {/* Right Floating Card 3 (Ivory Memories) */}
            <div className="floating-card card-right-memories">
              <div className="eyebrow-flame" style={{ marginBottom: '0.4rem' }}>
                <Flame size={14} />
              </div>
              <h5>Memories made here.</h5>
              <p>For quiet evenings, celebrations, and everything in between.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          AGENCY CALLOUT SECTION (Image 3 - Noir Pixel)
          ==================================================================== */}
      <section className="agency-callout-section">
        <div className="site-wrapper">
          <div className="agency-grid">
            <div className="agency-left">
              <span className="agency-badge">
                <Flame size={14} />
                Noir Pixel Hospitality Studio
              </span>
              <h2 className="agency-title">
                Want a Restaurant Website Like This?
              </h2>
              <p className="agency-desc">
                Noir Pixel designs premium custom websites for restaurants, cafés, and hospitality brands that want an online presence as refined as their dining experience.
              </p>
            </div>

            <div className="agency-right">
              <div className="agency-features-list">
                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Sparkles size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Custom Design</h4>
                    <p>Tailored to your brand, your story, and your guests.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Compass size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Mobile-Friendly</h4>
                    <p>Beautiful on every device. Seamless for every guest.</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon-box">
                    <Award size={20} />
                  </div>
                  <div className="feature-info">
                    <h4>Built to Convert / Reservation-Ready</h4>
                    <p>Designed to turn visitors into bookings.</p>
                  </div>
                </div>

                <a
                  href="#reservations"
                  className="agency-cta-btn"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsBookingModalOpen(true);
                  }}
                >
                  <span>DM ‘RESTAURANT’ to get yours</span>
                  <ArrowRight size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          FOOTER SECTION (Matching reference image)
          ==================================================================== */}
      <footer className="footer-section">
        <div className="site-wrapper">
          <div className="footer-top-grid">
            {/* Logo Column */}
            <div>
              <a href="#hero" className="brand" style={{ marginBottom: '1rem', display: 'inline-flex' }}>
                <div className="brand-text">
                  <span>Maison</span>
                  <strong>Braise</strong>
                </div>
              </a>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '240px' }}>
                Fire-dining gastronomy rooted in seasonal integrity and culinary finesse.
              </p>
            </div>

            {/* Navigation Columns */}
            <div className="footer-nav-cols">
              <div className="footer-col">
                <h5>Navigate</h5>
                <ul>
                  <li><a href="#menu">Menu</a></li>
                  <li><a href="#story">Our Story</a></li>
                  <li><a href="#reservations">Reservations</a></li>
                  <li><a href="#tasting">Private Dining</a></li>
                  <li><a href="#chef">Journal</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h5>Information</h5>
                <ul>
                  <li><span>Dress Code: Smart Casual</span></li>
                  <li><a href="#reservations">Gift Cards</a></li>
                  <li><a href="#story">Careers</a></li>
                  <li><a href="mailto:contact@maisonbraise.com">Contact</a></li>
                </ul>
              </div>

              <div className="footer-col">
                <h5>Follow</h5>
                <ul>
                  <li><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a></li>
                  <li><a href="https://facebook.com" target="_blank" rel="noreferrer">Facebook</a></li>
                  <li><a href="#newsletter">Newsletter</a></li>
                </ul>
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="footer-newsletter" id="newsletter">
              <h5>Join our mailing list</h5>
              {newsletterSubscribed ? (
                <p style={{ color: 'var(--terracotta)', fontSize: '0.88rem', fontWeight: 500 }}>
                  ✓ You are subscribed to private dining notes.
                </p>
              ) : (
                <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                  <input
                    type="email"
                    placeholder="Your email address"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    required
                  />
                  <button type="submit" className="newsletter-submit-btn" aria-label="Subscribe to newsletter">
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="footer-bottom-bar">
            <span>© Maison Braise. All Rights Reserved.</span>
            <div className="footer-links-inline">
              <a href="#privacy">Privacy Policy</a>
              <span>·</span>
              <a href="#terms">Terms & Conditions</a>
            </div>
          </div>
        </div>
      </footer>

      {/* ====================================================================
          DISH SPOTLIGHT MODAL (When clicking any menu highlight)
          ==================================================================== */}
      {selectedDish && (
        <div className="modal-backdrop" onClick={() => setSelectedDish(null)}>
          <div className="reservation-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setSelectedDish(null)}
              aria-label="Close dish detail"
            >
              <X size={18} />
            </button>
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <img
                src={selectedDish.image}
                alt={selectedDish.name}
                style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 1rem', boxShadow: 'var(--shadow-md)' }}
              />
              <div className="eyebrow-flame" style={{ justifyContent: 'center', marginBottom: '0.25rem' }}>
                <Flame size={14} />
                <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  {selectedDish.category} · {selectedDish.price}
                </span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem' }}>{selectedDish.name}</h2>
            </div>
            <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-main)', marginBottom: '1.5rem' }}>
              {selectedDish.fullDetail}
            </p>
            <div style={{ background: 'var(--bg-warm)', padding: '1rem', borderRadius: '6px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <div><strong>Sommelier Pairing:</strong> {selectedDish.pairing}</div>
              <div><strong>Provenance:</strong> {selectedDish.origin}</div>
              <div><strong>Dietary:</strong> {selectedDish.allergens}</div>
            </div>
            <button
              className="btn-terracotta"
              style={{ width: '100%' }}
              onClick={() => openBookingModalWithDish(selectedDish)}
            >
              Reserve Table for this Dish
            </button>
          </div>
        </div>
      )}

      {/* ====================================================================
          INTERACTIVE RESERVATION MODAL
          ==================================================================== */}
      {isBookingModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsBookingModalOpen(false)}>
          <div className="reservation-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn"
              onClick={() => setIsBookingModalOpen(false)}
              aria-label="Close reservation modal"
            >
              <X size={18} />
            </button>

            {!bookingSuccess ? (
              <>
                <div className="modal-heading-area">
                  <div className="eyebrow-flame" style={{ justifyContent: 'center', marginBottom: '0.5rem' }}>
                    <Flame size={16} />
                  </div>
                  <h2>Table Reservation</h2>
                  <p>Maison Braise · 18 Rue du Feu, Paris</p>
                </div>

                <form onSubmit={handleBookingSubmit}>
                  <div className="modal-form-grid">
                    <div className="form-group">
                      <label>Date</label>
                      <input
                        type="date"
                        value={bookingData.date}
                        onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Time Slot</label>
                      <select
                        value={bookingData.time}
                        onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                      >
                        <option>18:00</option>
                        <option>18:30</option>
                        <option>19:00</option>
                        <option>19:30</option>
                        <option>20:00</option>
                        <option>20:30</option>
                        <option>21:00</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Party Size</label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => setBookingData({ ...bookingData, guests: e.target.value })}
                      >
                        <option value="1">1 Guest (Chef's Bar)</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="8">8 Guests (Private Cellar)</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Seating Preference</label>
                      <select
                        value={bookingData.seating}
                        onChange={(e) => setBookingData({ ...bookingData, seating: e.target.value })}
                      >
                        <option>Chef's Counter (Fire View)</option>
                        <option>Main Dining Hall</option>
                        <option>The Hearth Room</option>
                        <option>Tasting Menu Experience (5 Courses)</option>
                      </select>
                    </div>
                    <div className="form-group form-group-full">
                      <label>Primary Guest Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Eleanor Vance"
                        value={bookingData.name}
                        onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email Address</label>
                      <input
                        type="email"
                        placeholder="eleanor@luxury.com"
                        value={bookingData.email}
                        onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        placeholder="+33 1 42 68 00 00"
                        value={bookingData.phone}
                        onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                        required
                      />
                    </div>
                    <div className="form-group form-group-full">
                      <label>Dietary Restrictions or Special Occasions</label>
                      <textarea
                        rows="2"
                        placeholder="Allergies, anniversaries, or wine cellar requests..."
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-terracotta" style={{ width: '100%', padding: '0.85rem' }}>
                    Confirm Table Reservation
                  </button>
                </form>
              </>
            ) : (
              <div className="booking-success-box">
                <div className="success-icon-badge">
                  <CheckCircle size={36} />
                </div>
                <h2>Reservation Confirmed</h2>
                <p>We are honored to prepare your evening at Maison Braise.</p>
                <div className="booking-summary-card">
                  <div><strong>Guest:</strong> {bookingData.name || 'Valued Guest'}</div>
                  <div><strong>Date & Time:</strong> {bookingData.date} at {bookingData.time}</div>
                  <div><strong>Party Size:</strong> {bookingData.guests} Guests</div>
                  <div><strong>Seating:</strong> {bookingData.seating}</div>
                  {bookingData.notes && <div><strong>Special Request:</strong> {bookingData.notes}</div>}
                </div>
                <button
                  className="btn-terracotta"
                  onClick={() => setIsBookingModalOpen(false)}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
