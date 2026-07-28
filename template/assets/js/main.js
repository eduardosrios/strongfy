(function ($) {
  "use strict";

  const $trial = $("#trial-offer");

  $("a[href^='#']").on("click", function (event) {
    const targetId = this.getAttribute("href");
    const $target = targetId && targetId !== "#" ? $(targetId) : $();

    if (!$target.length) {
      return;
    }

    event.preventDefault();
    $target.get(0).scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "center"
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
})(jQuery);
