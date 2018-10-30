var gulp = require('gulp');
var concat = require('gulp-concat')
var del = require('del');
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');
var less = require('gulp-less');
var minifyCSS = require('gulp-cssnano');
var prefix = require('gulp-autoprefixer');
var bSync = require('browser-sync');
var wiredep = require('wiredep').stream;

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


 gulp.task('server', function(done) {
     bSync({
         server: {
             baseDir: ['dist', 'app']
         }
     });
     done();
 });

 gulp.task('deps', function() {
     return gulp.src('app/**/*.html')
         .pipe(wiredep())
         .pipe(gulp.dest('dist'));
 })

gulp.task('default',
    gulp.series('clean',
        gulp.parallel('styles', 'scripts', 'deps'),
        'server',
        function watcher(done) {
        gulp.watch(
            ['app/scripts/!**!/!*.js', '!app/scripts/vendor/!**!/!*.js'],
            gulp.parallel('scripts')
        );
        gulp.watch(
            'app/styles/!**!/!*.less',
            gulp.parallel('styles')
        );
        gulp.watch(
            'dist/!**!/!*',
            bSync.reload
        );
        done();
        }
    )
);


