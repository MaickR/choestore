// Evento para manejar la carga de la ventana
window.addEventListener('load', function () {
  // Ajustes específicos para dispositivos pequeños
  if (window.innerWidth < 767) {
      setTimeout(() => {
          document.body.classList.remove('loaded');
          const mainBlock = document.querySelector('.main-block');
          if (mainBlock) mainBlock.classList.remove('load-bg');
      }, 1000);
  } else {
      setTimeout(() => {
          document.body.classList.remove('loaded');
      }, 1000);
  }
});

//? AJUSTES BARRA DE NAVEGACION

document.addEventListener('DOMContentLoaded', () => {
  // Cacheo de elementos DOM
  const DOM = {
    header: document.querySelector('header'),
    burger: document.querySelector('.c-header__burger'),
    menu: document.querySelector('.c-header__menu'),
    closeButton: document.querySelector('.c-header__close'),
    navbar: document.querySelector('.navbar'),
    submenuIcons: document.querySelectorAll('.c-header__submenu-icon')
  };

  // Configuración de comportamiento
  const SCROLL_THRESHOLD = 1; // 1px de scroll para activar el efecto
  let lastScrollPosition = 0;

  // Control de header fijo con throttling para mejor performance
  const handleScroll = () => {
    const currentScroll = window.scrollY;
    
    // Solo actualizar si hay cambio real en la posición
    if (Math.abs(currentScroll - lastScrollPosition) < 5) return;

    if (currentScroll > SCROLL_THRESHOLD) {
      if (!DOM.header.classList.contains('c-header-fixed')) {
        DOM.header.classList.add('c-header-fixed');
        DOM.navbar.classList.add('c-animate');
      }
    } else {
      DOM.header.classList.remove('c-header-fixed');
      DOM.navbar.classList.remove('c-animate');
    }
    lastScrollPosition = currentScroll;
  };

  // Evento de scroll con passive true y throttling
  window.addEventListener('scroll', () => {
    requestAnimationFrame(handleScroll);
  }, { passive: true });

  // Control del menú móvil
  const toggleMenu = (state) => {
    DOM.menu.classList.toggle('active', state);
    DOM.burger.setAttribute('aria-expanded', state);
    DOM.menu.setAttribute('aria-hidden', !state);
  };

  DOM.burger.addEventListener('click', () => {
    toggleMenu(!DOM.menu.classList.contains('active'));
  });

  DOM.closeButton.addEventListener('click', () => {
    toggleMenu(false);
  });

  // Cerrar menú al hacer clic fuera
  document.addEventListener('click', (e) => {
    if (!DOM.menu.contains(e.target) && !DOM.burger.contains(e.target)) {
      toggleMenu(false);
    }
  });

  // Control de submenús con accesibilidad mejorada
  DOM.submenuIcons.forEach(icon => {
    icon.addEventListener('click', (e) => {
      const submenu = e.target.closest('.dropdown').querySelector('.c-header__submenu-mobile');
      const isExpanded = submenu.style.display === 'block';
      
      submenu.style.display = isExpanded ? 'none' : 'block';
      icon.setAttribute('aria-expanded', !isExpanded);
      icon.textContent = isExpanded ? '►' : '▼';
    });
  });

  // Cerrar menú al seleccionar opción
  DOM.menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
  });

  // Mejoras de accesibilidad iniciales
  DOM.menu.setAttribute('aria-hidden', true);
  DOM.burger.setAttribute('aria-haspopup', 'true');
  DOM.burger.setAttribute('aria-expanded', 'false');
});

//! AJUSTES BARRA DE NAVEGACION


//? ANIMACIONES DEL BANNER

