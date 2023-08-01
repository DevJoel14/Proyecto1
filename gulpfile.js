
const { src, dest, watch, series, parallel } = require('gulp');/* importarlos las dependencias para usarlas */

//css y sass
const sass = require('gulp-sass')(require('sass'));
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');/* agrega prefijos automaticos a las caract de css nuevo */
const sourcemaps = require('gulp-sourcemaps');
const cssnano = require('cssnano');

//imagenes
const imagemin = require('gulp-imagemin');
const webp = require('gulp-webp');
const avif = require('gulp-avif');
function css( done ) {
    //compillar sass
    // paso: 1 - identificar el archivo, 2 - compilarla, 3 - Guardar el .css

    src('src/scss/app.scss')
        .pipe(sourcemaps.init() )
        .pipe( sass( ) )
        .pipe( postcss([ autoprefixer() ]) )
        .pipe( sourcemaps.write('.'))/* guarda junto al build */
        .pipe( dest('build/css') )
    
    done();
}

function imagenes( ) {
    return src('src/img/**/*')
        .pipe( imagemin({ optimizationLevel: 3} ))
        .pipe( dest ('build/img') );
    
}

function versionWebp() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( webp( opciones ) )
        .pipe( dest('build/img'));
}

function versionAvif() {
    const opciones = {
        quality: 50
    }
    return src('src/img/**/*.{png,jpg}')
        .pipe( avif(opciones))
        .pipe( dest('build/img'));
}

function dev ( ) {
    watch( 'src/scss/**/*.scss', css);//comodines busca todos los archivos de la carpeta src que tenga la extencions scss
    watch( 'src/img/**/*', imagenes);//si se ponen nuevas imagenes estara pendiente
}


exports.css = css;
exports.dev = dev;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp;
exports.versionAvif = versionAvif;
exports.default = series( imagenes, versionWebp ,versionAvif, css, dev );
//default es para que una tarea se ejecute de forma automatica con poner gulp. primero css luego dev.

//series - se inicia una tarea, y hasta que finaliza, inicia la siguiente
//parallel - Todas inician al mismo tiempo