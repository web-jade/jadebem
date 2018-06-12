var
    gulp = require('gulp'),
    pug = require('gulp-pug'),
    stylus = require('gulp-stylus'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    cleancss = require('gulp-cleancss');

gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: 'src'
        },
        notify: false,
    })
});

gulp.task('page', function buildHTML() {
    return gulp.src('src/pages/**/*.pug')
        .pipe(pug({
            // pretty: true
        }))
        .pipe(gulp.dest("src"))
        .pipe(browserSync.stream());
});

gulp.task('styles', function () {
    return gulp.src([
        'src/tools/**/*.styl',
        'src/blocks/**/*.styl'
        ])
        .pipe(stylus({
            'include css': true
        }))
        .pipe(concat('main.css'))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(cleancss({
            level: {
                1: {
                    specialComments: false
                }
            }
        }))
        .pipe(rename({
            suffix: '.min',
            prefix: ''
        }))
        .pipe(gulp.dest('src/assets/css'))
        .pipe(browserSync.stream());
});

gulp.task('scripts', function buildHTML() {
    return gulp.src([
            'src/vendor/jquery/dist/jquery.min.js',
            'src/blocks/**/*.js'
        ])
        .pipe(concat('scripts.js'))
        .pipe(gulp.dest("src/assets/js"))
        .pipe(uglify())
        .pipe(concat('scripts.min.js'))
        .pipe(browserSync.stream());
});

gulp.task('watch', ['styles', 'scripts', 'page', 'browser-sync'], function() {
    gulp.watch('src/tools/**/*.styl', ['styles', browserSync.reload]);
    gulp.watch('src/blocks/**/*.styl', ['styles', browserSync.reload]);
    gulp.watch('src/blocks/**/*.js', ['scripts']);
    gulp.watch('src/pages/*.pug', ['page']);
    gulp.watch('src/blocks/**/*.pug', ['page']);
});

gulp.task('build', ['styles', 'scripts', 'page'], function () {
    var buildFiles = gulp.src([
        'src/*.html',
        'src/assets/**/*'
    ]).pipe(gulp.dest('build'));
});

gulp.task('default', ['watch']);