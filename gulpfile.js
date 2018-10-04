const gulp = require('gulp')
const babelify = require('babelify')
const browserify = require('browserify')
const source = require('vinyl-source-stream')

gulp.task('default', () => {
	browserify('./src/simplewallet.js', {standalone: 'bitcoin', debug: true})
	.transform(babelify, {presets: ['es2015']})
	.bundle()
	.pipe(source('bundle.js'))
	.pipe(gulp.dest('static/scripts'))
})