'use strict';

import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');

/* ============================================================
   SAFEGUARD : empêcher tout scroll horizontal involontaire
   (sans bloquer les scrollers internes comme .comparo-viewport)
   ============================================================ */
function enforceNoXScroll() {
  const html = document.documentElement;
  const body = document.body;
  // clip > hidden : n’ajoute pas de gutter latérale
  html.style.overflowX = 'clip';
  body.style.overflowX = 'clip';
  // Évite les "rebonds" horizontaux
  html.style.overscrollBehaviorX = 'none';
  body.style.overscrollBehaviorX = 'none';

  // Laisse les scrollers internes gérer leur X-scroll (ex: .comparo-viewport)
  const isInsideWhitelistedXScroller = (el) =>
    el?.closest?.('.comparo-viewport, .track, [data-allow-x-scroll="true"]');

  // Empêche une propagation qui ferait bouger la page en X
  window.addEventListener('wheel', (e) => {
    // si l’event vient d’un scroller autorisé, on ne touche à rien
    if (isInsideWhitelistedXScroller(e.target)) return;
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
      e.preventDefault();
    }
  }, { passive: false });

  // Touch: la majorité de tes gestes sont en Y; on ne bride pas globalement,
  // mais on coupe les glissements horizontaux flagrants hors scrollers autorisés.
  let touchStartX = 0, touchStartY = 0;
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0];
    touchStartX = t.clientX; touchStartY = t.clientY;
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (isInsideWhitelistedXScroller(e.target)) return;
    const t = e.touches[0];
    const dx = Math.abs(t.clientX - touchStartX);
    const dy = Math.abs(t.clientY - touchStartY);
    // si le geste est nettement plus horizontal, on le bloque au niveau page
    if (dx > dy && dx > 8) {
      e.preventDefault();
    }
  }, { passive: false });
}

document.addEventListener("DOMContentLoaded", () => {
  // Anti X-scroll global
  enforceNoXScroll();

  gsap.registerPlugin(ScrollTrigger);

  initBurgerMenu();
  initNavActive();
  initVideo953();
  initAccueilImage();
  initFadeIn();
  initCasinoText();
  initFadeUpEffect();
  init997Image();
  initMobileAccordion();
  initFooterAnimation();
  initSlider();
  initFeaturesCards();
  initHeroCarAnimation();
  initTimelineScroll();
  initModelEvolution();
  initQuiz();
  initFake3DRotation();
  initScrollScaleForward();
  initFeatureListAnimation();
  initFeaturesReveal();
  initEvolution();

  // ➜ Nouveau : gestion des ancres compatible header fixe + GSAP
  initAnchorScrolling();

  // 3D
  initPorsche3DSection();

  initComparison();
  initHistorySideNav();
  initLaunchControl();
  initMiniGames();
  initMemoryStandalone();
});

function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const navLinks = document.getElementById('nav-links');

  if (burger && navLinks) {
    burger.addEventListener('click', () => {
      const links = navLinks.querySelectorAll('li');
      burger.classList.toggle('open');

      if (navLinks.classList.contains('active')) {
        links.forEach((link) => {
          link.classList.remove('show');
        });

        setTimeout(() => {
          navLinks.classList.remove('show');
          navLinks.classList.remove('active');
        }, 400);

        burger.innerHTML = '&#9776;';
      } else {
        navLinks.classList.add('active');
        navLinks.classList.add('show');
        burger.innerHTML = '✖';

        links.forEach((link, i) => {
          setTimeout(() => {
            link.classList.add('show');
          }, i * 100);
        });
      }
    });
  }
}

function initNavActive() {
  const navItems = document.querySelectorAll('.nav-link');
  if (navItems.length > 0) {
    const currentPath = window.location.pathname;
    navItems.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      if (linkPath === currentPath || (linkPath === '/' && currentPath === '/index.php')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }
}

function initFake3DRotation() {
  const images3d = [
    'assets/images/porsche-1.png',
    'assets/images/porsche-2.png',
    'assets/images/porsche-3.png',
    'assets/images/porsche-4.png',
    'assets/images/porsche-5.png',
    'assets/images/porsche-6.png',
    'assets/images/porsche-7.png',
    'assets/images/porsche-8.png'
  ];

  const porscheImage = document.getElementById('porscheImage');
  const textZone = document.getElementById('rotationDescription');
  const buttons = document.querySelectorAll('.rotation-controls button');
  const sectionRotation3d = document.querySelector('.porsche-fake3d-section');
  const prevBtn = document.getElementById('prevView');
  const nextBtn = document.getElementById('nextView');

  if (!porscheImage || !textZone || buttons.length === 0 || !sectionRotation3d) return;

  let currentIndex = 0;

  function updateView(index) {
    const text = buttons[index].dataset.text;
    porscheImage.style.opacity = 0;
    textZone.classList.add('hidden');

    setTimeout(() => {
      porscheImage.src = images3d[index];
      porscheImage.style.opacity = 1;
      textZone.textContent = text;
      textZone.classList.remove('hidden');
    }, 200);

    buttons.forEach(b => b.classList.remove('active'));
    buttons[index].classList.add('active');
    currentIndex = index;
  }

  buttons.forEach((btn, index) => {
    btn.addEventListener('click', () => {
      updateView(index);
    });
  });

  function goToNext() {
    const newIndex = (currentIndex + 1) % images3d.length;
    updateView(newIndex);
  }

  function goToPrev() {
    const newIndex = (currentIndex - 1 + images3d.length) % images3d.length;
    updateView(newIndex);
  }

  nextBtn?.addEventListener('click', goToNext);
  prevBtn?.addEventListener('click', goToPrev);

  let touchStartX = 0;

  sectionRotation3d.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  sectionRotation3d.addEventListener('touchend', e => {
    const touchEndX = e.changedTouches[0].screenX;
    const delta = touchEndX - touchStartX;

    if (delta < -50) goToNext();
    if (delta > 50) goToPrev();
  }, { passive: true });

  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight') goToNext();
    else if (e.key === 'ArrowLeft') goToPrev();
  });

  updateView(0);
}

function initVideo953() {
  const video953 = document.getElementById("video-953");
  const videoSection = document.querySelector(".video953");

  if (video953 && videoSection) {
    gsap.set(video953, { opacity: 0, y: 50 });

    ScrollTrigger.create({
      trigger: ".video953",
      start: "top 80%",
      end: "bottom top",
      onEnter: () => {
        video953.muted = false;
        video953.play();

        gsap.to(video953, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => videoSection.classList.add("half-black-bg")
        });
      },
      onEnterBack: () => {
        video953.muted = false;
        video953.play();

        gsap.to(video953, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power2.out",
          onComplete: () => videoSection.classList.add("half-black-bg")
        });
      },
      onLeave: () => video953.pause(),
      onLeaveBack: () => {
        video953.pause();
        videoSection.classList.remove("half-black-bg");
      },
      once: false
    });
  }
}

function initAccueilImage() {
  const accueilImg = document.querySelector('.accueil__img');

  if (accueilImg) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          accueilImg.classList.add('visible');
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(accueilImg);
  }
}

function initFadeIn() {
  const s997Fades = document.querySelectorAll('.s997__fade-in');

  if (s997Fades.length > 0) {
    s997Fades.forEach((el) => {
      gsap.to(el, {
        scrollTrigger: {
          trigger: el,
          start: "top 60%",
          toggleClass: "visible",
          once: true,
        }
      });
    });
  }

  const elements = document.querySelectorAll('.fade-in-on-scroll');

  elements.forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 30 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        delay: 0.5,
        scrollTrigger: {
          trigger: el,
          start: "top 70%",
          toggleActions: "play none none none",
          once: true
        }
      }
    );
  });
}

function initCasinoText() {
  const animatedTitles = document.querySelectorAll('.animated-casino');

  if (animatedTitles.length > 0) {
    animatedTitles.forEach((el) => {
      const finalText = el.dataset.title;
      let currentIndex = 0;
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ ";

      function animateCasino() {
        const interval = setInterval(() => {
          let output = "";

          for (let i = 0; i < finalText.length; i++) {
            if (i < currentIndex) {
              output += finalText[i];
            } else {
              output += letters[Math.floor(Math.random() * letters.length)];
            }
          }

          el.textContent = output;

          if (currentIndex < finalText.length) {
            currentIndex++;
          } else {
            clearInterval(interval);
          }
        }, 120);
      }

      ScrollTrigger.create({
        trigger: el,
        start: 'top 80%',
        once: true,
        onEnter: animateCasino,
      });
    });
  }
}

function initFadeUpEffect() {
  const elements = document.querySelectorAll('.fade-up-on-scroll');
  elements.forEach((el, index) => {
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: "power2.out",
      delay: index * 0.1,
      scrollTrigger: {
        trigger: el,
        start: "top 70%",
        toggleActions: "play none none none"
      }
    });
  });
}

