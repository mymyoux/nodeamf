/**************************************************************************************************/
//	Nioot classes are very core classes only
//  include : same behaviour than #include in C/C++ (i.e. copy/paste included file into current one
//  requireAll : must be called with module as argument from index.js of a module. It will 
//				 export all present files as submodules. If reload is set to true it will be forced 
// 				 to reread directory files
/**************************************************************************************************/

var file = require("fs");
var path = require("path");
var exclude = [".svn"];
/**
 * Includes a file like #include in many languages
 * @param filename Filename to include
 */
include = function(filename)
{
    if(filename.substring(filename.length-3,filename.length)!=".js")
    {
        filename += ".js"
    }
    console.log("#include : "+filename);
    eval(file.readFileSync(filename)+"");
}
/**
 * Equivalent to write require to all file inside a directory
 * @param object Module
 * @param reload Forces to reload the require calls
 */
requireAll = function(object, reload)
{
    var exports = object.exports;
    var dirname = path.dirname(object.filename);
    var filename = path.basename(object.filename);
    var files;
    if(object.files != undefined && reload!=true)
    {
        files = object.files;
    }else
    {
        files = file.readdirSync(dirname);
    }
    var index;
    if((index = files.indexOf(filename))> -1)
    {
        files.splice(index, 1);
    }
    object.files = files;
    var len = files.length;
    var name;
    for(var i=0; i<len; i++)
    {
        if(exclude.indexOf(files[i])==-1)
        {
            if((index = files[i].indexOf('.')) > -1)
            {
                name = files[i].substring(0, index);
            }else
            {
                name = files[i];
            }
            try
            {
                exports[name] = require(dirname+"/"+files[i]);
            }catch(error)
            {

            }
        }
    }
    return exports;
}
/**
 * Specifies if the given param is a function or not
 * @param functionToCheck Function to test
 * @return true or false
 */
isFunction = function isFunction(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) == '[object Function]';
}
requireAll(module);