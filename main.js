(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById("menu-toggle");
  const siteNav = document.getElementById("site-nav");

  if (menuToggle && siteNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = siteNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    siteNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        siteNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });
  }

  // Scroll reveal
  const revealElements = document.querySelectorAll(".reveal");

  if (!prefersReducedMotion && revealElements.length) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    revealElements.forEach((el) => el.classList.add("visible"));
  }

  // Metric count-up
  const metricValues = document.querySelectorAll(".metric-number");

  const formatCount = (value, suffix) => {
    if (suffix === "K+") return `${value}K+`;
    return `${value}${suffix || ""}`;
  };

  const animateMetric = (element) => {
    const target = Number(element.dataset.count || "0");
    const suffix = element.dataset.suffix || "";

    if (prefersReducedMotion) {
      element.textContent = formatCount(target, suffix);
      return;
    }

    let current = 0;
    const duration = 1400;
    const start = performance.now();

    const tick = (timestamp) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(target * eased);
      element.textContent = formatCount(current, suffix);

      if (progress < 1) {
        requestAnimationFrame(tick);
      }
    };

    requestAnimationFrame(tick);
  };

  if (!prefersReducedMotion && metricValues.length) {
    const metricObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateMetric(entry.target);
            metricObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    metricValues.forEach((metric) => metricObserver.observe(metric));
  } else {
    metricValues.forEach((metric) => animateMetric(metric));
  }

  // Active nav sync
  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".site-nav a")];

  const syncActiveNav = () => {
    const offset = window.scrollY + 120;
    let activeId = sections[0]?.id;

    sections.forEach((section) => {
      if (offset >= section.offsetTop) {
        activeId = section.id;
      }
    });

    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${activeId}`;
      link.classList.toggle("active", isActive);
    });
  };

  if (navLinks.length) {
    syncActiveNav();
    window.addEventListener("scroll", syncActiveNav, { passive: true });
  }
})();
