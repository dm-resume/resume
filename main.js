const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.getElementById("year").textContent = new Date().getFullYear();

const metricValues = document.querySelectorAll(".metric-value");

const formatCount = (value, suffix) => {
  if (suffix === "K+") {
    return `${value}K+`;
  }

  return `${value}${suffix ?? ""}`;
};

const animateMetric = (element) => {
  const target = Number(element.dataset.count || "0");
  const suffix = element.dataset.suffix || "";

  if (prefersReducedMotion) {
    element.textContent = formatCount(target, suffix);
    return;
  }

  let current = 0;
  const duration = 1300;
  const start = performance.now();

  const tick = (timestamp) => {
    const progress = Math.min((timestamp - start) / duration, 1);
    current = Math.round(target * (1 - Math.pow(1 - progress, 3)));
    element.textContent = formatCount(current, suffix);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if (!prefersReducedMotion) {
  const metricObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateMetric(entry.target);
          metricObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );

  metricValues.forEach((metric) => metricObserver.observe(metric));
} else {
  metricValues.forEach((metric) => animateMetric(metric));
}

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".site-nav a")];

const syncActiveNav = () => {
  const offset = window.scrollY + 180;
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

syncActiveNav();
window.addEventListener("scroll", syncActiveNav, { passive: true });
