const gulp = require("gulp");
const plumber = require("gulp-plumber");
const sourcemap = require("gulp-sourcemaps");
const less = require("gulp-less");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const sync = require("browser-sync").create();
const rename = require("gulp-rename");
const cheerio = require("gulp-cheerio");
const svgmin = require("gulp-svgmin");

const footer = require("gulp-footer");
const svgstore = require("gulp-svgstore");

const createLess = (data) => {
  return gulp
    .src("source/less/assets/variables.less")
    .pipe(footer(data))
    .pipe(gulp.dest("source/less/assets/"));
};

const createSprite = () => {
  return gulp
    .src("source/img/svg-decorative/*.svg")
    .pipe(svgmin())
    .pipe(svgstore())
    .pipe(
      cheerio({
        run: function ($) {
          $('[fill]:not([id^="______"] *)').removeAttr("fill");
          $('[stroke]:not([id^="______"] *)').removeAttr("stroke");
          $("[style]").removeAttr("style");
          $("[class]").removeAttr("class");
          $("style").remove();
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(
      cheerio({
        run: function ($) {
          let size = 24;
          let counter = 0;
          let data = "\n";
          let svg = $("svg");
          $("symbol").each((_, element) => {
            if (element.attribs.id.substr(0, 6) !== "STATIC") {
              svg.append(
                $(
                  '<use width="' +
                    size +
                    '" height="' +
                    size +
                    '" xlink:href="#' +
                    element.attribs.id +
                    '" x="0" y="' +
                    counter * size +
                    (element.attribs.id.includes("______")
                      ? '"/>'
                      : '" fill="#' + element.attribs.id.substr(0, 6) + '"/>')
                )
              );
              data +=
                "@" +
                element.attribs.id.substr(7) +
                ": " +
                counter +
                ";" +
                "\n";
              counter++;
            }
          });
          createLess(data);
          svg.attr("width", size);
          svg.attr("height", counter * size);
        },
        parserOptions: { xmlMode: true },
      })
    )
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("source/img/sprite"));
};

exports.createSprite = createSprite;

// Styles

const styles = () => {
  return gulp
    .src("source/less/style.less")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(less())
    .pipe(postcss([autoprefixer()]))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("source/css"))
    .pipe(sync.stream());
};

exports.styles = styles;

// Server

const server = (done) => {
  sync.init({
    server: {
      baseDir: "source",
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};

exports.server = server;

// Watcher

const watcher = () => {
  gulp.watch("source/less/**/*.less", gulp.series("styles"));
  gulp.watch("source/*.html").on("change", sync.reload);
};

exports.default = gulp.series(styles, server, watcher);
