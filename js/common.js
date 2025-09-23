
//서브메뉴
$(function () {
  const NS = ".menu";
  const $gnb = $("#gnb");
  const $depth1 = $("#gnb .depth1");
  const $allDepth2 = $("#gnb .depth1 > li > .depth2");
  const $subBg = $(".sub_bg");
  const $siteList = $(".site_map .list");
  const $siteClose = $(".site_map .close");

  $depth1.off(NS);
  $gnb.off(NS);
  $subBg.off(NS);
  $siteList.off(NS);
  $siteClose.off(NS);

  let isPinned = false;

  function openAll(via) {
    $allDepth2.stop(true, true).slideDown(200);
    $subBg.stop(true, true).slideDown(200);

    if (via === "pin") {
      $siteList.stop(true, true).fadeOut(150);
      $siteClose.stop(true, true).fadeIn(150);
    }
  }

  function closeAll() {
    $allDepth2.stop(true, true).slideUp(150);
    $subBg.stop(true, true).slideUp(150);
    $siteList.stop(true, true).fadeIn(150);
    $siteClose.stop(true, true).fadeOut(150);
  }

  $allDepth2.hide();

  $depth1.on("mouseenter" + NS, function () {
    if (!isPinned) openAll();
  });

  $gnb.on("mouseleave" + NS, function (e) {
    if (isPinned) return;
    const $to = $(e.relatedTarget);
    if ($to.closest("#gnb").length || $to.closest(".sub_bg").length) return;
    closeAll();
  });

  $subBg.on("mouseenter" + NS, function () {
    if (!isPinned) openAll();
  });

  $subBg.on("mouseleave" + NS, function (e) {
    if (isPinned) return;
    const $to = $(e.relatedTarget);
    if ($to.closest("#gnb").length || $to.closest(".sub_bg").length) return;
    closeAll();
  });

  const $siteMap = $(".site_map");
  $siteMap.off(NS).on("click" + NS, function (e) {
    e.preventDefault();
    const btn = this;

    const spans = btn.querySelectorAll("span");
    spans.forEach(s => window.getComputedStyle(s).transform);

    if (!isPinned) {
      isPinned = true;

      requestAnimationFrame(() => {
        btn.classList.add("open");
        btn.setAttribute("aria-expanded", "true");

        requestAnimationFrame(() => {
          openAll("pin");
        });
      });

    } else {
      isPinned = false;

      requestAnimationFrame(() => {
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");

        requestAnimationFrame(() => {
          closeAll();
        });
      });
    }
  });
});

//모바일 메인메뉴
$(function () {
  const NS = ".mo";
  const DUR = 300;
  const $btn = $(".site_map");
  const $mo = $("#mo_gnb");
  const mq = window.matchMedia("(max-width: 768px)");

  $btn.off("click" + NS);

  $btn.on("click" + NS, function (e) {
    e.preventDefault();

    if (!mq.matches) return;

    const opening = !$mo.hasClass("open");

    $(this).find("span").each(function () { window.getComputedStyle(this).transform; });
    window.getComputedStyle($mo[0]).transform;

    if (opening) {
      this.classList.add("open");
      this.setAttribute("aria-expanded", "true");

      requestAnimationFrame(() => {
        $mo.addClass("open");
      });
    } else {
      this.classList.remove("open");
      this.setAttribute("aria-expanded", "false");

      requestAnimationFrame(() => {
        $mo.removeClass("open");
      });
    }
  });
});

$(function () {
  $("#mo_gnb .mo_depth1 > li > a").click(function (e) {
    const $parentLi = $(this).parent("li");
    const liIndex = $parentLi.index(); // 0부터 시작 (첫 번째 = 0, 두 번째 = 1)

    if (liIndex === 1) {
      // 두 번째 메뉴는 무조건 바로 링크 이동
      return true; 
    }

    if (!$parentLi.hasClass("open")) {
      // 첫 클릭 → 열기만 하고 링크 이동 막기
      e.preventDefault();

      // 다른 메뉴 닫기
      $("#mo_gnb .mo_depth1 li").removeClass("open")
        .find(".mo_depth2").stop().slideUp();

      // 현재 메뉴 열기
      $parentLi.addClass("open")
        .find(".mo_depth2").stop().slideDown();
    }
    // 두 번째 클릭 → 링크 이동 (preventDefault 없음)
  });
});