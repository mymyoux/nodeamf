var Log = require("debug");
var log = new Log.Log();
var id = 0;
function TestDyn()
{
    this.id = id++;
    this.dyna = "yes";
}
var p = TestDyn.prototype;
TestDyn.getAlias = function()
{
    return "nioot.io.niootclient::TestDyn";
};
p.isDynamic = function()
{
    return true;
}
p.getStaticProperties = function()
{
    return ["id"];
}
p.toString = function()
{
    return "[Super TestDyn! "+this.id+"]";
};
module.exports = TestDyn;