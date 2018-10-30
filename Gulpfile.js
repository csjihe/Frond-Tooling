var gulp = require('gulp');
var concat = require('gulp-concat')
var del = require('del');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-cssnano');
var prefix = require('gulp-autoprefixer');

/*gulp.task('scripts', function () {
    return gulp.src('app/scripts/!**!/!*.js')
        .pipe(concat('main.main.js'))
        .pipe(uglify())
        .pipe(gulp.dest('dist/scripts'));
})*/

gulp.task('styles', function () {
    return gulp.src('app/styles/main.less')
        .pipe(less())
        .pipe(minifyCSS())
        .pipe(prefix())
        .pipe(gulp.dest('dist/styles'));
})
gulp.task('test', function () {
    return gulp.src(['app/scripts/**/*.js', '!app/scripts/vendor/**/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter('default'))
        .pipe(jshint.reporter('fail'));
})

gulp.task('clean', function() {
    return del(['dist']);
});


gulp.task('scripts',
    gulp.series('test', function scriptsInternal() {
        return gulp.src(['app/scripts/vendor/**/*.js', 'app/scripts/**/*.js' ])
            .pipe(concat('main.main.js'))
            .pipe(gulp.dest('dist'));
    })
);

gulp.task('default',
    gulp.series('clean',
        gulp.parallel(['styles', 'scripts'])
    )
);


