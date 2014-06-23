'use strict';

var fs = require('fs-extra'),
    assert = require('assert'),
    semver = require('semver'),
    exec = require('child_process').exec;

describe('Task: checkDependencies', function () {
    it('should not print anything for valid package setup', function (done) {
        this.timeout(10000);
        exec('grunt checkDependencies:ok', function (error) {
            assert.equal(error, null);
            done();
        });
    });

    it('should error on invalid package setup', function (done) {
        this.timeout(10000);
        exec('grunt checkDependencies:notOk', function (error) {
            assert.notEqual(error, null);
            done();
        });
    });

    it('should install missing packages when `install` is set to true', function (done) {
        this.timeout(30000);

        var versionRange = require('./not-ok-install/package.json').dependencies.minimatch,
            version = JSON.parse(fs.readFileSync(__dirname +
                '/not-ok-install/node_modules/minimatch/package.json')).version;

        assert.equal(semver.satisfies(version, versionRange),
            false, 'Expected version ' + version + ' not to match ' + versionRange);

        fs.remove(__dirname + '/not-ok-install-copy', function (error) {
            assert.equal(error, null);
            fs.copy(__dirname + '/not-ok-install', __dirname + '/not-ok-install-copy',
                function (error) {
                    assert.equal(error, null);
                    exec('grunt checkDependencies:notOkCopyInstall', function (error) {
                        // The first install is supposed to not fail because it's instructed to do
                        // npm install.
                        assert.equal(error, null);
                        exec('grunt checkDependencies:notOkCopy', function (error) {
                            // The second one would fail if there are mismatched packages since it's not
                            // invoked with `install: true`.
                            assert.equal(error, null);
                            version = JSON.parse(fs.readFileSync(__dirname +
                                '/not-ok-install-copy/node_modules/minimatch/package.json')).version;
                            assert(semver.satisfies(version, versionRange),
                                'Expected version ' + version + ' to match ' + versionRange);
                            done();
                        });
                    });
                });
        });
    });
});
