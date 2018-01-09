var gulp = require("gulp"),
	less = require("gulp-less"),
	concat = require("gulp-concat"),
	rename = require("gulp-rename"),
	cleanCSS = require("gulp-clean-css");

var paths = {
	styles: {
		src: "public/assets/less/living-lab.less",
		dest: "public/assets/css/",
	}
};


gulp.task("styles", function() {

	return gulp.src([paths.styles.src])
		.pipe(less())
		.pipe(cleanCSS({ "compatibility": "ie9" }))
		.pipe(rename({ "basename": "living-lab", "suffix": ".min" }))
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task("watch", function() {
	gulp.watch(["public/assets/less/*.less"], gulp.parallel("styles"));
});

gulp.task("default", gulp.series("styles"));
