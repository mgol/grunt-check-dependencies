# grunt-check-dependencies

> Checks if currently installed npm dependencies are installed in the exact same versions that are specified in package.json. Based on [check-dependencies](https://www.npmjs.org/package/check-dependencies).

[![Build Status](https://travis-ci.org/mzgol/grunt-check-dependencies.svg?branch=master)](https://travis-ci.org/mzgol/grunt-check-dependencies)
[![Build status](https://ci.appveyor.com/api/projects/status/058pwmb1qvxphjfa/branch/master?svg=true)](https://ci.appveyor.com/project/mzgol/grunt-check-dependencies/branch/master)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)

## Getting Started
This plugin requires Grunt.

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-check-dependencies --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-check-dependencies');
```

## The "checkDependencies" task

### Overview
The `checkDependencies` task checks if the package has all necessary dependencies installed in right versions.
If that's not the case, the task fails and advises to run `npm install`.

If in case of a missing package you want to invoke the `npm install` command automatically, set the `install`
option to `true`.

In your project's Gruntfile, add a section named `checkDependencies` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
    checkDependencies: {
        options: {
            // Task-specific options go here.
        },
        your_target: {
            // Target-specific file lists and/or options go here.
        },
    },
})
```

#### Options

The `checkDependencies` task accepts a couple of options:

```js
{
    // 'npm' or 'bower', depending on what we want to test.
    packageManager: string,

    // Path to a directory containing the package to test. By default the current app is tested.
    packageDir: string,

    // Ensures all installed dependencies are specified in `package.json` or `bower.json`.
    // `false` by default.
    onlySpecified: boolean,

    // If true, on error, instead of failing the task, `npm install` will be invoked for the user.
    // `false` by default.
    install: boolean,

    // Tells the task which sections of the package.json file should be checked.
    // Default is `['dependencies', 'devDependencies']`.
    scopeList: array,

    // If true, logs non-error messages as well.
    verbose: boolean,
}
```

For the full list, see [the usage section](https://github.com/mzgol/check-dependencies#usage) of the README of the [check-dependencies](https://www.npmjs.org/package/check-dependencies) package.

### Usage Examples

The most basic (and probably most common) use of the task requires just providing a target, i.e.:
```js
{
    checkDependencies: {
        this: {},
    },
}
```

If you want to automatically install missing packages, here's what you want:
```js
{
    checkDependencies: {
        this: {
            options: {
                install: true,
            },
        },
    },
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Michał Gołębiowski. Licensed under the MIT license.
