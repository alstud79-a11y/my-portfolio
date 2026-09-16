const header = document.querySelector("#header");
const menuButton = document.querySelector("#menuButton");
const nav = document.querySelector("#nav");
const menuLinks = document.querySelectorAll("#nav a");

// 화면을 조금 내리면 헤더에 그림자를 넣습니다.
window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

// 모바일 메뉴 열기와 닫기
menuButton.addEventListener("click", function () {
  const isOpen = nav.classList.toggle("open");
  menuButton.classList.toggle("open");
  menuButton.setAttribute("aria-expanded", isOpen);
});

// 메뉴를 누르면 모바일 메뉴를 닫습니다.
menuLinks.forEach(function (link) {
  link.addEventListener("click", function () {
    nav.classList.remove("open");
    menuButton.classList.remove("open");
    menuButton.setAttribute("aria-expanded", "false");
  });
});

// 섹션이 화면에 들어올 때 자연스럽게 나타납니다.
const sections = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(function (items) {
  items.forEach(function (item) {
    if (item.isIntersecting) {
      item.target.classList.add("show");
      observer.unobserve(item.target);
    }
  });
}, {
  threshold: 0.12
});

sections.forEach(function (section) {
  observer.observe(section);
});

// FILMS 탭: 한 자리에서 작품을 바꿔 봅니다.
const filmData = {
  brand: {
    eyebrow: "BRAND FILM · 2026",
    title: "16BRAND<br><em>IN MOTION</em>",
    description: "16BRAND의 발랄한 컬러와 제품 무드를 짧은 브랜드 필름으로 재구성했습니다. 이미지 제작부터 장면 구성, 편집까지 직접 연결해 웹 프로젝트의 분위기를 영상으로 확장했습니다.",
    meta: "Planning · AI Image · Editing",
    src: "assets/16brand-film.mp4",
    youtubeId: "IdYaVvwsIeU",
    vertical: false,
    index: "01", tags: ["PLANNING","AI IMAGE","EDITING"]
  },
  skin: {
    eyebrow: "2026 BEAUTY SAFETY SHORT-FORM · ENCOURAGEMENT AWARD",
    title: "SKIN<br><em>AIRPORT</em>",
    description: "화장품 안전성 평가 과정을 ‘피부공항 입국심사’라는 콘셉트로 풀어낸 세로형 공모전 영상입니다. 정보 전달과 스토리텔링이 함께 보이도록 AI 비주얼과 숏폼 편집을 구성했습니다.",
    meta: "Planning · AI Visual · Editing",
    src: "assets/skin-airport-film-smaller.mp4",
    youtubeId: "i_AfTu45pbU",
    vertical: true,
    index: "02", tags: ["PLANNING","AI VISUAL","CAPCUT"]
  },
  hunmin: {
    eyebrow: "COMPETITION FILM · 2026",
    title: "훈민정음<br><em>THE CREATION OF HANGEUL</em>",
    description: "훈민정음 창제의 과정과 의미를 현대적인 AI 영상 문법으로 재해석한 세로형 작품입니다. 역사적 분위기를 유지하면서 장면의 흐름과 이미지 연출이 자연스럽게 이어지도록 구성했습니다.",
    meta: "Planning · AI Visual · Editing",
    src: "assets/hunminjeongeum-film.mp4",
    youtubeId: "bUmIUdSJQfw",
    vertical: true,
    index: "03", tags: ["PLANNING","AI VIDEO","EDITING"]
  }
};

const filmTabs = document.querySelectorAll(".film-tab");
const filmVideo = document.querySelector("#filmVideo");
const filmSource = null;
const filmPlayer = document.querySelector("#filmPlayer");
const filmPanel = document.querySelector(".film-panel");
const filmEyebrow = document.querySelector("#filmEyebrow");
const filmTitle = document.querySelector("#filmTitle");
const filmDescription = document.querySelector("#filmDescription");
const filmMeta = document.querySelector("#filmMeta");
const filmIndex = document.querySelector("#filmIndex");
const filmWatermark = document.querySelector("#filmWatermark");
const filmTags = document.querySelector("#filmTags");

let filmSwitchTimer = null;

filmTabs.forEach(function (tab) {
  tab.addEventListener("click", function () {
    const item = filmData[tab.dataset.film];
    if (!item) return;

    // 이전 탭 전환 타이머가 남아 있으면 취소해서
    // 빠르게 탭을 바꿔도 이전 작품의 설명이 다시 덮어쓰지 않게 합니다.
    if (filmSwitchTimer) {
      window.clearTimeout(filmSwitchTimer);
      filmSwitchTimer = null;
    }

    filmTabs.forEach(function (button) {
      const active = button === tab;
      button.classList.toggle("active", active);
      button.setAttribute("aria-selected", active ? "true" : "false");
    });

    filmPanel.classList.remove("is-entering");
    filmPanel.classList.add("is-switching");

    filmSwitchTimer = window.setTimeout(function () {
      // 타이머가 실행되는 순간에도 현재 활성 탭이 같은지 한 번 더 확인합니다.
      if (!tab.classList.contains("active")) return;

      filmEyebrow.textContent = item.eyebrow;
      filmTitle.innerHTML = item.title;
      filmDescription.textContent = item.description;
      if (filmMeta) filmMeta.textContent = item.meta;
      if (filmIndex) filmIndex.textContent = item.index + " / MOTION SHOWCASE";
      if (filmWatermark) filmWatermark.textContent = item.index;
      if (filmTags) filmTags.innerHTML = item.tags.map(tag => "<span>" + tag + "</span>").join("");
      filmPlayer.classList.toggle("vertical", item.vertical);
      filmVideo.src = "https://www.youtube-nocookie.com/embed/" + item.youtubeId
        + "?autoplay=1&mute=1&loop=1&playlist=" + item.youtubeId
        + "&controls=0&rel=0&playsinline=1";
      filmPanel.classList.remove("is-switching");
      void filmPanel.offsetWidth;
      filmPanel.classList.add("is-entering");
      filmSwitchTimer = null;
    }, 180);
  });
});


