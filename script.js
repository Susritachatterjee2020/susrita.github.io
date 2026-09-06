"use strict";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* -------------------------------------------------
   Theme toggle (light / dark) with persistence
   ------------------------------------------------- */
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle?.querySelector("i");
const storedTheme = (() => {
  try { return localStorage.getItem("theme"); } catch { return null; }
})();
const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  if (themeIcon) {
    themeIcon.className = theme === "dark" ? "bx bx-moon" : "bx bx-sun";
  }
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
}

applyTheme(storedTheme || (systemPrefersDark ? "dark" : "light"));

themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try { localStorage.setItem("theme", next); } catch { /* ignore */ }
});

/* -------------------------------------------------
   Mobile navigation
   ------------------------------------------------- */
const menuToggle = document.getElementById("menu-toggle");
const navLinksWrap = document.getElementById("nav-links");
const navLinks = document.querySelectorAll("#nav-links a");

function closeMenu() {
  navLinksWrap?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  const icon = menuToggle?.querySelector("i");
  if (icon) icon.className = "bx bx-menu";
}

menuToggle?.addEventListener("click", () => {
  const isOpen = navLinksWrap?.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(Boolean(isOpen)));
  const icon = menuToggle.querySelector("i");
  if (icon) icon.className = isOpen ? "bx bx-x" : "bx bx-menu";
});

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (targetId && targetId.startsWith("#")) {
      const target = document.querySelector(targetId);
      if (target) {
        event.preventDefault();
        target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
      }
    }
    closeMenu();
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeMenu();
});

/* -------------------------------------------------
   Navbar state + scroll progress bar
   ------------------------------------------------- */
const navbar = document.getElementById("navbar");
const progressBar = document.querySelector(".scroll-progress span");
const toTop = document.getElementById("to-top");

function onScroll() {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  if (progressBar) progressBar.style.width = `${progress}%`;
  navbar?.classList.toggle("scrolled", scrollTop > 20);
  toTop?.classList.toggle("visible", scrollTop > 600);
}

let ticking = false;
window.addEventListener("scroll", () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      onScroll();
      ticking = false;
    });
    ticking = true;
  }
}, { passive: true });
onScroll();

toTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});

/* -------------------------------------------------
   Reveal-on-scroll
   ------------------------------------------------- */
const revealItems = document.querySelectorAll(".reveal");

function revealAll() {
  revealItems.forEach((item) => item.classList.add("visible"));
}

if (prefersReducedMotion || !("IntersectionObserver" in window)) {
  revealAll();
} else {
  // Opt in to the hide-then-animate behaviour only now that we know we can undo it.
  document.documentElement.classList.add("js-anim");

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealItems.forEach((item) => revealObserver.observe(item));

  // Safety net: never leave content hidden if the observer misbehaves
  // (throttled tab, restored scroll position, deep link, etc.).
  window.setTimeout(revealAll, 2500);
  window.addEventListener("load", () => window.setTimeout(revealAll, 400));
}

/* -------------------------------------------------
   Animated stat counters
   ------------------------------------------------- */
const counters = document.querySelectorAll("[data-count]");

function animateCount(el) {
  const target = Number(el.dataset.count) || 0;
  const suffix = el.dataset.suffix || "";
  if (prefersReducedMotion) {
    el.textContent = `${target}${suffix}`;
    return;
  }
  const duration = 1400;
  const start = performance.now();
  function tick(now) {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = `${Math.round(target * eased)}${suffix}`;
    if (p < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

if ("IntersectionObserver" in window) {
  const countObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => countObserver.observe(el));
} else {
  counters.forEach((el) => { el.textContent = `${el.dataset.count}${el.dataset.suffix || ""}`; });
}

/* -------------------------------------------------
   Active nav link on scroll
   ------------------------------------------------- */
const sections = document.querySelectorAll("main section[id], header.hero[id]");

if ("IntersectionObserver" in window) {
  const navObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute("id");
        if (!id || !entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      });
    },
    { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((section) => navObserver.observe(section));
}

/* -------------------------------------------------
   Footer year
   ------------------------------------------------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());
