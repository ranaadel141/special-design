const App = {
  query: (selector) => document.querySelector(selector),
  queryAll: (selector) => document.querySelectorAll(selector),

  storage: {
    get: (key, defaultValue = null) => localStorage.getItem(key) ?? defaultValue,
    set: (key, value) => localStorage.setItem(key, value),
    remove: (key) => localStorage.removeItem(key),
  },

  dom: {
    addClass: (el, className) => el.classList.add(className),
    removeClass: (el, className) => el.classList.remove(className),
    toggleClass: (el, className, force) => el.classList.toggle(className, force),
    setStyle: (el, property, value) => el.style.setProperty(property, value),
  },

  setCSSVariable: (varName, value) => {
    document.documentElement.style.setProperty(varName, value);
  },

  setActive: (event) => {
    const parent = event.target.parentElement;
    parent.querySelectorAll(".active").forEach((el) => App.dom.removeClass(el, "active"));
    App.dom.addClass(event.target, "active");
  },

  toggleVisibility: (containerSelector, showValue, settingsKey) => {
    const container = App.query(containerSelector);
    if (!container) return;

    container.style.display = showValue ? "block" : "none";
    App.storage.set(settingsKey, showValue ? "show" : "hide");
  },

  initVisibilitySetting: (containerSelector, settingSelectors, storageKey) => {
    const setting = App.storage.get(storageKey);
    const { yesSelector, noSelector } = settingSelectors;
    const container = App.query(containerSelector);

    if (!container) return;

    App.queryAll(`${settingSelectors.root} span`).forEach((el) =>
      App.dom.removeClass(el, "active")
    );

    if (setting === "show") {
      container.style.display = "block";
      App.dom.addClass(App.query(yesSelector), "active");
      
    } else if (setting === "hide") {
      container.style.display = "none";
      App.dom.addClass(App.query(noSelector), "active");
    }
  },
};

const State = {
  backgroundOption: true,
  backgroundInterval: null,
  imagesArray: ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg"],
  landingPage: App.query(".landing-page"),
};

const ColorTheme = {
  init: () => {
    const savedColor = App.storage.get("color_option");
    if (savedColor) {
      App.setCSSVariable("--primary-color", savedColor);
      ColorTheme.updateActive(savedColor);
    }
  },

  updateActive: (color) => {
    App.queryAll(".colors-list li").forEach((el) => {
      App.dom.toggleClass(el, "active", el.dataset.color === color);
    });
  },

  onChange: () => {
    App.queryAll(".colors-list li").forEach((li) => {
      li.addEventListener("click", (e) => {
        const color = e.target.dataset.color;
        App.setCSSVariable("--primary-color", color);
        App.storage.set("color_option", color);
        App.setActive(e);
      });
    });
  },
};

const Background = {
  init: () => {
    const savedBg = App.storage.get("background_option");
    if (savedBg === "true") {
      State.backgroundOption = true;
      App.dom.addClass(App.query(".random-backgrounds .Yes"), "active");
      App.dom.removeClass(App.query(".random-backgrounds .No"), "active");
    } else if (savedBg === "false") {
      State.backgroundOption = false;
      App.dom.addClass(App.query(".random-backgrounds .No"), "active");
      App.dom.removeClass(App.query(".random-backgrounds .Yes"), "active");
    }
  },

  onChange: () => {
    App.queryAll(".random-backgrounds span").forEach((span) => {
      span.addEventListener("click", (e) => {
        App.setActive(e);
        State.backgroundOption = e.target.dataset.background === "yes";
        App.storage.set("background_option", State.backgroundOption);

        if (State.backgroundOption) {
          Background.randomize();
        } else {
          clearInterval(State.backgroundInterval);
        }
      });
    });
  },

  randomize: () => {
    State.backgroundInterval = setInterval(() => {
      if (State.backgroundOption) {
        const randomIndex = Math.floor(Math.random() * State.imagesArray.length);
        State.landingPage.style.backgroundImage = `url("imgs/${State.imagesArray[randomIndex]}")`;
      }
    }, 1000);
  },
};

