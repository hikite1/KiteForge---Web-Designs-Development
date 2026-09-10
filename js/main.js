// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Mobile navigation toggle
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("site-nav");

if (toggle && nav) {
  const setOpen = (open) => {
    nav.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  };

  toggle.addEventListener("click", () => {
    setOpen(nav.classList.contains("open") === false);
  });

  // Close after tapping a link
  nav.addEventListener("click", (e) => {
    if (e.target.tagName === "A") setOpen(false);
  });

  // Close when leaving mobile width
  window.matchMedia("(min-width: 761px)").addEventListener("change", (e) => {
    if (e.matches) setOpen(false);
  });
}

// Contact form: submit to Netlify in the background, swap in a thank-you
const form = document.querySelector(".contact-form");
const formStatus = document.querySelector(".form-status");

if (form && formStatus) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const button = form.querySelector("button[type=submit]");
    button.disabled = true;
    button.textContent = "Sending...";

    try {
      const body = new URLSearchParams(new FormData(form)).toString();
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });
      if (!res.ok) throw new Error(String(res.status));

      form.hidden = true;
      formStatus.textContent =
        "Thanks. Your message is in. We'll reply within a couple of days.";
      formStatus.classList.add("ok");
      formStatus.hidden = false;
    } catch (err) {
      button.disabled = false;
      button.textContent = "Send";
      formStatus.textContent =
        "Something went wrong sending that. Email kiteforge1@gmail.com instead.";
      formStatus.classList.add("err");
      formStatus.hidden = false;
    }
  });
}

// Responsive Facebook Page Plugin: keep the embed width matched to its column
const fb = document.querySelector(".fb-embed");
if (fb) {
  const base = fb.src.replace(/([?&])width=\d+/, "$1").replace(/[?&]$/, "");
  const join = base.includes("?") ? "&" : "?";
  const sizeFb = () => {
    const w = Math.max(180, Math.min(500, Math.floor(fb.parentElement.clientWidth)));
    if (fb.dataset.w === String(w)) return;
    fb.dataset.w = String(w);
    fb.src = `${base}${join}width=${w}`;
  };
  sizeFb();
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(sizeFb, 250);
  });
}
