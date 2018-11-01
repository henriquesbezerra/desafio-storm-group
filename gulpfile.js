var gulp     = require('gulp'),             // Meu Automatizador.
    sass     = require('gulp-sass'),        // Meu pré-processador.
    cssnano  = require('gulp-cssnano'),     // Minifica o css, https://cssnano.co    
    srcmaps  = require('gulp-sourcemaps'),  // Mapeia o css, para debugg
    bs       = require('browser-sync'),     // Server sincronizado ao Browser, para atualizar em 'tempo real'.
    uglify   = require('gulp-uglify'),      // Minifica o JavaScript.
    rename   = require('gulp-rename'),      // Renomeia Arquivos.
    concat   = require('gulp-concat'),      // Concatena arquivos.
    pipeif   = require('gulp-if'),          // Utilizado para criar condições
    ssi      = require('gulp-ssi'),         // Pra concatenar html
    flatmap  = require('gulp-flatmap'),     // Mapea os Arquivos
    imagemin = require('gulp-imagemin'),    // Comprimi as imagens
    pngquant = require('imagemin-pngquant'),// Plugin imagemin para minificar png
    watch = require('gulp-watch'),          // Verifica modificação em algum arquivo
    fs       = require('fs');               // Para verificar se um arquivo ou pasta existe

// Configuração dos Browser Suportados pelo cssnano  
var supported = [
    'last 2 versions',
    'safari >= 8',
    'ie >= 8',
    'ff >= 20',
    'ios 6',
    'android 4'
];
    
// Configuração dos Caminhos    
var config = {
    src    : {
        sass  : "./src/sass/*.scss",
        index : "./src/*.html",
        incs  : "./src/html-parts/*.html",  
        js    : "./src/js/*.js",
        img   : "./src/images/*"
    },
    server : {
        root : "./server",
        css  : "./server/css",
        js   : "./server/js",
        img  : "./server/images"
    },
    dist : {
        root : "./dist",
        css  : "./dist/css",
        js   : "./dist/js",
        img  : "./dist/images"
    }
};

// Função para tratr o Sass, converto e minifica-lo
function compile_css($origin, $dest, $out, $dev = true){    
    return gulp.src($origin)        
        .pipe(sass.sync({outputStyle: $out}).on('error', sass.logError))
        .pipe(pipeif( $dev, srcmaps.init()))
        .pipe(cssnano({
            autoprefixer: {browsers: supported, add: true}
        }))
        .pipe(rename({ extname: '.min.css' }))
        .pipe(gulp.dest($dest))
        .pipe(pipeif( $dev, srcmaps.write('.'))) 
        .pipe(pipeif( $dev, gulp.dest($dest)))       
        .pipe(bs.stream());
}

// Função para tratar o Js, concatena-lo e minifica-lo
function compile_scripts($origin, $dest, $dev = true){   
    return gulp.src($origin)
    .pipe(concat('scripts.js'))
    .pipe(pipeif( $dev, srcmaps.init()))          
    .pipe(uglify())
    .pipe(rename({ extname: '.min.js' }))   
    .pipe(gulp.dest($dest))
    .pipe(pipeif( $dev, srcmaps.write('.'))) 
    .pipe(pipeif( $dev, gulp.dest($dest)))       
    .pipe(bs.stream());
}

// Apenas Transporta o HTML
function compile_html($origin, $dest){   
    return gulp.src($origin)    
        .pipe(flatmap(function(stream, file){
            return stream
                .pipe(ssi())
        }))    
        .pipe(gulp.dest($dest))
        .pipe(bs.stream());
}

// Comprimi as imagens quando exportr o projeto
function compile_imgs($origin,$dest, $compress = false){
    return gulp.src($origin)
        .pipe(pipeif($compress, imagemin(
            [
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                pngquant(),
                imagemin.svgo({
                    plugins: [
                        {removeViewBox: true},
                        {cleanupIDs: false}
                    ]
                })
            ], {
                verbose: true
            }
        )))
        .pipe(gulp.dest($dest));
}

// Inicia a compilação do sass
gulp.task('sass',()=>{
    compile_css(config.src.sass, config.server.css, 'expanded');   
});

// Inicia a compilação dos scripts
gulp.task('scripts',()=>{
    compile_scripts(config.src.js, config.server.js);
});

// Inicia a compilação dos scripts
gulp.task('html',()=>{
    compile_html(config.src.index, config.server.root);
});

// Comprimi as imagens
gulp.task('images', () =>{
    compile_imgs(config.src.img ,config.server.img);
});

// Tarefa para o Ambiente de Desenvolvimento
gulp.task('dev',()=>{
    bs.init({
        server: {
            baseDir: "./server"
        }
    });

    if(!fs.existsSync('./server')){
        compile_css(config.src.sass, config.server.css, 'expanded'); 
        compile_scripts(config.src.js, config.server.js);
        compile_html(config.src.index, config.server.root);
    }

    // Move imgs to server folder
    compile_imgs(config.src.img, config.server.img);
    
    gulp.watch(config.src.sass, ['sass']);
    gulp.watch(config.src.js, ['scripts']);
    gulp.watch([config.src.index, config.src.incs]).on('change', function(file){
        compile_html(config.src.index, config.server.root);
    });

    watch(config.src.img, function () {
        console.log('Movendo imagens');
        compile_imgs(config.src.img, config.server.img);
    });   

});

// Tarefa para exportar o projeto
gulp.task('dist',()=>{   
    compile_css(config.src.sass, config.dist.css, 'compressed',false); 
    compile_scripts(config.src.js, config.dist.js,false);
    compile_html(config.src.index, config.dist.root);   
    compile_imgs(config.src.img ,config.dist.img, true);
});