function init997Image() {
  const s997Img = document.querySelector('.s997__img');

  if (s997Img) {
    gsap.fromTo(s997Img,
      { opacity: 0, y: 50 },
      {
        scrollTrigger: {
          trigger: s997Img,
          start: 'top 85%',
          once: true,
        },
        opacity: 1,
        y: 0,
        delay: 1.3,
        duration: 1.2,
        ease: "power2.out"
      }
    );
  }
}

function initMobileAccordion() {
  const items = document.querySelectorAll(".timeline__item");

  if (items.length > 0) {
    function handleScroll() {
      let closestItem = null;
      let closestDistance = Infinity;
      const viewportCenter = window.innerHeight / 2;

      items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestItem = item;
        }
      });

      items.forEach(item => item.classList.remove("active"));
      if (closestItem) closestItem.classList.add("active");
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
  }
}

function initFooterAnimation() {
  const footer = document.querySelector('.site-footer');
  const divider = document.querySelector('.footer-divider');

  if (footer && divider) {
    gsap.set(footer, { opacity: 0, y: 50 });
    gsap.set(divider, { scaleX: 0 });

    gsap.to(footer, {
      scrollTrigger: {
        trigger: footer,
        start: "top bottom",
        once: true,
        onEnter: () => {
          gsap.to(footer, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out"
          });

          gsap.to(divider, {
            scaleX: 1,
            duration: 1,
            ease: "power2.out",
            delay: 0.4
          });
        }
      }
    });
  }
}

function initSlider() {
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const slider = document.querySelector('.slider');
  if (slides.length > 0 && dots.length > 0 && slider) {
    let current = 0;

    function showSlide(index) {
      slides.forEach((slide, i) => {
        slide.classList.toggle('is-visible', i === index);
        dots[i].classList.toggle('is-current', i === index);
      });
    }

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        current = index;
        showSlide(current);
      });
    });

    let startX = 0;
    let endX = 0;

    slider.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });

    slider.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const threshold = 50;
      if (startX - endX > threshold) {
        current = (current + 1) % slides.length;
        showSlide(current);
      } else if (endX - startX > threshold) {
        current = (current - 1 + slides.length) % slides.length;
        showSlide(current);
      }
    }

    showSlide(current);
  }
}

function initFeaturesCards() {
  const section = document.querySelector('.porsche-features');
  const title = document.getElementById('feature-title');
  const text = document.getElementById('feature-text');
  const image = document.getElementById('feature-image');
  const container = document.getElementById('cards-container');

  if (!section || !title || !text || !image || !container) return;

  const data = {
    moteur: {
      title: "MOTEUR",
      text: "Le flat-6 biturbo de la 911 allie puissance, réactivité, et une sonorité inimitable.\n\nDe 385 à 450 ch, il offre un couple généreux dès les bas régimes et propulse la 911 de 0 à 100 km/h en 3,4 s.\nUn moteur taillé pour la performance et l'émotion.",
      image: "assets/images/moteur-911-carrera-1.png",
      thumb: "assets/images/moteur-old.jpg"
    },
    frein: {
      title: "FREIN",
      text: "Les freins Porsche Ceramic Composite Brake (PCCB) offrent des performances de freinage supérieures et constantes. Leur légèreté améliore la maniabilité et le confort de conduite.",
      image: "assets/images/frein.png",
      thumb: "assets/images/frein.jpg"
    },
    design: {
      title: "DESIGN",
      text: "Le design de la Porsche 911 est un subtil mélange d'élégance intemporelle et de sportivité affirmée.\n\nAvec sa silhouette iconique en forme de goutte d'eau, ses ailes galbées, ses phares ronds et sa ligne de toit plongeante,elle incarne l'équilibre parfait entre tradition et innovation.\n\nChaque détail, du dessin des jantes aux courbes du capot, reflète la quête de performance et de raffinement qui définit l'ADN de la 911 depuis plus de 60.",
      image: "assets/images/design.png",
      thumb: "assets/images/design-new.jpg"
    }
  };

  function createCard(feature) {
    const card = document.createElement('div');
    card.classList.add('feature-card');
    card.dataset.feature = feature;

    const label = document.createElement('span');
    label.textContent = data[feature].title;

    const img = document.createElement('div');
    img.className = 'image';
    img.style.backgroundImage = `url(${data[feature].thumb})`;

    card.appendChild(label);
    card.appendChild(img);

    card.addEventListener('click', () => {
      updateLeftContent(feature);
      updateActiveCard(feature);
    });

    return card;
  }

  function updateLeftContent(feature) {
    gsap.to([title, text, image], {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        title.textContent = data[feature].title;
        text.textContent = data[feature].text;
        image.src = data[feature].image;
        image.alt = data[feature].title;

        gsap.to([title, text, image], {
          opacity: 1,
          duration: 0.4,
          delay: 0.1
        });
      }
    });
  }

  function updateActiveCard(activeFeature) {
    const cards = container.querySelectorAll('.feature-card');
    cards.forEach(card => {
      card.classList.toggle('active', card.dataset.feature === activeFeature);
    });
  }

  function updateDisplay() {
    container.innerHTML = '';
    Object.keys(data).forEach((feature, i) => {
      const card = createCard(feature);
      if (i === 0) {
        updateLeftContent(feature);
        card.classList.add('active');
      }
      container.appendChild(card);
    });

    animateCardsOnce();
  }

  function animateCardsOnce() {
    const cards = container.querySelectorAll('.feature-card');
    gsap.from(cards, {
      x: 50,
      opacity: 0,
      stagger: 0.15,
      duration: 0.6,
      delay: 0.3,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 20%",
        toggleActions: "play none none none"
      }
    });
  }

  updateDisplay();
}

function initHeroCarAnimation() {
  const car = document.querySelector('.car-container');
  const hero = document.querySelector('.porsche-hero');
  const headlights = document.querySelectorAll('.headlight');

  if (!car || !hero) return;

  gsap.to(car, {
    scrollTrigger: {
      trigger: hero,
      start: "top center",
      end: "bottom 10%",
      scrub: true,
    },
    x: 0,
    y: 0,
    scale: 1,
    ease: "power2.out",
  });

  ScrollTrigger.create({
    trigger: hero,
    start: "center center",
    onEnter: () => {
      headlights.forEach(light => gsap.to(light, { opacity: 1, duration: 1 }));
    },
    onLeaveBack: () => {
      headlights.forEach(light => gsap.to(light, { opacity: 0, duration: 0.6 }));
    },
  });
}

function initTimelineScroll() {
  const section = document.querySelector(".porsche-timeline-section");
  const stepsEls = document.querySelectorAll(".porsche-step");
  const slidesEls = document.querySelectorAll(".porsche-slide");
  const imagesEls = document.querySelectorAll(".porsche-image");

  if (!section || !stepsEls.length || !slidesEls.length || !imagesEls.length) {
    console.warn("Timeline Porsche: éléments manquants");
    return;
  }

  const stepsData = Array.from(stepsEls).map((stepEl, i) => {
    const stepNum = i + 1;
    const slide = section.querySelector(`.porsche-slide[data-step="${stepNum}"]`);
    const image = section.querySelector(`.porsche-image[data-step="${stepNum}"]`);
    return {
      stepNum,
      slide,
      image
    };
  });

  function changeContent(index) {
    const stepNum = index + 1;

    stepsEls.forEach(s => s.classList.toggle("active", s.dataset.step == stepNum));
    slidesEls.forEach(s => s.classList.toggle("active", s.dataset.step == stepNum));
    imagesEls.forEach(i => i.classList.toggle("active", i.dataset.step == stepNum));
  }

  stepsData.forEach((_, i) => {
    ScrollTrigger.create({
      trigger: section,
      start: () => `top -${i * window.innerHeight}px`,
      end: () => `+=${window.innerHeight}`,
      onEnter: () => changeContent(i),
      onEnterBack: () => changeContent(i)
    });
  });

  changeContent(0);

  stepsEls.forEach(stepEl => {
    stepEl.addEventListener("click", () => {
      const stepNumber = parseInt(stepEl.dataset.step, 10);
      const targetSlide = section.querySelector(`.porsche-slide[data-step="${stepNumber}"]`);
      if (targetSlide) {
        targetSlide.scrollIntoView({ behavior: "smooth", block: "start" });
        changeContent(stepNumber - 1);
      }
    });
  });
}

