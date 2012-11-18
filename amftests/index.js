var tests =
{
    init:function()
    {
        var reporter = require('nodeunit').reporters.default;
        var dirname = __dirname;
        process.chdir(dirname);
        reporter.run(['./ByteArrayTests.js']);
        process.chdir(dirname);
    }
}
module.exports = tests;