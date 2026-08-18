(function () {
  var progress = document.createElement("div");
  progress.className = "scroll-progress";
  document.body.appendChild(progress);

  function updateProgress() {
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    var max = document.documentElement.scrollHeight - window.innerHeight;
    var percent = max > 0 ? (scrollTop / max) * 100 : 0;
    progress.style.width = percent + "%";
  }

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();

  var revealItems = document.querySelectorAll(
    ".section-head, .card, .feature-item, .step, .image-panel, .cta-band, .hero-showcase"
  );

  revealItems.forEach(function (item, index) {
    if (!item.hasAttribute("data-reveal")) {
      item.setAttribute("data-reveal", "up");
    }
    item.style.transitionDelay = Math.min(index % 6, 5) * 70 + "ms";
  });

  document.body.classList.add("reveal-ready");

  if (!("IntersectionObserver" in window)) {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach(function (item) {
    observer.observe(item);
  });
})();

(function () {
  var STORAGE_KEY = "yfz_privacy_consent";
  var banner = document.createElement("aside");
  banner.className = "consent-banner";
  banner.setAttribute("role", "region");
  banner.setAttribute("aria-label", "Privacy consent");
  banner.innerHTML =
    '<div class="consent-copy">' +
      '<strong>Privacy &amp; Cookie Notice</strong>' +
      'We use a small set of cookies and similar tools to keep this website ' +
      'secure, remember preferences, and understand how it is used. By ' +
      'clicking "Accept" you agree to our ' +
      '<a href="privacy.html">Privacy Policy</a> and ' +
      '<a href="terms.html">Terms of Service</a>.' +
    '</div>' +
    '<div class="consent-actions">' +
      '<button type="button" class="button outline" data-consent-action="decline">Decline</button>' +
      '<button type="button" class="button primary" data-consent-action="accept">Accept</button>' +
    '</div>';
  document.body.appendChild(banner);

  function readConsent() {
    try {
      return window.localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function writeConsent(value) {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch (e) {
      /* localStorage may be unavailable; consent is still acknowledged for this session */
    }
  }

  if (!readConsent()) {
    window.setTimeout(function () {
      banner.classList.add("is-visible");
    }, 320);
  }

  banner.addEventListener("click", function (event) {
    var target = event.target.closest("[data-consent-action]");
    if (!target) {
      return;
    }
    var action = target.getAttribute("data-consent-action");
    writeConsent(action === "accept" ? "accepted" : "declined");
    banner.classList.remove("is-visible");
    window.setTimeout(function () {
      if (banner.parentNode) {
        banner.parentNode.removeChild(banner);
      }
    }, 480);
  });
})();