function initModelEvolution() {
  const slices = document.querySelectorAll('.slice');
  const modelInfo = document.getElementById('modelInfo');
  const modelImg = document.getElementById('modelImg');
  const modelYear = document.getElementById('modelYear');
  const modelPower = document.getElementById('modelPower');
  const modelSpeed = document.getElementById('modelSpeed');
  const closeBtn = document.getElementById('closeInfo');
  const prevBtn = document.getElementById('prevModel');
  const nextBtn = document.getElementById('nextModel');
  const modelLink = document.getElementById('modelLink');

  const modelData = {
    "original": { img: 'assets/images/901-original.png', year: '1963', power: '130 ch', speed: '210 km/h', anchor: 'original' },
    "gseries": { img: 'assets/images/g-serie.png', year: '1973', power: '150 ch', speed: '225 km/h', anchor: 'g-serie' },
    "964": { img: 'assets/images/964.png', year: '1988', power: '250 ch', speed: '240 km/h', anchor: '964' },
    "993": { img: 'assets/images/993.png', year: '1993', power: '272 ch', speed: '270 km/h', anchor: '993' },
    "996": { img: 'assets/images/996.png', year: '1997', power: '300 ch', speed: '280 km/h', anchor: '996' },
    "997": { img: 'assets/images/997.png', year: '2004', power: '325 ch', speed: '285 km/h', anchor: '997' },
    "991": { img: 'assets/images/991.png', year: '2011', power: '350 ch', speed: '295 km/h', anchor: '991' }
  };
  const modelOrder = ["original", "gseries", "964", "993", "996", "997", "991"];
  let currentModelIndex = 0;

  if (slices.length > 0 && modelInfo && modelImg && modelYear && modelPower && modelSpeed && closeBtn && prevBtn && nextBtn && modelLink) {
    function showModel(modelKey) {
      const data = modelData[modelKey];
      if (!data) return;
      currentModelIndex = modelOrder.indexOf(modelKey);
      modelInfo.classList.remove('fade-in');
      void modelInfo.offsetWidth;
      modelInfo.classList.add('fade-in');
      modelImg.src = data.img;
      modelYear.textContent = data.year;
      modelPower.textContent = data.power;
      modelSpeed.textContent = data.speed;
      modelLink.href = `history.php#${data.anchor}`;
      slices.forEach(s => s.classList.remove('active'));
      const activeSlice = document.querySelector(`.slice[data-model="${modelKey}"]`);
      if (activeSlice) activeSlice.classList.add('active');
      modelInfo.classList.add('visible');
    }

    slices.forEach(slice => {
      slice.addEventListener('click', () => {
        const model = slice.getAttribute('data-model');
        showModel(model);
      });
    });

    closeBtn.addEventListener('click', () => {
      modelInfo.classList.remove('visible');
      slices.forEach(s => s.classList.remove('active'));
    });

    prevBtn.addEventListener('click', () => {
      currentModelIndex = (currentModelIndex - 1 + modelOrder.length) % modelOrder.length;
      showModel(modelOrder[currentModelIndex]);
    });
    nextBtn.addEventListener('click', () => {
      currentModelIndex = (currentModelIndex + 1) % modelOrder.length;
      showModel(modelOrder[currentModelIndex]);
    });

    document.addEventListener('keydown', (e) => {
      if (!modelInfo.classList.contains('visible')) return;
      if (e.key === 'ArrowLeft') {
        currentModelIndex = (currentModelIndex - 1 + modelOrder.length) % modelOrder.length;
        showModel(modelOrder[currentModelIndex]);
      } else if (e.key === 'ArrowRight') {
        currentModelIndex = (currentModelIndex + 1) % modelOrder.length;
        showModel(modelOrder[currentModelIndex]);
      } else if (e.key === 'Escape') {
        modelInfo.classList.remove('visible');
        slices.forEach(s => s.classList.remove('active'));
      }
    });
  }
}

function initQuiz() {
  const quizSection = document.querySelector(".question-quiz");
  const resultSection = document.querySelector(".result-quiz");
  if (!quizSection) return;

  const questionText = document.querySelector(".question-text");
  const answerButtons = document.querySelectorAll(".answer-btn");
  const counterDisplay = document.getElementById("question-counter");
  const finalScoreDisplay = document.getElementById("final-score");
  const restartButton = document.getElementById("restart-quiz");
  const needle = document.getElementById("needle");
  const encouragementMessage = document.getElementById("encouragement-message");
  const rewardSection = document.getElementById("reward-links");
  const r1 = document.getElementById("reward-1");
  const r2 = document.getElementById("reward-2");
  const r3 = document.getElementById("reward-3");

  const allQuestions = [
    { question: "En quelle année la première Porsche 911 a-t-elle été présentée ?", answers: ["1962", "1963", "1970", "1959"], correct: 1 },
    { question: "Quel est le nom de code interne de la première 911 ?", answers: ["Typ 901", "Typ 911", "Typ 356", "Typ G"], correct: 0 },
    { question: "Quelle génération suit la 993 ?", answers: ["964", "997", "996", "991"], correct: 2 },
    { question: "Quel modèle a introduit les phares ovales ?", answers: ["996", "993", "997", "964"], correct: 0 },
    { question: "Quelle est la plus récente génération ?", answers: ["992", "997", "991", "964"], correct: 0 },
    { question: "Quelle génération est surnommée ‘la dernière refroidie par air’ ?", answers: ["996", "993", "991", "997"], correct: 1 },
    { question: "Quelle version est axée sur la piste ?", answers: ["Carrera", "Targa", "Turbo", "GT3"], correct: 3 },
    { question: "Quel constructeur fabrique la Porsche 911 ?", answers: ["Mercedes", "Ferrari", "Porsche", "BMW"], correct: 2 },
    { question: "En quelle année est sortie la génération 991 ?", answers: ["2007", "2011", "2015", "2019"], correct: 1 },
    { question: "Quelle est la version ultra-sportive homologuée pour la route ?", answers: ["Carrera", "Targa", "Turbo", "GT3 RS"], correct: 3 },
    { question: "Quel type de moteur équipe traditionnellement la Porsche 911 ?", answers: ["V6", "V8", "Flat-six", "V12"], correct: 2 }
  ];
  let shuffledQuestions = [];
  let currentQuestionIndex = 0;
  let score = 0;

  function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function rotateNeedleToIndex(index, total = 10) {
    const minDeg = 0;
    const maxDeg = 230;
    const ratio = index / total;
    const angle = minDeg + (maxDeg - minDeg) * ratio;
    if (needle) needle.style.transform = `rotate(${angle}deg)`;
    if (counterDisplay) counterDisplay.textContent = index;
  }

  function showQuestion() {
    const question = shuffledQuestions[currentQuestionIndex];
    questionText.textContent = question.question;
    answerButtons.forEach((btn, index) => {
      btn.textContent = question.answers[index];
      btn.classList.remove("correct", "wrong");
    });
    rotateNeedleToIndex(currentQuestionIndex, shuffledQuestions.length);
  }

  function handleAnswer(e) {
    const selectedIndex = parseInt(e.target.dataset.index);
    const correctIndex = shuffledQuestions[currentQuestionIndex].correct;

    answerButtons.forEach((btn, index) => {
      btn.disabled = true;
      if (index === correctIndex) {
        btn.classList.add("correct");
      } else if (index === selectedIndex) {
        btn.classList.add("wrong");
      }
    });

    if (selectedIndex === correctIndex) score++;

    setTimeout(() => {
      answerButtons.forEach((btn) => {
        btn.classList.remove("correct", "wrong");
        btn.disabled = false;
      });
      currentQuestionIndex++;
      if (currentQuestionIndex < shuffledQuestions.length) {
        showQuestion();
      } else {
        showResult();
      }
    }, 800);
  }

  function showResult() {
    quizSection.classList.add("hidden");
    resultSection.classList.remove("hidden");
    finalScoreDisplay.textContent = `Tu as obtenu ${score} / ${shuffledQuestions.length} bonnes réponses !`;

    encouragementMessage.classList.add("hidden");
    rewardSection.classList.add("hidden");
    r1.classList.add("hidden");
    r2.classList.add("hidden");
    r3.classList.add("hidden");

    if (score >= 5) {
      rewardSection.classList.remove("hidden");
      if (score >= 9) {
        r1.classList.remove("hidden");
        r2.classList.remove("hidden");
        r3.classList.remove("hidden");
      } else if (score >= 7) {
        r2.classList.remove("hidden");
        r3.classList.remove("hidden");
      } else {
        r3.classList.remove("hidden");
      }
    } else {
      encouragementMessage.classList.remove("hidden");
    }
  }

  function startQuiz() {
    shuffledQuestions = shuffleArray([...allQuestions]).slice(0, 10);
    currentQuestionIndex = 0;
    score = 0;
    rotateNeedleToIndex(0, 10);
    quizSection.classList.remove("hidden");
    resultSection.classList.add("hidden");
    showQuestion();
  }

  const answerBtnsArr = Array.from(answerButtons);
  answerBtnsArr.forEach((btn) => btn.addEventListener("click", handleAnswer, { passive: true }));
  restartButton.addEventListener("click", startQuiz, { passive: true });

  window.addEventListener('load', () => {
    if (!needle) return;
    let step = 0;
    const anim = setInterval(() => {
      const angle = 10 + Math.sin(step) * 10;
      needle.style.transform = `rotate(${angle}deg)`;
      step += 0.2;
      if (step > Math.PI * 2) {
        clearInterval(anim);
        needle.style.transform = `rotate(10deg)`;
      }
    }, 30);
  });

  startQuiz();
}

