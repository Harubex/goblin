// These names are stupid.
const gulp = require("gulp");
const eslint = require("gulp-eslint");
const browserify = require("browserify");
const watchify = require("watchify");
const babelify = require("babelify");
const source = require("vinyl-source-stream");
const buffer = require("vinyl-buffer");
const babel = require("gulp-babel");

let destination = "build";


gulp.task("build-server", async (done) => {
    compileFiles();
    done();
});

gulp.task("build-client", gulp.series("build-server", async (done) => {
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
    done();
}));

gulp.task("lint", () => {
    return gulp.src(["**/*.js", "**/*.jsx", "!node_modules/**"])
        .pipe(eslint())
        .pipe(eslint.results((results) => {
            console.log(`Total Results: ${results.length}`);
            console.log(`Total Warnings: ${results.warningCount}`);
            console.log(`Total Errors: ${results.errorCount}`);
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

function compileFiles() {
    gulp.src("src/*.jsx").pipe(babel()).pipe(gulp.dest(destination + "/server"));
}