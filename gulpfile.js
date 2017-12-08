// These names are stupid.
const gulp = require("gulp");
const browserify = require("browserify");
const watchify = require("watchify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babel = require("gulp-babel");

let destination = "build";

gulp.task("build-client", ["build-server"], () => {
    gulp.src("src/*.css").pipe(gulp.dest(destination));

    let bundler = browserify(Object.assign(watchify.args, {
        entries: "src/main.jsx",
        extensions: [".jsx", ".js"], 
        debug: true
    }));
    bundler = watchify(bundler);
    bundler.transform(babelify);
    bundler.on("update", () => {
        compileFiles();
        let stream = bundler.bundle().on("error", console.error).pipe(source("bundle.js")).pipe(buffer());
        stream.pipe(gulp.dest(destination));
    }).emit("update");
});

gulp.task("build-server", () => {
    compileFiles();
});

function compileFiles() {
    gulp.src("src/*.jsx").pipe(babel()).pipe(gulp.dest(destination + "/server"));
}