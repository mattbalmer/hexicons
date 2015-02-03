var gulp = require('gulp'),
    stylus = require('gulp-stylus'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    browserify = require('browserify'),
    reactify = require('reactify'),
    nib = require('nib');

var appname = 'hexicons',
paths = {
    source: {
        css: ['client/**/*.styl', 'node_modules/react-color-picker/style/index.styl'],
        ignored_css: [ '!client/css/_/**/*.styl' ],
        js: 'client/**/*.js',
        app_js: './client/js/'+appname+'.js',
        html: [ 'client/**/*.html' ]
    },
    dest: {
        css: 'public/css/',
        js: 'public/js/',
        html: 'public/'
    }
};

// === Tier 1 Tasks ===
gulp.task('html', function() {
    return gulp.src(paths.source.html)
        .pipe(gulp.dest(paths.dest.html));
});
gulp.task('css', function() {
    return gulp.src(paths.source.css.concat(paths.source.ignored_css))
        .pipe(stylus({
            use: nib(),
            paths: [ '_' ],
            import: [ 'nib', '_' ]
        }))
        .pipe(concat('style.css'))
        .pipe(gulp.dest(paths.dest.css));
});
gulp.task('js', function() {
    return browserify(paths.source.app_js)
        .transform(reactify)
        .bundle()
        .pipe(source(appname+'.js'))
        .pipe(gulp.dest(paths.dest.js));
});
gulp.task('watch', function() {
    gulp.watch(paths.source.css, ['css']);
    gulp.watch(paths.source.js, ['js']);
    gulp.watch(paths.source.html, ['html']);
});

// === Tier 2 Tasks ===
gulp.task('compile', ['html', 'css', 'js']);
gulp.task('default', ['compile', 'watch']);