function initScrollScaleForward() {
  const elements = document.querySelectorAll('.scroll-scale-forward');

  elements.forEach((el) => {
    gsap.fromTo(el,
      { scale: 1 },
      {
        scale: 1.3,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "bottom top",
          scrub: true
        }
      }
    );
  });
}

function initFeatureListAnimation() {
  const listItems = document.querySelectorAll('.feature-list li');

  listItems.forEach((li, index) => {
    gsap.to(li, {
      scrollTrigger: {
        trigger: li,
        start: "top 85%",
        toggleActions: "play none none none"
      },
      opacity: 1,
      x: 0,
      delay: index * 0.2,
      duration: 0.6,
      ease: "power2.out"
    });
  });
}

function initFeaturesReveal() {
  const section = document.querySelector('.porsche-features');
  const left = section?.querySelector('.content-left');
  const right = section?.querySelector('.content-right');

  if (!section || !left || !right) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top 80%",
      once: true,
    }
  });

  tl.from(left, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out"
  })
  .from(right, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: "power2.out"
  }, ">0.1");
}

function initEvolution() {
  const track   = document.getElementById("track");
  const wrap    = track?.parentElement;
  const cards   = Array.from(track?.children || []);
  const prev    = document.getElementById("prev");
  const next    = document.getElementById("next");
  const dotsBox = document.getElementById("dots");

  if (!track || !wrap || cards.length === 0) return;

  const isMobile = () => matchMedia("(max-width:767px)").matches;

  cards.forEach((_, i) => {
    const dot = document.createElement("span");
    dot.className = "dot";
    dot.onclick = () => activate(i, true);
    dotsBox.appendChild(dot);
  });
  const dots = Array.from(dotsBox.children);

  let current = -1;

  function center(i){
    const card  = cards[i];
    if (!card) return;
    const axis  = isMobile() ? "top"  : "left";
    const size  = isMobile() ? "clientHeight" : "clientWidth";
    const start = isMobile() ? card.offsetTop : card.offsetLeft;
    wrap.scrollTo({ [axis]: start - (wrap[size]/2 - card[size]/2), behavior: "smooth" });
  }

  function fillActiveData(i){
    const active = cards[i];
    if (!active) return;
    const year = active.dataset.year || "";
    const hp   = active.dataset.hp   || "";
    const vmax = active.dataset.vmax || "";

    const yearEl = active.querySelector(".p911-year");
    const hpEl   = active.querySelector(".p911-hp");
    const vmaxEl = active.querySelector(".p911-vmax");

    if (yearEl) yearEl.textContent = year;
    if (hpEl)   hpEl.textContent   = hp;
    if (vmaxEl) vmaxEl.textContent = vmax;
  }

  function setNavState(){
    dots.forEach((d, k) => d.classList.toggle("active", k === current && current !== -1));
    const noOpen = current === -1;
    if (prev) prev.disabled = noOpen ? true : current === 0;
    if (next) next.disabled = noOpen ? true : current === cards.length - 1;
  }

  function toggleUI(i){
    cards.forEach((c, k) => c.toggleAttribute("active", k === i));
    fillActiveData(i);
    setNavState();
  }

  function closeActive(){
    cards.forEach(c => c.removeAttribute("active"));
    current = -1;
    setNavState();
  }

  function activate(i, scroll){
    const sameOpen = (i === current) && cards[i]?.hasAttribute("active");
    if (sameOpen){
      closeActive();
      return;
    }
    current = i;
    toggleUI(i);
    if (scroll) center(i);
  }

  function go(step){
    if (current === -1) return;
    const target = Math.min(Math.max(current + step, 0), cards.length - 1);
    activate(target, true);
  }

  if (prev) prev.onclick = () => go(-1);
  if (next) next.onclick = () => go(1);

  addEventListener("keydown", (e) => {
    if (["ArrowRight","ArrowDown"].includes(e.key)) go(1);
    if (["ArrowLeft","ArrowUp"].includes(e.key))   go(-1);
    if (e.key === "Escape") closeActive();
  }, { passive:true });

  cards.forEach((card, i) => {
    card.addEventListener("click", (e) => {
      if (e.target.closest(".p911-close")) { closeActive(); return; }
      activate(i, true);
    });
  });

  let sx=0, sy=0;
  track.addEventListener("touchstart",(e)=>{ sx=e.touches[0].clientX; sy=e.touches[0].clientY; },{passive:true});
  track.addEventListener("touchend",(e)=>{
    const dx = e.changedTouches[0].clientX - sx;
    const dy = e.changedTouches[0].clientY - sy;
    if (isMobile() ? Math.abs(dy) > 60 : Math.abs(dx) > 60)
      go((isMobile() ? dy : dx) > 0 ? -1 : 1);
  },{passive:true});

  if (isMobile()) dotsBox.hidden = true;

  setNavState();
  center(0);
}

/* -----------------------------
   NOUVEAU : Gestion des ancres
   ----------------------------- */
// Solution complète pour les ancres inter-pages
function initAnchorScrolling() {
  const header = document.querySelector('.navbar');
  const getOffset = () => (header ? header.offsetHeight : 0) + 12;

  // Désactiver la restauration automatique du scroll
  if ('scrollRestoration' in history) {
    try { history.scrollRestoration = 'manual'; } catch (_) {}
  }

  function getTargetFromHash(hash) {
    if (!hash || hash === '#') return null;
    const id = decodeURIComponent(hash.slice(1));
    return document.getElementById(id) || null;
  }

  function scrollToHash(hash, behavior = 'smooth') {
    const target = getTargetFromHash(hash);
    if (!target) {
      console.log('Ancre non trouvée:', hash);
      return false;
    }

    // Fermer le menu burger si ouvert
    const burger = document.getElementById('burger');
    const navLinks = document.getElementById('nav-links');
    if (burger && navLinks && navLinks.classList.contains('active')) {
      burger.classList.remove('open');
      navLinks.classList.remove('active', 'show');
      burger.innerHTML = '&#9776;';
    }

    // Calculer la position avec offset
    const rect = target.getBoundingClientRect();
    const y = rect.top + window.pageYOffset - getOffset();

    window.scrollTo({
      top: Math.max(0, y),
      behavior: behavior
    });

    return true;
  }

  // Gestion des clics sur les liens avec ancres
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href*="#"]');
    if (!a) return;

    const url = new URL(a.href, window.location.origin);
    const sameOrigin = url.origin === window.location.origin;
    const currentPath = window.location.pathname.replace(/\/+$/, '');
    const targetPath = url.pathname.replace(/\/+$/, '');
    const samePath = currentPath === targetPath;
    const hash = url.hash;

    if (!hash) return;

    if (sameOrigin && samePath) {
      // Même page : scroll direct
      e.preventDefault();
      scrollToHash(hash, 'smooth');
      try { history.pushState(null, '', hash); } catch {}
    }
    // Différente page : laisser le navigateur faire, le scroll se fera à l'arrivée
  }, { passive: false });

  // FONCTION PRINCIPALE de repositionnement à l'arrivée
  function handleArrivalScroll() {
    const hash = window.location.hash;
    if (!hash) return;

    // Attendre que GSAP soit prêt
    function waitForGSAP() {
      return new Promise(resolve => {
        if (window.gsap && window.ScrollTrigger) {
          ScrollTrigger.refresh();
          resolve();
        } else {
          setTimeout(() => waitForGSAP().then(resolve), 50);
        }
      });
    }

    // Vérifier que l'élément cible existe
    function waitForElement(hash, maxAttempts = 50) {
      return new Promise((resolve) => {
        let attempts = 0;

        function check() {
          const target = getTargetFromHash(hash);
          if (target) {
            resolve(target);
            return;
          }

          attempts++;
          if (attempts < maxAttempts) {
            setTimeout(check, 100);
          } else {
            resolve(null);
          }
        }

        check();
      });
    }

    // Séquence de scroll
    async function doScroll() {
      try {
        await waitForGSAP();
        const target = await waitForElement(hash);
        if (!target) return;

        scrollToHash(hash, 'auto');

        const delays = [200, 500, 1000, 2000];
        delays.forEach((delay, index) => {
          setTimeout(() => {
            if (window.ScrollTrigger) {
              ScrollTrigger.refresh();
            }
            scrollToHash(hash, index > 0 ? 'smooth' : 'auto');
          }, delay);
        });

      } catch (error) {
        console.error('Erreur lors du scroll:', error);
      }
    }

    doScroll();
  }

  // Événements pour déclencher le repositionnement
  window.addEventListener('load', handleArrivalScroll, { passive: true });
  window.addEventListener('pageshow', handleArrivalScroll, { passive: true });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', handleArrivalScroll, { passive: true });
  } else {
    setTimeout(handleArrivalScroll, 0);
  }

  // Changement de hash sur la même page
  window.addEventListener('hashchange', () => {
    if (window.ScrollTrigger) {
      ScrollTrigger.refresh();
    }
    setTimeout(() => scrollToHash(window.location.hash, 'smooth'), 100);
  }, { passive: true });

  // Attendre les polices
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => {
      if (window.location.hash) {
        setTimeout(() => {
          if (window.ScrollTrigger) ScrollTrigger.refresh();
          scrollToHash(window.location.hash, 'auto');
        }, 100);
      }
    });
  }
}