(() => {
  const root=document.querySelector('.reference-real');
  if(!root)return;
  const els=root.querySelectorAll('.hero-title,.about-copy h2,.work .section-heading h2,.project-impact-title,.film .section-heading h2,.film-text h3,.resume-title h2,.contact-inner h2');
  els.forEach(el=>el.classList.add('ref-hit'));
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){els.forEach(el=>el.classList.add('ref-in'));return;}
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('ref-in');io.unobserve(e.target)}}),{threshold:.15});
  els.forEach(el=>io.observe(el));
})();

// Keep identity and project names visible; hero letters have their own staggered animation.
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.hero-letter-title, .project-impact-title').forEach(el => {
    el.classList.remove('ref-hit','v2-hit');
    el.style.visibility = 'visible';
  });
});


/* ===== FILM AUTOPLAY EXPERIENCE ===== */
document.addEventListener("DOMContentLoaded", () => {
  const playQuietly = (video) => {
    if (!video) return;
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    const p = video.play();
    if (p && typeof p.catch === "function") p.catch(() => {});
  };

  // Start visible previews immediately.
  document.querySelectorAll(".film-player video, .brand-video-mockup video").forEach(playQuietly);

  // Re-start a film whenever its tab becomes active / source changes.
  document.querySelectorAll(".film-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      window.setTimeout(() => {
        const video = document.querySelector(".film-player video");
        if (video) {
          video.currentTime = 0;
          playQuietly(video);
        }
      }, 80);
    });
  });

  // Elegant viewport behavior: pause when far away, resume on screen.
  const videos = document.querySelectorAll(".film-player video, .brand-video-mockup video");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting) playQuietly(v);
        else v.pause();
      });
    }, { threshold: 0.25 });
    videos.forEach(v => observer.observe(v));
  }
});

/* ===== AWARD CARD STATE ===== */
document.addEventListener("DOMContentLoaded", () => {
  const award = document.getElementById("filmAwardCard");
  const tabs = document.querySelectorAll(".film-tab");
  const syncAward = () => {
    const active = document.querySelector(".film-tab.active");
    const show = active && active.dataset.film === "skin";
    if (!award) return;
    award.classList.toggle("show", !!show);
    award.setAttribute("aria-hidden", show ? "false" : "true");
  };
  tabs.forEach(tab => tab.addEventListener("click", () => setTimeout(syncAward, 0)));
  syncAward();
});

/* ===== CONTACT EMAIL ACTION ===== */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("a,button,.contact-actions,.email-btn,.contact-email").forEach(el => {
    if ((el.textContent || "").trim().toUpperCase().includes("EMAIL")) {
      el.style.cursor = "pointer";
      el.addEventListener("click", (e) => {
        const a = e.target.closest("a");
        if (a && a.href && a.href.startsWith("mailto:")) return;
        e.preventDefault();
        window.location.href = "mailto:tkfkd7489@naver.com";
      });
    }
  });
});


/* ===== YOUTUBE EMBED READY =====
   Paste a YouTube video ID into data-youtube-id="" on a video element.
   The local MP4 automatically becomes a muted autoplaying YouTube embed.
*/
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("video[data-youtube-id]").forEach(video => {
    const id = (video.dataset.youtubeId || "").trim();
    if (!id) return;

    const wrap = document.createElement("div");
    wrap.className = "youtube-frame";

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.youtube.com/embed/" + encodeURIComponent(id) +
      "?autoplay=1&mute=1&loop=1&playlist=" + encodeURIComponent(id) +
      "&controls=0&rel=0&playsinline=1";
    iframe.title = video.getAttribute("aria-label") || "Portfolio video";
    iframe.allow = "autoplay; encrypted-media; picture-in-picture";
    iframe.setAttribute("allowfullscreen", "");

    wrap.appendChild(iframe);
    video.replaceWith(wrap);
  });
});


/* ===== MOBILE NAV CLOSE FIX ===== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle =
    document.querySelector(".menu-toggle") ||
    document.querySelector(".nav-toggle") ||
    document.querySelector(".hamburger") ||
    document.querySelector("[aria-label*='메뉴']");

  const nav =
    document.querySelector(".site-nav") ||
    document.querySelector("header nav");

  if (!toggle || !nav) return;

  // 기존 핸들러와 충돌하지 않게 실제 표시 상태를 기준으로 토글
  toggle.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopImmediatePropagation();

    const opened =
      nav.classList.contains("open") ||
      nav.classList.contains("active") ||
      nav.classList.contains("is-open");

    nav.classList.remove("open", "active", "is-open");

    if (!opened) {
      nav.classList.add("is-open");
      toggle.classList.add("is-active");
      toggle.setAttribute("aria-expanded", "true");
    } else {
      toggle.classList.remove("is-active", "active", "open");
      toggle.setAttribute("aria-expanded", "false");
    }
  }, true);

  // 메뉴 선택 후에도 자동 닫힘
  nav.querySelectorAll("a").forEach(a => {
    a.addEventListener("click", () => {
      nav.classList.remove("open", "active", "is-open");
      toggle.classList.remove("is-active", "active", "open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
});
