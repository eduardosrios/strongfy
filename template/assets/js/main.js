(function ($) {
  "use strict";

  const $trial = $("#trial-offer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $(document).on("click", "a[href^='#']", function (event) {
    const targetId = this.getAttribute("href");
    const $target = targetId && targetId !== "#" ? $(targetId) : $();

    if (!$target.length) {
      return;
    }

    event.preventDefault();
    $target.get(0).scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: targetId === "#trial-offer" ? "center" : "start"
    });

    if (targetId === "#trial-offer") {
      $trial.addClass("is-highlighted").trigger("focus");
      window.setTimeout(function () {
        $trial.removeClass("is-highlighted");
      }, 1200);
    }

    const nav = document.getElementById("primaryNav");
    if (nav && nav.classList.contains("show")) {
      bootstrap.Collapse.getOrCreateInstance(nav).hide();
    }
  });

  $(".program-option").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".program-selector");
    const $image = $section.find(".program-selector__visual img");

    $button.addClass("is-active").attr("aria-selected", "true")
      .siblings().removeClass("is-active").attr("aria-selected", "false");
    $("#programTag").text($button.find("span").text() + " / " + $button.data("title"));
    $("#programCopy").text($button.data("copy"));
    $image.attr({ src: $button.data("image"), alt: $button.data("title") + " training" });
  });

  $("[data-billing]").on("click", function () {
    const $button = $(this);
    const billing = $button.data("billing");
    $button.addClass("is-active").attr("aria-pressed", "true")
      .siblings().removeClass("is-active").attr("aria-pressed", "false");
    $("[data-monthly][data-annual]").each(function () {
      const $price = $(this);
      $price.text(billing === "annual" ? $price.data("annual") : $price.data("monthly"));
    });
  });

  $(".story-card").on("click", function () {
    $("#storyStatus").text($(this).data("story"));
    $(this).attr("aria-pressed", "true").siblings().attr("aria-pressed", "false");
  });

  $("[data-class-filter]").on("click", function () {
    const $button = $(this);
    const filter = $button.data("class-filter");
    $button.addClass("is-active").attr("aria-selected", "true")
      .siblings().removeClass("is-active").attr("aria-selected", "false");
    $(".class-tabs__grid [data-class]").each(function () {
      this.hidden = filter !== "all" && $(this).data("class") !== filter;
    });
  });

  const dayNames = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };
  $("[data-day]").on("click", function () {
    const $button = $(this);
    const day = $button.data("day");
    $button.addClass("is-active").attr("aria-selected", "true")
      .siblings().removeClass("is-active").attr("aria-selected", "false");
    $("#scheduleList [data-days]").each(function () {
      this.hidden = !String($(this).data("days")).split(" ").includes(day);
    });
    $("#scheduleStatus").text("Showing " + dayNames[day] + " sessions.");
  });

  $("#scheduleList article button").on("click", function () {
    const $button = $(this);
    const className = $button.closest("article").find("h3").text();
    const reserved = !$button.hasClass("is-reserved");
    $button.toggleClass("is-reserved", reserved).text(reserved ? "Reserved" : "Reserve")
      .attr("aria-pressed", String(reserved));
    $("#scheduleStatus").text(className + (reserved ? " reserved. We’ll hold your place." : " reservation removed."));
  });

  $("#trialForm").on("submit", function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    const name = $("#trialName").val().trim();
    $("#trialFormStatus").text("Thanks, " + name + ". Your Strongfy start plan is on its way.");
    $(this).find("button[type='submit']").html("Request sent <i class='fa-solid fa-check'></i>").prop("disabled", true);
  });

  $("#newsletterForm").on("submit", function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    $("#newsletterStatus").text("You’re in. Your first Strongfy update is on the way.");
    $(this).find("button[type='submit']").html("Subscribed <i class='fa-solid fa-check'></i>").prop("disabled", true);
  });

  const heroInsights = [
    { quote: "“Your muscles grow while you sleep. Make 7–9 hours your secret weapon for maximum progress.”", location: "Brooklyn, NY", date: "Jul. 28" },
    { quote: "“The best program is the one you can repeat with intent. Build the week before you chase the year.”", location: "Austin, TX", date: "Aug. 04" },
    { quote: "“Train the movement you want to trust under pressure. Strength is confidence you can use.”", location: "Portland, OR", date: "Aug. 11" }
  ];
  let insightIndex = 0;
  let insightTimer;

  function showInsight(nextIndex) {
    const $quote = $("#heroQuote");
    insightIndex = (nextIndex + heroInsights.length) % heroInsights.length;
    $quote.addClass("is-changing");
    window.setTimeout(function () {
      const insight = heroInsights[insightIndex];
      $quote.text(insight.quote).removeClass("is-changing");
      $("#heroQuoteLocation").text(insight.location);
      $("#heroQuoteDate").text(insight.date);
    }, reducedMotion ? 0 : 160);
  }

  function restartInsightTimer() {
    window.clearInterval(insightTimer);
    if (!reducedMotion) {
      insightTimer = window.setInterval(function () { showInsight(insightIndex + 1); }, 7000);
    }
  }

  $("[data-quote-direction]").on("click", function () {
    showInsight(insightIndex + ($(this).data("quote-direction") === "next" ? 1 : -1));
    restartInsightTimer();
  });
  restartInsightTimer();

  const counterObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const duration = reducedMotion ? 0 : 950;
      const start = performance.now();
      function render(now) {
        const progress = duration ? Math.min((now - start) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = target >= 10000 ? (value / 1000).toFixed(1) + "K" : value.toLocaleString("en-US");
        if (progress < 1) requestAnimationFrame(render);
      }
      requestAnimationFrame(render);
      observer.unobserve(element);
    });
  }, { threshold: 0.55 }) : null;
  $("[data-count]").each(function () { if (counterObserver) counterObserver.observe(this); });

  if (!reducedMotion && "IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    $(".section-head, .body-section .content-wrap > :not(.section-head), .footer-cta__content, .footer-identity, .footer-newsletter").each(function () {
      this.classList.add("reveal-ready");
      revealObserver.observe(this);
    });
  }

  let scrollTicking = false;
  function updateScrollUi() {
    const maxScroll = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
    const progress = Math.min(window.scrollY / maxScroll, 1);
    const heroBottom = document.querySelector(".hero").getBoundingClientRect().bottom;
    const contactTop = document.querySelector("#contact").getBoundingClientRect().top;
    $("#scrollProgressBar").css("transform", "scaleX(" + progress + ")");
    $("#floatingTrial").toggleClass("is-visible", heroBottom < 0 && contactTop > window.innerHeight * 0.3);
    $(".reveal-ready:not(.is-revealed)").each(function () {
      const rect = this.getBoundingClientRect();
      if (rect.top < window.innerHeight * 1.08 && rect.bottom > -80) this.classList.add("is-revealed");
    });
    scrollTicking = false;
  }
  window.addEventListener("scroll", function () {
    if (!scrollTicking) {
      requestAnimationFrame(updateScrollUi);
      scrollTicking = true;
    }
  }, { passive: true });
  updateScrollUi();

  if ("IntersectionObserver" in window) {
    const navTargets = ["about", "services", "schedule", "spaces", "membership", "contact"];
    const navObserver = new IntersectionObserver(function (entries) {
      const visible = entries.filter(function (entry) { return entry.isIntersecting; }).sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; })[0];
      if (!visible) return;
      $(".hero-nav .nav-link").removeClass("is-active").filter("[href='#" + visible.target.id + "']").addClass("is-active");
    }, { rootMargin: "-30% 0px -55%", threshold: [0, 0.2, 0.5] });
    navTargets.forEach(function (id) { const target = document.getElementById(id); if (target) navObserver.observe(target); });
  }

  const $modal = $("#mediaModal");
  const $modalImage = $("#mediaModalImage");
  let modalItems = [];
  let modalIndex = 0;
  let modalTrigger = null;

  function renderModalItem() {
    const item = modalItems[modalIndex];
    $modalImage.attr({ src: item.src, alt: item.alt });
    $("#mediaModalKicker").text(item.kicker);
    $("#mediaModalTitle").text(item.title);
    $("#mediaModalCopy").text(item.copy);
    $("#mediaModalCount").text((modalIndex + 1) + " / " + modalItems.length);
    $modal.find("[data-modal-direction]").prop("disabled", modalItems.length < 2);
  }

  function openModal(items, index, trigger) {
    modalItems = items;
    modalIndex = index;
    modalTrigger = trigger;
    renderModalItem();
    $modal.prop("hidden", false);
    $(document.body).addClass("is-modal-open");
    window.setTimeout(function () { $modal.find(".media-modal__close").trigger("focus"); }, 0);
    $("#siteInteractionStatus").text("Media viewer opened.");
  }

  function closeModal() {
    $modal.prop("hidden", true);
    $(document.body).removeClass("is-modal-open");
    if (modalTrigger) modalTrigger.focus();
    $("#siteInteractionStatus").text("Media viewer closed.");
  }

  const galleryFigures = [...document.querySelectorAll(".gallery-marquee figure, .training-gallery figure")];
  const galleryItems = galleryFigures.map(function (figure) {
    const image = figure.querySelector("img");
    const caption = figure.querySelector("figcaption")?.textContent.trim() || "Strongfy training";
    figure.tabIndex = 0;
    figure.setAttribute("role", "button");
    figure.setAttribute("aria-label", "Open " + caption + " in media viewer");
    return { src: image.src, alt: image.alt, kicker: "Inside Strongfy", title: caption, copy: image.alt + "." };
  });

  galleryFigures.forEach(function (figure, index) {
    function activate() { openModal(galleryItems, index, figure); }
    figure.addEventListener("click", activate);
    figure.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
    });
  });

  $(".story-card").on("click", function () {
    const image = this.querySelector("img");
    openModal([{ src: image.src, alt: image.alt, kicker: "Member story", title: $(this).find("strong").text(), copy: $(this).data("story") + " " + $(this).find("small").text() + "." }], 0, this);
  });

  $("[data-modal-direction]").on("click", function () {
    modalIndex = (modalIndex + ($(this).data("modal-direction") === "next" ? 1 : -1) + modalItems.length) % modalItems.length;
    renderModalItem();
  });
  $("[data-modal-close]").on("click", closeModal);
  document.addEventListener("keydown", function (event) {
    if ($modal.prop("hidden")) return;
    if (event.key === "Escape") {
      closeModal();
      return;
    }
    if (event.key === "ArrowLeft" && modalItems.length > 1) {
      modalIndex = (modalIndex - 1 + modalItems.length) % modalItems.length;
      renderModalItem();
      return;
    }
    if (event.key === "ArrowRight" && modalItems.length > 1) {
      modalIndex = (modalIndex + 1) % modalItems.length;
      renderModalItem();
      return;
    }
    if (event.key !== "Tab") return;
    const focusable = [...$modal[0].querySelectorAll(".media-modal__dialog button:not([disabled])")];
    if (!focusable.length) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });

  function buildVideoVariants() {
    const variants = [
      ["04", "assets/videos/personal-coaching.mp4", "Personal coaching session"],
      ["06", "assets/videos/treadmill-cardio.mp4", "Treadmill conditioning session"],
      ["13", "assets/videos/boxing-drills.mp4", "Boxing performance drills"],
      ["17", "assets/videos/battle-ropes.mp4", "High-intensity battle ropes session"],
      ["29", "assets/videos/mobility-stretch.mp4", "Mobility and stretching session"],
      ["32", "assets/videos/strength-barbell.mp4", "Barbell strength session"]
    ];

    variants.forEach(function ([sectionNumber, source, label]) {
      const original = document.querySelector(".body-section[data-section='" + sectionNumber + "']");
      if (!original || document.querySelector(".body-section[data-video-source='" + source + "']")) return;
      const duplicate = original.cloneNode(true);
      duplicate.removeAttribute("id");
      duplicate.dataset.section = sectionNumber + "-video";
      duplicate.dataset.videoSource = source;
      duplicate.classList.add("video-variant");
      duplicate.querySelectorAll("[id]").forEach(function (node) { node.removeAttribute("id"); });
      duplicate.querySelectorAll(".reveal-ready").forEach(function (node) {
        node.classList.remove("reveal-ready");
        node.classList.add("is-revealed");
      });
      duplicate.querySelectorAll("img:not(.concept-icon):not(.brand__mark)").forEach(function (image) {
        const video = document.createElement("video");
        video.src = source;
        video.autoplay = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "metadata";
        video.setAttribute("aria-label", label);
        image.replaceWith(video);
      });
      const index = duplicate.querySelector(".section-index");
      if (index) index.textContent = sectionNumber + "V / 36";
      original.insertAdjacentElement("afterend", duplicate);
    });
  }

  function replaceComplexConceptIcons() {
    const sources = [
      ["assets/images/icons/kettlebell.png", "Kettlebell"],
      ["assets/images/icons/strength-kit.png", "Strength equipment"],
      ["assets/images/icons/trainer.png", "Personal coaching"],
      ["assets/images/icons/stopwatch.png", "Timed performance"]
    ];
    const icons = document.querySelectorAll(".benefits-grid__items article > i, .amenities-index__grid article > i, .feature-manifesto__points article > i, .workout-categories__grid article > i, .power-pillars__grid article > i, .coaching-steps__list i, .journey-process__line i");
    icons.forEach(function (icon, index) {
      const item = sources[index % sources.length];
      const image = document.createElement("img");
      image.className = "concept-icon";
      image.src = item[0];
      image.alt = item[1];
      image.width = 42;
      image.height = 42;
      icon.replaceWith(image);
    });
  }

  function addBootstrapStructure() {
    document.querySelectorAll(".content-wrap").forEach(function (container) { container.classList.add("container"); });
    document.querySelectorAll("[class*='__grid'], [class*='__layout'], [class*='__cards'], [class*='__list'], [class*='__rail'], .feature-manifesto__points").forEach(function (layout) {
      if (!layout.children.length || layout.closest(".nav-submenu")) return;
      layout.classList.add("row", "g-4", "bootstrap-grid");
      const count = layout.children.length;
      layout.querySelectorAll(":scope > *").forEach(function (child) {
        child.classList.add("col-12", count >= 4 ? "col-md-6" : "col-md");
      });
    });
  }

  function addReferenceLinks() {
    const base = "http://localhost/templates/Gym/referencias/references-used/";
    const originalExtensions = { 1:"jpg",2:"jpg",3:"webp",4:"webp",5:"webp",6:"webp",7:"webp",8:"webp",9:"webp",10:"webp",11:"webp",12:"webp",13:"jpg",14:"jpg",15:"jpg",16:"webp",17:"webp",18:"webp",19:"webp",20:"webp",21:"png",22:"png",23:"png",24:"png",25:"png",26:"png",27:"webp",28:"webp",29:"webp",30:"webp",31:"webp",32:"webp",33:"webp",34:"webp",35:"png",36:"jpg" };
    const inlineStyle = "position:absolute;top:50px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;border:4px solid #050806;border-radius:50%;background:#ffffff;color:#050806;font-size:24px;font-weight:800;line-height:1;opacity:.5;z-index:2600;text-decoration:none;";
    function link(label, href, right, title) {
      const anchor = document.createElement("a");
      anchor.className = "reference-link";
      anchor.href = encodeURI(href);
      anchor.target = "_blank";
      anchor.rel = "noopener noreferrer";
      anchor.title = title;
      anchor.setAttribute("aria-label", title);
      anchor.setAttribute("style", inlineStyle + "right:" + right + "px;");
      anchor.textContent = label;
      return anchor;
    }
    const hero = document.querySelector(".hero");
    if (hero && !hero.querySelector(".reference-link")) hero.append(link("C", base + "hero/cutted-section/hero-cropped.webp", 80, "Open cropped hero reference"), link("O", base + "hero/original/hero-original.jpg", 10, "Open original hero reference"));
    document.querySelectorAll(".body-section").forEach(function (section) {
      if (section.querySelector(".reference-link")) return;
      const n = Number(String(section.dataset.section).split("-")[0]);
      const folder = base + "body-content/section " + n + "/";
      const file = "section-" + String(n).padStart(2,"0");
      section.append(link("C", folder + "cutted-section/" + file + "-cropped.webp", 80, "Open cropped reference for section " + n), link("O", folder + "original/" + file + "-original." + originalExtensions[n], 10, "Open original reference for section " + n));
    });
    const footer = document.querySelector(".site-footer");
    if (footer && !footer.querySelector(".reference-link")) footer.append(link("C", base + "footer/cutted-section/footer-cropped.webp", 80, "Open cropped footer reference"), link("O", base + "footer/original/footer-original.png", 10, "Open original footer reference"));
  }

  function buildStickyTopbar() {
    const nav = document.querySelector(".hero-nav");
    if (!nav || document.querySelector(".scroll-topbar")) return;
    const bar = document.createElement("header");
    bar.className = "scroll-topbar";
    bar.setAttribute("aria-label", "Sticky navigation");
    const clone = nav.cloneNode(true);
    clone.classList.add("scroll-topbar__nav");
    const collapse = clone.querySelector("#primaryNav");
    if (collapse) collapse.id = "stickyPrimaryNav";
    const toggle = clone.querySelector("[data-bs-target='#primaryNav']");
    if (toggle) { toggle.dataset.bsTarget = "#stickyPrimaryNav"; toggle.setAttribute("aria-controls", "stickyPrimaryNav"); }
    bar.append(clone);
    document.body.prepend(bar);
    let previousY = window.scrollY;
    function update() {
      const currentY = window.scrollY;
      const pastHero = currentY > Math.max(220, document.querySelector(".hero").offsetHeight * .65);
      bar.classList.toggle("is-visible", pastHero && currentY < previousY);
      previousY = currentY;
    }
    window.addEventListener("scroll", update, { passive:true });
    update();
  }

  $(document).on("click", ".submenu-toggle", function (event) {
    event.preventDefault();
    event.stopPropagation();
    const item = this.closest(".nav-item--submenu");
    const open = !item.classList.contains("is-open");
    this.closest(".hero-nav").querySelectorAll(".nav-item--submenu.is-open").forEach(function (other) {
      if (other !== item) { other.classList.remove("is-open"); other.querySelector(".submenu-toggle")?.setAttribute("aria-expanded","false"); }
    });
    item.classList.toggle("is-open", open);
    this.setAttribute("aria-expanded", String(open));
    this.querySelector("i")?.classList.toggle("fa-chevron-down", !open);
    this.querySelector("i")?.classList.toggle("fa-chevron-up", open);
  });
  $(document).on("click", function () {
    document.querySelectorAll(".nav-item--submenu.is-open").forEach(function (item) {
      item.classList.remove("is-open");
      item.querySelector(".submenu-toggle")?.setAttribute("aria-expanded","false");
    });
  });

  buildVideoVariants();
  replaceComplexConceptIcons();
  addBootstrapStructure();
  addReferenceLinks();
  buildStickyTopbar();
  $("[data-day='mon']").trigger("click");
})(jQuery);
