
//메인배너 스와이퍼
document.addEventListener('DOMContentLoaded', function () {
  const el = document.querySelector('.main_banner');
  if (!el) return;
  if (el.swiper) el.swiper.destroy(true, true); // 중복 초기화 방지

  new Swiper('.main_banner', {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 0,
    autoplay: { delay: 4000, disableOnInteraction: false },
    navigation: {
      nextEl: '.main_banner .swiper-button-next',
      prevEl: '.main_banner .swiper-button-prev',
    },
  });
});

//회사소개
document.addEventListener("DOMContentLoaded", () => {
  const intro = document.querySelector(".intro");
  const links = Array.from(intro.querySelectorAll(".intro_inner a"));

  let timerIds = [];

  const play = () => {
    links.forEach((el, idx) => {
      const id = setTimeout(() => el.classList.add("show"), idx * 500);
      timerIds.push(id);
    });
  };

  const reset = () => {
    timerIds.forEach(id => clearTimeout(id));
    timerIds = [];
    links.forEach(el => el.classList.remove("show"));
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          play();
        } else {
          reset();
        }
      });
    },
    {
      threshold: 0.25,
      rootMargin: "-10% 0px -10% 0px"
    }
  );

  observer.observe(intro);
});

//제품소개 탭
$(function () {
  const mq = window.matchMedia('(max-width:768px)');
  let listOpen = false;
  let isAnimating = false;

  function moveActiveToTop() {
    const $active = $('.tab li.on');
    if ($active.index() !== 0) $active.prependTo($active.parent());
  }

  function showActivePanel() {
    const activeId = $('.tab li.on').attr('rel') || $('.tab li').first().attr('rel');
    $('.tab_content').hide();
    $('#' + activeId).show();
  }

  function setDesktopMode() {
    listOpen = false;
    $('.tab').removeClass('dropdown-open');
    $('.tab li').show();
    showActivePanel();
  }

  function setMobileMode() {
    listOpen = false;
    moveActiveToTop();
    $('.tab').removeClass('dropdown-open');
    $('.tab li').hide();
    $('.tab li.on').show();
    showActivePanel();
  }

  function initByMode() {
    if (mq.matches) setMobileMode();
    else setDesktopMode();
  }

  initByMode();
  if (mq.addEventListener) mq.addEventListener('change', initByMode);
  else mq.addListener(initByMode);

  function closeDropdownWithAnimation() {
    if (isAnimating) return;
    isAnimating = true;
    $('.tab li').not('.on')
      .stop(true, true).slideUp(180)
      .promise().done(function () {
        $('.tab').removeClass('dropdown-open');
        listOpen = false;
        $('.tab li').not('.on').hide();
        $('.tab li.on').show();
        isAnimating = false;
      });
  }

  $('.tab').on('click', 'li', function (e) {
    e.preventDefault();
    const $li = $(this);
    const id = $li.attr('rel');

    if (mq.matches) {
      // ===== 모바일 =====
      if (!listOpen) {
        if ($li.hasClass('on')) {
          moveActiveToTop();
          $('.tab').addClass('dropdown-open');
          $('.tab li').not('.on').stop(true, true).slideDown(180);
          listOpen = true;
        } else {
          $('.tab li').removeClass('on');
          $li.addClass('on');
          showActivePanel();
          moveActiveToTop();
          $('.tab li').hide();
          $('.tab li.on').show();
        }
      } else {
        if ($li.hasClass('on')) {
          moveActiveToTop();
          closeDropdownWithAnimation();
        } else {
          $('.tab li').removeClass('on');
          $li.addClass('on');
          showActivePanel();
          moveActiveToTop();
          closeDropdownWithAnimation();
        }
      }
    } else {
      $('.tab li').removeClass('on');
      $li.addClass('on');
      $('.tab_content').hide();
      $('#' + id).stop(true, true).fadeIn(180);
    }
  });
});