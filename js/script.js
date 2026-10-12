/* ============================================================
   МОБИЛЬНОЕ МЕНЮ
   ============================================================ */
const menu = document.querySelector("#menu");
const burgerBtn = document.querySelector("#burger_btn");
const btnClose = document.querySelector(".menu__btn-close");

const modalToggler = function () {
  menu.classList.toggle("modal-open");
};

burgerBtn.addEventListener("click", modalToggler);
btnClose.addEventListener("click", modalToggler);

document.querySelectorAll(".menu__list-burger .menu__link").forEach((link) => {
  link.addEventListener("click", () => {
    menu.classList.remove("modal-open");
  });
});

/* ============================================================
      ДАННЫЕ ПО ОБЪЕКТАМ
      ============================================================ */
const properties = [
  {
    id: 1,
    type: "house",
    title: "California St.",
    location: "Los Angeles, CA",
    price: "$1,200,000",
    beds: "16 beds",
    baths: "2 bathrooms",
    rooms: "11 rooms",
    images: ["./img/osov.svg", "./img/osov2.svg", "./img/osov3.svg"],
  },
  {
    id: 2,
    type: "villa",
    title: "Welford Gardens",
    location: "Miami, FL",
    price: "$3,500,000",
    beds: "12 beds",
    baths: "3 bathrooms",
    rooms: "16 rooms",
    images: ["./img/osov3.svg", "./img/osov.svg", "./img/osov2.svg"],
  },
  {
    id: 3,
    type: "house",
    title: "The Grove",
    location: "Austin, TX",
    price: "$950,000",
    beds: "12 beds",
    baths: "2 bathrooms",
    rooms: "14 rooms",
    images: ["./img/osov2.svg", "./img/osov3.svg", "./img/osov.svg"],
  },
  {
    id: 4,
    type: "apartment",
    title: "Wallace St.",
    location: "Chicago, IL",
    price: "$650,000",
    beds: "10 beds",
    baths: "2 bathrooms",
    rooms: "8 rooms",
    images: [
      "./img/IMAGEbathroom1.svg",
      "./img/IMAGEbathroom2.svg",
      "./img/IMAGEbathroom3.svg",
    ],
  },
  {
    id: 5,
    type: "apartment",
    title: "Dwight Way",
    location: "Berkeley, CA",
    price: "$480,000",
    beds: "8 beds",
    baths: "1 bathroom",
    rooms: "6 rooms",
    images: [
      "./img/IMAGEbathroom2.svg",
      "./img/IMAGEbathroom3.svg",
      "./img/IMAGEbathroom1.svg",
    ],
  },
  {
    id: 6,
    type: "house",
    title: "North Avenue",
    location: "Seattle, WA",
    price: "$875,000",
    beds: "14 beds",
    baths: "3 bathrooms",
    rooms: "11 rooms",
    images: [
      "./img/IMAGEbathroom3.svg",
      "./img/IMAGEbathroom1.svg",
      "./img/IMAGEbathroom2.svg",
    ],
  },
];

/* ============================================================
      ИЗБРАННОЕ — состояние
      ============================================================ */
const favoritesList = document.querySelector("#favoritesList");
const favoritesSection = document.querySelector("#favorites");
const favoritesCount = document.querySelector("#favoritesCount");
const favoritesBtn = document.querySelector("#favoritesBtn");

let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
let currentFilter = "all";
let currentSort = "default";

const saveFavorites = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

const updateFavoritesCount = () => {
  favoritesCount.textContent = favorites.length;
  if (favorites.length > 0) {
    favoritesCount.classList.add("is-visible");
  } else {
    favoritesCount.classList.remove("is-visible");
  }
};

/* ============================================================
      РЕНДЕР КАРТОЧЕК + СОРТИРОВКА
      ============================================================ */
const propertiesList = document.querySelector("#propertiesList");
const filterButtons = document.querySelectorAll(".newsroom__filter");
const sortSelect = document.querySelector("#sortSelect");

const typeLabel = {
  house: "House",
  villa: "Villa",
  apartment: "Apartment",
};

const heartSVG = `
     <svg viewBox="0 0 24 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">
       <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
     </svg>
   `;

