"use strict";

var gulp = require('gulp'),                                       // Сам Gulp
	sass = require('gulp-sass'),                              // SASS компилятор
	rename = require('gulp-rename'),                          // Переименование файлов
	notify = require("gulp-notify"),                          // Всплывающее окно
	concat = require('gulp-concat'),                          // Конкатенация JS
	uglify = require('gulp-uglify'),                          // Минификация JS
	connect = require('gulp-connect'),                        // Сервер с LIVE RELOAD
	csscomb = require('gulp-csscomb'),                        // Причесываем CSS
	htmlmin = require('gulp-htmlmin'),                        // Минификация HTML
	concatCss = require('gulp-concat-css'),                   // Конкатенация CSS
	minifyCss = require('gulp-minify-css'),                   // Минификация CSS
	autoprefixer = require('gulp-autoprefixer'),              // Автоматические префиксы
	opn = require('opn');                                     // Автозапуска браузера

// server connect 
gulp.task('connect', function() {
	connect.server({
		root: 'dist',
		livereload: true,
		port: 8888
	});
	opn('http://localhost:8888');
});

// sass
gulp.task('sass', function () {
	gulp.src('app/sass/style.sass')
	.pipe(sass())
	.pipe(csscomb())
	.pipe(gulp.dest('app/css/'));
});

// css
gulp.task('css', function () {
	gulp.src('app/css/*.css')
	.pipe(concatCss('style.css'))
	.pipe(autoprefixer('last 30 version'))
	.pipe(minifyCss())
	.pipe(rename('style.min.css'))
	.pipe(gulp.dest('dist/css/'))
	.pipe(connect.reload())
	.pipe(notify('CSS Done!'));
});

// html
gulp.task('html', function () {
	gulp.src('app/*.html')
	.pipe(htmlmin({collapseWhitespace: true}))
	.pipe(gulp.dest('dist/'))
	.pipe(connect.reload())
	.pipe(notify('HTML Done!'));
})

// js
gulp.task('js', function () {
	gulp.src('app/js/*.js')
	.pipe(concat('main.js'))
	.pipe(uglify())
	.pipe(gulp.dest('dist/js/'))
	.pipe(connect.reload())
	.pipe(notify('JS Done!'));
});

// watch
gulp.task('watch', function () {
	gulp.watch('app/sass/*.sass', ['sass'])
	gulp.watch('app/css/*.css', ['css'])
	gulp.watch('app/js/*.js', ['js'])
	gulp.watch('app/*.html', ['html']);
});

// default
gulp.task('default', ['connect', 'watch']);
