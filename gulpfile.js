var gulp = require('gulp');
var install = require('gulp-install');
var url = require('url');
var proxyMiddleware = require('proxy-middleware');
var browserSync = require('browser-sync');
var Server = require('karma').Server;


// Copy libraries from /node_modules into /assets
gulp.task('copy', function() {
    gulp.src(['node_modules/bootstrap/dist/**/*'])
        .pipe(gulp.dest('assets/bootstrap'));

    gulp.src(['node_modules/angular/*'])
        .pipe(gulp.dest('assets/angular'));

    gulp.src(['node_modules/angular-mocks/*'])
        .pipe(gulp.dest('assets/angular-mocks'));

    gulp.src(['node_modules/angular-route/*'])
        .pipe(gulp.dest('assets/angular-route'));

    gulp.src(['node_modules/jquery/dist/*'])
        .pipe(gulp.dest('assets/jquery'));
});

gulp.task('install', function () {
    gulp.src(['package.json'])
        .pipe(install());
});

// Run everything
gulp.task('start', ['copy', 'unit', 'serve']);

gulp.task('unit', function (done) {
    new Server({
        configFile: require('path').resolve('karma-init.conf.js')
    }, done).start();
});

// Configure the browserSync task
gulp.task('browser-sync', function() {
    var proxyOptions = url.parse('http://api.brewerydb.com/v2');

    proxyOptions.route = '/api';

    browserSync({
        open: true,
        port: 3000,
        server: {
            baseDir: "./",
            middleware: [proxyMiddleware(proxyOptions)]
        }
    });
});

// Dev task with browserSync
gulp.task('serve', ['browser-sync'], function() {
    // Reloads the browser whenever HTML, CSS or JS files change
    gulp.watch('*.html', browserSync.reload);
    gulp.watch('*.js', browserSync.reload);
    gulp.watch('*.css', browserSync.reload);
});

