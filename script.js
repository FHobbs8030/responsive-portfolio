/* =========================
   THEME ENGINE
========================= */
const THEME_STORAGE_KEY = "portfolio-theme";
const THEME_PREFERENCES = ["night", "auto", "day"];

const rootElement = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");

const systemThemeQuery =
  typeof window.matchMedia === "function"
    ? window.matchMedia("(prefers-color-scheme: dark)")
    : null;

const isSupportedThemePreference = (preference) => {
  return THEME_PREFERENCES.includes(preference);
};

const getSavedThemePreference = () => {
  try {
    const savedPreference = localStorage.getItem(THEME_STORAGE_KEY);

    return isSupportedThemePreference(savedPreference)
      ? savedPreference
      : null;
  } catch {
    return null;
  }
};

const saveThemePreference = (preference) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Theme switching still works when storage is unavailable.
  }
};

const getSystemTheme = () => {
  if (!systemThemeQuery) return "night";

  return systemThemeQuery.matches ? "night" : "day";
};

const resolveTheme = (preference) => {
  return preference === "auto" ? getSystemTheme() : preference;
};

const getNextThemePreference = (preference) => {
  const currentIndex = THEME_PREFERENCES.indexOf(preference);
  const nextIndex = (currentIndex + 1) % THEME_PREFERENCES.length;

  return THEME_PREFERENCES[nextIndex];
};

const updateThemeToggle = (preference, resolvedTheme) => {
  if (!themeToggle) return;

  const nextPreference = getNextThemePreference(preference);

  themeToggle.setAttribute(
    "aria-label",
    `Theme preference: ${preference}. Current theme: ${resolvedTheme}. Switch to ${nextPreference} mode`,
  );

  themeToggle.setAttribute(
    "title",
    `Switch to ${nextPreference} mode`,
  );
};

const applyThemePreference = (preference) => {
  const resolvedPreference = isSupportedThemePreference(preference)
    ? preference
    : "night";

  const resolvedTheme = resolveTheme(resolvedPreference);

  rootElement.dataset.themePreference = resolvedPreference;
  rootElement.dataset.theme = resolvedTheme;

  updateThemeToggle(resolvedPreference, resolvedTheme);
};

const initialThemePreference =
  getSavedThemePreference() ??
  (isSupportedThemePreference(rootElement.dataset.themePreference)
    ? rootElement.dataset.themePreference
    : "night");

applyThemePreference(initialThemePreference);

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentPreference =
      rootElement.dataset.themePreference;

    const nextPreference =
      getNextThemePreference(currentPreference);

    applyThemePreference(nextPreference);
    saveThemePreference(nextPreference);
  });
}

const handleSystemThemeChange = () => {
  if (rootElement.dataset.themePreference === "auto") {
    applyThemePreference("auto");
  }
};

if (systemThemeQuery) {
  if (typeof systemThemeQuery.addEventListener === "function") {
    systemThemeQuery.addEventListener("change", handleSystemThemeChange);
  } else if (typeof systemThemeQuery.addListener === "function") {
    systemThemeQuery.addListener(handleSystemThemeChange);
  }
}

const menuIcon = document.querySelector("#menu-icon");
const logo = document.querySelector(".logo");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section");

if (menuIcon && navbar) {
  menuIcon.addEventListener("click", (e) => {
    e.stopPropagation();

    navbar.classList.toggle("active");
    menuIcon.classList.toggle("active");

    document.body.style.overflow = navbar.classList.contains("active")
      ? "hidden"
      : "";
  });
}

const closeMenu = () => {
  if (!navbar || !menuIcon) return;
  navbar.classList.remove("active");
  menuIcon.classList.remove("active");
  document.body.style.overflow = "";
};

if (logo) {
  logo.addEventListener("click", () => {
    closeMenu();

    navLinks.forEach((l) => l.classList.remove("active"));

    const homeLink = document.querySelector('header nav a[href="#home"]');
    if (homeLink) homeLink.classList.add("active");
  });
}

navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    closeMenu();

    navLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

document.addEventListener("click", (e) => {
  if (
    navbar &&
    menuIcon &&
    navbar.classList.contains("active") &&
    !navbar.contains(e.target) &&
    !menuIcon.contains(e.target)
  ) {
    closeMenu();
  }
});

window.addEventListener("scroll", () => {
  if (navbar && navbar.classList.contains("active")) {
    closeMenu();
  }
});

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  { threshold: 0.6 },
);

sections.forEach((section) => {
  navObserver.observe(section);
});

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (!form || !status) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 🔥 Set reply-to email BEFORE sending
    const emailInput = document.getElementById("email");
    const replyTo = document.getElementById("replyto");
    if (emailInput && replyTo) {
      replyTo.value = emailInput.value;
    }

    // 🔥 Set timestamp BEFORE sending
    const ts = document.getElementById("submittedAt");
    if (ts) {
      ts.value = new Date().toLocaleString();
    }

    const data = new FormData(form);
    const submitBtn = form.querySelector("button");

    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";
    submitBtn.classList.add("loading");

    try {
      const response = await fetch(form.action, {
        method: "POST",
        body: data,
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        status.textContent = "Message sent successfully!";
        status.className = "form-status success";
        form.reset();

        setTimeout(() => {
          status.textContent = "";
          status.className = "form-status";
        }, 4000);
      } else {
        status.textContent = "Oops! Something went wrong.";
        status.className = "form-status error";
      }
    } catch (error) {
      status.textContent = "Network error. Please try again.";
      status.className = "form-status error";
    }

    submitBtn.disabled = false;
    submitBtn.textContent = "Send Message";
    submitBtn.classList.remove("loading");
  });
});

const heroImage = document.querySelector(".home-image .image-wrapper");

function addTapEffect(element) {
  if (!element) return;

  element.addEventListener("touchstart", () => {
    element.classList.add("tap-active");

    setTimeout(() => {
      element.classList.remove("tap-active");
    }, 180);
  });
}

addTapEffect(logo);
addTapEffect(heroImage);
