/* =========================================================
   OxyCare – proposition 3 – script commun
   ========================================================= */
const WHATSAPP = "212677447844"; // format international, sans + ni zéro initial

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

/* ---------- Liens WhatsApp pré-remplis (data-wa="message") ---------- */
const waLink = text => `https://wa.me/${WHATSAPP}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
const pageMessage = document.body.dataset.wa || "Bonjour OxyCare, je souhaite des informations.";
$$("[data-wa]").forEach(a => {
  if (a === document.body) return;
  a.href = waLink(a.dataset.wa || pageMessage);
  a.target = "_blank";
  a.rel = "noopener";
});

/* ---------- Menu ---------- */
const burger = $("#burger"), nav = $("#nav");
burger.addEventListener("click", () => {
  const open = !nav.classList.contains("is-open");
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
});
$$(".nav__group").forEach(group => {
  const toggle = $(".nav__toggle", group);
  toggle.addEventListener("click", () => {
    const open = !group.classList.contains("is-open");
    group.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", open);
  });
  document.addEventListener("click", e => {
    if (!group.contains(e.target)) { group.classList.remove("is-open"); toggle.setAttribute("aria-expanded", "false"); }
  });
});
document.addEventListener("keydown", e => {
  if (e.key !== "Escape") return;
  nav.classList.remove("is-open"); burger.setAttribute("aria-expanded", "false");
  $$(".nav__group").forEach(g => { g.classList.remove("is-open"); $(".nav__toggle", g).setAttribute("aria-expanded", "false"); });
});

/* ---------- Apparition douce ---------- */
const io = new IntersectionObserver(entries => entries.forEach(en => {
  if (en.isIntersecting) { en.target.classList.add("is-visible"); io.unobserve(en.target); }
}), { threshold: 0.12 });
$$(".reveal").forEach(el => io.observe(el));

/* ---------- Formulaire de secours → WhatsApp ---------- */
const form = $("#contactForm");
if (form) {
  const type = new URLSearchParams(location.search).get("demande");
  if (type) form.type.value = type;
  form.addEventListener("submit", e => {
    e.preventDefault();
    const ok = form.name.value.trim() && form.phone.value.replace(/\D/g, "").length >= 9 && form.type.value;
    $("#formError").classList.toggle("is-visible", !ok);
    if (!ok) return;
    const msg = [
      "Bonjour OxyCare,",
      `Demande : ${form.type.value}`,
      form.zone.value && `Secteur : ${form.zone.value}`,
      `Nom : ${form.name.value.trim()}`,
      `Numéro : ${form.phone.value.trim()}`,
      form.message.value.trim() && `Message : ${form.message.value.trim()}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(msg), "_blank", "noopener");
    $("#formOk").classList.add("is-visible");
  });
}

$$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
