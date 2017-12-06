# grunt-bower-bundle v0.0.1

> Bundle install bower components
> 



## Getting Started

*If you are new to Grunt, you will find a lot of answers to your questions in their [getting started guide](http://gruntjs.com/getting-started).

To install the module:
````
npm install --save-dev grunt-bower-bundle
```

Include the task in your Gruntfile:
```js
grunt.loadNpmTasks('grunt-bower-bundle');
```

Create a config block within your Gruntfile:

```js
watch: {
	bower: {
		files: 'bower.json'
		tasks: 'bowerBundle'
	}
}

bowerBundle: {
  target: {
  
    // Point to the files that should be updated when
    // you run `grunt bowerBundle`
    src: [
      'app/views/**/*.html',   // .html support...
      'app/views/**/*.jade'   // .jade support...
    ],

    // Optional:
    // ---------
    installDir: '' // the directory of concat typed files
    bowerDir: ''  // the directory of your bower.json
  }
}
```


## Use in HTML


```html
<!-- bundle:js:min res/vendors.js -->
<!-- endbundle -->
```

Will change to


```html
<!-- bundle:js:min res/vendors.js -->
<script src='res/vendors.js'></script>
<!-- endbundle -->
```

all you bower package's js files will concat and minify to `res/vendors.js`


## Debug bower package

Add `debug` after `bundle:js`

```html
<!-- bundle:js:debug res/vendors.js -->
<!-- endbundle -->
```

Will change to (if you installed jquery, angular and bootstrap)

```html
<!-- bundle:js:debug res/vendors.js -->
<script src="vendors/jquery/dist/jquery.js"></script>
<script src="vendors/angular/angular.js"></script>
<script src="vendors/bootstrap/dist/js/bootstrap.js"></script>
<!-- endbundle -->
```

## Bundle CSS and Jade support


```jade
// bundle:css res/vendors.css
// endbundle
```

Will change to

```jade
// bundle:css res/vendors.css
link(rel='stylesheet', href='res/vendors.css')
// endbundle
```

**For now, bundle css not support minify, but it also support debug mode**