// AJOUT : Script de debug à exécuter dans la console pour tester
window.debugAnchor = function(hash) {
  const element = document.getElementById(hash.replace('#', ''));
  if (element) {
    console.log('Élément trouvé:', element);
    console.log('Position:', element.getBoundingClientRect());
    element.style.border = '3px solid red';
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.log('Élément non trouvé pour:', hash);
    console.log('IDs disponibles:', Array.from(document.querySelectorAll('[id]')).map(el => el.id));
  }
};


//3D

/* ===== Tweens util ===== */
const easeInOutCubic = (t) => (t < 0.5 ? 4*t*t*t : 1 - Math.pow(-2*t+2,3)/2);
function tweenVector3(vec, to, durSec, onUpdate, onComplete) {
  const from = vec.clone(), t0 = performance.now();
  const step = (now) => {
    const t = Math.min(1, (now - t0) / (durSec * 1000));
    const k = easeInOutCubic(t);
    vec.set(
      from.x + (to.x - from.x) * k,
      from.y + (to.y - from.y) * k,
      from.z + (to.z - from.z) * k
    );
    onUpdate && onUpdate(k);
    (t < 1) ? requestAnimationFrame(step) : onComplete && onComplete();
  };
  durSec <= 0 ? (vec.copy(to), onUpdate?.(1), onComplete?.()) : requestAnimationFrame(step);
}

/* ===== Fonction principale ===== */
export function initPorsche3DSection() {
  const section = document.querySelector('.porsche-3d');
  if (!section) return;

  // DOM
  const viewer    = document.getElementById('viewer');
  const loadingEl = document.getElementById('loading');
  const progressEl= document.getElementById('progress');
  const statusEl  = document.getElementById('status');
  const titleEl   = document.getElementById('view-title');
  const textEl    = document.getElementById('view-text');
  const dotsEl    = document.getElementById('view-dots');
  const prevBtn   = document.getElementById('view-prev');
  const nextBtn   = document.getElementById('view-next');

  if (!viewer) return;

  /* ===== Renderer ===== */
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(viewer.clientWidth, viewer.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;
  // Laisse défiler la page verticalement sur mobile même quand on touche le canvas
  renderer.domElement.style.touchAction = 'pan-y';
  viewer.appendChild(renderer.domElement);

  /* ===== Scene + Camera ===== */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, viewer.clientWidth / viewer.clientHeight, 0.1, 5000);
  camera.position.set(2.6, 1.6, 3.2);

  /* ===== OrbitControls (rotation only, pas de zoom/pinch/pan) ===== */
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;      // molette/pinch ignorés => la page scrolle
  controls.enablePan  = false;
  controls.mouseButtons = {
    LEFT: THREE.MOUSE.ROTATE,
    MIDDLE: null,
    RIGHT: null
  };
  controls.touches = {
    ONE: THREE.TOUCH.ROTATE,
    TWO: null
  };

  /* ===== IBL via HDRI (reflets type configurateur) ===== */
  const rgbe = new RGBELoader();
  // Studio à bandes (reflets nets)
  rgbe.load('https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_08_1k.hdr', (hdr) => {
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    scene.environment = hdr;   // reflets uniquement
    scene.background = null;   // fond transparent (tu gardes ton fond de section)
  });

  /* ===== Lights (renforce les volumes) ===== */
  const ambient = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(6, 3.2, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(2048, 2048);
  keyLight.shadow.normalBias = 0.03;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0xffffff, 1.1);
  fillLight.position.set(-6, 2.4, 5);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.3);
  rimLight.position.set(0, 6.5, -6);
  scene.add(rimLight);

  /* ===== Loader ===== */
  const manager = new THREE.LoadingManager();
  manager.onProgress = (_url, loaded, total) => {
    const pct = Math.round((loaded / total) * 100);
    if (progressEl) progressEl.style.width = pct + '%';
    if (statusEl)   statusEl.textContent   = `Chargement… ${pct}%`;
  };
  manager.onLoad = () => loadingEl && loadingEl.classList.add('hidden');

  const gltfLoader = new GLTFLoader(manager);
  const draco = new DRACOLoader();
  draco.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
  gltfLoader.setDRACOLoader(draco);

  /* ===== Modèle ===== */
  const MODEL_URL = 'assets/models/porsche911-992.glb';
  let model = null;

  // cadrage/vues
  let fitLast = { camZ: 0, sizeY: 1 };
  let radiusForViews = 6;
  const TARGET_OFFSET = new THREE.Vector3(0, 0.12, 0);

  const viewLabels = [];
  const viewTexts = [
    "La face avant de la 992 affirme sa sportivité avec des lignes acérées et une signature lumineuse à LED emblématique. Le regard est intense, ancré dans l’ADN Porsche, mêlant modernité et puissance.",
    "Sous cet angle, la 992 impose sa présence. Les ailes musclées, la posture large et abaissée, ainsi que les entrées d’air sculptées, évoquent une bête prête à bondir. L'élégance n’a jamais été aussi agressive.",
    "La silhouette intemporelle de la 911 est sublimée par une ligne de toit fluide et tendue. Les courbes se prolongent harmonieusement jusqu’au spoiler arrière, offrant équilibre et mouvement, même à l’arrêt.",
    "Un angle qui met en valeur les hanches larges et la finesse du bandeau lumineux à LED. L’allure est musclée mais raffinée, fidèle à l’héritage tout en affirmant une nouvelle ère technologique.",
    "Un design large et pur, dominé par le bandeau LED et le lettrage Porsche élégant. Les doubles sorties d’échappement rappellent que sous cette carrosserie racée sommeille un moteur prêt à rugir.",
    "Cette 911 ne déroge pas à la règle par rapport à ses grandes sœurs. Elle est à la fois rétro, moderne et futuriste. Une 911, avec sa silhouette reconnaissable entre toutes, un design qui traverse le temps et une richesse technologique appartenant à ses nombreuses victoires en courses.",
    "Cette 8e génération est comme toutes ses grandes sœurs une pionnière et nous fait parcourir le temps. La 911, voiture de sport, qui à l'heure actuelle est un point de repère et fidèle à elle-même dans un monde qui est au changement.",
    "La Porsche 911 type 992 n’est pas qu’une voiture, c’est une icône en mouvement. Héritière d’une lignée légendaire, elle réussit l’exploit de conjuguer tradition et modernité, puissance et élégance, maîtrise et émotion. À chaque ligne, à chaque son, à chaque virage, elle rappelle pourquoi elle reste l’ultime référence du sport automobile… sur route, comme dans les cœurs."
  ];
  const angles = [0, Math.PI/4, Math.PI/2, 3*Math.PI/4, Math.PI, -3*Math.PI/4, -Math.PI/2, -Math.PI/4];
  let currentView = 0;

  // Chargement
  gltfLoader.load(
    MODEL_URL,
    (gltf) => {
      model = gltf.scene;

      // 1) Normalisation échelle/centre
      model.updateMatrixWorld(true);
      const box0 = new THREE.Box3().setFromObject(model);
      const size0 = new THREE.Vector3(); box0.getSize(size0);
      const targetHeight = 1.7;
      const scl = targetHeight / (size0.y || 1);
      model.scale.setScalar(scl);

      // 2) Réglages matériaux généraux
      model.traverse((o) => {
        if (!o.isMesh) return;
        o.castShadow = o.receiveShadow = true;
        const mat = o.material;
        if (mat?.isMeshStandardMaterial || mat?.isMeshPhysicalMaterial) {
          mat.envMapIntensity = 1.2;
          if (mat.map) mat.map.colorSpace = THREE.SRGBColorSpace;
        }
      });

      // 3) Centrage + cadrage
      const fit = centerAndFrame(model, { camera, controls });
      fitLast = { camZ: fit.camZ, sizeY: fit.sizeY };
      scene.add(model);

      /* === Car paint control ===== */
      const paintMeshes = [];
      model.traverse((o) => {
        if (!o.isMesh) return;
        const n = (o.name + ' ' + (o.material?.name || '')).toLowerCase();
        const looksLikeBody = /body|carpaint|paint|shell|carros|karos|carrosserie/.test(n);
        if (!looksLikeBody) return;

        const oldMat = o.material;

        const phys = new THREE.MeshPhysicalMaterial({
          map: null,
          normalMap: oldMat.normalMap || null,
          roughnessMap: oldMat.roughnessMap || null,
          metalnessMap: oldMat.metalnessMap || null,
          color: new THREE.Color('#D21F1B'),
          metalness: 0.10,
          roughness: 0.32,
          clearcoat: 1.0,
          clearcoatRoughness: 0.04,
          envMapIntensity: 1.45,
          ior: 1.5,
          specularIntensity: 0.55,
          specularColor: new THREE.Color('#ffffff'),
          iridescence: 0.03,
          iridescenceIOR: 1.3,
          iridescenceThicknessRange: [50, 120]
        });

        o.material = phys;
        paintMeshes.push(o);
      });

      function setPaint(hex) {
        paintMeshes.forEach((m) => {
          m.material.color.set(hex);
          m.material.needsUpdate = true;
        });
      }
      window.setPaint = setPaint;

      // Cadrage frontal “catalogue”
      const framing = {
        fov: 42,
        targetY: fit.sizeY * 0.30,
        camElev: 0.02,
        radius: fit.camZ * 1.07
      };
      camera.fov = framing.fov;
      camera.updateProjectionMatrix();
      radiusForViews = framing.radius;

      buildDots();
      goToView(0, true, framing);
    },
    undefined,
    (err) => {
      if (statusEl) statusEl.textContent = 'Échec du chargement du modèle.';
      console.error(err);
    }
  );

  /* ===== UI ===== */
  function buildDots() {
    if (!dotsEl) return;
    dotsEl.innerHTML = '';
    for (let i = 0; i < 8; i++) {
      const b = document.createElement('button');
      if (i === currentView) b.classList.add('active');
      b.addEventListener('click', () => goToView(i));
      dotsEl.appendChild(b);
    }
  }
  prevBtn && prevBtn.addEventListener('click', () => goToView((currentView + 7) % 8));
  nextBtn && nextBtn.addEventListener('click', () => goToView((currentView + 1) % 8));

  /* ===== Changement de vue ===== */
  function goToView(index, instant = false, framingOverride = null) {
    if (!model) return;
    currentView = index;

    const F = framingOverride || {
      targetY: fitLast.sizeY * 0.36,
      camElev: 0.06,
      radius:  radiusForViews
    };

    const ang = angles[index];
    const r   = F.radius;
    const elev= F.camElev;

    const toTarget = new THREE.Vector3(0, F.targetY + 0.12, 0);
    const toCam = toTarget.clone().add(new THREE.Vector3(
      Math.sin(ang) * r,
      r * elev,
      Math.cos(ang) * r
    ));

    const d = instant ? 0 : 1.0;
    tweenVector3(camera.position, toCam, d, () => controls.update());
    tweenVector3(controls.target,  toTarget, d, () => controls.update());

    if (titleEl) titleEl.textContent = viewLabels[index] || '';
    if (textEl)  textEl.textContent  = viewTexts[index] || '';
    if (dotsEl) [...dotsEl.children].forEach((el, i) => el.classList.toggle('active', i === index));
  }

  /* ===== Resize ===== */
  const ro = new ResizeObserver(() => {
    const w = viewer.clientWidth || 800;
    const h = viewer.clientHeight || 450;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });
  ro.observe(viewer);

  /* ===== Render loop ===== */
  (function render() {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(render);
  })();

  /* ===== Centrage ===== */
  function centerAndFrame(root, { camera, controls }) {
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    box.getSize(size);
    box.getCenter(center);
    root.position.sub(center);

    const newBox = new THREE.Box3().setFromObject(root);
    const newSize = new THREE.Vector3();
    newBox.getSize(newSize);

    const maxDim = Math.max(newSize.x, newSize.y, newSize.z);
    const fov = camera.fov * (Math.PI / 180);
    const camZ = Math.abs(maxDim / (2 * Math.tan(fov / 2))) * 1.05;

    camera.position.set(camZ, camZ * 0.35, camZ);
    controls.target.set(0, newSize.y * 0.5 * 0.6, 0);
    controls.update();

    return { extent: maxDim, camZ, sizeY: newSize.y };
  }
}

