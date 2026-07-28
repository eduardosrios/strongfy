(function ($) {
  "use strict";

  const $trial = $("#trial-offer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  $("a[href^='#']").on("click", function (event) {
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
    const focusable = [...$modal[0].querySelectorAll("button:not([disabled])")];
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

  $("[data-day='mon']").trigger("click");
})(jQuery);
