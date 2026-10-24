const scenarios = {
  latency: {
    intent: "“Show customers useful flight options without making them wait.”",
    caller: "GET /offers",
    callerFact: "Travel app · search endpoint",
    downstream: "GET /flights",
    downstreamFact: "Vendor A · 15-second response",
    requirement: "A fast first response",
    first: "Within 500 ms",
    second: "Up to 60 s old",
    detail: "Caching explicitly permitted",
    title: "Plug considers scheduled caching.",
    reason:
      "The edge defines response time and freshness. With cache permission, Plug evaluates serving eligible results from a refreshed cache and exposes the remaining assumptions.",
  },
  duplicates: {
    intent: "“Each confirmed order should create exactly one shipment.”",
    caller: "POST /orders",
    callerFact: "Commerce platform · order endpoint",
    downstream: "POST /shipments",
    downstreamFact: "Vendor B · fulfillment endpoint",
    requirement: "One intended side effect",
    first: "No duplicates",
    second: "Retry safely",
    detail: "Delivery may happen more than once",
    title: "Plug considers an idempotent consumer.",
    reason:
      "The edge forbids duplicate side effects. Plug evaluates deduplication and checks the identity and persistence obligations needed to make redelivery safe.",
  },
  bursts: {
    intent: "“Accept the campaign traffic without overwhelming our provider.”",
    caller: "POST /campaigns",
    callerFact: "Marketing platform · campaign endpoint",
    downstream: "POST /messages",
    downstreamFact: "Vendor C · fixed request quota",
    requirement: "Stay within the quota",
    first: "Deferred delivery",
    second: "Bounded waiting",
    detail: "Declare a final completion deadline",
    title: "Plug considers queue-based load leveling.",
    reason:
      "The edge allows deferred completion. Plug evaluates buffering bursts and draining within capacity, while keeping sustained load, queue bounds, and deadlines explicit.",
  },
};
const carousel = document.querySelector(".architecture");
const tabs = [...document.querySelectorAll("[data-scenario]")];
const panel = document.getElementById("scenario-panel");
const toggle = document.getElementById("slideshow-toggle");
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
const duration = 8000;
let activeIndex = 0;
let userPaused = motion.matches;
let hovered = false;
let inView = true;
let timer;
let progress;
let transition;

function updatePlayback() {
  clearTimeout(timer);
  progress?.cancel();
  const playing = !userPaused && !hovered && !document.hidden && inView;
  carousel.dataset.playing = String(playing);
  toggle.textContent = userPaused ? "Play slideshow" : "Pause slideshow";
  toggle.setAttribute(
    "aria-label",
    userPaused ? "Play slideshow" : "Pause slideshow",
  );
  panel.setAttribute("aria-live", playing ? "off" : "polite");
  document.getElementById("playback-status").textContent = playing
    ? "ADVANCES EVERY 8 SECONDS"
    : "PAUSED · EXPLORE AT YOUR PACE";
  if (!playing) return;
  const bar = tabs[activeIndex].querySelector(".tab-progress");
  if (!motion.matches)
    progress = bar.animate(
      [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }],
      {
        duration,
        easing: "linear",
        fill: "forwards",
      },
    );
  timer = setTimeout(
    () => selectScenario((activeIndex + 1) % tabs.length),
    duration,
  );
}
function selectScenario(index, manual = false, focus = false) {
  activeIndex = index;
  if (manual) userPaused = true;
  const tab = tabs[index];
  const scenario = scenarios[tab.dataset.scenario];
  const fields = {
    "business-intent": scenario.intent,
    "caller-name": scenario.caller,
    "caller-fact": scenario.callerFact,
    "downstream-name": scenario.downstream,
    "downstream-fact": scenario.downstreamFact,
    "requirement-name": scenario.requirement,
    "requirement-first": scenario.first,
    "requirement-second": scenario.second,
    "requirement-detail": scenario.detail,
    "reason-title": scenario.title,
    "reason-detail": scenario.reason,
  };
  for (const [id, value] of Object.entries(fields))
    document.getElementById(id).textContent = value;
  tabs.forEach((item, position) => {
    item.setAttribute("aria-selected", String(position === index));
    item.tabIndex = position === index ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", tab.id);
  document.getElementById("slide-count").textContent =
    "0" + (index + 1) + " / 03";
  transition?.cancel();
  if (!motion.matches)
    transition = panel.animate(
      [
        { opacity: 0.25, transform: "translateY(5px)" },
        { opacity: 1, transform: "translateY(0)" },
      ],
      { duration: 380, easing: "ease-out" },
    );
  if (focus) tab.focus();
  updatePlayback();
}
tabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectScenario(index, true));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    if (event.key === "ArrowLeft")
      next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = tabs.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      selectScenario(next, true, true);
    }
  });
});
document
  .getElementById("previous-slide")
  .addEventListener("click", () =>
    selectScenario((activeIndex + tabs.length - 1) % tabs.length, true),
  );
document
  .getElementById("next-slide")
  .addEventListener("click", () =>
    selectScenario((activeIndex + 1) % tabs.length, true),
  );
toggle.addEventListener("click", () => {
  userPaused = !userPaused;
  hovered = false;
  updatePlayback();
});
carousel.addEventListener("pointerenter", (event) => {
  if (event.pointerType === "mouse") {
    hovered = true;
    updatePlayback();
  }
});
carousel.addEventListener("pointerleave", () => {
  hovered = false;
  updatePlayback();
});
carousel.addEventListener("focusin", (event) => {
  if (event.target !== toggle || event.target.matches(":focus-visible")) {
    userPaused = true;
    updatePlayback();
  }
});
document.addEventListener("visibilitychange", updatePlayback);
motion.addEventListener("change", () => {
  if (motion.matches) userPaused = true;
  updatePlayback();
});
if ("IntersectionObserver" in window) {
  new IntersectionObserver(
    (entries) => {
      inView = entries[0].isIntersecting;
      updatePlayback();
    },
    { threshold: 0.15 },
  ).observe(carousel);
}
updatePlayback();

const copyButton = document.getElementById("copy-commands");
let copyReset;
copyButton.addEventListener("click", async () => {
  const code = document.getElementById("setup-commands");
  const status = document.getElementById("copy-status");
  clearTimeout(copyReset);
  try {
    await navigator.clipboard.writeText(code.textContent.trim());
    copyButton.textContent = "Copied ✓";
    status.textContent = "Setup commands copied.";
  } catch {
    const range = document.createRange();
    range.selectNodeContents(code);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = "Selected";
    status.textContent =
      "Commands selected. Press Control C or Command C to copy.";
  }
  copyReset = setTimeout(() => {
    copyButton.textContent = "Copy ⧉";
    status.textContent = "";
  }, 3500);
});