const Skills = {
  init: () => {
    const skillsSection = App.query(".skills");
    if (!skillsSection) return;

    window.addEventListener("scroll", () => {
      const { offsetTop } = skillsSection;
      const { innerHeight, pageYOffset } = window;

      if (pageYOffset + innerHeight >= offsetTop) {
        App.queryAll(".skill-box .Skill-progress span").forEach((skill) => {
          skill.style.width = skill.dataset.progress;
        });
      }
    });
  },
};

const Gallery = {
  init: () => {
    App.queryAll(".gallery img").forEach((img) => {
      img.addEventListener("click", () => Gallery.createPopup(img));
    });
    Gallery.closeListener();
  },

  createPopup: (img) => {
    const overlay = document.createElement("div");
    overlay.className = "popup-overlay";
    overlay.addEventListener("click", () => {
      overlay.remove();
      App.query(".popup-box")?.remove();
    });
    document.body.appendChild(overlay);

    const popupBox = document.createElement("div");
    popupBox.className = "popup-box";

    if (img.alt) {
      const heading = document.createElement("h3");
      heading.textContent = img.alt;
      popupBox.appendChild(heading);
    }

    const image = document.createElement("img");
    image.src = img.src;
    popupBox.appendChild(image);

    const closeBtn = document.createElement("span");
    closeBtn.className = "close-button";
    closeBtn.textContent = "X";
    popupBox.appendChild(closeBtn);

    document.body.appendChild(popupBox);
  },

  closeListener: () => {
    document.addEventListener("click", (e) => {
      if (e.target.className === "close-button") {
        e.target.parentNode.remove();
        App.query(".popup-overlay").remove();
      }
    });
  },
};

const Navigation = {
  init: () => {
    Navigation.smoothScroll();
  },

  smoothScroll: () => {
    const elements = [...App.queryAll(".nav-bollets .bullet"), ...App.queryAll(".links a")];
    elements.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const target = App.query(e.target.dataset.section);
        if (target) {
          target.scrollIntoView({ behavior: "smooth" });
        }
      });
    });
  },
};

const BulletsNav = {
  init: () => {
    App.initVisibilitySetting(".nav-bollets", {
      root: ".bullet-option",
      yesSelector: ".bullet-option .Yes",
      noSelector: ".bullet-option .No",
    }, "bullets_option");
  },

  onChange: () => {
    App.queryAll(".bullet-option span").forEach((span) => {
      span.addEventListener("click", (e) => {
        const isShow = span.dataset.bullet === "show";
        App.toggleVisibility(".nav-bollets", isShow, "bullets_option");
        App.setActive(e);
      });
    });
  },
};

const Settings = {
  init: () => {
    App.query(".toggle-setting .fa-gear")?.addEventListener("click", function () {
      this.classList.toggle("fa-spin");
      App.query(".setting-box")?.classList.toggle("open");
    });

    App.query(".reset-option")?.addEventListener("click", () => {
      Settings.reset();
    });
  },

  reset: () => {
    App.storage.remove("color_option");
    App.storage.remove("background_option");
    App.storage.remove("bullets_option");
    window.location.reload();
  },
};

const Menu = {
  init: () => {
    const toggleBtn = App.query(".toggle-menu");
    const links = App.query(".links");

    if (!toggleBtn || !links) return;

    toggleBtn.addEventListener("click", () => {
      toggleBtn.classList.toggle("menu-active");
      links.classList.toggle("open");
    });

    document.addEventListener("click", (e) => {
      if (e.target !== toggleBtn && e.target !== links) {
        if (links.classList.contains("open")) {
          toggleBtn.classList.toggle("menu-active");
          links.classList.toggle("open");
        }
      }
    });

    links.addEventListener("click", (e) => e.stopPropagation());
  },
};

document.addEventListener("DOMContentLoaded", () => {
  ColorTheme.init();
  ColorTheme.onChange();

  Background.init();
  Background.onChange();
  Background.randomize();

  Skills.init();
  Gallery.init();
  Navigation.init();

  BulletsNav.init();
  BulletsNav.onChange();

  Settings.init();
  Menu.init();
});


