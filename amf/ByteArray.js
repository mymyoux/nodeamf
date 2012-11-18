var DynBuffer = require("./DynBuffer");
var zlib = require("zlib");

/**
 * Creates a ByteArray
 * @param buffer Buffer data. It could be Buffer, DynBuffer or string data, others types are not tested/supported
 * @param encoding If buffer is String you should specify its encoding, by default utf8 is used
 */
function ByteArray(buffer, encoding)
{
    if(buffer instanceof DynBuffer)
    {
        this._buffer = buffer;
    }else
    {
        this._buffer = new DynBuffer();
        if(buffer != undefined)
        {
            this._buffer.write(buffer, encoding);
        }
    }
    var DataInput = require("./DataInput");
    var DataOutput = require("./DataOutput");
    this._reader = new DataInput(this._buffer);
    this._writer = new DataOutput(this._buffer);
    this._uncompressMode = ["unzip", "inflateRaw"];
    this._compressMode = ["deflateRaw"];
}
var p = ByteArray.prototype;
/**
 * Async. Compress current ByteArray. This byteArray will be modified
 * @param callback [optional] Callback function(boolean success, ByteArray byteArray) called when the compression is complete or failed
 * @param algorithm [optional] Compression mode (currently only deflateRaw is supported) or compression id (0 deflateRaw). If it is set to -1 it will not decompress
 * the buffer but send it to the callback with success. Default : 0
 * @param buffer [optional] Should not be set (used for internal mechanisms) but if a buffer is given it will be used for decompression and will fill current ByteArray if it succeed.
 */
p.compress = function(callback, algorithm, buffer)
{
    //todo
    try
    {
        var idMode = algorithm!=undefined ? !isNaN(parseFloat(algorithm)) && isFinite(algorithm)?algorithm:algorithm==undefined?0:-1:0;
        if(idMode >= this._compressMode.length || idMode < -1)
        {
            throw(new Error("You specified an id for compression incorrect : "+idMode+" should be in [0;"+(this._uncompressMode.length-1)+"]"));
        }
        var compressionMode = idMode>-1 ? this._compressMode[idMode] : algorithm;

        if((compressionMode == undefined || compressionMode == -1 )&& idMode == -1)
        {
            if(buffer != undefined)
            {
                this._buffer.clear();
                this._buffer.add(buffer);
            }
            if(callback != undefined)
            {
                callback(true, this);
            }
            return;
        }
        buffer = buffer == undefined ? this._buffer.toBuffer(): buffer;
        if(buffer.length == 0)
        {
            this.clear();
            if(callback != undefined)
            {
                callback(true, this);
            }
        }
        var self = this;
        zlib[compressionMode](buffer, function(err, buf) {
            if(callback != undefined)
            {
                if(err == null && buf.length > 0)
                {
                    self._buffer.clear();
                    self._buffer.add(buf);
                    callback(true, self);
                }else
                {
                    callback(false, err);
                }
            }
        });
    }catch(error)
    {
        console.log(error.stack);
    }
}

/**
 * Async. Decompress current ByteArray. This byteArray will be modified
 * @param callback [optional] Callback function(boolean success, ByteArray byteArray) called when the decompression is complete or failed
 * @param algorithm [optional] Decompression mode (currently only unzip and inflateRaw are supported) or compression id (0 for unzip and 1 for inflateRaw). If it is set to -1 it will not decompress
 * the buffer but send it to the callback with success.
 * @param buffer [optional] Should not be set (used for internal mechanisms) but if a buffer is given it will be used for decompression and will fill current ByteArray if it succeed.
 * If not set it will try all available decompression mode starting with id = 0 until one succeed or until all has been tried.
 */
