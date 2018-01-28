module.exports = function (grunt) {

  var path = require('path'),
    wiredep = require('wiredep'),
    uglifyJs = require('uglify-js'),
    _ = require('lodash');


  function getBower(dir) {
    var pkg, directory;

    var safeReadJson = function (file) {
      file = path.join(dir, file);
      try {
        if (grunt.file.isFile(file)) { return grunt.file.readJSON(file); }
      } catch(e) {}
      return false;
    };

    // bower.json
    _.each(['bower.json', '.bower.json', 'component.json'], function(file) {
      pkg = safeReadJson(file);
      if (pkg) { return false; }
    });

    if (!pkg) { grunt.fail.fatal('No bower.json file found in directory ' + dir); }


    // bower packages directory
    var directories = ['bower_components', 'components'];
    var bowerRC = safeReadJson('.bowerrc');
    if (bowerRC && bowerRC.directory) { directories.unshift(bowerRC.directory); }

    _.each(directories, function(d) {
      if (!directory && grunt.file.isDir(path.join(dir, d))) {
        directory = path.join(dir, d);
        return false;
      }
    });

    if (!directory) { grunt.fail.fatal('Can\'t find your bower components packages directory in ' + dir); }


    return {pkg: pkg, directory: directory};
  }


  grunt.registerMultiTask('bowerBundle', 'Bundle install bower components', function() {

    this.requiresConfig('bowerBundle.' + this.target + '.src');

    var files = grunt.file.expand(this.data.src),
      bowerDir = path.join(process.cwd(), this.data.bowerDir || ''),
      installDir = this.data.installDir,

      bowerData = getBower(bowerDir),
      EOL = require('os').EOL;


    var parseData = wiredep({
      bowerJson: bowerData.pkg,
      directory: bowerData.directory
    });


    var patterns = [
      /(([ \t]*)<!--\s*bundle:(\S*)\s+(\S*)\s*-->)(\n|\r|.)*?(<!--\s*endbundle\s*-->)/gi,
      /(([ \t]*)\/\/\s*bundle:(\S*)\s+(\S*))(\n|\r|.)*?(\/\/\s*endbundle)/gi
    ];

    var replaces = {
      html: {
        js: '<script ' + 'src="{{filePath}}"></script>',
        css: '<link' + ' rel="stylesheet" href="{{filePath}}" />'
      },
      jade: {
        js: 'script(src=\'{{filePath}}\')',
        css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
      }
    };

    var processFile = function(type, dist, opts) {
      var content;
      if (type === 'js' && (_.includes(opts, 'uglify') || _.includes(opts, 'min'))) {
        content = uglifyJs.minify(parseData[type]).code;
      } else {
        content = parseData[type].reduce(function(sum, file) { return sum + grunt.file.read(file);}, '');
      }
      grunt.file.write(dist, content);
    };


    _.each(files, function(file) {
      var fileExt = path.extname(file).substr(1),
        fileDir = path.dirname(file),
        content = grunt.file.read(file);

      patterns.forEach(function(pattern) {
        content = content.replace(pattern, function(raw, left, tabs, opt, target, mid, right) {
          var dist = path.join(installDir || fileDir, target),
            opts = opt.split(':'), // debug, uglify|min
            type = opts.shift(),
            tpl = replaces[fileExt][type],
            result = [];

          if (tpl && parseData[type] && parseData[type].length) {
            result.push(left);
            if (_.includes(opts, 'debug')) {
              _.each(parseData[type], function(f) {
                result.push(tpl.replace('{{filePath}}', path.relative(fileDir, f)));
              });
            } else {
              processFile(type, dist, opts);
              result.push(tpl.replace('{{filePath}}', target));
            }
            result.push(right);
            return result.join(EOL + tabs);
          }
          return raw;
        });
      });

      grunt.file.write(file, content);
    });
  });

};


