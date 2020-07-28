var gulp = require('gulp');
var fc2json = require('gulp-file-contents-to-json');
var merge = require('gulp-merge-json');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var browserSync = require('browser-sync').create();
var render = require('gulp-nunjucks-render');
var data = require('gulp-data');
var nunjucksConfig = require('./src/nunjucksConfig');


gulp.task('browserSync', function () {
    browserSync.init({
        server: {
            baseDir: 'dist/'
        },
    })
});

gulp.task('create-json-blob', function () {
    gulp.src('src/templates/components/*/*')
        .pipe(fc2json('content.json'))
        .pipe(gulp.dest('src/'));
});


gulp.task('sass', function () {
    return gulp.src('src/sass/styles.scss')
        .pipe(sass(
            {outputStyle: 'compressed'}
        ))
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.reload({
            stream: true
        }))
});

gulp.task('optimize-js', function () {
    return gulp.src('src/js/*.js')
        .pipe(concat('main.min.js'))
        .pipe(uglify({
            mangle: false
        }))
        .pipe(uglify().on('error', function (e) {
            console.log(e);
        }))
        .pipe(gulp.dest('dist/js/'))
});

gulp.task('merge', function () {
    return gulp.src('src/*.json')
        .pipe(merge())
        .pipe(gulp.dest('./src/'));
});

gulp.task('nunjucks', function () {
    return gulp.src('src/pages/**/*.+(njk)')
        .pipe(data(function () {
            return require('./src/combined.json')
        }))
        .pipe(render({
            path: ['src/templates'],
            manageEnv: nunjucksConfig.manageEnvironment
        }))
        .pipe(gulp.dest('dist'))
});


gulp.task('watch', gulp.parallel('browserSync', function () {
    gulp.watch('src/sass/**/*.scss', gulp.series('sass'));
    gulp.watch('src/js/*.js', gulp.series('optimize-js'));
    gulp.watch("src/*", gulp.series('create-json-blob'));
    gulp.watch('src/**/*.+(njk)', gulp.series('nunjucks'));
}));