p.decompress = function(callback, algorithm, buffer)
{

    var idMode = algorithm!=undefined ? !isNaN(parseFloat(algorithm)) && isFinite(algorithm)?algorithm:-1:0;
    if(idMode >= this._uncompressMode.length || idMode < -1)
    {
        throw(new Error("You specified an id for compression incorrect : "+idMode+" should be in [0;"+(this._uncompressMode.length-1)+"]"));
    }
    var compressionMode = idMode>-1 ? this._uncompressMode[idMode] : algorithm;
    if((compressionMode == undefined || compressionMode == -1 )&& idMode == -1)
    {
        if(buffer != undefined)
        {
            this._buffer.clear();
            this._buffer.add(buffer);
        }
        if(callback != undefined)
        {
            callback(true, this);
        }
        return;
    }
    var self = this;
    buffer = buffer == undefined ? this._buffer.toBuffer(): buffer;
    if(buffer.length == 0)
    {
        this.clear();
        if(callback != undefined)
        {
            callback(true, this);
        }
    }
    zlib[compressionMode](buffer, function(err, buf) {
        if(err || buf.length == 0)
        {
            //error
            if(idMode > -1 && idMode < self._uncompressMode.length-1)
            {
                return self.decompress(callback, idMode+1, buffer);
            }else
            {
                if(callback != undefined)
                {
                    callback(false, self);
                }
            }
        }else
        {
            self._buffer.clear();
            self._buffer.add(buf);
            if(callback != undefined)
            {
                callback(true, self);
            }
        }
    });
};
p.writeBytes = function(byteArray, offset, length)
{
    if(byteArray != undefined)
    {
        if(offset == undefined || offset < 0)
        {
            offset = 0;
        }
        if(length == undefined || length > byteArray.length)
        {
            length = byteArray.length;
        }
        if(offset < byteArray.length)
        {
            this._buffer.add(byteArray.toString("base64", offset, offset+length),"base64");
        }
    }
};
p.clear = function()
{
    this._buffer.clear();
},
p.readBoolean = function()
{
    return this._reader.readBoolean();
};
p.writeBoolean = function(value)
{
    this._writer.writeBoolean(value);
};
p.readInt = function()
{
    return this._reader.readInt();
};
p.writeInt = function(value)
{
    this._writer.writeInt(value);
};
p.readByte = function()
{
    return this._reader.readByte();
};
p.writeByte = function(value)
{
    this._writer.writeByte(value);
};
p.readUnsignedByte = function()
{
    return this._reader.readUnsignedByte();
};
p.writeUnsignedByte = function(value)
{
    this._writer.writeUnsignedByte(value);
};
p.readDouble = function()
{
    return this._reader.readDouble();
};
p.writeDouble = function(value)
{
    this._writer.writeDouble(value);
};
p.readFloat = function()
{
    return this._reader.readFloat();
};
p.writeFloat = function(value)
{
    this._writer.writeFloat(value);
};
p.readShort = function()
{
    return this._reader.readShort();
};
p.writeShort = function(value)
{
    this._writer.writeShort(value);
};
p.readUnsignedShort = function()
{
    return this._reader.readUnsignedShort();
};
p.writeUnsignedShort = function(value)
{
    this._writer.writeUnsignedShort(value);
};
p.readUnsignedInt = function()
{
    return this._reader.readUnsignedInt();
};
p.writeUnsignedInt = function(value)
{
    this._writer.writeUnsignedInt(value);
};
p.readUTF = function()
{
    return this._reader.readUTF();
};
p.writeUTF = function(value)
{
    this._writer.writeUTF(value);
};
p.readUTFBytes = function(size)
{
    return this._reader.readUTFBytes(size);
};
p.writeUTFBytes = function(value)
{
    this._writer.writeUTFBytes(value);
};
p.readObject = function()
{
    return this._reader.readObject();
};
p.writeObject = function(value)
{
    this._writer.writeObject(value);
};
p.__defineGetter__("position", function()
{
    return this._buffer!=undefined?this._buffer.position:0;
});
p.__defineSetter__("position", function(position)
{
    if(this._buffer != undefined)
    {
        this._buffer.position = position;
    }
});
p.__defineGetter__("length", function()
{
    return this._buffer!=undefined?this._buffer.length:0;
});
p.__defineGetter__("bytesAvailable", function()
{
    return this._buffer!=undefined?this._buffer.bytesAvailable:0;
});
p.clone = function()
{
    return new ByteArray(this._buffer.clone());
};
p.toString = function(encoding, start, end)
{
    return encoding == undefined && start == undefined && end == undefined ? "[ByteArray length=\""+this._buffer.length+"\"]":this._buffer.toString(encoding, start, end==undefined?end:end-start);
};
module.exports = ByteArray;