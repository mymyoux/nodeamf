function DataOutput(buffer, amf)
{
    this._reset = true;
   if(buffer == undefined)
   {
       var DynBuffer = require("./DynBuffer");
       buffer = new DynBuffer();

   }
   if(amf != undefined)
   {
       this._amf = amf;
       this._reset = false;
   }
   this._buffer = buffer;
}
var p = DataOutput.prototype;
p.writeBoolean = function(value)
{
    this._buffer.writeInt8(value==false || value == undefined?0:1);
};
/**
 * Write Int from [-128; 127]
 * @param value
 */
p.writeByte=function(value)
{
    //force byte to be between [-128; 127]
    value &= 255;
    value = value > 127?value-256:value;
    if(value < 0)
        this._buffer.writeInt8(value);
    else
        this._buffer.writeUInt8(value);
};
p.writeDouble=function(value)
{
    this._buffer.writeDoubleBE(value);
};
p.writeFloat=function(value)
{
    this._buffer.writeFloatBE(value);
};
p.writeShort=function(value)
{
    value &=65535;
    value = value > 32767?value - 65536:value;
    if(value < 0)
        this._buffer.writeInt16BE(value);
    else
        this._buffer.writeUInt16BE(value);
};
p.writeInt=function(value)
{
    value &= 4294967295;
    value = value > 2147483647?value - 4294967295:value;
    if(value < 0)
        this._buffer.writeInt32BE(value);
    else
        this._buffer.writeUInt32BE(value);
};
p.writeUnsignedInt=function(value)
{
    value &= 4294967295;
    value %= 4294967296;
    if(value < 0)
    {
        value += 4294967296;
    }
    this._buffer.writeUInt32BE(value);

};
p.writeUTF=function(value)
{
    if(value != undefined)
    {
        value = unescape( encodeURIComponent(value));
        this._buffer.writeUInt16BE(value.length);
        this.writeUTFBytes(value, true);
    }
};
p.writeUTFBytes=function(value, unescaped)
{
    if(value!=undefined)
    {
        if(unescaped !== true )
        {
            value = unescape( encodeURIComponent(value));
        }
        for(var i=0; i<value.length; i++)
        {
            this._buffer.writeUInt8(value.charCodeAt(i));
        }
    }
};
p.writeObject=function(value)
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
        this._amf.writeObject(value);
    }catch(error)
    {
        console.log(error.stack);
    }
};
p.clone=function()
{
    return new DataOutput(this._buffer.clone());
};
p.__defineGetter__("length", function()
{
    return this._buffer!=undefined?this._buffer.length:0;
});
p.__defineGetter__("bytesAvailable", function()
{
    return this._buffer!=undefined?this._buffer.bytesAvailable:0;
});
module.exports = DataOutput;