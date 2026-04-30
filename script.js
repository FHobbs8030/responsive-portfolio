const menuIcon = document.querySelector("#menu-icon");
const logo = document.querySelector(".logo");
const navbar = document.querySelector(".navbar");
const navLinks = document.querySelectorAll("header nav a");
const sections = document.querySelectorAll("section");

/* TOGGLE MENU */
menuIcon.addEventListener("click", (e) => {
  e.stopPropagation();

  navbar.classList.toggle("active");
  menuIcon.classList.toggle("active");

  document.body.style.overflow = navbar.classList.contains("active")
    ? "hidden"
    : "";
});

logo.addEventListener("click", () => {
  closeMenu();

  navLinks.forEach((l) => l.classList.remove("active"));

  const homeLink = document.querySelector('header nav a[href="#home"]');
  if (homeLink) {
    homeLink.classList.add("active");
  }
});

/* CLOSE MENU FUNCTION */
const closeMenu = () => {
  navbar.classList.remove("active");
  menuIcon.classList.remove("active");
  document.body.style.overflow = "";
};

/* CLOSE MENU ON LINK CLICK */
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    closeMenu();

    navLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

/* CLOSE MENU ON CLICK OUTSIDE */
document.addEventListener("click", (e) => {
  if (
    navbar.classList.contains("active") &&
    !navbar.contains(e.target) &&
    !menuIcon.contains(e.target)
  ) {
    closeMenu();
  }
});

/* CLOSE MENU ON SCROLL */
window.addEventListener("scroll", () => {
  if (navbar.classList.contains("active")) {
    closeMenu();
  }
});

/* ACTIVE NAV LINK ON SCROLL */
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

const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = new FormData(form);
  const submitBtn = form.querySelector("button");

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";

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
});