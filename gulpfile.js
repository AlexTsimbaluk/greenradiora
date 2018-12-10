'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    exec = require('child_process').exec,
    less = require('gulp-less'),
    autoprefixer = require('gulp-autoprefixer') // для запуска команд в терминале
;

// при изменении файлов откладываем перезагрузку на это время,
// чтобы cordova успела перезапуститься
var RELOAD_TIMEOUT = 1000;

// gulp.task('browser-sync', ['cordova-run'], function() {
gulp.task('browser-sync', function() {
    setTimeout(() => {
        browserSync({
            /*server: {
                baseDir: 'www'
            },*/
            // proxy: 'localhost:8000',
            proxy: 'greenra',
            // proxy: 'localhost:8080',
            port:   9999,
            notify: false,
            ghostMode: false
        });
    }, RELOAD_TIMEOUT);
});

gulp.task('less', function() {
    'use strict';
    return gulp.src('./static/less/main.less')
            .pipe(less())
            .pipe(autoprefixer(
                ['last 5 versions', '> 1%', 'ie 8', 'ie 7'],
                { cascade: true })
            )
            .pipe(gulp.dest('./static/css/'))
            .pipe(browserSync.reload({stream: true}));
});

/*gulp.task('webpack-deferred-reload', ['webpack-build'], function() {
    console.log('Waiting for ' + (RELOAD_TIMEOUT / 1000) + 's...');
    setTimeout(() => {
        browserSync.reload();
    }, RELOAD_TIMEOUT);
});*/

gulp.task('webpack-build', function() {
    console.log('::webpack:build');

    // exec('npm run build && cordova build && cordova serve && cordova run android', (error, stdout, stderr) => {
    exec('npm run cordova-run-all', (error, stdout, stderr) => {
        exec('cordova build browser');
        exec('cordova serve');
        console.log('::browserSync:reload');
        setTimeout(() => {
            browserSync.reload();
        }, RELOAD_TIMEOUT);
    });
});

gulp.task('webpack-dev', function() {
    console.log('::webpack:dev');

    exec('npm run dev');
});

gulp.task('deferred-reload', ['cordova-build', 'cordova-run-android', 'cordova-serve'], function() {
    console.log('Waiting for ' + (RELOAD_TIMEOUT / 1000) + 's...');
    setTimeout(() => {
        browserSync.reload();
    }, RELOAD_TIMEOUT);
});

gulp.task('cordova-serve', function() {
    console.log('::cordova:serve');

    exec('cordova serve');
});

gulp.task('cordova-build', function() {
    console.log('::cordova:build');

    exec('cordova build');
});

gulp.task('cordova-run', function() {
    console.log('::cordova:run:browser');
    console.log('::cordova:run:android');

    exec('cordova run browser');
    exec('cordova run android');
});

gulp.task('cordova-run-android', function() {
    console.log('::cordova:run:android');

    exec('cordova run android');
});

gulp.task('watch', ['browser-sync'], function() {
    // gulp.watch('src/**/*.*', ['webpack-build']);

    gulp.watch([
            './static/less/*.less'
        ], ['less']);
});

gulp.task('default', ['watch']);

