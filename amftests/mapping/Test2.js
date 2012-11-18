var Log = require("debug");
var log = new Log.Log();
var id = 0;
function Test2()
{
    this.id = id++;
}
var p = Test2.prototype;
Test2.getAlias = function()
{
    return "nioot.io.niootclient::Test2";
};
p.toString = function()
{
    return "[Super test2! "+this.id+"]";
};
module.exports = Test2;