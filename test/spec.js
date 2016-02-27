'use strict';

const fs = require('fs-extra');
const assert = require('assert');
const semver = require('semver');
const exec = require('child_process').exec;

describe('Task: checkDependencies', () => {
    it('should not print anything for valid package setup', function (done) {
        this.timeout(10000);
        exec('grunt checkDependencies:ok', error => {
            assert.equal(error, null);
            done();
        });
    });

    it('should error on invalid package setup', function (done) {
        this.timeout(10000);
        exec('grunt checkDependencies:notOk', error => {
            assert.notEqual(error, null);
            done();
        });
    });

    it('should error if `continueAfterInstall: true` is specified without ' +
        '`install: true`', function (done) {
        this.timeout(10000);
        exec('grunt checkDependencies:continueWithoutInstall', error => {
            assert.notEqual(error, null);
            done();
        });
    });

    it('should install missing packages when `install` is set to true', function (done) {
        this.timeout(30000);

        const versionRange = require('./not-ok-install/package.json').dependencies.minimatch;
        const version = JSON.parse(fs.readFileSync(`${ __dirname
            }/not-ok-install/node_modules/minimatch/package.json`)).version;

        assert.equal(semver.satisfies(version, versionRange), false,
            `Expected version ${ version } not to match ${ versionRange }`);

        fs.remove(`${ __dirname }/not-ok-install-copy`, error => {
            assert.equal(error, null);
            fs.copy(`${ __dirname }/not-ok-install`, `${ __dirname }/not-ok-install-copy`,
                error => {
                    assert.equal(error, null);
                    exec('grunt checkDependencies:notOkCopyInstall', error => {
                        assert.notEqual(error, null);
                        exec('grunt checkDependencies:notOkCopy', error => {
                            // The second one would fail if there are mismatched packages since
                            // it's not invoked with `install: true`.
                            assert.equal(error, null);
                            const newVersion = JSON.parse(fs.readFileSync(`${ __dirname
                                }/not-ok-install-copy/node_modules/minimatch/package.json`))
                                .version;
                            assert(semver.satisfies(newVersion, versionRange),
                                `Expected version ${ newVersion } to match ${ versionRange }`);
                            done();
                        });
                    });
                });
        });
    });

    it('should install missing packages and continue when `install` and `continueAfterInstall`' +
        ' are set to true',
        function (done) {
            this.timeout(30000);

            const versionRange = require('./not-ok-install/package.json').dependencies.minimatch;
            const version = JSON.parse(fs.readFileSync(`${ __dirname
                }/not-ok-install/node_modules/minimatch/package.json`)).version;

            assert.equal(semver.satisfies(version, versionRange), false,
                `Expected version ${ version } not to match ${ versionRange }`);

            fs.remove(`${ __dirname }/not-ok-install-copy`, error => {
                assert.equal(error, null);
                fs.copy(`${ __dirname }/not-ok-install`, `${ __dirname }/not-ok-install-copy`,
                    error => {
                        assert.equal(error, null);
                        exec('grunt checkDependencies:notOkCopyInstallContinueAfterInstall',
                            error => {
                                assert.equal(error, null);
                                done();
                            }
                        );
                    });
            });
        });

    // Deprecated.
    it('should install missing packages and continue when `install` and `continue`' +
        ' are set to true',
        function (done) {
            this.timeout(30000);

            const versionRange = require('./not-ok-install/package.json').dependencies.minimatch;
            const version = JSON.parse(fs.readFileSync(`${ __dirname
                }/not-ok-install/node_modules/minimatch/package.json`)).version;

            assert.equal(semver.satisfies(version, versionRange), false,
                `Expected version ${ version } not to match ${ versionRange }`);

            fs.remove(`${ __dirname }/not-ok-install-copy`, error => {
                assert.equal(error, null);
                fs.copy(`${ __dirname }/not-ok-install`, `${ __dirname }/not-ok-install-copy`,
                    error => {
                        assert.equal(error, null);
                        exec('grunt checkDependencies:notOkCopyInstallContinue',
                            error => {
                                assert.equal(error, null);
                                done();
                            }
                        );
                    });
            });
        });
});