const banners = [
	{
	  image: "img/banner-01.jpg",
	 /*  title: "Magia del Bosque", */
	/*   description:
		"Llena tu hogar de magia con nuestro difusor de frutos del bosque, acompañado de palitos de bambú.",
	  buttonText: "Ver detalles", */
	/*   buttonLink: "products/difusor-bosque.html", */
	},
	{
	  image: "img/banner-02.jpg",
	  /* title: "Frescura Maracuyá", */
	  /* description:
		"Siente la frescura vibrante del Splash corporal de maracuyá. Ideal para mantenerte fresco durante todo el día.",
	  buttonText: "Comprar ahora", */
	 /*  buttonLink: "products/splash-maracuya.html", */
	},
	{
	  image: "img/banner-03.jpg",
	 /*  title: "Fragancias Para Tu Viaje",
	  description:
		"Perfuma tu casco con una fragancia irresistible de kiwi y frutos rojos. ¡Viajar nunca fue tan fresco!",
	  buttonText: "Descúbrelo",
	  buttonLink: "products/casco-kiwi-frutos-rojos.html", */
	},
	{
	  image: "img/banner-04.jpg",
	 /*  title: "Tu Elección Perfecta",
	  description:
		"Descubre el equilibrio perfecto entre fragancia y elegancia. Choe siempre inspira.",
	  buttonText: "Conócenos",
	  buttonLink: "about.html", */
	},
  ];
  
  const backgrounds = document.querySelectorAll(".main-block__background");
  const content = document.querySelector(".main-block__content");
  
  let currentIndex = 0;
  
  function updateBanner() {

    if (!content || backgrounds.length === 0) {
      return;
    }
	// Remover la clase 'active' de todas las imágenes y contenido
	backgrounds.forEach((bg) => bg.classList.remove("active"));
	content.classList.remove("active");
  
	// Configurar la nueva imagen y contenido
	const { image, title, description, buttonText, buttonLink } =
	  banners[currentIndex];
  
	// Activar la nueva imagen
	backgrounds[currentIndex].classList.add("active");
  
	// Cambiar el contenido con un pequeño retraso para la transición
	setTimeout(() => {
	  content.querySelector("h1").textContent = title;
	  content.querySelector("p").textContent = description;
  
	  const button = content.querySelector("a");
	  button.textContent = buttonText;
	  button.href = buttonLink;
  
	  content.classList.add("active");
	}, 500);
  
	// Actualizar índice
	currentIndex = (currentIndex + 1) % banners.length;
  }
  
  // Iniciar el banner y establecer el intervalo
  updateBanner();
  setInterval(updateBanner, 10000);


//! ANIMACIONES DEL BANNER

//? PRODUCTOS CON SWIPER.JS
document.addEventListener("DOMContentLoaded", () => {
  // Seleccionar todos los contenedores de Swiper
  document.querySelectorAll(".dest-container.swiper").forEach(swiperContainer => {
    new Swiper(swiperContainer, {
      slidesPerView: 4,              // 4 en pantallas grandes
      spaceBetween: 30,             // Espacio entre cada tarjeta
      slidesPerGroup: 1,            // Avanza una tarjeta a la vez
      loop: true,
      grabCursor: true,
      centerInsufficientSlides: true, // Centra si hay menos slides
      // Quita fade y centerSlide si quieres evitar "slides cortadas"
      // fade: "true",
      // centerSlide: "true",

      pagination: {
        el: swiperContainer.querySelector(".swiper-pagination"),
        clickable: true,
        /* dynamicBullets: true */
        type: "fraction",
      },
      navigation: {
        nextEl: swiperContainer.querySelector(".swiper-button-next"),
        prevEl: swiperContainer.querySelector(".swiper-button-prev")
      },

      // Breakpoints responsivos
      breakpoints: {
        0: {
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 15
        },
        520: {
          slidesPerView: 2,
          slidesPerGroup: 1,
          spaceBetween: 20
        },
        768: {
          slidesPerView: 3,
          slidesPerGroup: 1,
          spaceBetween: 20
        },
        1200: {
          slidesPerView: 4,
          slidesPerGroup: 1,
          spaceBetween: 30
        }
      }
    });
  });

  // Manejo de enlaces de producto
  document.querySelectorAll(".product-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const url = link.dataset.url;
      if (url) window.open(url, "_blank");
    });
  });

  // Manejo de WhatsApp
  document.querySelectorAll(".whatsapp-link").forEach(icon => {
    icon.addEventListener("click", e => {
      e.preventDefault();
      const message = encodeURIComponent(icon.dataset.message || "Hola, estoy interesado en este producto");
      const whatsappUrl = `https://wa.me/573103624742?text=${message}`;
      window.open(whatsappUrl, "_blank");
    });
  });
});
//! PRODUCTOS CON SWIPER.JS

//? DESCUENTOS TEMPORADA
const topCategoriesSlider = new Swiper('.top-categories__slider', {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 5000,
    disableOnInteraction: false,
  },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  breakpoints: {
    640: {
      slidesPerView: 2,
    },
    1024: {
      slidesPerView: 3,
    }
  }
});
//! DESCUENTOS TEMPORADA

