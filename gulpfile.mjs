//? Dependencias de gulp
import gulp from 'gulp';
const { src, dest, watch, series, parallel } = gulp;

//? CSS y SASS
import sass from 'gulp-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import sourcemaps from 'gulp-sourcemaps';
import cssnano from 'cssnano';

//? Importa el compilador Sass moderno
import * as sassCompiler from 'sass';

const sassGulp = sass(sassCompiler);

//? Imagenes
import imagemin from 'gulp-imagemin';
import imageminMozjpeg from 'imagemin-mozjpeg';
import imageminPngquant from 'imagemin-pngquant';
import webp from 'gulp-webp';
import avif from 'gulp-avif';

//* Herramienta que evita que se detenga el proceso de compilación
import plumber from 'gulp-plumber';

//? Ve los cambios en el navegador
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const browserSync = require('browser-sync').create();

//? Herramientas adicionales
import terser from 'gulp-terser'; // Minifica JavaScript
import rename from 'gulp-rename'; // Renombra archivos
import accessibility from 'gulp-accessibility'; // Evalúa accesibilidad
import sitemap from 'gulp-sitemap'; // Genera sitemap para SEO
import concat from 'gulp-concat'; // Une archivos CSS/JS

//* Función para compilar el SASS
function css(done) {
    src('src/scss/app.scss')
        .pipe(plumber())
        .pipe(sourcemaps.init())
        .pipe(sassGulp())
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/css'))
        .pipe(browserSync.stream());
    done();
}

//* Función para optimizar las imágenes en `src/assets/img` y `src/assets/icons`
function imagenes() {
    return src('src/assets/img/**/*.{png,jpg}')
      .pipe(imagemin([
        imageminMozjpeg({ quality: 80 }),
        imageminPngquant({ quality: [0.7, 0.8] })
      ]))
      .pipe(dest('build/assets/img'));
  }
  
  

// Generar versiones WebP a partir de JPG/PNG
function generarWebpVersiones() {
    return src('src/assets/img/**/*.{png,jpg}')
      .pipe(webp({ quality: 50 }))
      .pipe(dest('build/assets/img/webp'));
}

// Generar versiones AVIF a partir de JPG/PNG
function generarAvifVersiones() {
    return src('src/assets/img/**/*.{png,jpg}')
      .pipe(avif({ quality: 50 }))
      .pipe(dest('build/assets/img/avif'));
}

//* Función para minificar y renombrar JavaScript, uniendo todos los archivos de `src/scripts`
function js() {
    return src('src/scripts/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(concat('app.js')) // Une todos los JS en un solo archivo llamado app.js
        .pipe(terser()) // Minifica el JavaScript
        .pipe(rename({ suffix: '.min' })) // Renombra como app.min.js
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/scripts')); // Guarda en build/scripts
}

//* Generación de un sitemap para SEO que incluye todos los HTML en `src` excepto los de `build`
function generarSitemap() {
    return src(['*.html', 'pages/**/*.html', '!build/**/*.html']) // Escanea el raíz y la carpeta pages, excluye build
        .pipe(sitemap({ siteUrl: 'http://localhost:3000' })) // Cambia esta URL en producción
        .pipe(dest('build'));
}

//* Evaluación de accesibilidad en todos los archivos HTML en `src` y subcarpetas
function accesibilidad() {
    return src(['*.html', 'pages/**/*.html']) // Lee todos los HTML en el raíz y en pages
        .pipe(accessibility({ force: true }))
        .on('error', console.log)
        .pipe(accessibility.report({ reportType: 'txt' }))
        .pipe(rename({ extname: '.accessibility.txt' }))
        .pipe(dest('build/reports'));
}

//? Configuración de BrowserSync
function servidor(done) {
    browserSync.init({
        server: {
            baseDir: './'
        }
    });
    done();
}

//? Función para recargar BrowserSync
function recargar(done) {
    browserSync.reload();
    done();
}

//? Tarea de desarrollo
function dev() {
    watch('src/scss/**/*.scss', css); // Observa SCSS
    watch('src/scripts/**/*.js', js); // Observa cambios en JS en `src/scripts`
    watch('src/assets/img/**/*.{png,jpg}', series(imagenes, generarWebpVersiones, generarAvifVersiones, recargar));
    watch('src/**/*.html', series(generarSitemap, recargar)); // Observa cambios en HTML y actualiza el sitemap
}

//* Exportar tareas individuales y la tarea por defecto
export { css, js, imagenes, generarWebpVersiones, generarAvifVersiones, generarSitemap, accesibilidad };

export default series(
    imagenes, 
    generarWebpVersiones,
    generarAvifVersiones,
    css, 
    js, 
    generarSitemap, 
    accesibilidad, 
    servidor, 
    dev
);
