const gulp = require('gulp'); //加载gulp插件
const gulpsass = require('gulp-sass');
const html = require('gulp-minify-html');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const watch = require('gulp-watch'); //添加此插件进行监听
const imagemin = require('gulp-imagemin'); //图片压缩插件
const babel = require('gulp-babel');
// gulp.task('taskname', function() {
//     console.log('hello,gulp');
// });

//3.sass编译--gulp-sass
gulp.task('runsass', function() {
    return gulp.src('src/sass/*.scss')
        .pipe(gulpsass({ outputStyle: 'compressed' })) //执行编译
        .pipe(gulp.dest('dist/css/'))
});


//4.压缩html
gulp.task('uglifyhtml', function() {
    return gulp.src('src/*.html')
        .pipe(html()) //执行压缩
        .pipe(gulp.dest('dist/'));
});


//5.合并压缩js
gulp.task('alljs', function() {
    return gulp.src('src/script/js/*.js')
        .pipe(babel({
            presets: ['@babel/env']
        }))
        .pipe(concat('all.js')) //合并以及重命名
        .pipe(gulp.dest('dist/script/js')) //输出
        .pipe(rename('all.min.js')) //重命名
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('dist/script/js'));
});


//6.图片的压缩--png
//如果插件安装不成功，可以在清除缓存之后继续按照 npm cache clean --force
//npm cache clean --force
gulp.task('runimg', function() {
    return gulp.src('src/images/*.png')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/images/'));
});

//最终监听的写法
//监听需要任务执行一次之后进行操作。
/* gulp.task('default',function(){
	//watch的第一个参数监听的文件的路径，第二个参数是监听运行的任务名
	watch(['src/sass/style.scss','src.html','src/js.js'],gulp.parallel('runsass','uglifyhtml','alljs'));
}); */

gulp.task('default', function() {
    //watch的第一个参数监听的文件的路径，第二个参数是监听运行的任务名
    watch(['src/*.html', 'src/sass/*.scss', 'src/script/js/*.js', 'src/images/*.png'], gulp.parallel('uglifyhtml', 'runsass', 'alljs', 'runimg')); //添加了 gulp.series 和 gulp.parallel 方法用于组合任务
    //gulp.parallel() –并行运行任务 
    //gulp.series() –运行任务序列,拥有先后顺序。 
});