function initComparison() {
  const root = document.querySelector(".comparo");
  if (!root) return;

  const modelData = {
    "911 Classic": { name: "911 Classic", year: "1964–1989", power: "130–231 ch", engine: "Flat-6, refroidissement air", image: "assets/images/901-original-compa.png" },
    "911 G Series": { name: "911 G Series", year: "1973–1989", power: "150–231 ch", engine: "Flat-6, refroidissement air", image: "assets/images/g-serie-compa.png" },
    "911 964":     { name: "911 (964)", year: "1989–1994", power: "250–360 ch", engine: "Flat-6, refroidissement air", image: "assets/images/964-compa.png" },
    "911 993":     { name: "911 (993)", year: "1995–1998", power: "272–450 ch", engine: "Flat-6, refroidissement air", image: "assets/images/993-compa.png" },
    "911 996":     { name: "911 (996)", year: "1998–2005", power: "300–483 ch", engine: "Flat-6, refroidissement eau", image: "assets/images/996-compa.png" },
    "911 997":     { name: "911 (997)", year: "2005–2012", power: "325–620 ch", engine: "Flat-6, refroidissement eau", image: "assets/images/997-compa.png" },
    "911 992":     { name: "911 (992)", year: "2019–Aujourd'hui", power: "385–650 ch", engine: "Flat-6 Biturbo", image: "assets/images/porsche-3.png" }
  };

  // Références
  const listEl   = root.querySelector("#comparoModelList");
  const slots    = [root.querySelector("#comparoSlot1"), root.querySelector("#comparoSlot2")];
  const infos    = [root.querySelector("#comparoInfo1"), root.querySelector("#comparoInfo2")];
  const viewport = root.querySelector(".comparo-viewport");
  const prevBtn  = root.querySelector(".comparo-prev");
  const nextBtn  = root.querySelector(".comparo-next");
  if (!listEl || !viewport || !slots[0] || !slots[1] || !infos[0] || !infos[1]) return;

  // 🔒 Désactiver tout drag natif HTML5 sur la liste et ses items
  listEl.querySelectorAll("[draggable]").forEach(el => el.setAttribute("draggable", "false"));
  listEl.addEventListener("dragstart", e => e.preventDefault()); // sécurité

  // Construire les cartes
  listEl.querySelectorAll("li").forEach(li => {
    const key   = (li.dataset.model || "").trim();
    const data  = modelData[key] || {};
    const img   = data.image || "https://via.placeholder.com/600x220?text=911";
    const title = data.name  || key || li.textContent.trim();

    li.setAttribute("role", "option");
    li.setAttribute("aria-selected", "false");
    li.innerHTML = `
      <span class="badge">${data.year || ""}</span>
      <span class="check">✓</span>
      <img class="thumb" src="${img}" alt="${title}">
      <div class="title">${title}</div>
    `;
  });

  const items = Array.from(listEl.querySelectorAll("li"));

  // État sélection
  const selected = { 0: null, 1: null };

  function setActiveState() {
    items.forEach(item => {
      const isActive = Object.values(selected).includes(item.dataset.model);
      item.classList.toggle("active-model", isActive);
      item.setAttribute("aria-selected", isActive ? "true" : "false");
    });
  }

  // ===== CLIC (prioritaire) =====
  items.forEach(item => {
    item.addEventListener("click", () => {
      const model = (item.dataset.model || "").trim();
      if (!modelData[model]) return;
      if (Object.values(selected).includes(model)) return;

      const freeIndex = ["0", "1"].find(k => !selected[k]);
      if (freeIndex !== undefined) {
        selected[freeIndex] = model;
        updateUI();
      }
    });
  });

  // ===== DRAG & DROP custom vers les cases =====
  const THRESHOLD = 8; // px avant de démarrer un drag
  let downItem = null, startX = 0, startY = 0, dragging = null, moved = false;

  items.forEach(item => {
    item.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return; // bouton principal uniquement
      downItem = item;
      startX = e.clientX;
      startY = e.clientY;
      moved = false;
      item.setPointerCapture?.(e.pointerId);

      const onMove = (ev) => {
        if (!downItem) return;
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        if (!moved && (Math.abs(dx) > THRESHOLD || Math.abs(dy) > THRESHOLD)) {
          moved = true;
          startCustomDrag(downItem, ev);
        }
        if (dragging) {
          positionGhost(ev.clientX, ev.clientY);
          highlightDrop(ev.clientX, ev.clientY);
        }
      };

      const onUp = (ev) => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp, true);

        if (dragging) {
          finishDrop(ev.clientX, ev.clientY);
          ev.preventDefault(); // évite le "clic fantôme" après drag
        }

        clearHighlights();
        removeGhost();
        downItem = null;
        dragging = null;

        try { item.releasePointerCapture?.(e.pointerId); } catch {}
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp, true);
    }, { passive: true });
  });

  function startCustomDrag(item, ev) {
    const key = (item.dataset.model || "").trim();
    if (!modelData[key]) return;

    const g = document.createElement("div");
    g.className = "comparo-ghost";
    g.innerHTML = `
      <img src="${modelData[key].image}" alt="${modelData[key].name}">
      <div class="title">${modelData[key].name}</div>
    `;
    // S'assure que le ghost est bien hors flow et ne pousse pas la page
    g.style.position = 'fixed';
    g.style.transform = "translate(0,0)";
    document.body.appendChild(g);

    dragging = { model: key, ghostEl: g };
    positionGhost(ev.clientX, ev.clientY);
  }

  function positionGhost(clientX, clientY) {
    if (!dragging?.ghostEl) return;
    const off = 14;
    dragging.ghostEl.style.left = clientX + off + "px";
    dragging.ghostEl.style.top  = clientY + off + "px";
  }

  function highlightDrop(clientX, clientY) {
    clearHighlights();
    const el = document.elementFromPoint(clientX, clientY);
    const slot = el && el.closest?.(".comparo-slot");
    if (slot) slot.classList.add("comparo-drop-target");
  }

  function clearHighlights() {
    root.querySelectorAll(".comparo-drop-target").forEach(s => s.classList.remove("comparo-drop-target"));
  }

  function removeGhost() {
    if (dragging?.ghostEl && dragging.ghostEl.parentNode) {
      dragging.ghostEl.parentNode.removeChild(dragging.ghostEl);
    }
  }

  function finishDrop(clientX, clientY) {
    const el = document.elementFromPoint(clientX, clientY);
    const slot = el && el.closest?.(".comparo-slot");
    if (!slot) return;

    const idx = slots.indexOf(slot);
    if (idx === -1) return;

    const model = dragging.model;
    if (!modelData[model]) return;
    if (Object.values(selected).includes(model)) return;

    selected[idx] = model;
    updateUI();
  }

  // ===== Reset =====
  root.querySelectorAll(".comparo-reset-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const index = parseInt(btn.dataset.reset, 10) - 1;
      selected[index] = null;
      updateUI();
    }, { passive: true });
  });

  const resetAllBtn = root.querySelector("#comparoResetAll");
  if (resetAllBtn) {
    resetAllBtn.addEventListener("click", () => {
      selected[0] = null;
      selected[1] = null;
      updateUI();
    }, { passive: true });
  }

  // ===== Slider (flèches + molette) — pas de drag-to-scroll, pas clavier =====
  function getStep(){
    const card = listEl.querySelector("li");
    if(!card) return 220;
    const rect = card.getBoundingClientRect();
    const gap  = parseFloat(getComputedStyle(listEl).gap || 12);
    const factor = window.innerWidth >= 1024 ? 2 : 1;
    return (rect.width + gap) * factor;
  }
  function scrollByStep(dir){ viewport.scrollBy({ left: dir * getStep(), behavior: "smooth" }); }
  function updateArrows(){
    const max = listEl.scrollWidth - viewport.clientWidth - 1;
    const x   = viewport.scrollLeft;
    if (prevBtn) prevBtn.disabled = x <= 0;
    if (nextBtn) nextBtn.disabled = x >= max;
  }
  if (prevBtn) prevBtn.addEventListener("click", () => scrollByStep(-1), { passive: true });
  if (nextBtn) nextBtn.addEventListener("click", () => scrollByStep(1),  { passive: true });
  viewport.addEventListener("wheel", e => {
    if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    viewport.scrollBy({ left: e.deltaY, behavior: "auto" });
    e.preventDefault();
  }, { passive:false });
  viewport.addEventListener("scroll", updateArrows, { passive: true });
  window.addEventListener("resize", updateArrows, { passive: true });
  updateArrows();

  // ===== Rendu =====
  function updateUI() {
    [0, 1].forEach(index => {
      const slotInfo = infos[index];
      const key = (selected[index] || "").trim();

      if (!key || !modelData[key]) {
        slotInfo.textContent = "Sélectionner un modèle";
        return;
      }

      const data = modelData[key];
      const powerValue = getPowerValue(data.power);

      let comparisonText = "";
      if (selected[0] && selected[1]) {
        const otherIndex = index === 0 ? 1 : 0;
        const otherPower = getPowerValue(modelData[selected[otherIndex]]?.power);
        const compareClass =
          powerValue > otherPower ? "better" :
          powerValue < otherPower ? "worse" : "";
        comparisonText = `<span class="${compareClass}">${
          compareClass === "better" ? "✅" : compareClass === "worse" ? "❌" : ""
        }</span>`;
      }

      slotInfo.innerHTML = `
        <img src="${data.image}" alt="${data.name}" />
        <h3>${data.name}</h3>
        <p><strong>Années :</strong> ${data.year}</p>
        <p><strong>Puissance :</strong> ${data.power} ${comparisonText}</p>
        <p><strong>Moteur :</strong> ${data.engine}</p>
      `;
    });

    setActiveState();
  }

  function getPowerValue(powerText) {
    if (!powerText) return 0;
    const matches = powerText.match(/(\d+)(?= ch)/g);
    return matches ? Math.max(...matches.map(Number)) : 0;
  }

  updateUI();
}


