const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const eslint = require('gulp-eslint');
const gulp = require('gulp');
const prettyError = require('gulp-prettyerror');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const terser = require('gulp-terser');

// Create basic Gulp tasks

gulp.task('sass-min', function() {
	return gulp
		.src('./sass/main.scss', { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(prettyError())
		.pipe(sass())
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(cssnano())
		.pipe(rename('style.min.css'))
		.pipe(sourcemaps.write('../maps'))
		.pipe(gulp.dest('./build/css'));
});

gulp.task('sass-full', function() {
	return gulp
		.src('./sass/main.scss', { sourcemaps: true })
		.pipe(sourcemaps.init())
		.pipe(prettyError())
		.pipe(sass())
		.pipe(
			autoprefixer({
				browsers: ['last 2 versions']
			})
		)
		.pipe(gulp.dest('./build/css'))
});

gulp.task('lint', function() {
	return gulp
		.src(['./js/*.js'])
		.pipe(prettyError())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

gulp.task('scripts-min', function() {
	return gulp
		.src('./js/*.js')
		.pipe(terser())
		.pipe(
			rename({
				extname: '.min.js'
			})
		)
		.pipe(gulp.dest('./build/js'));
});

gulp.task('scripts-full', function() {
		return gulp
			.src('./js/*.js')
			.pipe(gulp.dest('./build/js'));
	});

gulp.task(
	'scripts',
	gulp.series('lint', 'scripts-full', 'scripts-min')
);

// Set-up BrowserSync and watch

gulp.task('watch', function() {
	gulp.watch('js/*.js', gulp.series('scripts'));
	gulp.watch('sass/*/*.scss', gulp.series('sass-min'));
	gulp.watch('sass/*/*.scss', gulp.series('sass-full'));
});

gulp.task('default', gulp.series('scripts', 'sass-min','sass-full'));
