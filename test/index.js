var assert = require("assert");
var path = require("path");
var webpack = require("webpack");

var CaseSensitivePathsPlugin = require("../");

describe("CaseSensitivePathsPlugin", function() {

    it("should compile and warn on wrong filename case", function(done) {
        webpack({
            context: path.join(__dirname, "fixtures", "wrong-case"),
            target: "node",
            output: {
                path: path.join(__dirname, "js"),
                filename: "result.js",
            },
            entry: "./entry",
            plugins: [
                new CaseSensitivePathsPlugin()
            ]
        }, function(err, stats) {
            if (err) done(err);
            assert(stats.hasErrors());
            assert.equal(stats.hasWarnings(), false);
            var jsonStats = stats.toJson();
            assert.equal(jsonStats.errors.length, 1);

            var error = jsonStats.errors[0].split("\n");
            // check that the plugin produces the correct output
            assert(error[1].indexOf('[CaseSensitivePathsPlugin]') > -1);
            assert(error[1].indexOf('TestFile.js') > -1); // wrong file require
            assert(error[1].indexOf('testfile.js') > -1); // actual file name

            done();
        });
    });
});
