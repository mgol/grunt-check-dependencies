# grunt-check-dependencies

> Checks if currently installed npm dependencies are installed in the exact same versions that are specified in package.json. Based on [check-dependencies](https://www.npmjs.org/package/check-dependencies).

[![Build Status](https://travis-ci.org/mgol/grunt-check-dependencies.svg?branch=master)](https://travis-ci.org/mgol/grunt-check-dependencies)
[![Build status](https://ci.appveyor.com/api/projects/status/058pwmb1qvxphjfa/branch/master?svg=true)](https://ci.appveyor.com/project/mgol/grunt-check-dependencies/branch/master)
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

The `checkDependencies` task accepts the same options the `check-dependencies` library accepts in its config except `verbose`, `log` and `error`. [Click here to see the full list](https://github.com/mgol/check-dependencies/tree/0.9.3#usage).

Below is a description of a few most basic options

```js
{
    // `'npm'` or `'bower'`, depending on what we want to test.
    // Default: `'npm'`.
    packageManager: string,

    // Path to a directory containing the package to test. By default the current app is tested.
    packageDir: string,

    // Ensures all installed dependencies are specified in `package.json` or `bower.json`.
    // Default: `false`.
    onlySpecified: boolean,

    // If true, on error, instead of failing the task, `npm install` will be invoked for the user.
    // Default: `false`.
    install: boolean,

    // If true, instead of aborting the task after checking (and installing), the task will
    // continueAfterInstall. This option requires `install: true` to work.
    // Default: `false`.
    continueAfterInstall: boolean,
}
```

If you run the task with the `--verbose` flag, it will log non-error messages as well.

For the full list, see [the usage section](https://github.com/mgol/check-dependencies#usage) of the README of the [check-dependencies](https://www.npmjs.org/package/check-dependencies) package.

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

If you want to automatically install missing packages without interrupting the task, you can use:
```js
{
    checkDependencies: {
        this: {
            options: {
                install: true,
                continueAfterInstall: true,
            },
        },
    },
}
```
However, be careful with the `continueAfterInstall` option as the tasks loaded before will not be updated unless re-running the task. This will also be the case with plugins like `load-grunt-tasks`.

## Supported Node.js versions
This project aims to support all Node.js LTS versions in the "active" phase (see [LTS README](https://github.com/nodejs/LTS/blob/master/README.md) for more details) as well as the latest stable Node.js.

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## License
Copyright (c) 2014 Michał Gołębiowski. Licensed under the MIT license.