/* ===========================
   NAV LATERALE HISTOIRE — JS complet
   (compatible GSAP/ScrollTrigger, sans gouttière globale)
   =========================== */
function initHistorySideNav() {
  const sidenav  = document.querySelector('.hist-sidenav');
  if (!sidenav) return;

  const links    = Array.from(sidenav.querySelectorAll('.hist-sidenav__link'));
  const progress = sidenav.querySelector('.hist-sidenav__progress');
  const header   = document.querySelector('.navbar');
  const getOffset = () => (header ? header.offsetHeight + 12 : 80);

  const items = links.map((link) => {
    const sel = link.getAttribute('data-target') || link.getAttribute('href');
    if (!sel) return null;
    let section = null;
    try { section = document.querySelector(sel); } catch { section = null; }
    return section ? { link, section } : null;
  }).filter(Boolean);

  if (!items.length) return;

  links.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const targetSel = link.getAttribute('data-target') || link.getAttribute('href');
      let target = null;
      try { target = document.querySelector(targetSel); } catch { target = null; }
      if (!target) return;

      const top = target.getBoundingClientRect().top + window.scrollY - getOffset();
      window.scrollTo({ top, behavior: 'smooth' });

      try { history.pushState(null, '', targetSel); } catch {}
    }, { passive: false });
  });

  items.forEach(({ link, section }) => {
    ScrollTrigger.create({
      trigger: section,
      start: () => `top+=${-getOffset()} center`,
      end: () => `bottom center`,
      onEnter: () => setActive(link),
      onEnterBack: () => setActive(link),
    });
  });

  function setActive(activeLink) {
    links.forEach(l => l.classList.toggle('is-active', l === activeLink));
    updateProgress();
  }

  function updateProgress() {
    if (!progress) return;
    const list = sidenav.querySelector('.hist-sidenav__list');
    const itemsEls = Array.from(sidenav.querySelectorAll('.hist-sidenav__item'));
    if (!list || !itemsEls.length) return;

    const activeIndex = links.findIndex(l => l.classList.contains('is-active'));
    const index = activeIndex >= 0 ? activeIndex : 0;

    const railTop = list.getBoundingClientRect().top + window.scrollY;
    const lastDotEl = itemsEls[index].querySelector('.hist-sidenav__dot');
    if (!lastDotEl) return;

    const lastDotY = lastDotEl.getBoundingClientRect().top + window.scrollY + (lastDotEl.offsetHeight / 2);
    const height = Math.max(0, lastDotY - railTop);
    progress.style.height = `${height}px`;
  }

  (function setInitialActive() {
    const mid = window.scrollY + window.innerHeight / 2;
    let bestI = 0, bestD = Infinity;
    items.forEach(({ section }, i) => {
      const r = section.getBoundingClientRect();
      const midSec = r.top + window.scrollY + r.height / 2;
      const d = Math.abs(midSec - mid);
      if (d < bestD) { bestD = d; bestI = i; }
    });
    setActive(items[bestI].link);
  })();

  updateProgress();

  window.addEventListener('resize', () => {
    clearTimeout(initHistorySideNav._rz);
    initHistorySideNav._rz = setTimeout(() => {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
      updateProgress();
    }, 120);
  }, { passive: true });

  window.addEventListener('scroll', () => {
    requestAnimationFrame(updateProgress);
  }, { passive: true });
}

