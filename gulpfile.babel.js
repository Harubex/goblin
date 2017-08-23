// These names are stupid.
import gulp from "gulp";
import browserify from "browserify";
import watchify from "watchify";
import babelify from "babelify";
import lr from "livereactload";
import source from "vinyl-source-stream";
import buffer from "vinyl-buffer";
import babel from "gulp-babel";

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
    bundler.plugin(lr);
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