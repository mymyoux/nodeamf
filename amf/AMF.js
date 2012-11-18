var net = require("net");
var DynBuffer = require("./DynBuffer");
var ByteArray = require("./ByteArray");
var DataOutput = require("./DataOutput");
var DataInput = require("./DataInput");
var XML = require("./XML");
var XMLDocument = require("./XMLDocument");
var util = require("util");

//AMF3 markers
var Markers = {
"markerUndefined"  :  0x00,
"markerNull"  :  0x01,
"markerFalse"  :  0x02,
"markerTrue"  :  0x03,
"markerInteger"  :  0x04,
"markerDouble"  :  0x05,
"markerString"  :  0x06,
"markerXMLDoc"  :  0x07,
"markerDate"  :  0x08,
"markerArray"  :  0x09,
"markerObject"  :  0x0A,
"markerXML"  :  0x0B,
"markerByteArray"  :  0x0C};

function AMF()
{
    this._buffer = new DynBuffer();
    this._strings = [];
    this._objects = [];
    this._classes = [];
}
AMF.addMapping=function (classInstance, alias)
{
    if(this._mappedClasses == undefined)
    {
        this._mappedClasses = [];
        this._mappedClassesAliases = [];
    }
    if(alias == undefined || alias == "")
    {
        try
        {
            alias = classInstance.hasOwnProperty("getAlias")?classInstance.getAlias():"";
            if(alias == undefined || alias == "")
            {
                alias = ( classInstance.prototype).getAlias();
                if(alias == undefined || alias == "")
                {
                    throw(new Error("error"));
                }
            }
        }catch(error)
        {

            // throw(new Error("You must specify an alias or your class must have a getAlias() function to retrieve it"));
        }
    }
    this._mappedClasses.push(classInstance);
    this._mappedClassesAliases.push(alias);
};
AMF.getMappedClass=function (alias)
{
    if(this._mappedClassesAliases != undefined)
    {
        var index;
        if((index=this._mappedClassesAliases.indexOf(alias))>-1)
        {
            return this._mappedClasses[index];
        }
    }
    return undefined;
};
AMF.hasMappedClass=function (alias)
{
    if(this._mappedClassesAliases!=undefined)
    {
        var index;
        if((index=this._mappedClassesAliases.indexOf(alias))>-1)
        {
            return true;
        }
    }
    return false;
};
var p = AMF.prototype;
/**
 *
 * Resets all registered object of AMF
 * @param clearBuffer If true will clear the buffer too. Default : false
 */
