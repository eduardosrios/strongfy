(function ($) {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $(document).on("click", "a[href^='#']", function (event) {
    const targetId = this.getAttribute("href");

    if (targetId === "#") {
      event.preventDefault();
      return;
    }

    const $target = targetId ? $(targetId) : $();

    if (!$target.length) {
      return;
    }

    event.preventDefault();
    $target.get(0).scrollIntoView({
      behavior: reducedMotion ? "auto" : "smooth",
      block: "start"
    });


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


  const counterObserver = "IntersectionObserver" in window ? new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      const element = entry.target;
      const target = Number(element.dataset.count);
      const prefix = element.dataset.countPrefix || "";
      const suffix = element.dataset.countSuffix || "";
      const duration = reducedMotion ? 0 : 950;
      const start = performance.now();
      function render(now) {
        const progress = duration ? Math.min((now - start) / duration, 1) : 1;
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(target * eased);
        element.textContent = prefix + (target >= 10000 ? (value / 1000).toFixed(1) + "K" : value.toLocaleString("en-US")) + suffix;
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
    $(".section-head, .body-section .content-wrap > :not(.section-head), .rf-section .rf-shell > *, .footer-cta__content, .footer-identity, .footer-newsletter").each(function () {
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
  const $modalVideo = $("#mediaModalVideo");
  let modalItems = [];
  let modalIndex = 0;
  let modalTrigger = null;

  function renderModalItem() {
    const item = modalItems[modalIndex];
    if (item.video) {
      $modalImage.prop("hidden", true);
      $modalVideo.attr({ src: item.video, "aria-label": item.alt }).prop("hidden", false);
    } else {
      $modalVideo[0]?.pause();
      $modalVideo.prop("hidden", true).removeAttr("src");
      $modalImage.attr({ src: item.src, alt: item.alt }).prop("hidden", false);
    }
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
    $modalVideo[0]?.pause();
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


  function replaceComplexConceptIcons() {
    const sources = [
      ["assets/images/icons/kettlebell.png", "Kettlebell"],
      ["assets/images/icons/strength-kit.png", "Strength equipment"],
      ["assets/images/icons/trainer.png", "Personal coaching"],
      ["assets/images/icons/stopwatch.png", "Timed performance"]
    ];
    const icons = document.querySelectorAll(".benefits-grid__items article > i, .amenities-index__grid article > i, .feature-manifesto__points article > i, .workout-categories__grid article > i, .power-pillars__grid article > i, .coaching-steps__list i, .journey-process__line i, .rf-54 .rf-service-row article > i");
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
    const referenceLayouts = [
      ".rf-sport", ".rf-mosaic", ".rf-phenomenon__stage", ".rf-program",
      ".rf-location-row", ".rf-price-row", ".rf-habits__stage", ".rf-benefits",
      ".rf-member-row", ".rf-brutal__facts", ".rf-info-strip", ".rf-discipline-row",
      ".rf-wellness-feature", ".rf-service-row", ".rf-trainer-lineup", ".rf-success-stage__people", ".rf-about",
      ".rf-service-accordion", ".rf-method__points", ".rf-coach-row", ".rf-transform>div", ".rf-class-stage",
      ".rf-trainer-accordion", ".rf-help-row", ".rf-service-intro", ".rf-service-images",
      ".rf-membership", ".rf-featured-classes", ".rf-news-row",
      ".rf-stack-showcase"
    ].join(", ");
    document.querySelectorAll("[class*='__grid'], [class*='__layout'], [class*='__cards'], [class*='__list'], [class*='__rail'], .feature-manifesto__points, " + referenceLayouts).forEach(function (layout) {
      if (!layout.children.length || layout.closest(".nav-submenu")) return;
      layout.classList.add("row", "g-4", "bootstrap-grid");
      const count = layout.children.length;
      layout.querySelectorAll(":scope > *").forEach(function (child) {
        if (layout.matches(".rf-class-stage") && child.matches("strong, button")) return;
        child.classList.add("col-12", count >= 4 ? "col-md-6" : "col-md");
      });
    });
    document.querySelectorAll(".rf-section a:not([aria-label])").forEach(function (link) {
      if (link.textContent.trim() || link.querySelector("img[alt]")) return;
      const target = link.getAttribute("href") || "";
      link.setAttribute("aria-label", target.includes("trainer") ? "View Strongfy trainers" : "Explore Strongfy spaces");
      link.querySelectorAll("i").forEach(function (icon) { icon.setAttribute("aria-hidden", "true"); });
    });
  }

  function addReferenceLinks() {
    const base = "http://localhost/templates/Gym/referencias/references-used/";
    const finalBase = "http://localhost/templates/Gym/referencias/final-references/Corpo/";
    const originalExtensions = { 1:"jpg",2:"jpg",3:"webp",4:"webp",5:"webp",6:"webp",7:"webp",8:"webp",9:"webp",10:"webp",11:"webp",12:"webp",13:"jpg",14:"jpg",15:"jpg",16:"webp",17:"webp",18:"webp",19:"webp",20:"webp",21:"png",22:"png",23:"png",24:"png",25:"png",26:"png",27:"webp",28:"webp",29:"webp",30:"webp",31:"webp",32:"webp",33:"webp",34:"webp",35:"png",36:"jpg" };
    const inlineStyle = "position:absolute;top:50px;width:60px;height:60px;display:flex;align-items:center;justify-content:center;border:4px solid #050806;border-radius:50%;background:#ffffff;color:#050806;font-size:24px;font-weight:800;line-height:1;opacity:.5;z-index:2600;text-decoration:none;";
    let multiCopyEnabled = false;
    let multiCopyValue = "";
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
    }
    function setMultiCopyState(enabled) {
      multiCopyEnabled = enabled;
      if (enabled) multiCopyValue = "";
      document.querySelectorAll(".reference-link--multi").forEach(function (button) {
        button.classList.toggle("is-active", enabled);
        button.style.backgroundColor = enabled ? "#22c55e" : "#ffffff";
        button.style.opacity = enabled ? "1" : ".5";
        button.title = enabled ? "Disable multiple section copy" : "Enable multiple section copy";
        button.setAttribute("aria-label", button.title);
        button.setAttribute("aria-pressed", String(enabled));
      });
      const status = document.getElementById("siteInteractionStatus");
      if (status) status.textContent = "Multiple section copy " + (enabled ? "enabled. Selection cleared." : "disabled.");
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
          let alreadySelected = false;
          if (multiCopyEnabled) {
            const selectedNumbers = multiCopyValue ? multiCopyValue.split(",") : [];
            alreadySelected = selectedNumbers.includes(String(number));
            if (!alreadySelected) {
              selectedNumbers.push(String(number));
              multiCopyValue = selectedNumbers.join(",");
            }
          }
          const nextValue = multiCopyEnabled ? multiCopyValue : String(number);
          await writeClipboardValue(nextValue);
          button.textContent = "✓";
          button.setAttribute("aria-label", "Section " + number + " copied");
          if (status) status.textContent = multiCopyEnabled ? (alreadySelected ? "Section " + number + " already selected. Clipboard unchanged: " + nextValue + "." : "Copied section list: " + nextValue + ".") : "Section " + number + " copied to clipboard.";
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
      const sectionNumber = String(section.dataset.section);
      const n = Number.parseInt(sectionNumber, 10);
      if (n >= 73 && n <= 96) {
        const part = n - 72;
        const suffix = n === 76 || n === 83 ? "-a" : "";
        const suppliedFile = part === 19 ? "categories.jpg" : "Untitled-1.jpg";
        const folder = base + "body-content/0 New Sections/section " + n + "/";
        section.append(
          link("C", folder + "cutted-section/section-" + n + "-reference" + suffix + ".jpg", 80, "Open cropped reference for section " + n),
          link("O", finalBase + "parte " + part + "/" + suppliedFile, 10, "Open original supplied reference for section " + n),
          sectionLink(section, sectionNumber),
          multiCopyButton()
        );
        return;
      }
      const sourceNumber = n > 36 ? n - 36 : n;
      const folder = n > 36 ? base + "body-content/0 New Sections/section " + n + "/" : base + "body-content/section " + n + "/";
      const file = "section-" + String(sourceNumber).padStart(2,"0");
      const croppedFile = n === 72 ? "fYp7zuaT7PTQ.jpg" : file + "-cropped.webp";
      section.append(link("C", folder + "cutted-section/" + croppedFile, 80, "Open cropped reference for section " + n), link("O", folder + "original/" + file + "-original." + originalExtensions[sourceNumber], 10, "Open original reference for section " + n), sectionLink(section, sectionNumber), multiCopyButton());
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
    const storyVideos = ["assets/videos/personal-coaching.mp4", "assets/videos/treadmill-cardio.mp4"];
    $(document).on("click", ".rf-47 .rf-video-card", function () {
      const index = $(this).index(".rf-47 .rf-video-card");
      const image = this.querySelector("img");
      openModal([{ video:storyVideos[index % storyVideos.length], src:image.src, alt:image.alt, kicker:"Member story", title:this.querySelector(".rf-video-meta strong")?.textContent.trim() || "Strongfy member", copy:"A real Strongfy training story." }], 0, this);
    });

    const referenceMedia = [...document.querySelectorAll(".rf-68 .rf-floating-quote img, .rf-69 .rf-membership>img, .rf-71 .rf-news-row img, .rf-72 .rf-stack-showcase>article>img, .nf-equipment-visual img, .nf-collection-cards article>img, .nf-service-mosaic__image img, .nf-manifesto img, .nf-transformation img, .nf-coach-profile>img, .nf-event-carousel article>img")];
    const referenceItems = referenceMedia.map(function (image) {
      image.tabIndex = 0;
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Open " + image.alt + " in media viewer");
      return { src:image.src, alt:image.alt, kicker:"Strongfy", title:image.alt, copy:"Explore the Strongfy experience." };
    });
    referenceMedia.forEach(function (image, index) {
      function activate() { openModal(referenceItems, index, image); }
      image.addEventListener("click", activate);
      image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") { event.preventDefault(); activate(); }
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

  function bindHeroFeatureCardToggles() {
    document.querySelectorAll(".hero-feature-more").forEach(function (button) {
      const grid = button.closest(".hero-feature-cards");
      const cards = [...grid.querySelectorAll(".hero-feature-card--extra")];
      const allCards = [...grid.querySelectorAll(".hero-feature-card")];
      let cardWidth = 0;

      function layoutExpandedCards() {
        const availableWidth = grid.parentElement.getBoundingClientRect().width;
        const columns = Math.max(1, Math.floor((availableWidth + 0.5) / cardWidth));

        grid.style.setProperty("--hero-feature-columns", String(columns));
        allCards.forEach(function (card, index) {
          card.classList.toggle("is-row-start", index % columns === 0);
          card.classList.toggle("is-first-row", index < columns);
        });
        grid.dispatchEvent(new CustomEvent("hero-feature-layout"));
      }

      button.addEventListener("click", function () {
        cardWidth = parseFloat(getComputedStyle(grid).getPropertyValue("--hero-feature-card-width")) || 260;
        button.setAttribute("aria-expanded", "true");
        cards.forEach(function (card) {
          card.hidden = false;
        });
        grid.classList.add("is-expanded");
        button.hidden = true;
        layoutExpandedCards();

        if ("ResizeObserver" in window) {
          const observer = new ResizeObserver(layoutExpandedCards);
          observer.observe(grid.parentElement);
        } else {
          window.addEventListener("resize", layoutExpandedCards);
        }
      }, { once: true });
    });
  }

  function bindHeroFeatureCardHighlights() {
    document.querySelectorAll(".hero-feature-cards").forEach(function (grid) {
      const targets = [...grid.querySelectorAll(".hero-feature-card, .hero-feature-more")];
      const firstCard = grid.querySelector(".hero-feature-card");
      let activeTarget = firstCard;
      let staticFrame = 0;

      function isVisible(target) {
        return target && !target.hidden && target.offsetParent !== null;
      }

      function setHighlight(target, animate) {
        const nextTarget = isVisible(target) ? target : firstCard;

        if (!nextTarget) {
          return;
        }

        grid.classList.toggle("is-highlight-static", !animate);
        grid.style.setProperty("--hero-feature-highlight-x", nextTarget.offsetLeft + "px");
        grid.style.setProperty("--hero-feature-highlight-y", nextTarget.offsetTop + "px");
        grid.style.setProperty("--hero-feature-highlight-width", nextTarget.offsetWidth + "px");
        grid.style.setProperty("--hero-feature-highlight-height", nextTarget.offsetHeight + "px");
        grid.classList.add("has-feature-highlight");

        targets.forEach(function (item) {
          item.classList.toggle("is-feature-highlight-active", item === nextTarget);
        });

        activeTarget = nextTarget;

        if (!animate) {
          cancelAnimationFrame(staticFrame);
          staticFrame = requestAnimationFrame(function () {
            staticFrame = requestAnimationFrame(function () {
              grid.classList.remove("is-highlight-static");
            });
          });
        }
      }

      targets.forEach(function (target) {
        target.addEventListener("pointerenter", function () {
          if (target !== activeTarget && isVisible(target)) {
            setHighlight(target, true);
          }
        });
        target.addEventListener("focus", function () {
          if (isVisible(target)) {
            setHighlight(target, true);
          }
        });
        target.addEventListener("pointerleave", function (event) {
          const nextTarget = event.relatedTarget instanceof Element
            ? event.relatedTarget.closest(".hero-feature-card, .hero-feature-more")
            : null;

          if (!nextTarget || !grid.contains(nextTarget)) {
            setHighlight(firstCard, true);
          }
        });
      });

      grid.addEventListener("pointerleave", function () {
        setHighlight(firstCard, true);
      });

      grid.addEventListener("focusout", function (event) {
        if (!grid.contains(event.relatedTarget)) {
          setHighlight(firstCard, true);
        }
      });

      grid.addEventListener("hero-feature-layout", function () {
        setHighlight(activeTarget, false);
      });

      setHighlight(firstCard, false);

      if ("ResizeObserver" in window) {
        new ResizeObserver(function () {
          setHighlight(activeTarget, false);
        }).observe(grid);
      } else {
        window.addEventListener("resize", function () {
          setHighlight(activeTarget, false);
        }, { passive: true });
      }
    });
  }

  function fitHeroTitles() {
    const titles = [...document.querySelectorAll(".hero-title")];
    const copy = titles[0]?.closest(".hero__copy");

    if (!titles.length || !copy) {
      return;
    }

    let lastWidth = -1;
    const fit = function (force) {
      const availableWidth = Math.max(copy.clientWidth - 1, 1);

      if (!force && Math.abs(availableWidth - lastWidth) < 0.5) {
        return;
      }

      lastWidth = availableWidth;
      titles.forEach(function (title) {
        title.style.removeProperty("--hero-title-fit");

        const baseSize = parseFloat(window.getComputedStyle(title).fontSize);
        const range = document.createRange();
        range.selectNodeContents(title);
        const textWidth = range.getBoundingClientRect().width;
        range.detach?.();

        if (!baseSize || !textWidth) {
          return;
        }

        const fittedSize = baseSize * availableWidth / textWidth * 1.00470051;
        const fittedSizeValue = fittedSize.toFixed(2) + "px";
        const titleStyle = window.getComputedStyle(title);
        const hero = title.closest(".hero");

        title.style.setProperty("--hero-title-fit", fittedSizeValue);
        if (hero && title === hero.querySelector(".hero-title")) {
          hero.style.setProperty("--hero-slogan-font-size", fittedSizeValue);
          hero.style.setProperty("--hero-slogan-font-family", titleStyle.fontFamily);
          hero.style.setProperty("--hero-slogan-font-weight", titleStyle.fontWeight);
        }
      });
    };

    fit(true);

    if ("ResizeObserver" in window) {
      new ResizeObserver(function () {
        fit(false);
      }).observe(copy);
    } else {
      window.addEventListener("resize", function () {
        fit(true);
      }, { passive: true });
    }

    if (document.fonts?.ready) {
      document.fonts.ready.then(function () {
        fit(true);
      });
    }
  }

  function bindNewSectionInteractions() {
    const status = document.getElementById("siteInteractionStatus");
    function announce(message) { if (status) status.textContent = message; }

    const journeyCopy = {
      foundation: "Learn safe movement patterns, build confidence, and create a training rhythm that lasts.",
      performance: "Turn solid technique into measurable strength, speed, and athletic capacity.",
      strength: "Build durable muscle and power while protecting the joints that make training possible.",
      longevity: "Keep performance high with intelligent loading, mobility, and recovery built into every week.",
      vitality: "Train balance, strength, and confidence for an active life with fewer limitations."
    };
    document.querySelectorAll("[data-journey-tabs]").forEach(function (journey) {
      const tabs = [...journey.querySelectorAll("[data-journey]")];
      const dots = [...journey.querySelectorAll(".nf-journey__track i")];
      const progress = journey.querySelector(".nf-journey__track span");
      tabs.forEach(function (tab, index) {
        tab.addEventListener("click", function () {
          tabs.forEach(function (item) { item.classList.toggle("is-active", item === tab); item.setAttribute("aria-selected", String(item === tab)); });
          dots.forEach(function (dot, dotIndex) { dot.classList.toggle("is-active", dotIndex <= index); });
          if (progress) progress.style.width = (index * 20 + 10) + "%";
          const copy = journey.querySelector("[data-journey-copy]");
          if (copy) copy.textContent = journeyCopy[tab.dataset.journey];
          announce(tab.textContent.trim() + " training stage selected.");
        });
      });
    });

    document.querySelectorAll(".nf-discipline [data-discipline]").forEach(function (button) {
      button.addEventListener("click", function () {
        const group = button.closest(".nf-discipline");
        group.querySelectorAll("[data-discipline]").forEach(function (item) { item.classList.toggle("is-active", item === button); item.setAttribute("aria-selected", String(item === button)); });
        const copy = group.parentElement.querySelector(".nf-discipline__status");
        if (copy) copy.textContent = button.dataset.discipline + " programming selected.";
      });
    });

    document.querySelectorAll("[data-commerce-rail]").forEach(function (rail) {
      const track = rail.querySelector("[data-rail-track]");
      rail.querySelectorAll("[data-rail-direction]").forEach(function (button) {
        button.addEventListener("click", function () {
          if (!track || track.children.length < 2) return;
          if (button.dataset.railDirection === "next") track.append(track.firstElementChild);
          else track.prepend(track.lastElementChild);
          announce("Collection rail moved " + button.dataset.railDirection + ".");
        });
      });
    });

    document.querySelectorAll(".nf-product-rail article>button").forEach(function (button) {
      button.setAttribute("aria-pressed", "false");
      button.addEventListener("click", function () {
        const active = button.getAttribute("aria-pressed") !== "true";
        button.setAttribute("aria-pressed", String(active));
        button.classList.toggle("is-active", active);
        button.querySelector("i")?.classList.toggle("fa-regular", !active);
        button.querySelector("i")?.classList.toggle("fa-solid", active);
        announce(active ? "Equipment saved to favorites." : "Equipment removed from favorites.");
      });
    });

    document.querySelectorAll("[data-product-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        const section = button.closest(".nf-77");
        const filter = button.dataset.productFilter;
        section.querySelectorAll("[data-product-filter]").forEach(function (item) { item.classList.toggle("is-active", item === button); item.setAttribute("aria-pressed", String(item === button)); });
        section.querySelectorAll("[data-product-category]").forEach(function (card) { card.hidden = filter !== "all" && card.dataset.productCategory !== filter; });
        announce((filter === "all" ? "All" : button.textContent.trim()) + " equipment shown.");
      });
    });


    document.querySelectorAll("[data-before-after]").forEach(function (comparison) {
      const range = comparison.querySelector("[data-compare-range]");
      if (!range) return;
      range.addEventListener("input", function () { comparison.style.setProperty("--compare-position", range.value + "%"); });
    });

    const quotes = [
      ["Our space combines <strong>professional equipment,</strong> expert coaches, and a motivating atmosphere to help you <strong>train smarter,</strong> move better, and grow stronger—<strong>every day.</strong>", "— Strongfy training community"],
      ["Detailed coaching turns uncertainty into <strong>clear purpose,</strong> helping every week feel <strong>smarter,</strong> stronger, and more sustainable—<strong>every session.</strong>", "— Elliot, performance member"],
      ["I came for strength and found a <strong>serious community,</strong> thoughtful recovery, and a plan that helps me <strong>move better,</strong> train hard, and return—<strong>every week.</strong>", "— Jordan, group training member"]
    ];
    document.querySelectorAll("[data-quote-stage]").forEach(function (stage) {
      stage.querySelectorAll("[data-quote]").forEach(function (button) {
        button.addEventListener("click", function () {
          const index = Number(button.dataset.quote);
          stage.querySelector("[data-quote-copy]").innerHTML = quotes[index][0];
          stage.querySelector("[data-quote-author]").textContent = quotes[index][1];
          stage.querySelectorAll("[data-quote]").forEach(function (dot) { dot.classList.toggle("is-active", dot === button); });
          announce("Member quote " + (index + 1) + " shown.");
        });
      });
    });

    document.querySelectorAll("[data-coach-directory]").forEach(function (directory) {
      const profile = directory.querySelector(".nf-coach-profile");
      function activateCoach(button, announceChange) {
        if (!button || button.classList.contains("is-active")) return;
        directory.querySelectorAll("[data-coach-name]").forEach(function (item) {
          item.classList.toggle("is-active", item === button);
          item.setAttribute("aria-selected", String(item === button));
        });
        const photo = directory.querySelector("[data-coach-photo]");
        profile?.classList.add("is-switching");
        photo.src = button.dataset.coachImage;
        photo.alt = button.dataset.coachName + ", Strongfy coach";
        directory.querySelector("[data-coach-title]").textContent = button.dataset.coachName;
        directory.querySelector("[data-coach-specialty]").textContent = button.dataset.coachRole;
        requestAnimationFrame(function () { requestAnimationFrame(function () { profile?.classList.remove("is-switching"); }); });
        if (announceChange) announce(button.dataset.coachName + " profile shown.");
      }
      directory.querySelectorAll("[data-coach-name]").forEach(function (button) {
        button.addEventListener("pointerenter", function () { activateCoach(button, false); });
        button.addEventListener("focus", function () { activateCoach(button, false); });
        button.addEventListener("click", function () { activateCoach(button, true); });
      });
    });

    document.querySelectorAll(".nf-class-library article").forEach(function (card) {
      card.addEventListener("click", function () {
        card.parentElement.querySelectorAll("article").forEach(function (item) { item.classList.toggle("is-active", item === card); });
      });
    });

    document.querySelectorAll("[data-member-carousel]").forEach(function (viewport) {
      const track = viewport.querySelector(".rf-member-row");
      const items = [...track.children];
      let index = 0;
      function metrics() {
        const first = items[0];
        if (!first) return { step:0, max:0 };
        const step = first.getBoundingClientRect().width;
        const visible = Math.max(1, Math.floor(viewport.clientWidth / step));
        return { step:step, max:Math.max(0, items.length - visible) };
      }
      function show(next) {
        const value = metrics();
        index = Math.max(0, Math.min(next, value.max));
        track.style.setProperty("--member-offset", (-index * value.step) + "px");
        announce("Member stories " + (index + 1) + " through " + Math.min(index + Math.max(1, Math.floor(viewport.clientWidth / value.step)), items.length) + " shown.");
      }
      viewport.closest(".rf-47").querySelectorAll("[data-member-direction]").forEach(function (button) {
        button.addEventListener("click", function () { show(index + (button.dataset.memberDirection === "next" ? 1 : -1)); });
      });
      window.addEventListener("resize", function () { show(index); });
    });

    document.querySelectorAll("[data-testimonial-carousel]").forEach(function (viewport) {
      const track = viewport.querySelector(".nf-testimonials");
      const cards = [...track.children];
      const section = viewport.closest(".nf-92");
      const count = section.querySelector("[data-testimonial-count]");
      const line = section.querySelector(".nf-testimonial-line");
      let index = 0;
      function metrics() {
        const card = cards[0];
        if (!card) return { step:0, max:0, visible:1 };
        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const step = card.getBoundingClientRect().width + gap;
        const visible = Math.max(1, Math.floor((viewport.clientWidth + gap) / step));
        return { step:step, max:Math.max(0, cards.length - visible), visible:visible };
      }
      function show(next, announceChange) {
        const value = metrics();
        index = (next + value.max + 1) % (value.max + 1);
        track.style.setProperty("--testimonial-offset", (-index * value.step) + "px");
        line?.style.setProperty("--testimonial-progress", (index * 100) + "%");
        if (count) count.textContent = String(index + 1).padStart(2,"0") + " / " + String(value.max + 1).padStart(2,"0");
        if (announceChange) announce("Testimonials page " + (index + 1) + " of " + (value.max + 1) + " shown.");
      }
      section.querySelectorAll("[data-testimonial-direction]").forEach(function (button) {
        button.addEventListener("click", function () { show(index + (button.dataset.testimonialDirection === "next" ? 1 : -1), true); });
      });
      viewport.addEventListener("keydown", function (event) {
        if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); show(index + (event.key === "ArrowRight" ? 1 : -1), true); }
      });
      window.addEventListener("resize", function () { show(index, false); });
      show(0, false);
    });
    document.querySelectorAll("[data-event-carousel]").forEach(function (carousel) {
      const slides = [...carousel.querySelectorAll("[data-event-slide]")];
      const count = carousel.querySelector("[data-event-count]");
      let index = 0;
      function show(next) {
        index = (next + slides.length) % slides.length;
        slides.forEach(function (slide, slideIndex) { slide.hidden = slideIndex !== index; slide.classList.toggle("is-active", slideIndex === index); });
        if (count) count.textContent = String(index + 1).padStart(2, "0") + " / " + String(slides.length).padStart(2, "0");
        announce("Event " + (index + 1) + " of " + slides.length + " shown.");
      }
      carousel.querySelectorAll("[data-event-direction]").forEach(function (button) { button.addEventListener("click", function () { show(index + (button.dataset.eventDirection === "next" ? 1 : -1)); }); });
    });

    document.querySelectorAll("[data-schedule-day]").forEach(function (button) {
      button.addEventListener("click", function () {
        const section = button.closest(".nf-90");
        const day = button.dataset.scheduleDay;
        section.querySelectorAll("[data-schedule-day]").forEach(function (item) { item.classList.toggle("is-active", item === button); item.setAttribute("aria-selected", String(item === button)); });
        section.querySelectorAll("[data-class-day]").forEach(function (card) { card.hidden = day !== "all" && card.dataset.classDay !== day; });
        announce((day === "all" ? "Full week" : button.textContent.trim()) + " schedule shown.");
      });
    });

    document.querySelectorAll(".nf-timetable button").forEach(function (button) {
      button.addEventListener("click", function () {
        button.classList.toggle("is-selected");
        button.setAttribute("aria-pressed", String(button.classList.contains("is-selected")));
        announce(button.textContent.trim() + (button.classList.contains("is-selected") ? " class selected." : " class unselected."));
      });
    });

  }
  function setupInfiniteGalleryMarquee() {
    const track = document.querySelector(".gallery-marquee__track");
    if (!track || track.dataset.loopReady === "true") return;
    [...track.children].forEach(function (figure) {
      const clone = figure.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.removeAttribute("role");
      clone.removeAttribute("tabindex");
      clone.removeAttribute("aria-label");
      clone.querySelectorAll("img").forEach(function (image) { image.alt = ""; });
      track.append(clone);
    });
    track.dataset.loopReady = "true";
  }
  bindNewSectionInteractions();

  setupInfiniteGalleryMarquee();
  addReferenceLinks();
  buildStickyTopbar();
  bindReferenceSectionInteractions();
  bindHeroFeatureCardToggles();
  bindHeroFeatureCardHighlights();
  fitHeroTitles();
  $("[data-day='mon']").trigger("click");
})(jQuery);