// launch control
function initLaunchControl() {
  const root = document.getElementById('launchControl');
  if (!root) return;

  const statusEl = document.getElementById('lc-status');
  const armBtn   = document.getElementById('lc-arm');
  const retryBtn = document.getElementById('lc-retry');

  const red   = root.querySelector('.lc-red');
  const amber = root.querySelector('.lc-amber');
  const green = root.querySelector('.lc-green');

  const tryEl    = document.getElementById('lc-try');
  const lastEl   = document.getElementById('lc-last');
  const avgEl    = document.getElementById('lc-avg');
  const bestEl   = document.getElementById('lc-best');
  const recordEl = document.getElementById('lc-record');
  const resEl    = document.getElementById('lc-result');

  const maxTries = 5;
  let tries = 0;
  let times = [];
  let armed = false;
  let go = false;
  let startTS = 0;
  let timers = [];

  const LS_KEY_BEST_SINGLE  = 'lc_best_single_ms';
  const LS_KEY_BEST_AVERAGE = 'lc_best_average_ms';
  let bestSingle  = Number(localStorage.getItem(LS_KEY_BEST_SINGLE)) || 0;
  let bestAverage = Number(localStorage.getItem(LS_KEY_BEST_AVERAGE)) || 0;

  const avg = arr => arr.length ? Math.round(arr.reduce((a,b)=>a+b,0)/arr.length) : 0;
  const best = arr => arr.length ? Math.min(...arr) : 0;
  const clearTimers = () => { timers.forEach(t => clearTimeout(t)); timers = []; };
  const resetLights = () => { red.classList.remove('on'); amber.classList.remove('on'); green.classList.remove('on'); };

  function setStatus(txt) { statusEl.textContent = txt; }
  function updateReadout() {
    tryEl.textContent    = String(tries);
    lastEl.textContent   = times.length ? `${times[times.length-1]}` : '–';
    avgEl.textContent    = times.length ? `${avg(times)}` : '–';
    bestEl.textContent   = times.length ? `${best(times)}` : '–';
    recordEl.textContent = bestSingle ? `${bestSingle}` : '–';
  }

  function saveRecordsIfBetter(finalAvg, finalBest) {
    if (!bestSingle || finalBest < bestSingle) {
      bestSingle = finalBest;
      localStorage.setItem(LS_KEY_BEST_SINGLE, String(bestSingle));
    }
    if (!bestAverage || finalAvg < bestAverage) {
      bestAverage = finalAvg;
      localStorage.setItem(LS_KEY_BEST_AVERAGE, String(bestAverage));
    }
  }

  function runSequence() {
    armed = true; go = false; setStatus('Ready…');
    armBtn.disabled = true; retryBtn.disabled = true;
    resetLights();

    const preDelay = 400 + Math.random() * 500;

    timers.push(setTimeout(() => {
      red.classList.add('on');
      setStatus('Ready…');

      timers.push(setTimeout(() => {
        red.classList.remove('on');
        amber.classList.add('on');
        setStatus('Set…');

        timers.push(setTimeout(() => {
          amber.classList.remove('on');
          amber.classList.add('on');

          timers.push(setTimeout(() => {
            amber.classList.remove('on');
            green.classList.add('on');
            go = true; armed = false;
            startTS = performance.now();
            setStatus('GO !');
          }, 400));

        }, 400));

      }, 500));
    }, preDelay));
  }

  function arm() {
    if (armed || go || tries >= maxTries) return;
    runSequence();
  }

  function handleReaction() {
    if (armed && !go) {
      clearTimers(); armed = false;
      setStatus('Faux départ !'); resetLights();
      armBtn.disabled = tries >= maxTries; retryBtn.disabled = tries >= maxTries;
      return;
    }

    if (go) {
      const t = Math.round(performance.now() - startTS);
      times.push(t); tries++;
      setStatus(`Réaction : ${t} ms`);
      resetLights(); go = false; armed = false;
      updateReadout();

      armBtn.disabled = tries >= maxTries;

      if (tries >= maxTries) {
        const a = avg(times);
        const b = best(times);
        saveRecordsIfBetter(a, b);
        updateReadout();

        let verdict = 'À polir ✨';
        if (a <= 260) verdict = 'Réflexes de pilote ! 🏁';
        else if (a <= 320) verdict = 'Très solide 🔥';
        else if (a <= 380) verdict = 'Correct 👌';

        const recAvgTxt  = bestAverage ? ` • Record moy.: ${bestAverage} ms` : '';
        const recBestTxt = bestSingle ? ` • Record single: ${bestSingle} ms` : '';
        resEl.textContent = `Moyenne: ${a} ms • Meilleur: ${b} ms${recAvgTxt}${recBestTxt} — ${verdict}`;

        retryBtn.disabled = false;
      } else {
        resEl.textContent = 'Appuie sur “Armer” pour l’essai suivant.';
      }
    }
  }

  function resetAll() {
    clearTimers();
    tries = 0; times = []; armed = false; go = false;
    resetLights();
    setStatus('Prêt ?'); resEl.textContent = '';
    updateReadout();
    armBtn.disabled = false; retryBtn.disabled = true;
  }

  armBtn.addEventListener('click', arm, { passive: true });
  retryBtn.addEventListener('click', resetAll, { passive: true });

  root.addEventListener('click', (e) => {
    if (e.target === armBtn || e.target === retryBtn) return;
    handleReaction();
  });
  window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') { e.preventDefault(); handleReaction(); }
  });

  updateReadout();
  setStatus('Prêt ?');
}


function initMiniGames() {
  const cards = document.querySelectorAll('.game-card');
  const overlays = document.querySelectorAll('.game-overlay');

  cards.forEach(card => {
    card.addEventListener('click', () => {
      const game = card.dataset.game;
      const overlay = document.getElementById(`overlay-${game}`);
      if (overlay) overlay.classList.add('active');
    }, { passive: true });
  });

  overlays.forEach(overlay => {
    const closeBtn = overlay.querySelector('.close-btn');
    closeBtn.addEventListener('click', () => {
      overlay.classList.remove('active');
    }, { passive: true });
  });

  // Initialise les deux jeux quand la page charge
  initLaunchControl();
  initMemoryStandalone();
}


// =========================
// MEMORY — FLIP 3D (standalone)
// =========================
function initMemoryStandalone() {
  const root = document.getElementById('memoryStandalone');
  if (!root) return;

  const grid       = root.querySelector('#mem-stand-grid');
  const movesEl    = root.querySelector('#mem-stand-moves');
  const timeEl     = root.querySelector('#mem-stand-time');
  const restartBt  = root.querySelector('#mem-stand-restart');

  const resultBox  = root.querySelector('#mem-stand-result');
  const resultText = resultBox.querySelector('.result-text');
  const playAgain  = root.querySelector('#mem-stand-play-again');

  const IMAGES = [
    'assets/images/memory/P-card-original.jpg',
    'assets/images/memory/P-card-g-serie.jpg',
    'assets/images/memory/P-card-964.jpg',
    'assets/images/memory/P-card-993.jpg',
    'assets/images/memory/P-card-996.jpg',
    'assets/images/memory/P-card-997.jpg',
    'assets/images/memory/P-card-991.jpg',
    'assets/images/memory/porsche-3.png'
  ];

  let deck = [];
  let first = null, second = null;
  let lock = false;
  let moves = 0, time = 0, timer = null, matchedPairs = 0;

  const shuffle = (a) => { for (let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]] } return a; };

  function buildDeck() {
    const items = IMAGES.map((src, i) => ({ key: `k${i}`, src, matched:false }));
    deck = shuffle([...items, ...items]);
  }

  function cardTemplate(card) {
    const wrap   = document.createElement('div');
    wrap.className = 'mem-card';
    wrap.dataset.key = card.key;

    const inner  = document.createElement('div');
    inner.className = 'mem-inner';

    const front  = document.createElement('div');
    front.className = 'mem-face mem-front';
    front.style.backgroundImage = `url("${card.src}")`;

    const back   = document.createElement('div');
    back.className = 'mem-face mem-back';

    inner.appendChild(front);
    inner.appendChild(back);
    wrap.appendChild(inner);

    wrap.addEventListener('click', () => onFlip(wrap, card, inner), { passive: true });
    return wrap;
  }

  function render() {
    grid.innerHTML = '';
    deck.forEach(c => grid.appendChild(cardTemplate(c)));
  }

  function startTimer() {
    clearInterval(timer);
    time = 0; timeEl.textContent = '0';
    timer = setInterval(() => { time++; timeEl.textContent = String(time); }, 1000);
  }

  function hideResult() {
    resultBox.style.display = 'none';
  }

  function reset() {
    first = second = null;
    lock = false;
    matchedPairs = 0;
    moves = 0;
    movesEl.textContent = '0';
    hideResult();
    buildDeck();
    render();
    startTimer();
  }

  function onFlip(wrap, card, inner) {
    if (lock || card.matched || inner.classList.contains('is-flipped')) return;

    inner.classList.add('is-flipped');

    if (!first) { first = { wrap, card, inner }; return; }

    second = { wrap, card, inner };
    moves++; movesEl.textContent = String(moves);
    lock = true;

    if (first.card.key === second.card.key) {
      first.card.matched = second.card.matched = true;
      first.wrap.classList.add('matched');
      second.wrap.classList.add('matched');
      matchedPairs++;
      lock = false;
      first = second = null;

      if (matchedPairs === IMAGES.length) {
        clearInterval(timer);
        setTimeout(() => {
          resultText.textContent = `🏁 Terminé ! ${moves} coups • ${time}s`;
          resultBox.style.display = 'flex';
        }, 120);
      }
    } else {
      setTimeout(() => {
        first.inner.classList.remove('is-flipped');
        second.inner.classList.remove('is-flipped');
        lock = false;
        first = second = null;
      }, 650);
    }
  }

  restartBt.addEventListener('click', reset, { passive: true });
  playAgain.addEventListener('click', reset, { passive: true });

  reset();
}
