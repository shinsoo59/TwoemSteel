
document.addEventListener('DOMContentLoaded', () => {
  const mainIframe = document.getElementById('main_map');

  // --- PC 버튼 클릭 시 iframe 변경 및 버튼 활성화 ---
  document.querySelectorAll('.map_shortcut.pc .map_btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.dataset.src;
      if (src) mainIframe.src = src;

      // 모든 버튼 초기화
      document.querySelectorAll('.map_shortcut.pc .map_btn').forEach(b => {
        b.classList.remove('active');
      });

      // 클릭한 버튼만 활성화
      btn.classList.add('active');
    });
  });

  // 모바일 드롭다운
  const toggleBtn = document.querySelector('.map_shortcut.mobile .dropdown_toggle');
  const dropdown = document.getElementById('mobileMapDropdown');
  const arrow = toggleBtn.querySelector('.dropdown_arrow');

  const arrowDefault = 'images/location/icon_dropdown.png';
  const arrowActive = 'images/location/icon_dropdown_up.png';

  function openDropdown() {
    dropdown.classList.add('show');
    toggleBtn.classList.add('connected');
    arrow.classList.add('rotated');
  }

  function closeDropdown() {
    dropdown.classList.remove('show');
    toggleBtn.classList.remove('connected');
    arrow.classList.remove('rotated');
  }

  toggleBtn.addEventListener('click', e => {
    e.preventDefault();
    if (dropdown.classList.contains('show')) closeDropdown();
    else openDropdown();
  });

  document.addEventListener('click', e => {
    if (!toggleBtn.contains(e.target) && !dropdown.contains(e.target)) {
      if (dropdown.classList.contains('show')) closeDropdown();
    }
  });

  // 드롭다운 아이템 클릭
  dropdown.addEventListener('click', e => {
    const btn = e.target.closest('.map_btn'); // 이전에 map_item으로 되어 있으면 안됨
    if (!btn) return;
    e.preventDefault();

    const newText = btn.textContent.trim();
    const newSrc = btn.dataset.src;

    const mainLabelSpan = toggleBtn.querySelector('.label');
    const currentMainText = mainLabelSpan ? mainLabelSpan.textContent.trim() : '';
    const currentMainSrc = toggleBtn.dataset.src || mainIframe.src;

    if (newSrc) mainIframe.src = newSrc;
    if (mainLabelSpan) mainLabelSpan.textContent = newText;
    toggleBtn.dataset.src = newSrc || '';

    btn.textContent = currentMainText;
    btn.dataset.src = currentMainSrc;

    closeDropdown();
  });
});

//제품안내 탭
$(function () {
  $(".product_content:first-child").show();
  $(".product_tab li").click(function () {
    $(".product_tab li").removeClass("on");
    $(this).addClass("on");
    $(".product_content").hide();
    const activeTab = $(this).data("title");
    $("#" + activeTab).fadeIn();
  })
})


