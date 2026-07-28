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
    $section.find(".program-selector__visual > span").text($button.find("span").text() + " / " + $button.data("title"));
    $section.find(".program-selector__list > p").text($button.data("copy"));
    $image.attr({ src: $button.data("image"), alt: $button.data("title") + " training" });
  });

  $("[data-billing]").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".pricing-matrix");
    const billing = $button.data("billing");
    $button.addClass("is-active").attr("aria-pressed", "true")
      .siblings().removeClass("is-active").attr("aria-pressed", "false");
    $section.find("[data-monthly][data-annual]").each(function () {
      const $price = $(this);
      $price.text(billing === "annual" ? $price.data("annual") : $price.data("monthly"));
    });
  });

  $(".story-card").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".member-stories");
    $section.find(".story-status").text($button.data("story"));
    $button.attr("aria-pressed", "true").siblings().attr("aria-pressed", "false");
  });

  $("[data-class-filter]").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".class-tabs");
    const filter = $button.data("class-filter");
    $button.addClass("is-active").attr("aria-selected", "true")
      .siblings().removeClass("is-active").attr("aria-selected", "false");
    $section.find(".class-tabs__grid [data-class]").each(function () {
      this.hidden = filter !== "all" && $(this).data("class") !== filter;
    });
  });

  const dayNames = { mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday" };
  $("[data-day]").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".schedule-board");
    const day = $button.data("day");
    $button.addClass("is-active").attr("aria-selected", "true")
      .siblings().removeClass("is-active").attr("aria-selected", "false");
    $section.find(".schedule-board__list [data-days]").each(function () {
      this.hidden = !String($(this).data("days")).split(" ").includes(day);
    });
    $section.find(".schedule-status").text("Showing " + dayNames[day] + " sessions.");
  });

  $(".schedule-board__list article button").on("click", function () {
    const $button = $(this);
    const $section = $button.closest(".schedule-board");
    const className = $button.closest("article").find("h3").text();
    const reserved = !$button.hasClass("is-reserved");
    $button.toggleClass("is-reserved", reserved).text(reserved ? "Reserved" : "Reserve")
      .attr("aria-pressed", String(reserved));
    $section.find(".schedule-status").text(className + (reserved ? " reserved. We’ll hold your place." : " reservation removed."));
  });

  $(".trial-form").on("submit", function (event) {
    event.preventDefault();
    if (!this.checkValidity()) {
      this.reportValidity();
      return;
    }
    const $form = $(this);
    const name = $form.find("input[name='name']").val().trim();
    $form.find(".trial-form__status").text("Thanks, " + name + ". Your Strongfy start plan is on its way.");
    $form.find("button[type='submit']").html("Request sent <i class='fa-solid fa-check'></i>").prop("disabled", true);
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
    let multiCopyEnabled = false;
    let lastClipboardValue = "";
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
    async function readClipboardValue() {
      try {
        return await navigator.clipboard.readText();
      } catch (error) {
        return lastClipboardValue;
      }
    }
    async function writeClipboardValue(value) {
      const text = String(value);
      try {
        await navigator.clipboard.writeText(text);
      } catch (error) {
        const field = document.createElement("textarea");
        field.value = text;
        field.setAttribute("readonly", "");
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.append(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw error;
      }
      lastClipboardValue = text;
    }
    function appendSectionNumber(currentValue, number) {
      const current = String(currentValue || "").trim();
      if (!/^\d+(?:\s*,\s*\d+)*$/.test(current)) return String(number);
      return current.split(/\s*,\s*/).concat(String(number)).join(",");
    }
    function setMultiCopyState(enabled) {
      multiCopyEnabled = enabled;
      document.querySelectorAll(".reference-link--multi").forEach(function (button) {
        button.classList.toggle("is-active", enabled);
        button.style.backgroundColor = enabled ? "#22c55e" : "#ffffff";
        button.style.opacity = enabled ? "1" : ".5";
        button.title = enabled ? "Disable multiple section copy" : "Enable multiple section copy";
        button.setAttribute("aria-label", button.title);
        button.setAttribute("aria-pressed", String(enabled));
      });
      const status = document.getElementById("siteInteractionStatus");
      if (status) status.textContent = "Multiple section copy " + (enabled ? "enabled." : "disabled.");
    }
    function sectionLink(section, number) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reference-link reference-link--section";
      button.title = "Copy section " + number;
      button.dataset.sectionNumber = String(number);
      button.setAttribute("aria-label", "Copy section " + number + " to clipboard");
      button.setAttribute("style", inlineStyle + "top:120px;right:80px;padding:0;cursor:pointer;");
      button.textContent = number;
      button.addEventListener("click", async function () {
        const status = document.getElementById("siteInteractionStatus");
        try {
          const currentValue = multiCopyEnabled ? await readClipboardValue() : "";
          const nextValue = multiCopyEnabled ? appendSectionNumber(currentValue, number) : String(number);
          await writeClipboardValue(nextValue);
          button.textContent = "✓";
          button.setAttribute("aria-label", "Section " + number + " copied");
          if (status) status.textContent = multiCopyEnabled ? "Copied section list: " + nextValue + "." : "Section " + number + " copied to clipboard.";
        } catch (error) {
          button.textContent = "!";
          button.setAttribute("aria-label", "Could not copy section " + number);
          if (status) status.textContent = "Could not copy section " + number + ".";
        }
        window.setTimeout(function () {
          button.textContent = number;
          button.setAttribute("aria-label", "Copy section " + number + " to clipboard");
        }, 900);
      });
      return button;
    }
    function multiCopyButton() {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "reference-link reference-link--multi";
      button.title = "Enable multiple section copy";
      button.setAttribute("aria-label", button.title);
      button.setAttribute("aria-pressed", "false");
      button.setAttribute("style", inlineStyle + "top:120px;right:10px;padding:0;cursor:pointer;");
      button.textContent = "C+";
      button.addEventListener("click", function () { setMultiCopyState(!multiCopyEnabled); });
      return button;
    }
    const hero = document.querySelector(".hero");
    if (hero && !hero.querySelector(".reference-link")) hero.append(link("C", base + "hero/cutted-section/hero-cropped.webp", 80, "Open cropped hero reference"), link("O", base + "hero/original/hero-original.jpg", 10, "Open original hero reference"));
    document.querySelectorAll(".body-section").forEach(function (section) {
      if (section.querySelector(".reference-link")) return;
      const n = Number(String(section.dataset.section).split("-")[0]);
      const sourceNumber = n > 36 ? n - 36 : n;
      const folder = n > 36 ? base + "body-content/0 New Sections/section " + n + "/" : base + "body-content/section " + n + "/";
      const file = "section-" + String(sourceNumber).padStart(2,"0");
      const croppedFile = n === 72 ? "fYp7zuaT7PTQ.jpg" : file + "-cropped.webp";
      section.append(link("C", folder + "cutted-section/" + croppedFile, 80, "Open cropped reference for section " + n), link("O", folder + "original/" + file + "-original." + originalExtensions[sourceNumber], 10, "Open original reference for section " + n), sectionLink(section, n), multiCopyButton());
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

  function bindReferenceSectionInteractions() {
    $(document).on("click", ".rf-41 [data-rf-program]", function () {
      const $button = $(this);
      const $section = $button.closest(".rf-41");
      $button.addClass("is-active").attr("aria-pressed", "true")
        .siblings().removeClass("is-active").attr("aria-pressed", "false");
      $section.find("[data-rf-program-image]").attr({
        src: $button.data("rf-program"),
        alt: "Strongfy " + $button.text().trim().toLowerCase() + " program"
      });
      $section.find(".rf-program__visual b").text($button.text().trim() + " program");
    });

    $(document).on("click", ".rf-58 [data-rf-service]", function () {
      $(this).addClass("is-active").attr("aria-pressed", "true")
        .siblings("[data-rf-service]").removeClass("is-active").attr("aria-pressed", "false");
    });

    $(document).on("click", ".rf-class-tabs button", function () {
      $(this).addClass("is-active").attr("aria-selected", "true")
        .siblings().removeClass("is-active").attr("aria-selected", "false");
    });

    $(document).on("click", ".rf-65 [data-rf-trainer]", function () {
      $(this).toggleClass("is-active");
      const expanded = $(this).hasClass("is-active");
      $(this).attr("aria-expanded", String(expanded));
      $(this).find("i").toggleClass("fa-arrow-down", !expanded).toggleClass("fa-arrow-up", expanded);
    });

    $(document).on("click", ".rf-61 .rf-billing button", function () {
      const $button = $(this);
      const annual = $button.index() === 1;
      const prices = annual ? ["$150", "$300", "$550"] : ["$15", "$30", "$55"];
      $button.addClass("is-active").attr("aria-pressed", "true")
        .siblings().removeClass("is-active").attr("aria-pressed", "false");
      $button.closest(".rf-61").find(".rf-price-row--outline article > strong").each(function (index) {
        $(this).contents().first()[0].nodeValue = prices[index];
        $(this).find("small").text(annual ? "/year" : "/month");
      });
    });
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
  bindReferenceSectionInteractions();
  $("[data-day='mon']").trigger("click");
})(jQuery);