const cardTemplate = (p) => `
     <li class="newsroom__item" data-id="${p.id}">
       <button class="newsroom__item-fav ${
         favorites.includes(p.id) ? "is-active" : ""
       }" data-fav-id="${p.id}" aria-label="В избранное">
         ${heartSVG}
       </button>
       <img src="${p.images[0]}" alt="${p.title}" class="newsroom__icon" />
       <h3 class="title">${typeLabel[p.type]}</h3>
       <p class="subtitle">${p.title}</p>
       <ul class="newsroom__list-icons">
         <li class="newsroom__item-icons">
           <img src="./img/bedsicon.svg" alt="beds" />
           <span class="newsroom__item-icons-text">${p.beds}</span>
         </li>
         <li class="newsroom__item-icons">
           <img src="./img/ShapeBathroom.svg" alt="baths" />
           <span class="newsroom__item-icons-text">${p.baths}</span>
         </li>
         <li class="newsroom__item-icons">
           <img src="./img/dooricon.svg" alt="rooms" />
           <span class="newsroom__item-icons-text">${p.rooms}</span>
         </li>
       </ul>
     </li>
   `;

// Парсим "$1,200,000" → 1200000
const parsePrice = (str) => Number(str.replace(/[^0-9]/g, ""));

const sortProperties = (list, sort) => {
  const copy = [...list];
  switch (sort) {
    case "price-asc":
      return copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "price-desc":
      return copy.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case "name-asc":
      return copy.sort((a, b) => a.title.localeCompare(b.title));
    case "name-desc":
      return copy.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return copy;
  }
};

const renderCards = (filter = "all") => {
  currentFilter = filter;
  const filtered =
    filter === "all" ? properties : properties.filter((p) => p.type === filter);
  const sorted = sortProperties(filtered, currentSort);
  propertiesList.innerHTML = sorted.map(cardTemplate).join("");
};

/* ============================================================
      ФИЛЬТРАЦИЯ
      ============================================================ */
filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    renderCards(btn.dataset.filter);
  });
});

/* ============================================================
      СОРТИРОВКА
      ============================================================ */
if (sortSelect) {
  sortSelect.addEventListener("change", () => {
    currentSort = sortSelect.value;
    renderCards(currentFilter);
  });
}

/* ============================================================
      МОДАЛЬНОЕ ОКНО + НАВИГАЦИЯ ПО ОБЪЕКТАМ
      ============================================================ */
const modal = document.querySelector("#propertyModal");
const modalImage = document.querySelector("#modalImage");
const modalType = document.querySelector("#modalType");
const modalTitle = document.querySelector("#modalTitle");
const modalPrice = document.querySelector("#modalPrice");
const modalBeds = document.querySelector("#modalBeds");
const modalBaths = document.querySelector("#modalBaths");
const modalRooms = document.querySelector("#modalRooms");

const sliderPrev = document.querySelector("#sliderPrev");
const sliderNext = document.querySelector("#sliderNext");
const modalCounter = document.querySelector("#modalCounter");

let currentPropertyIndex = 0;

const updateModalContent = (p) => {
  modalImage.src = p.images[0];
  modalImage.alt = p.title;
  modalType.textContent = typeLabel[p.type];
  modalTitle.textContent = `${p.title}, ${p.location}`;
  modalPrice.textContent = p.price;
  modalBeds.textContent = p.beds;
  modalBaths.textContent = p.baths;
  modalRooms.textContent = p.rooms;
  modalCounter.textContent = `${currentPropertyIndex + 1} / ${
    properties.length
  }`;
};

const openModal = (p) => {
  currentPropertyIndex = properties.findIndex((x) => x.id === p.id);
  updateModalContent(properties[currentPropertyIndex]);
  modal.classList.add("is-open");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  modal.classList.remove("is-open");
  document.body.style.overflow = "";
};

const nextProperty = () => {
  currentPropertyIndex = (currentPropertyIndex + 1) % properties.length;
  updateModalContent(properties[currentPropertyIndex]);
};

const prevProperty = () => {
  currentPropertyIndex =
    (currentPropertyIndex - 1 + properties.length) % properties.length;
  updateModalContent(properties[currentPropertyIndex]);
};

sliderNext.addEventListener("click", nextProperty);
sliderPrev.addEventListener("click", prevProperty);

propertiesList.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".newsroom__item-fav");
  if (favBtn) {
    e.stopPropagation();
    toggleFavorite(Number(favBtn.dataset.favId));
    return;
  }

  const item = e.target.closest(".newsroom__item");
  if (!item) return;

  const id = Number(item.dataset.id);
  const property = properties.find((p) => p.id === id);
  if (property) openModal(property);
});