$(function () {
  function showTop(tabId) {
    // 상단 탭 on/off
    $(".product_tab li").removeClass("on")
      .filter("[data-title='" + tabId + "']").addClass("on");

    // 상단 컨텐츠 표시
    $(".product_content").hide();
    $("#" + tabId).show();

    // 해당 탭 안의 "제품 종류" 초기화 (li.on 우선, 없으면 첫번째)
    const $shown = $("#" + tabId);
    const $on = $shown.find(".product_type_tab li.on").first();
    const firstId = ($on.length ? $on : $shown.find(".product_type_tab li").first()).data("title");

    // 같은 탭 내부만 초기화
    $shown.find(".product_type_content").hide();
    $("#" + firstId).show();
  }

  // URL로부터 진입 탭 결정
  const params = new URLSearchParams(location.search);
  const map = { hr: "product_01", cr: "product_02", product_01: "product_01", product_02: "product_02" };

  let key = params.get("tab");            // ?tab=hr|cr
  if (!map[key]) {
    const h = (location.hash || "").replace("#", ""); // #hr|#cr|#product_01|#product_02
    key = h;
  }
  const initialTab = map[key] || "product_01"; // 기본: 열연

  // 초기 표시
  showTop(initialTab);

  // 상단 탭 클릭
  $(".product_tab li").on("click", function () {
    const id = $(this).data("title");
    showTop(id);
    // 딥링크 유지(선택): 필요 없으면 아래 줄 제거해도 됨
    history.replaceState(null, "", "#" + id);
  });
});
$(function () {
  // 공통 함수 - 모바일/데스크탑 분기, 열연, 냉연 각각 적용

  function createTabs(tabSelector, contentSelector) {
    const mq = window.matchMedia('(max-width:768px)');
    let listOpen = false;
    let isAnimating = false;

    function moveActiveToTop($tab) {
      const $active = $tab.find('li.on');
      if ($active.index() !== 0) $active.prependTo($active.parent());
    }

    function showActivePanel($tab) {
      const $wrap = $tab.closest('.product_type');                  // ★ 추가: 범위 한정
      const activeId = $tab.find('li.on').data('title') || $tab.find('li').first().data('title');
      $wrap.find(contentSelector).hide();                            // ★ 변경: 전역 -> 해당 섹션만
      $('#' + activeId).show();
    }

    function setDesktopMode($tab) {
      listOpen = false;
      $tab.removeClass('dropdown-open');
      $tab.find('li').show();
      showActivePanel($tab);
    }

    function setMobileMode($tab) {
      listOpen = false;
      moveActiveToTop($tab);
      $tab.removeClass('dropdown-open');
      $tab.find('li').hide();
      $tab.find('li.on').show();
      showActivePanel($tab);
    }

    function initByMode($tab) {
      if (mq.matches) setMobileMode($tab);
      else setDesktopMode($tab);
      showActivePanel($tab);
    }

    // 초기화
    const $tab = $(tabSelector);
    initByMode($tab);

    // 미디어쿼리 이벤트
    if (mq.addEventListener) mq.addEventListener('change', function () { initByMode($tab); });
    else mq.addListener(function () { initByMode($tab); });

    function closeDropdownWithAnimation($tab) {
      if (isAnimating) return;
      isAnimating = true;
      $tab.find('li').not('.on')
        .stop(true, true).slideUp(180)
        .promise().done(function () {
          $tab.removeClass('dropdown-open');
          listOpen = false;
          $tab.find('li').not('.on').hide();
          $tab.find('li.on').show();
          isAnimating = false;
        });
    }

    // 탭 클릭
    $tab.on('click', 'li', function (e) {
      e.preventDefault();
      const $li = $(this);
      const id = $li.data('title');
      const $wrap = $tab.closest('.product_type');                  // ★ 추가

      if (mq.matches) {
        // 모바일
        if (!listOpen) {
          if ($li.hasClass('on')) {
            moveActiveToTop($tab);
            $tab.addClass('dropdown-open');
            $tab.find('li').not('.on').stop(true, true).slideDown(180);
            listOpen = true;
          } else {
            $tab.find('li').removeClass('on');
            $li.addClass('on');
            showActivePanel($tab);
            moveActiveToTop($tab);
            $tab.find('li').hide();
            $tab.find('li.on').show();
          }
        } else {
          if ($li.hasClass('on')) {
            moveActiveToTop($tab);
            closeDropdownWithAnimation($tab);
          } else {
            $tab.find('li').removeClass('on');
            $li.addClass('on');
            showActivePanel($tab);
            moveActiveToTop($tab);
            closeDropdownWithAnimation($tab);
          }
        }
      } else {
        // 데스크탑
        $tab.find('li').removeClass('on');
        $li.addClass('on');
        $wrap.find(contentSelector).hide();                         // ★ 변경: 전역 -> 해당 섹션만
        $('#' + id).stop(true, true).fadeIn(180);
      }
    });
  }

  // 열연 제품 종류 탭 적용
  createTabs('.product_type_tab.hr', '.product_type_content');

  // 냉연 제품 종류 탭 적용
  createTabs('.product_type_tab.cr', '.product_type_content');
});

$(function () {
  $(".agree").on("click", function () {
    $(this).toggleClass("on");
  });
});

function updateSubmitState() {
  const ok = $agreeRequired.prop('checked');
  $submitBtn.prop('disabled', !ok);
  if (ok) {
    $consentError.attr('hidden', true);
  }
}

// 폼 제출 처리
$form.on('submit', function (e) {
  e.preventDefault();
  if (!$agreeRequired.prop('checked')) {
    $consentError.text('서비스 제공을 위한 개인정보 수집·이용에 동의하셔야 합니다.').removeAttr('hidden');
    $agreeRequired.focus();
    return;
  }
});

$(function () {
    $("#contactForm").on("submit", function (e) {
      alert("문의가 정상적으로 제출되었습니다!");
    });
  });