AMF.prototype.reset=function(clearBuffer)
{
    if(clearBuffer === true)
    {
        this._buffer.clear();
    }
    this._strings = [];
    this._objects = [];
    this._classes = [];
};
p.hasNext=function()
{
    return this._buffer.hasNext();
};
p.readNext=function()
{
    return this.readObject();
};
p.readObject=function()
{
    var type = this._buffer.readUInt8();
    var data = null;
    switch(type)
    {
        case Markers.markerUndefined://0
            data = this._readUndefined();
            break;
        case Markers.markerNull://1
            data = this._readNull();
            break;
        case Markers.markerFalse://2
            data = this._readFalse();
            break;
        case Markers.markerTrue://3
            data = this._readTrue();
            break;
        case Markers.markerInteger://4
            data = this._readInteger();
            break;
        case Markers.markerDouble://5
            data = this._readDouble();
            break;
        case Markers.markerString://6
            data = this._readString(true);
            break;
        case Markers.markerXMLDoc://7
            data = this._readXMLDoc();
            break;
        case Markers.markerDate://8
            data = this._readDate();
            break;
        case Markers.markerArray://9
            data = this._readArray();
            break;
        case Markers.markerObject://10
            data = this._readObject();
            break;
        case Markers.markerXML://11
            data = this._readXML();
            break;
        case Markers.markerByteArray://12
            data = this._readByteArray();
            break;
        default :

            throw(new Error("Byte marker["+type+"] is unknown"));
    }
    return data;
};
p.writeObject=function(value)
{

    var type = this._getTypeMarker(value);
    this._buffer.writeUInt8(type);
    switch(type)
    {
        //only markers
        case Markers.markerUndefined://0
        case Markers.markerNull://1
        case Markers.markerFalse://2
        case Markers.markerTrue://3
            break;
        case Markers.markerInteger://4

            this._writeInteger(value);
            break;
        case Markers.markerDouble://5

            this._writeDouble(value);
            break;
        case Markers.markerString://6

            this._writeString(value, true);
            break;
        case Markers.markerXMLDoc://7

            this._writeXMLDoc(value);
            break;
        case Markers.markerDate://8

            this._writeDate(value);
            break;
        case Markers.markerArray://9

            this._writeArray(value);
            break;
        case Markers.markerObject://10

            this._writeObject(value);
            break;
        case Markers.markerXML://11

            this._writeXML(value);
            break;
        case Markers.markerByteArray://12

            //data = this.readObject();
            this._writeByteArray(value);
            break;
        default :

            throw(new Error("Byte marker["+type+"] is unknown"));
    }


    return type;
};
p._getTypeMarker=function(value)
{
    //undefined 0
    if(value === undefined)
    {
        return Markers.markerUndefined;
    }
    //null 1
    if(value == null)
    {
        return Markers.markerNull;
    }
    //ByteArray 12
    if(value instanceof ByteArray)
    {
        return Markers.markerByteArray;
    }
    //Date 8
    if(value instanceof Date)
    {
        return Markers.markerDate;
    }
    //Array 9
    if(util.isArray(value))
    {
        return Markers.markerArray;
    }
    //false 2
    if(value === false)
    {
        return Markers.markerFalse;
    }
    //true 3
    if(value === true)
    {
        return Markers.markerTrue;
    }
    if(value instanceof XML)
    {
        return Markers.markerXML;
    }
    if(value instanceof XMLDocument)
    {
        return Markers.markerXMLDoc;
    }
    //string 6 (must be before numbers)
    if(value === value+"")
    {
        return Markers.markerString;
    }
    //number
    if(!isNaN(parseFloat(value)) && isFinite(value))
    {
        //int 4
        if(parseInt(value) == value && value <= 268435455 && value >= -268435456)
        {
            return Markers.markerInteger;
        }else
        {
            //double 5
            return Markers.markerDouble;
        }
    }
    //Object 10
    return Markers.markerObject;
};
p._readNull=function()
{
    return null;
};
p._readUndefined=function()
{
    return undefined;
};
p._readFalse=function()
{
    return false;
};
p._readTrue=function()
{
    return true;
};
p._readInteger=function()
{
    return this._buffer.readInt29();
};
p._writeInteger=function(value)
{
    this._buffer.writeInt29(value);
};
p._readDouble=function()
{
    return this._buffer.readDoubleBE();
};
p._writeDouble=function(value)
{
    this._buffer.writeDoubleBE(value);
};
p._readString=function(register)
{
    var size = this._readInteger();
    //plain text
    if(size & 1)
    {
        size >>= 1;
        var data = "";

        while(size-->0)
        {
            data+=this._buffer.readChar();
        }
        data = decodeURIComponent(escape(data));
        if(data.length > 0 && register)
        {
            this._strings.push(data);
        }
        return data;
    }else
    {

        return  this._strings[size >> 1];
    }
};
p._writeInteger=function(value)
{
    this._buffer.writeInt29(value);
};
p._writeString=function(value, register)
{
    var index;
    value = unescape( encodeURIComponent(value));
    var size = value.length;

    if(false && register && size > 0 && (index = this._strings.indexOf(value))>-1)
    {
        this._writeInteger((index << 1)|0);

        return;
    }else
    {
        this._writeInteger((size << 1)|1);
    }
    if(size > 0 && register)
    {
        this._strings.push(value);
    }
    var i = -1 ;
    while(++i < size)
    {
        this._buffer.writeUInt8(value.charCodeAt(i));
    }
};
p._readDate=function()
{
    var ref = this._readInteger();
    //plain data
    if(ref & 1)
    {
        var data = new Date();
        data.setTime(this._readDouble());

        this._objects.push(data);
        return data;
    }else
    {

        //clone
        return new Date(this._objects[ref>>1].getTime());
    }
};
p._writeDate=function(value)
{
    var index;
    if((index = this._objects.indexOf(value)) > -1)
    {

        this._writeInteger((index <<1) |0);
        return;
    }else
    {
        this._objects.push(value);
        this._writeInteger(1);
        this._writeDouble(value.getTime());
    }
};
p._readArray=function(register)
{
    var size = this._readInteger();
    if(size & 1)
    {
        if(register == undefined || register)
        {
            this._objects.push(this._buffer.position-1);
        }
        size >>= 1;
        var mixedArrayKey = this._readString(true);


        var data = mixedArrayKey == "" ? [] : {};
        //need to be put before calling readObject (can have reference inside them)


        while (mixedArrayKey != "")
        {
            data[mixedArrayKey] = this.readObject();
            mixedArrayKey = this._readString(true);
        }

        for (var i = 0; i < size; i++)
        {

            data[i] = this.readObject();
        }

        return data;
    }else
    {

        //return this._objects[size>>1];
        var position = this._buffer.position;
        this._buffer.position = this._objects[size>>1];
        var data =  this._readArray(false);
        this._buffer.position = position;
        return data;
    }
};
p._writeArray= function(value)
{
    var size = value.length;
    var index;
    if((index = this._objects.indexOf(value))>-1)
    {
        this._writeInteger((index << 1) | 0);
        return;
    }else
    {
        this._objects.push(value);
        this._writeInteger((size << 1) | 1);
        var keys = [];
        for(var p in value)
        {
            if(!isNaN(parseFloat(p)) && isFinite(p))
            {
                continue;
            }
            keys.push(p);
        }

        for(var i=0; i<keys.length; i++)
        {
            this._writeString(keys[i], true);
            this.writeObject(value[keys[i]]);
        }

        this._writeString("", false);

        for(var i=0; i<size ;i++)
        {
            this.writeObject(value[i]);
        }
    }
};
p._readByteArray=function()
{
    var size = this._readInteger();
    if(size & 1)
    {
        size >>= 1;
        var data = new ByteArray(this._buffer.readBuffer(size));


        this._objects.push(data);
        return data;
    }else
    {

        return this._objects[size>>1].clone();
    }
};
p._writeByteArray=function(value)
{
    var index;
    var size = value.length;
    value = value.toString("base64");
    if((index = this._objects.indexOf(value))>-1)
    {
        this._writeInteger((index << 1));
        return;
    }else
    {
        this._objects.push(value);
        this._writeInteger((size << 1) | 1);
        this._buffer.add(value, "base64");
        this._buffer.position = this._buffer.length;
    }
};
p._writeObject=function(value)
{
    var index;
    if((index = this._objects.indexOf(value))>-1)
    {
        this._writeInteger((index << 1));
        return;
    }else
    {

        var classDef = this._setClassDefinition(value);
        this._objects.push(value);

        if(!classDef.externalizable)
        {
            for(var p in classDef.staticProperties)
            {

                this.writeObject(value[classDef.staticProperties[p]]);

            }
            if(classDef.dynamic)
            {
                for(var i=0; i<classDef.dynamicProperties.length; i++)
                {

                    this._writeString(classDef.dynamicProperties[i], true);
                    this.writeObject(value[classDef.dynamicProperties[i]]);
                }
                this._writeString("", false);
            }
        }else
        {

            var output = new DataOutput(this._buffer, this._amf);
            value.writeExternal(output);

        }

    }
};
p._readObject=function(register)
{
    var ref = this._readInteger();
    var data = {};
    if(ref & 1)
    {
        if(register == undefined || register)
        {
            this._objects.push(this._buffer.position-1);
        }

        var classDef = this._getClassDefinition(ref);

        //non externalizable
        if(classDef == undefined)
        {

            return;
        }
        if( classDef.name == undefined ||classDef.name == "")
        {

            data = {};
        }else
        {
            data = AMF.getMappedClass(classDef.name);
            if(data == undefined)
            {
                data = {};

            }else
            {
                data = new data();
            }
        }

        var len = this._objects.length;
        //  this._objects.push(data);
        if(!classDef.externalizable)
        {
            for (var i = 0; i < classDef.length; i++)
            {
                data[classDef.properties[i]] = this.readObject();
            }
            //dynamic
            if (classDef.dynamic)
            {
                var name;
                while ((name = this._readString(true))!=null && name.length > 0)
                {

                    data[name] = this.readObject();

                }
            }
        }else
        {
            //externalizable
             //TODO: perhaps remove this try/catch or the throw
            try
            {
                var d = new DataInput(this._buffer, this)
                data.readExternal(d);
            }catch(error)
            {
                throw("readObject Error : "+error);
            }
        }


        return data;
    }else
    {

        //return this._objects[(ref >> 1)];
        var position = this._buffer.position;
        this._buffer.position = this._objects[ref>>1];
        var data = this._readObject(false);
        this._buffer.position = position;
        return data;
    }
};
p._readXML=function()
{
    var size = this._readInteger();
    if(size & 1)
    {
        size >>= 1;
        var data = "";

        while(size-->0)
        {
            data+=this._buffer.readChar();
        }
        data = decodeURIComponent(escape(data));
        if(data == "<>")
        {
            data = "<root />";
        }
        this._objects.push(data);
        return new XML(data);
    }else
    {
        return  new XML(this._objects[size >> 1]);
    }
};
p._writeXML = function(value)
{
    var index;
    value = value.toString();
    value = unescape( encodeURIComponent(value));
    var size = value.length;

    if(size > 0 && (index = this._objects.indexOf(value))>-1)
    {
        this._writeInteger((index << 1)|0);

        return;
    }else
    {
        this._writeInteger((size << 1)|1);
    }

    this._objects.push(value);

    var i = -1 ;
    while(++i < size)
    {
        this._buffer.writeUInt8(value.charCodeAt(i));
    }
};
p._readXMLDoc=function()
{
    var size = this._readInteger();
    if(size & 1)
    {
        size >>= 1;
        var data = "";

        while(size-->0)
        {
            data+=this._buffer.readChar();
        }
        data = decodeURIComponent(escape(data));
        if(data == "<>")
        {
            data = "<root />";
        }
        this._objects.push(data);
        return new XMLDocument(data);
    }else
    {
        return  new XMLDocument(this._objects[size >> 1]);
    }
};
p._writeXMLDoc = function(value)
{
    var index;
    value = value + "";
    value = unescape( encodeURIComponent(value));
    var size = value.length;

    if(size > 0 && (index = this._objects.indexOf(value))>-1)
    {
        this._writeInteger((index << 1)|0);

        return;
    }else
    {
        this._writeInteger((size << 1)|1);
    }

    this._objects.push(value);

    var i = -1 ;
    while(++i < size)
    {
        this._buffer.writeUInt8(value.charCodeAt(i));
    }
};
p._setClassDefinition=function(value)
{

    var ref = 3;
    var classDef = {};
    classDef.name = value["getAlias"]!=undefined?value.getAlias():value.constructor.hasOwnProperty("getAlias")?value.constructor.getAlias():"";
    classDef.externalizable = value["writeExternal"]!=undefined?true:false;
    var dynamic = value["isDynamic"]!=undefined?value["isDynamic"]:value.constructor.hasOwnProperty("isDynamic")!=undefined?value.constructor["isDynamic"]:undefined;
    classDef.dynamic = dynamic!=undefined?(!!(dynamic.constructor && dynamic.call && dynamic.apply)?dynamic():dynamic):classDef.name!=""?false:true;
    classDef.staticProperties = [];
    ref |= classDef.externalizable?4:0;
    ref |= classDef.dynamic?8:0;
    classDef.staticPropertiesKey = value["getStaticProperties"]!=undefined?value.getStaticProperties():value.constructor.hasOwnProperty("getStaticProperties")?value.constructor.getStaticProperties():undefined
    if(classDef.dynamic)
    {
        classDef.staticPropertiesKey = classDef.staticPropertiesKey == undefined ? []: classDef.staticPropertiesKey ;
        classDef.dynamicProperties = [];
    }
    if(!classDef.externalizable)
    {
        for(var p in value)
        {

            if(!(value[p] && value[p].constructor && value[p].call && value[p].apply) && p.substring(0, 2)!="__")
            {

                if(!classDef.dynamic || classDef.staticPropertiesKey  == undefined || classDef.staticPropertiesKey.indexOf(p)>-1)
                {
                    classDef.staticProperties.push(p);
                }else
                {
                    if(classDef.dynamic )
                    {
                        classDef.dynamicProperties.push(p);
                    }
                }
            }
        }

        ref |= classDef.staticProperties.length << 4;
    }
    for(var i=0; i<this._classes.length; i++)
    {

        if(classDef ==  this._classes[i])
        {

            return (i << 2) | 1;
        }
    }
    this._writeInteger(ref);
    this._writeString(classDef.name, true);
    if(!classDef.externalizable)
    {
        for(var i=0; i<classDef.staticProperties.length; i++)
        {

            this._writeString(classDef.staticProperties[i], true);
        }
    }

    this._classes.push(classDef);
    return classDef;
};
p._getClassDefinition=function(ref)
{
    var classDef = {};
    if(ref & 2)
    {
        //find current classDef
        classDef.name = this._readString(true);
    }else
    {
        return this._classes[ref>>2];
    }
    classDef.dynamic = ref & 8;
    classDef.externalizable = ref & 4;
    classDef.length = ref >> 4;
    classDef.properties = [];

    for (var i=0; i<classDef.length; i++)
    {
        classDef.properties.push(this._readString(true));
    }
    this._classes.push(classDef);
    return classDef;
};
module.exports = AMF;