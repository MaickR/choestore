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

// Evento para detectar el tamaño del viewport dinámicamente (si es necesario)
window.addEventListener('resize', () => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  console.log(`Viewport actualizado: Ancho ${viewportWidth}px, Alto ${viewportHeight}px`);
});

//? AJUSTES BARRA DE NAVEGACION

document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const burger = document.querySelector('.c-header__burger');
  const menu = document.querySelector('.c-header__menu');
  const closeButton = menu.querySelector('.c-header__close');

  // Obtener la sección "trending" para saber a partir de qué punto se fija la barra de navegación
  const trendingSection = document.querySelector('.trending');

  // Verificamos si existe la sección trending
  let trendingOffset = 0;
  if (trendingSection) {
    // Obtenemos la posición superior de la sección trending en relación al viewport
    trendingOffset = trendingSection.getBoundingClientRect().top + window.scrollY;
    // Esto nos da la distancia desde el top del documento hasta la sección trending
  }

  // Evento de scroll para controlar la barra de navegación
  window.addEventListener('scroll', () => {
    // Si la posición del scroll es mayor que la posición de la sección trending - un margen
    // significa que el usuario ya pasó antes de entrar a trending, y queremos fijar el header.
    // Puedes ajustar el margen según preferencia, aquí no se resta nada, se fija justo antes de trending.
    if (window.scrollY > trendingOffset - 50) { 
      // 50px antes de llegar a trending, ajusta este valor si quieres más distancia
      if (!header.classList.contains('c-header-fixed')) {
        header.classList.add('c-header-fixed');
        const navbar = header.querySelector('.navbar');
        // Forzar un reflow para que se apliquen las propiedades iniciales (opacity:0, translateY(-10px))
        navbar.offsetHeight; 
        // Ahora agregamos la clase c-animate para iniciar la transición a opacity:1, translateY(0)
        navbar.classList.add('c-animate');
      }
    } else {
      // Si el scroll es menor que el offset de trending - 50, remover el estado fijo
      if (header.classList.contains('c-header-fixed')) {
        header.classList.remove('c-header-fixed');
        const navbar = header.querySelector('.navbar');
        navbar.classList.remove('c-animate');
      }
    }
  });

  // Mostrar/ocultar menú móvil al hacer clic en el ícono de menú
  burger.addEventListener('click', () => {
    menu.classList.toggle('active');
  });

  // Cerrar el menú móvil al hacer clic en la "X"
  closeButton.addEventListener('click', () => {
    menu.classList.remove('active');
  });

  // Cerrar el menú al hacer clic fuera del menú (en cualquier área del documento)
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !burger.contains(e.target)) {
      menu.classList.remove('active');
    }
  });

  // Control de submenús en el menú móvil
  const submenuIcons = menu.querySelectorAll('.c-header__submenu-icon');
  submenuIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      const submenu = icon.closest('.dropdown').querySelector('.c-header__submenu-mobile');
      if (submenu.style.display === 'block') {
        submenu.style.display = 'none';
        icon.textContent = '►'; // Cambiar el icono al estado cerrado
      } else {
        submenu.style.display = 'block';
        icon.textContent = '▼'; // Cambiar el icono al estado abierto
      }
    });
  });

  // Cerrar menú móvil al hacer clic en un link dentro de él
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
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


//* CAROUSEL DESCUENTOS

let promoSlider = document.querySelector(".promo-slider");
let promoCurrentSlide = 0;
let promoTotalSlides = promoSlider.querySelectorAll(".promo-wrapper .promo-left > div").length - 1;

// Función para determinar si estamos en tablet o teléfono
const isMobile = () => window.innerWidth <= 768;

// Función para actualizar el slider
const updateSlider = () => {
  let leftDiv = promoSlider.querySelector(".promo-wrapper .promo-left div");
  let rightDiv = promoSlider.querySelector(".promo-wrapper .promo-right div");

  // Limitar el desplazamiento a -200vh en dispositivos móviles
  if (isMobile() && promoCurrentSlide > 2) {
    promoCurrentSlide = 2; // Máximo 2 slides (0, 1, 2)
  }

  // Actualizar margin-top de los contenedores según el dispositivo
  let marginValue = isMobile() ? promoCurrentSlide * -50 : promoCurrentSlide * -100;
  leftDiv.style.marginTop = `${marginValue}vh`;
  rightDiv.style.marginTop = `${marginValue}vh`;
};

// Evento para el botón "Arriba"
promoSlider.querySelector(".promo-controls .promo-up").addEventListener("click", function () {
  if (promoCurrentSlide == 0) return;
  promoCurrentSlide--;
  updateSlider();
});

// Evento para el botón "Abajo"
promoSlider.querySelector(".promo-controls .promo-down").addEventListener("click", function () {
  if (promoCurrentSlide == promoTotalSlides) return;
  promoCurrentSlide++;
  updateSlider();
});
//! CAROUSEL DESCUENTOS







  