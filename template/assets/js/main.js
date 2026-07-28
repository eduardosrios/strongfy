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

  $("[data-day='mon']").trigger("click");
})(jQuery);
