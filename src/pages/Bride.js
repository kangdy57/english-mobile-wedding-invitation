import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Container as MapDiv,
  NaverMap,
  Marker,
  useNavermaps,
} from "react-naver-maps";

import "../App.css";
import Reveal from "../components/Reveal";
import Countdown from "../components/Countdown";
import Lightbox from "../components/Lightbox";
import pinIcon from "../assets/location-pin.png";
import hero800 from "../assets/hero/hero-800.jpg";
import hero1200 from "../assets/hero/hero-1200.jpg";
import hero1800 from "../assets/hero/hero-1800.jpg";

/* ---------------------------------------------------------------- details */

const CEREMONY = new Date("2026-10-24T15:00:00+09:00");

const VENUE = {
  name: "Sejong Memorial Hall",
  korean: "세종대왕기념관",
  address: "Hoegiro 56-gil, Hoegi-dong, Dongdaemun-gu, Seoul, South Korea",
  tel: "02-960-1700",
  lat: 37.5909615011864,
  lng: 127.04363162642107,
};

const LINKS = {
  guide: "https://kangdy57.github.io/weddingWebsiteEng.html",
  rsvp: "https://docs.google.com/forms/d/e/1FAIpQLScPVRuaH94D9xSpVRe9c5ZkZhI94IAfoocNzWSZqBwAB_i2Fg/viewform",
  whatsapp: "https://chat.whatsapp.com/FlMIuNS8CqkLFPacB2wFGc",
  googleMaps: `https://www.google.com/maps/search/?api=1&query=${VENUE.lat},${VENUE.lng}`,
  naverMaps: "https://map.naver.com/p/search/세종대왕기념관",
  calendar:
    "https://calendar.google.com/calendar/render?action=TEMPLATE" +
    "&text=" +
    encodeURIComponent("Dayeon & Prannoy — Wedding Ceremony") +
    "&dates=20261024T060000Z/20261024T090000Z" +
    "&location=" +
    encodeURIComponent(`${VENUE.name}, ${VENUE.address}`) +
    "&details=" +
    encodeURIComponent("Traditional Korean wedding ceremony. We can't wait to see you!"),
};

/* ---------------------------------------------------------------- gallery */

// where the layout switches from the single-column phone sheet to the
// two-column desktop one — kept in sync with the @media block in App.css
const DESKTOP = 900;

const CDN = "https://5hiexw8se9.ucarecd.net/";

// Uploadcare ids, in the order they should appear in the gallery.
const PHOTOS = [
  "86d81d21-9992-4ca0-acdf-e70a6091babb",
  "3e8a1691-8cca-4cb4-8636-0b826f27444c",
  "029806d5-acd0-41ef-86c0-a3910d5f245a",
  "63993ddf-3b95-4dd5-b111-5a9a91b718f6",
  "3e9f7e65-da93-41e6-a504-3265fdc65047",
  "59d31548-b1fa-420c-b895-d2187e5a6037",
  "b4d499f5-938a-4837-9024-4adf1022d009",
  "e96d2dbc-b9f9-4542-a276-4530a8740142",
  "68625584-770c-4b66-84dd-1158e6cf1b7a",
  "3aff7748-5a4a-45ec-9400-c19c02e0da4e",
  "38c241e5-8ece-471d-a903-2ed652603b1b",
  "6cf895ec-ad76-466f-a662-7466ed754569",
];

// The originals are ~4000x5500. Never ship those to a phone — let the CDN
// crop and re-encode to the size of the tile it lands in. `smart` crops
// around the faces, which a centre crop of a tall portrait loses.
const thumbUrl = (i, w, ratio = 1.333) =>
  `${CDN}${PHOTOS[i]}/-/scale_crop/${w}x${Math.round(w * ratio)}/smart/` +
  `-/quality/smart/-/format/auto/`;

const fullUrl = (i) =>
  `${CDN}${PHOTOS[i]}/-/preview/1400x1400/-/quality/smart/-/format/auto/`;

/* --------------------------------------------------------------- calendar */

const MONTH_LABEL = "October 2026";
const DAY_NAMES = ["S", "M", "T", "W", "T", "F", "S"];
const FIRST_WEEKDAY = new Date(Date.UTC(2026, 9, 1)).getUTCDay(); // Thursday
const DAYS_IN_MONTH = 31;
const WEDDING_DAY = 24;

const calendarCells = [
  ...Array.from({ length: FIRST_WEEKDAY }, () => null),
  ...Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1),
];

/* ------------------------------------------------------------------ icons */