//? INSTAGRAM PHOTOS
document.addEventListener('DOMContentLoaded', () => {
  // Mobile touch handling only
  if (window.innerWidth < 768) {
    const instaPhotos = document.querySelectorAll('.insta-photo');
    
    instaPhotos.forEach(photo => {
      photo.addEventListener('click', (e) => {
        const hover = photo.querySelector('.insta-photo__hover');
        if (hover && !hover.classList.contains('active')) {
          e.preventDefault();
          // Remove active class from all hovers
          document.querySelectorAll('.insta-photo__hover').forEach(h => {
            h.classList.remove('active');
          });
          // Add active class to clicked hover
          hover.classList.add('active');
        }
      });
    });
  }
});
//! INSTAGRAM PHOTOS

//? IMAGENES PRODUCTOS
const createGalleryManager = () => {
  // 1. Generar datos dinámicamente desde el HTML (sin duplicación)
  const generateImageData = () => {
    return Array.from(document.querySelectorAll('.img-item')).map(thumbnail => {
      const picture = thumbnail.querySelector('picture');
      return {
        sources: Array.from(picture.querySelectorAll('source')).map(source => ({
          srcset: source.srcset,
          type: source.type
        })),
        img: {
          src: picture.querySelector('img').src,
          alt: picture.querySelector('img').alt.replace(' thumbnail', ''),
          width: 640,
          height: 640
        }
      };
    });
  };

  // 2. Usar datos generados dinámicamente
  const imagesData = generateImageData();
  const mainContainer = document.querySelector('.img-showcase');

  // 3. Método optimizado para actualizar imágenes
  const updateMainImage = (index) => {
    const fragment = document.createDocumentFragment();
    const { sources, img } = imagesData[index];

    // Clonar sources desde datos
    sources.forEach(({ srcset, type }) => {
      const source = document.createElement('source');
      source.srcset = srcset;
      source.type = type;
      fragment.appendChild(source);
    });

    // Crear imagen principal
    const mainImg = new Image();
    Object.assign(mainImg, {
      ...img,
      loading: 'lazy',
      decoding: 'async',
      itemprop: 'image'
    });
    
    fragment.appendChild(mainImg);

    // Actualización eficiente del DOM
    mainContainer.querySelector('picture').replaceChildren(fragment);
  };

  // 4. Manejador de eventos mejorado
  const handleThumbnailClick = (event, index) => {
    event.preventDefault();
    updateMainImage(index);
  };

  // 5. Inicialización automática con validación
  const initialize = () => {
    document.querySelectorAll('.img-item').forEach((thumbnail, index) => {
      thumbnail.addEventListener('click', (e) => handleThumbnailClick(e, index));
    });
  };

  return { initialize };
};
// 6. Inicialización controlada con checks de performance
document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    const gallery = createGalleryManager();
    gallery.initialize();
  });
});
//! IMAGENES PRODUCTOS

//? CONTROL DE CANTIDAD DE PRODUCTOS
document.addEventListener('DOMContentLoaded', function () {
  const quantityInput = document.getElementById('quantity');
  const decreaseButton = document.querySelector('.quantity-decrease');
  const increaseButton = document.querySelector('.quantity-increase');

  decreaseButton.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  increaseButton.addEventListener('click', function () {
    let currentValue = parseInt(quantityInput.value);
    quantityInput.value = currentValue + 1;
  });
});
//! CONTROL DE CANTIDAD DE PRODUCTOS

// Script para alternar entre las pestañas (Descripción y Reviews).
document.addEventListener('DOMContentLoaded', function () {
  const tabLinks = document.querySelectorAll('.tab-link');
  const tabContents = document.querySelectorAll('.tab-content');

  tabLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Desactivar todos los tabs
      tabLinks.forEach(item => {
        item.classList.remove('active');
        item.setAttribute('aria-selected', 'false');
      });

      // Ocultar todos los paneles
      tabContents.forEach(content => {
        content.hidden = true;
      });

      // Activar el tab actual
      link.classList.add('active');
      link.setAttribute('aria-selected', 'true');

      // Mostrar el panel correspondiente
      const panelId = link.getAttribute('aria-controls');
      const tabPanel = document.getElementById(panelId);
      tabPanel.hidden = false;
    });
  });
});



  