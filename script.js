   /* ── DYNAMIC ISLAND: shrink on scroll ── */
      const nav = document.getElementById("main-nav");
      window.addEventListener("scroll", () => {
        if (window.scrollY > 60) {
          nav.style.padding = "6px 8px";
        } else {
          nav.style.padding = "8px 10px";
        }
      });

      /* ── NAV ACTIVE LINK on scroll ── */
      const sections = document.querySelectorAll("section[id]");
      const navLinks = document.querySelectorAll(".nav-links a");
      const observer2 = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              navLinks.forEach((a) => a.classList.remove("active"));
              const active = document.querySelector(
                `.nav-links a[href="#${e.target.id}"]`,
              );
              if (active) active.classList.add("active");
            }
          });
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      sections.forEach((s) => observer2.observe(s));

      /* ── SCROLL REVEAL ── */
      const revealObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("visible");
              revealObs.unobserve(e.target);
            }
          });
        },
        { threshold: 0.07 },
      );
      document
        .querySelectorAll(".reveal")
        .forEach((el) => revealObs.observe(el));

      /* ── COUNTER ANIMATION ── */
      function animateCount(el) {
        const target = parseInt(el.dataset.target);
        // Already animated guard
        if (el.dataset.animated) return;
        el.dataset.animated = "1";
        const duration = 1400;
        const startTime = performance.now();
        // ease-out cubic
        function easeOut(t) {
          return 1 - Math.pow(1 - t, 3);
        }
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const value = Math.floor(easeOut(progress) * target);
          el.textContent = value.toLocaleString();
          if (progress < 1) requestAnimationFrame(tick);
          else el.textContent = target.toLocaleString();
        }
        requestAnimationFrame(tick);
      }

      // Fire counters only after the stats row has fully faded in
      // Stats animation: delay 1.15s + duration 0.5s = 1.65s — add buffer
      const COUNTER_DELAY = 1900;
      let countersFired = false;

      function fireCounters() {
        if (countersFired) return;
        countersFired = true;
        document.querySelectorAll(".hero-stats .count").forEach(animateCount);
      }

      // Primary: timer-based so counters start exactly when stats are visible
      setTimeout(fireCounters, COUNTER_DELAY);

      // Fallback: also fire on scroll-into-view for repeat visits / cached loads
      const countObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) fireCounters();
          });
        },
        { threshold: 0.5 },
      );
      document
        .querySelectorAll(".hero-stats")
        .forEach((el) => countObs.observe(el));

      /* ── THEME TOGGLE ── */
      const toggleBtn = document.getElementById("theme-toggle");
      const html = document.documentElement;
      // Load saved preference
      if (localStorage.getItem("theme") === "light")
        html.classList.add("light");
      toggleBtn.addEventListener("click", () => {
        html.classList.toggle("light");
        localStorage.setItem(
          "theme",
          html.classList.contains("light") ? "light" : "dark",
        );
      });