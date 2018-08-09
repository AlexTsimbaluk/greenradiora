'use strict';

var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    exec = require('child_process').exec // для запуска команд в терминале
;

// при изменении файлов откладываем перезагрузку на это время,
// чтобы cordova успела перезапуститься
var RELOAD_TIMEOUT = 2000;

// gulp.task('browser-sync', ['webpack-dev','cordova-run'], function() {
gulp.task('browser-sync', ['cordova-run'], function() {
    setTimeout(() => {
        browserSync({
            /*server: {
                baseDir: 'www'
            },*/
            proxy: 'localhost:8000',
            port:   9999,
            notify: false,
            ghostMode: false
        });
    }, RELOAD_TIMEOUT);
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
        exec('cordova serve');
        console.log('::browserSync:reload');
        browserSync.reload();
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
    gulp.watch('src/**/*.*', ['webpack-build']);

    // gulp.watch('www/**/*.html', ['deferred-reload']);
    // gulp.watch('www/**/*.js', ['deferred-reload']);
    // gulp.watch('www/**/*.css', ['deferred-reload']);
});

gulp.task('default', ['watch']);

