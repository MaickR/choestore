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

//? INDEX- PRODUCTOS CON SWIPER.JS
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
//! INDEX- PRODUCTOS CON SWIPER.JS

//? INDEX- DESCUENTOS TEMPORADA
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
//! INDEX- DESCUENTOS TEMPORADA

//? INDEX- INSTAGRAM PHOTOS
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
//! INDEX- INSTAGRAM PHOTOS

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

//? SECCION PRODUCTOS - CONTROL DE CANTIDAD DE PRODUCTOS
document.addEventListener("DOMContentLoaded", function () {
  /********************************************
   * 1. CONTROL DE CANTIDAD DE PRODUCTO (+/-)
   ********************************************/
  const quantityInput = document.getElementById("quantity");
  const decreaseBtn = document.querySelector(".quantity-decrease");
  const increaseBtn = document.querySelector(".quantity-increase");

  // Evento para disminuir la cantidad
  decreaseBtn.addEventListener("click", function () {
    const currentValue = parseInt(quantityInput.value, 10) || 1;
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });

  // Evento para aumentar la cantidad
  increaseBtn.addEventListener("click", function () {
    const currentValue = parseInt(quantityInput.value, 10) || 1;
    quantityInput.value = currentValue + 1;
  });

  /********************************************
   * 2. OBTENCIÓN DE DATOS DEL PRODUCTO
   ********************************************/
  const productTitleEl = document.getElementById("product-title");
  const priceEl = document.querySelector(".product-price .new-price span[itemprop='price']");
  const productDescEl = document.querySelector("[itemprop='description']");
  const productImgEl = document.querySelector(".img-showcase img[itemprop='image']");

  // Asume que la URL canónica del producto podría ser la actual o un link fijo:
  const productURL = window.location.href; 

  // Función para garantizar datos
  function getTextContent(element) {
    return element ? element.textContent.trim() : "";
  }

  // Datos del producto
  const productTitle = getTextContent(productTitleEl) || "Producto sin título";
  const productPrice = priceEl ? priceEl.textContent.trim() : "Precio desconocido";
  const productDesc = getTextContent(productDescEl) || "Descripción no disponible";
  const productImgSrc = productImgEl ? productImgEl.src : "";

  /********************************************
   * 3. FUNCIÓN PARA OBTENER SALUDO BASADO EN HORA (COLOMBIA)
   ********************************************/
  function getTimeGreeting() {
    // Hora local del usuario (asumiendo la misma zona horaria que Colombia)
    const hour = new Date().getHours();
    if (hour < 12) {
      return "Buenos días";
    } else if (hour < 18) {
      return "Buenas tardes";
    } else {
      return "Buenas noches";
    }
  }

  /********************************************
   * 4. BOTÓN "COMPRAR" -> MENSAJE DE WHATSAPP
   ********************************************/
  const buyButton = document.querySelector(".btn[aria-label='Agregar al carrito']");

  buyButton.addEventListener("click", function () {
    // Obtener la cantidad
    const quantityValue = parseInt(quantityInput.value, 10) || 1;
    // Crear el saludo + mensaje
    const greeting = getTimeGreeting();
    // Armar el texto del mensaje
    // Nota: Se usa \n para saltos de línea y encodeURIComponent para URL
    let message = `${greeting},\n\n` +
      `Vengo de Choestore.com y me interesa el producto "${productTitle}" ` +
      `que se encuentra con un valor de ${productPrice} y deseo adquirirlo en una ` +
      `cantidad de ${quantityValue} unidades.`;

    // Formar la URL de WhatsApp: https://wa.me/<phone>?text=<encodedText>
    const phoneNumber = "573103624742"; // Sin '+' al inicio, WhatsApp usa formato 'countrycode + number'
    const whatsAppURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    // Abrir en nueva pestaña para mayor seguridad y conveniencia
    window.open(whatsAppURL, "_blank");
  });

  /********************************************
   * 5. BOTONES DE REDES SOCIALES PARA COMPARTIR
   ********************************************/
  // a) Compartir en Facebook
  const facebookLink = document.querySelector("a[aria-label='Compartir en Facebook']");
  if (facebookLink) {
    facebookLink.addEventListener("click", function (e) {
      e.preventDefault();
      // Facebook share link
      // Comparte la URL del producto; se puede añadir un quote, pero FB no siempre lo respeta
      const fbShareURL = "https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(productURL);
      window.open(fbShareURL, "_blank");
    });
  }

  // b) Compartir en Instagram
  // Instagram no soporta un "share link" oficial en desktop. 
  // Se suele redirigir al perfil de Instagram o usar la app. 
  // Como aproximación, podrías abrir el link del producto:
  const instagramLink = document.querySelector("a[aria-label='Compartir en Instagram']");
  if (instagramLink) {
    instagramLink.addEventListener("click", function(e) {
      e.preventDefault();
      const instaShareText = `Mira este producto: ${productTitle}\n\n${productDesc}\n${productURL}`;
      const instaShareURL = "instagram://share?text=" + encodeURIComponent(instaShareText);
      // Intentamos abrir la app de Instagram; si falla, se muestra un mensaje
      window.location.href = instaShareURL;
      setTimeout(function() {
        alert("La opción de compartir en Instagram no está disponible desde el navegador. Por favor, copia el enlace y compártelo manualmente.");
      }, 1500);
    });
  }

  // c) Compartir en WhatsApp
  // Este enlace difiere al botón "Comprar" (que es un chat directo con Choe).
  // Aquí, el usuario comparte el producto con sus contactos (no con la tienda).
  const whatsAppShareLink = document.querySelector("a[aria-label='Compartir en WhatsApp']");
    if (whatsAppShareLink) {
      whatsAppShareLink.addEventListener("click", function(e) {
        e.preventDefault();
        const shareMessage = `¡Mira este producto en Choestore.com!\n\n${productTitle}\n\n${productDesc}\n\nLink: ${productURL}`;
        // Copiar mensaje al portapapeles para mayor comodidad
        if (navigator.clipboard) {
          navigator.clipboard.writeText(shareMessage).then(function() {
            alert("Mensaje copiado al portapapeles. Ahora puedes pegarlo en tu estado o enviarlo a un contacto.");
          });
        }
        const waShareURL = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareMessage)}`;
        window.open(waShareURL, "_blank");
      });
    }
  });
//! SECCION PRODUCTOS - CONTROL DE CANTIDAD DE PRODUCTOS

//? SECCION PRODUCTOS - CARACTERISTICAS PRODUCTOS
document.addEventListener("DOMContentLoaded", function() {
  const tabLinks = document.querySelectorAll(".tab-link");
  const tabContents = document.querySelectorAll(".tab-content");
  
  // Asignamos comportamiento a cada botón de pestaña
  tabLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Quitamos 'active' y aria-selected="false" a todos los botones
      tabLinks.forEach((l) => {
        l.classList.remove("active");
        l.setAttribute("aria-selected", "false");
      });
      
      // Ocultamos todo el contenido
      tabContents.forEach((content) => {
        content.hidden = true;
      });
      
      // Activamos solo la pestaña clicada
      link.classList.add("active");
      link.setAttribute("aria-selected", "true");
      
      // Mostramos solo el <article> correspondiente
      const controlledTab = document.getElementById(link.getAttribute("aria-controls"));
      controlledTab.hidden = false;
    });
  });
});
//! SECCION PRODUCTOS - CARACTERISTICAS PRODUCTOS

//? SECCION PRODUCTOS - PRODUCTOS RELACIONADOS  
/* 
  Inicialización de Swiper.js para el slider de productos relacionados
  - Se ha renombrado la clase de .blog-slider a .relacionado-slider
  - Ajustamos la paginación con la clase .relacionado-slider__pagination
  - Mantemos el efecto 'fade' y el loop
  - autoHeight en false para que respete la altura definida por CSS 
    (evitando scroll extra en pantallas pequeñas)
*/

var swiper = new Swiper('.relacionado-slider', {
  spaceBetween: 30,
  effect: 'fade',
  loop: true,
  mousewheel: {
    invert: false,
  },
  autoHeight: false,
  pagination: {
    el: '.relacionado-slider__pagination',
    clickable: true,
  },
});

//! SECCION PRODUCTO - PRODUCTOS RELACIONADOS  