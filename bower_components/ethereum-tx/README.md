# ethereumjs - Browser Builds

This repository contains browser builds of the following ``ethereumjs`` libraries:

- [ethereumjs-vm](./dist/ethereumjs-vm/)
- [ethereumjs-tx](./dist/ethereumjs-tx/)
- [ethereumjs-wallet](./dist/ethereumjs-wallet/)
- [ethereumjs-icap](./dist/ethereumjs-icap/)
- [ethereumjs-abi](./dist/ethereumjs-abi/)

They are built using [browserify](browserify.org) with a known set of working dependencies.

**Note:**

This repository was just lately (October 2017) revived. Currently all builds are considered ``experimental`` in terms of API stability, functionality and security!

## Usage

In your web application, include only one of the builds from the `dist` directory. All exports will be available under the global `ethereumjs`.

**Note:** all packages expect ECMAScript 6 (ES6) as a minimum environment. From browsers lacking ES6 support, please use a shim (like [es6-shim](https://github.com/paulmillr/es6-shim)) before including any of the builds from this repo.

## Examples

Examples for usage of the browser builds can be found in the ``examples`` directory:

- [examples/](./examples/)

Start an [http-server](https://github.com/indexzero/http-server) from the main directory of the repository to run the examples in the browser.

## Build

Run `npm run build` to generate a new set up builds. Change `package.json` to require different versions of the libraries.