const Icon = ({ path, filled = false }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
    <path
      d={path}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PATHS = {
  book: "M4 4.5A1.5 1.5 0 015.5 3H19v16H5.5A1.5 1.5 0 014 17.5v-13zM4 17.5A1.5 1.5 0 015.5 16H19v5H5.5A1.5 1.5 0 014 19.5v-2z",
  envelope: "M3 6.5h18v11H3v-11zm0 .5l9 6.5L21 7",
  chat: "M21 11.5a7.5 7.5 0 01-10.9 6.7L4 20l1.9-5.6A7.5 7.5 0 1121 11.5z",
  map: "M9 3L3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3zm0 0v15m6-12v15",
  copy: "M9 9h10v12H9V9zM5 15H4V3h12v1",
  arrow: "M5 12h13m-5-6l6 6-6 6",
  check: "M4 12.5l5 5L20 6.5",
  phone:
    "M21 16.9v2.5a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6A19.8 19.8 0 011.1 3.7 2 2 0 013.1 1.5h2.5a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L6.7 9.3a16 16 0 006 6l1.2-1.1a2 2 0 012.1-.5c.9.3 1.8.6 2.8.7a2 2 0 011.7 2z",
};

/* ------------------------------------------------------------------- page */

function Bride() {
  const navermaps = useNavermaps();

  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [copied, setCopied] = useState(false);
  const [pastHero, setPastHero] = useState(false);
  const [overButtons, setOverButtons] = useState(false);
  const dateRef = useRef(null);
  const linksRef = useRef(null);

  // The hero is sticky, so it never leaves the viewport and can't be
  // observed for this — go by scroll distance instead.
  useEffect(() => {
    const onScroll = () =>
      setPastHero(window.scrollY > window.innerHeight * 0.75);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // The floating RSVP steps aside over the two sections that carry their
  // own buttons, so it never sits on top of one.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;

    const visible = new Set();
    const stops = [dateRef.current, linksRef.current]
      .filter(Boolean)
      .map((node) => {
        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) visible.add(node);
            else visible.delete(node);
            setOverButtons(visible.size > 0);
          },
          { threshold: 0.15 }
        );
        observer.observe(node);
        return () => observer.disconnect();
      });

    return () => stops.forEach((stop) => stop());
  }, []);

  const showRsvpFloat = pastHero && !overButtons && lightboxIndex === null;

  const copyAddress = useCallback(async () => {
    const text = `${VENUE.name} (${VENUE.korean}), ${VENUE.address}`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  }, []);

  return (
    <div className="page">
      {/* ------------------------------------------------------------ hero */}
      <header className="hero">
        <img
          className="hero-img"
          src={hero1200}
          srcSet={`${hero800} 800w, ${hero1200} 1200w, ${hero1800} 1800w`}
          sizes="100vw"
          alt="Dayeon and Prannoy holding hands in front of Hamburg City Hall"
          fetchpriority="high"
        />
        <div className="hero-scrim" />

        <div className="hero-top">
          <p className="eyebrow eyebrow--light">We're getting married</p>
          <h1 className="hero-names">
            Dayeon
            <span className="hero-amp">&amp;</span>
            Prannoy
          </h1>
        </div>

        <div className="hero-bottom">
          <p className="hero-meta">
            24 · 10 · 2026<span className="dot">·</span>Seoul
          </p>
          <span className="scroll-cue" aria-hidden="true" />
        </div>
      </header>

      <main className="sheet">
        {/* -------------------------------------------------------- when */}
        <section className="section section--sand" ref={dateRef}>
          <Reveal>
            <p className="eyebrow">Save the date</p>

            {/* grid areas so this stacks on a phone and goes side-by-side
                on a wide screen without reordering the DOM */}
            <div className="date-grid">
              <div className="date-head">
                <p className="when-line">Saturday, 24 October 2026</p>
                <p className="when-time">3:00 in the afternoon</p>
              </div>

              <div className="calendar" role="img" aria-label="October 2026, the 24th">
                <p className="calendar-month">{MONTH_LABEL}</p>
                <div className="calendar-grid">
                  {DAY_NAMES.map((d, i) => (
                    <span className="calendar-dow" key={i}>
                      {d}
                    </span>
                  ))}
                  {calendarCells.map((day, i) => (
                    <span
                      key={i}
                      className={`calendar-day ${
                        day === WEDDING_DAY ? "is-wedding" : ""
                      }`}
                    >
                      {day || ""}
                    </span>
                  ))}
                </div>
              </div>

              <div className="date-tail">
                <Countdown target={CEREMONY} />
                <a className="btn btn--ghost" href={LINKS.calendar} target="_blank" rel="noopener noreferrer">
                  Add to calendar
                </a>
              </div>
            </div>
          </Reveal>
        </section>

        {/* -------------------------------------------------- invitation */}
        <section className="section">
          <Reveal>
            <p className="eyebrow">Invitation</p>
            <span className="ornament" aria-hidden="true" />

            <div className="story">
              <p>
                It all started in <em>2017</em>, in a student dorm in Germany —
                Prannoy couldn't stop dreaming about Dayeon.
              </p>
              <p>
                Fast forward seven years to <em>2024</em>, and the two of them
                tied the knot in a small, private ceremony in Denmark, becoming
                the legendary <strong>PraDa</strong> duo.
              </p>
              <p>
                Now, in <em>2026</em>, the real celebration begins — a
                traditional wedding ceremony in Korea.
              </p>
              <p className="story-call">
                You're on our VIP guest list.
                <br />
                The only question left is — will you join us?
              </p>
            </div>

            <div className="parents">
              <p>
                <span>Jungbae Kang &amp; Hyojung Jin</span>
                <em>'s daughter</em> <strong>Dayeon</strong>
              </p>
              <p>
                <span>Ram Mulmi &amp; Janahita Mulmi</span>
                <em>'s son</em> <strong>Prannoy</strong>
              </p>
            </div>
          </Reveal>
        </section>

        {/* ----------------------------------------------------- gallery */}
        <section className="section section--flush">
          <Reveal>
            <p className="eyebrow">Gallery</p>
            <span className="ornament" aria-hidden="true" />
          </Reveal>

          <div className="gallery">
            {PHOTOS.map((id, i) => {
              // two full-width photos break up the grid; placed so no row
              // is ever left half-empty
              const wide = i === 0 || i === 7;
              return (
                <Reveal
                  key={id}
                  className={`gallery-cell ${wide ? "gallery-cell--wide" : ""}`}
                  delay={(i % 2) * 70}
                >
                  <button
                    className="gallery-btn"
                    onClick={() => setLightboxIndex(i)}
                    aria-label={`Open photo ${i + 1}`}
                  >
                    <picture>
                      {/* the wide tiles are square only on narrow screens;
                          desktop lays every tile out 3:4, so ask the CDN for
                          that crop rather than letting CSS squash the square */}
                      {wide && (
                        <source
                          media={`(min-width: ${DESKTOP}px)`}
                          srcSet={`${thumbUrl(i, 480)} 480w, ${thumbUrl(i, 760)} 760w`}
                          sizes="360px"
                        />
                      )}
                      <img
                        src={wide ? thumbUrl(i, 900, 1) : thumbUrl(i, 480)}
                        srcSet={
                          wide
                            ? `${thumbUrl(i, 560, 1)} 560w, ${thumbUrl(i, 900, 1)} 900w, ${thumbUrl(i, 1200, 1)} 1200w`
                            : `${thumbUrl(i, 320)} 320w, ${thumbUrl(i, 480)} 480w, ${thumbUrl(i, 760)} 760w`
                        }
                        sizes={
                          wide
                            ? "(max-width: 440px) 100vw, 440px"
                            : "(max-width: 440px) 50vw, 360px"
                        }
                        alt={`Dayeon and Prannoy, ${i + 1} of ${PHOTOS.length}`}
                        loading={i < 2 ? "eager" : "lazy"}
                        decoding="async"
                      />
                    </picture>
                  </button>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* ---------------------------------------------------- location */}
        <section className="section section--flush">
          <Reveal>
            <p className="eyebrow">Location</p>
            <span className="ornament" aria-hidden="true" />
          </Reveal>

          <div className="location-grid">
            <div className="map-frame">
              <MapDiv style={{ width: "100%", height: "100%" }}>
                <NaverMap
                  defaultCenter={new navermaps.LatLng(VENUE.lat, VENUE.lng)}
                  defaultZoom={16}
                >
                  <Marker
                    position={new navermaps.LatLng(VENUE.lat, VENUE.lng)}
                    icon={{ url: pinIcon, size: new navermaps.Size(64, 64) }}
                  />
                </NaverMap>
              </MapDiv>
            </div>

            <div className="section-inner">
            <Reveal className="venue">
              <h2 className="venue-name">{VENUE.name}</h2>
              <p className="venue-korean">{VENUE.korean}</p>
              <p className="venue-address">{VENUE.address}</p>
              <a className="venue-tel" href={`tel:${VENUE.tel.replace(/-/g, "")}`}>
                <Icon path={PATHS.phone} /> {VENUE.tel}
              </a>

              <div className="venue-actions">
                <a className="chip" href={LINKS.naverMaps} target="_blank" rel="noopener noreferrer">
                  <Icon path={PATHS.map} /> Naver Map
                </a>
                <a className="chip" href={LINKS.googleMaps} target="_blank" rel="noopener noreferrer">
                  <Icon path={PATHS.map} /> Google Maps
                </a>
                <button className="chip" onClick={copyAddress}>
                  <Icon path={copied ? PATHS.check : PATHS.copy} />
                  {copied ? "Copied!" : "Copy address"}
                </button>
              </div>
            </Reveal>

            <Reveal className="transit">
              <h3 className="transit-title">Getting there</h3>

              <div className="transit-row">
                <span className="transit-badge transit-badge--line6">6</span>
                <div>
                  <strong>Subway</strong>
                  <p>
                    Korea Univ. Station (고려대역), Line 6 — Exit 3.
                    <br />A 750 m walk, or a free shuttle bus every 15 minutes.
                  </p>
                </div>
              </div>

              <div className="transit-row">
                <span className="transit-badge transit-badge--bus">Bus</span>
                <div>
                  <strong>Bus</strong>
                  <p>No. 1226, 201 or 273.</p>
                </div>
              </div>
            </Reveal>
            </div>
          </div>
        </section>

        {/* ------------------------------------------------- guest links */}
        <section className="section section--sand" ref={linksRef}>
          <Reveal>
            <p className="eyebrow">Before you come</p>
            <p className="guide-intro">
              We've put together everything you need to know about the wedding
              and about travelling in Korea — fair warning, it's very detailed.
            </p>

            <nav className="cards">
              <a className="card card--primary" href={LINKS.rsvp} target="_blank" rel="noopener noreferrer">
                <span className="card-icon">
                  <Icon path={PATHS.envelope} />
                </span>
                <span className="card-text">
                  <strong>RSVP</strong>
                  <small>Let us know you're coming</small>
                </span>
                <Icon path={PATHS.arrow} />
              </a>

              <a className="card" href={LINKS.guide} target="_blank" rel="noopener noreferrer">
                <span className="card-icon">
                  <Icon path={PATHS.book} />
                </span>
                <span className="card-text">
                  <strong>Wedding &amp; Korea guide</strong>
                  <small>Everything you need to know</small>
                </span>
                <Icon path={PATHS.arrow} />
              </a>

              <a className="card" href={LINKS.whatsapp} target="_blank" rel="noopener noreferrer">
                <span className="card-icon">
                  <Icon path={PATHS.chat} />
                </span>
                <span className="card-text">
                  <strong>Guest WhatsApp group</strong>
                  <small>Meet the other guests</small>
                </span>
                <Icon path={PATHS.arrow} />
              </a>
            </nav>
          </Reveal>
        </section>

        {/* ------------------------------------------------------- video */}
        <section className="section">
          <Reveal>
            <p className="eyebrow">What to expect</p>
            <p className="video-caption">
              A traditional Korean ceremony, in case you've never seen one.
            </p>
            <div className="video-frame">
              <iframe
                title="Example of a traditional Korean wedding ceremony"
                src="https://www.youtube-nocookie.com/embed/oFP1a4Ra2Qs"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
              />
            </div>
          </Reveal>
        </section>

        {/* ------------------------------------------------------ footer */}
        <footer className="footer">
          <span className="ornament ornament--light" aria-hidden="true" />
          <p>
            We are so excited to celebrate with you.
            <br />
            Love and hugs from the PraDa family.
          </p>
          <p className="footer-sign">Dayeon &amp; Prannoy</p>
        </footer>
      </main>

      {/* ------------------------------------------------------ floating */}
      <a
        className={`rsvp-float ${showRsvpFloat ? "is-visible" : ""}`}
        href={LINKS.rsvp}
        target="_blank"
        rel="noopener noreferrer"
        aria-hidden={!showRsvpFloat}
        tabIndex={showRsvpFloat ? 0 : -1}
      >
        <Icon path={PATHS.envelope} />
        RSVP
      </a>

      {lightboxIndex !== null && (
        <Lightbox
          index={lightboxIndex}
          count={PHOTOS.length}
          srcFor={fullUrl}
          onChange={setLightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
}

export default Bride;
