function DataInput(buffer, amf)
{
    this._reset = true;
    if(amf != undefined)
    {
        this._amf = amf;
        this._reset = false;
    }
    if(buffer == undefined)
   {
       var DynBuffer = require("./DynBuffer");
       buffer = new DynBuffer();

   }
    this._buffer = buffer;
}
var p = DataInput.prototype;

p.readBoolean=function()
{
    return this._buffer.readUInt8() == 1;
};
p.readInt=function()
{
    return this._buffer.readInt32BE();
};
p.readByte=function()
{
    return this._buffer.readInt8();
};
p.readUnsignedByte=function()
{
    return this._buffer.readUInt8();
};
p.readDouble=function()
{
    return this._buffer.readDoubleBE();
};
p.readFloat=function()
{
    return this._buffer.readFloatBE();
};
p.readShort=function()
{
    return this._buffer.readInt16BE();
};
p.readUnsignedShort=function()
{
    return this._buffer.readUInt16BE();
};
p.readUnsignedInt=function()
{
    return this._buffer.readUInt32BE();
};
p.readUTF=function()
{
    return this.readUTFBytes(this._buffer.readUInt16BE());
};
p.readUTFBytes=function(size)
{
    if(size <= 0 || size == undefined)
    {
        return "";
    }else
    {
        var data = "";
        while(size-->0)
        {
            data+=String.fromCharCode(this._buffer.readUInt8());
        }
        return decodeURIComponent(escape(data));
    }
};
p.readObject=function()
{
    try
    {
        if(this._amf == undefined)
        {
            var AMF = require("./AMF");
            this._amf = new AMF();
        }else
        {
            if(this._reset)
            {
                this._amf.reset();
            }
        }
        this._amf._buffer = this._buffer;
        return this._amf.readObject();
    }catch(error)
    {
       throw(error);
    }
};
p.clone=function()
{
    return new DataInput(this._buffer.clone());
};
p.__defineGetter__("length", function()
{
    return this._buffer!=undefined?this._buffer.length:0;
});
p.__defineGetter__("bytesAvailable", function()
{
    return this._buffer!=undefined?this._buffer.bytesAvailable:0;
});
module.exports = DataInput;