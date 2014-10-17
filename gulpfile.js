var gulp = require('gulp');
var es = require('event-stream');
var gutil = require('gulp-util');
var sass = require('gulp-ruby-sass');
var autoprefixer = require('gulp-autoprefixer');
var livereload = require('gulp-livereload');
var minifycss = require('gulp-minify-css');
var notify = require('gulp-notify');
var rename = require('gulp-rename');
var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pngcrush = require('imagemin-pngcrush');
var watch = require('gulp-watch');

var src = './';
var dest = './';

gulp.task('process-css', function (cb) {
    es.concat(
        gulp.src(src + 'css/scss/styles.scss')
            .pipe(sass({style:'compressed'}).on('error', gutil.log))
            .pipe(autoprefixer('last 10 versions'))
            .pipe(gulp.dest(dest + 'css'))
            .pipe(livereload())
        ,
        gulp.src(src + 'css/styles.css')
            .pipe(rename('styles.min.css'))
            .pipe(gulp.dest(dest + 'css'))        
            .pipe(livereload())
            .pipe(notify('CSS compiled, prefixed and minified.'))    )
    .on('end', cb)
    .pipe(livereload());
});

gulp.task('lint', function() {
	return gulp.src(src+'js/app.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'))
	.pipe(notify('Javascript code parsed with JSHint'));
});

gulp.task('jquery', function() {
    return gulp.src(src+'bower_components/jquery/dist/jquery.min.js')
    .pipe(gulp.dest(dest + 'js/vendor/'))
    .pipe(notify('Jquery copied to "vendor" folder'));
});

gulp.task('process-js', function() {
	return gulp.src([
		src + 'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap/modal.js',
		src + 'bower_components/fastclick/lib/fastclick.js',
		src + 'js/scripts.js'
    ])
    .pipe(concat('scripts.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest(dest+'/js'))
    .pipe(livereload())
    .pipe(notify('Javascript concatenated and minified.'));
});

gulp.task('process-img', function () {
  return gulp.src(src + 'img/**/*')
    .pipe(imagemin({
        progressive: true,
        svgoPlugins: [{removeViewBox: false}],
        use: [pngcrush()]
    }))
    .pipe(gulp.dest(dest + '/img/'))
    .pipe(notify('Images optimized.'));
});



gulp.task('watch', function () {
  gulp.watch(src + '/js/**/*.js', ['lint','process-js']);
  gulp.watch(src + '/css/**/*.scss', ['process-css']);
  gulp.watch(src + 'img/**/*', ['process-img']);
});

gulp.task('default', ['process-css','lint','jquery','process-js','process-img','watch']);