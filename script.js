const menuIcon = document.querySelector("#menu-icon");
const navbar = document.querySelector(".navbar");
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("header nav a");

/* TOGGLE MENU */
if (menuIcon) {
  menuIcon.addEventListener("click", () => {
    navbar.classList.toggle("active");
  });
}

/* CLOSE MENU ON LINK CLICK */
navLinks.forEach((link) => {
  link.addEventListener("click", function () {
    navbar.classList.remove("active");

    navLinks.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  });
});

/* ACTIVE NAV LINK ON SCROLL */
const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach((link) => {
          const href = link.getAttribute("href");

          if (href === `#${id}`) {
            link.classList.add("active");
          } else {
            link.classList.remove("active");
          }
        });

        if (window.innerWidth <= 768) {
          navbar.classList.remove("active");
        }
      }
    });
  },
  { rootMargin: "-30% 0px -50% 0px" }
);

sections.forEach((section) => navObserver.observe(section));