document.querySelectorAll("[data-close]").forEach((el) => {
  el.addEventListener("click", closeModal);
});

document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("is-open")) return;

  if (e.key === "Escape") closeModal();
  if (e.key === "ArrowRight") nextProperty();
  if (e.key === "ArrowLeft") prevProperty();
});

/* ============================================================
      ИЗБРАННОЕ — логика
      ============================================================ */
const renderFavorites = () => {
  const favProperties = properties.filter((p) => favorites.includes(p.id));

  if (favProperties.length === 0) {
    favoritesSection.hidden = true;
    favoritesList.innerHTML = "";
    return;
  }

  favoritesSection.hidden = false;
  favoritesList.innerHTML = favProperties.map(cardTemplate).join("");
};

const toggleFavorite = (id) => {
  if (favorites.includes(id)) {
    favorites = favorites.filter((f) => f !== id);
  } else {
    favorites.push(id);
  }

  saveFavorites();
  updateFavoritesCount();
  renderFavorites();
  renderCards(currentFilter);
};

favoritesList.addEventListener("click", (e) => {
  const favBtn = e.target.closest(".newsroom__item-fav");
  if (favBtn) {
    e.stopPropagation();
    toggleFavorite(Number(favBtn.dataset.favId));
    return;
  }

  const item = e.target.closest(".newsroom__item");
  if (!item) return;
  const id = Number(item.dataset.id);
  const property = properties.find((p) => p.id === id);
  if (property) openModal(property);
});

favoritesBtn.addEventListener("click", () => {
  if (favorites.length === 0) return;
  favoritesSection.scrollIntoView({ behavior: "smooth", block: "start" });
});

/* ============================================================
      ВАЛИДАЦИЯ ФОРМЫ ПОДПИСКИ
      ============================================================ */
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterEmail = document.querySelector("#newsletterEmail");
const newsletterMessage = document.querySelector("#newsletterMessage");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const showMessage = (text, type) => {
  newsletterMessage.textContent = text;
  newsletterMessage.classList.remove("is-error", "is-success");
  if (type) newsletterMessage.classList.add(`is-${type}`);
};

newsletterForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = newsletterEmail.value.trim();

  if (!value) {
    newsletterEmail.classList.add("is-invalid");
    newsletterEmail.classList.remove("is-valid");
    showMessage("Please enter your email address.", "error");
    return;
  }

  if (!emailPattern.test(value)) {
    newsletterEmail.classList.add("is-invalid");
    newsletterEmail.classList.remove("is-valid");
    showMessage("Please enter a valid email address.", "error");
    return;
  }

  newsletterEmail.classList.remove("is-invalid");
  newsletterEmail.classList.add("is-valid");
  showMessage("Thanks! You've been subscribed.", "success");

  setTimeout(() => {
    newsletterEmail.value = "";
    newsletterEmail.classList.remove("is-valid");
    showMessage("", "");
  }, 2500);
});

newsletterEmail.addEventListener("input", () => {
  newsletterEmail.classList.remove("is-invalid", "is-valid");
  showMessage("", "");
});

/* ============================================================
      ПЕРЕКЛЮЧЕНИЕ ТЕМЫ
      ============================================================ */
const themeToggle = document.querySelector("#themeToggle");
const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.documentElement.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.getAttribute("data-theme") === "dark";

  if (isDark) {
    document.documentElement.removeAttribute("data-theme");
    localStorage.setItem("theme", "light");
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  }
});

/* ============================================================
      STICKY-NAV ТЕНЬ ПРИ СКРОЛЛЕ
      ============================================================ */
const header = document.querySelector("header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    header.classList.add("is-scrolled");
  } else {
    header.classList.remove("is-scrolled");
  }
});

/* ============================================================
      КНОПКА "НАВЕРХ"
      ============================================================ */
const backToTop = document.querySelector("#backToTop");

if (backToTop) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      backToTop.classList.add("is-visible");
    } else {
      backToTop.classList.remove("is-visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ============================================================
      АНИМАЦИЯ ПОЯВЛЕНИЯ СЕКЦИЙ
      ============================================================ */
const revealElements = document.querySelectorAll("section, .newsroom__img");

revealElements.forEach((el) => el.classList.add("reveal"));

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 }
);

revealElements.forEach((el) => revealObserver.observe(el));

/* ============================================================
      ИНИЦИАЛИЗАЦИЯ
      ============================================================ */
renderCards();
updateFavoritesCount();
renderFavorites();
