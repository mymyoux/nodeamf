
var DEFAULT_SIZE_WRITING_BUFFER = 100;
var MAX_INT_29= 0x0FFFFFFF;
var MIN_INT_29 = -0x10000000;
/**
 * Buffer with dynamic size
 */
function DynBuffer()
{
    /**
     * Buffers
     */
    this._buffers = [];
    /**
     * Global offset
     */
    this._offset = 0;
    /**
     * Current Buffer Offset
     */
    this._currentOffset = 0;
    /**
     * Current Buffer
     */
    this._currentBuffer = 0;
    /**
     * Number of bytes
     */
    this._length = 0;
    /**
     * Size of each buffer
     */
    this._lengths = [];
    this._writingBuffer = undefined;
    this._writingBufferLength = 0;
}
var p = DynBuffer.prototype;
/**
 * Clear buffer data and reset offset
 */
p.clear = function()
{
    this.rewind();
    this._writingBuffer = undefined;
    this._writingBufferLength = 0;
    this._buffers = [];
    this._length = 0;
    this._lengths = [];
};
/**
 * Adds writing buffer into buffers arrays
 */
p._freezeWritingBuffer = function()
{
    if(this._writingBufferLength > 0)
    {
        var len = this._writingBufferLength;
        this._writingBufferLength = 0;
        this.add(this._writingBuffer.slice(0, len));
        this._writingBuffer = undefined;
    }
};
/**
 * Adds writing buffer into buffers arrays depending of the offset
 */
p._freezeWritingBufferRelatingToOffset = function()
{
    if(this._writingBufferLength > 0 && this._offset >= this._length - 4)
    {
        var len = this._writingBufferLength;
        this._writingBufferLength = 0;
        this.add(this._writingBuffer.slice(0, len));
        this._writingBuffer = undefined;
    }
};
/**
 * Adds data or buffer at the end of this buffer
 * @param data Raw data or buffer
 * @param encoding used to convert raw data into buffer. Currently ascii, binary, ucs2, hex,  utf8 or base64 are supported. (same as supported buffer encoding)
 */
p.write = function(data, offset, length, encoding)
{
    if(data != undefined)
    {
        this._freezeWritingBuffer();
        if(encoding == undefined || (encoding+"").length == 0)
        {
            if(length != undefined && (isNaN(parseFloat(length)) || isFinite(length)) && (length+"").length>0)
            {
                encoding = length;
            }else
            {
                if(offset != undefined && (isNaN(parseFloat(offset)) || isFinite(offset)) && (offset+"").length>0)
                {
                    encoding = offset;
                }else
                {
                    encoding = "utf8";
                }
            }
        }
        if(offset == undefined || isNaN(parseFloat(offset)) || isFinite(offset))
        {
            offset = 0;
        }
        if(length == undefined || isNaN(parseFloat(length)) || isFinite(length))
        {
            length = this._length - offset;
        }
        if(encoding == undefined)
        {
            encoding = "utf8";
        }
        if(!Buffer.isBuffer(data))
        {
            data = new Buffer(data, encoding);

        }
        var buffers = [];
        if(offset > 0)
        {
            buffers.push(this.extract(0, offset));
        }
        buffers.push(data);
        if(length < this._length)
        {
            buffers.push(this.extract(offset+length, this._length));
        }
        this.clear();
        for(var i=0; i<buffers.length; i++)
        {
            this.add(buffers[i]);
        }

    }
 /*   this._length+=data.length;
    this._buffers.push(data);
    this._lengths.push(this._length);*/
};
/**
 * Adds data to the end of this buffer. <strong>Doesn't move position</strong>
 * @param data Raw data or Buffer.
 * @param encoding used to convert raw data into buffer. Currently ascii, binary, ucs2, hex,  utf8 or base64 are supported. (same as supported buffer encoding)
 */
p.add = function(data, encoding)
{
    if(data != undefined)
    {
        this._freezeWritingBuffer();
        if(encoding == undefined)
        {
            encoding = "utf8";
        }
        if(!Buffer.isBuffer(data))
        {
            if(data instanceof DynBuffer)
            {
                data = data.toString("base64");
                encoding = "base64";
            }
            data = new Buffer(data, encoding);
        }
        this._length+=data.length;
        this._buffers.push(data);
        this._lengths.push(this._length);
    }
};
/**
 * Gets a buffer extracted from this buffer
 * @param start Start position
 * @param length Length of new buffer
 */
p.splice = function(start, length)
{
    return this.extract(start, length);
};
/**
 * Gets a buffer extracted from this buffer
 * @param start Start position
 * @param length Length of new buffer
 */
//ERROR!
p.extract = function(start, length)
{

    this._freezeWritingBuffer();
    if(start == undefined)
    {
        start = 0;
    }
    if(length == undefined)
    {
        length = this._length;
    }
    length = length>this._length-start?this._length-start:length;
    var data = new Buffer(length);

    var offsetData =  0;
    if(start>=this._length)
    {
        return data;
    }
    for(var i=0; i<this._lengths.length; i++)
    {
        if(this._lengths[i]>=start)
        {
            break;
        }
    }
    var startPosition = start;
    if(i > 0)
    {
        startPosition = this._lengths[i]-start;
        startPosition = this._buffers[i].length - startPosition - 1;
    }
    var readLength = this._buffers[i].length - startPosition;
    if(readLength > length)
    {
        readLength = length;
    }
    length -= readLength;
    this._buffers[i].copy(data, offsetData, startPosition,  readLength+startPosition);
    offsetData+= readLength;
    while(length > 0 && i <this._length.length)
    {
        i++;
        startPosition = 0;
        readLength = this._buffers[i].length;
        if(readLength > length)
        {
            readLength = length;
        }
        length -= readLength;
        this._buffers[i].copy(data, offsetData, startPosition,  readLength+startPosition);
        offsetData+= readLength;

    }
    var buffer = new DynBuffer();
    buffer.write(data);
    return buffer;

};
p.readBuffer = function(size)
{
    var buffer = this.extract(this._offset, size);
    this.position+=buffer.length;
    return buffer;
};
p.readChar = function()
{
    return String.fromCharCode(this.readUInt8());
};
p.writeChar = function(value)
{
    if(value != undefined && (value+"").length > 0)
    {
        this.writeUInt8((value+"").charCodeAt(0));
    }
};
p.readUInt8 = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            this._offset++;
            return this._buffers[this._currentBuffer].readUInt8(this._currentOffset++);
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            return this.readUInt8();
        }
    }
    throw(new Error("You tried to read outside buffer boundaries..."));
};
p.writeUInt8 = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            this._offset++;
            this._buffers[this._currentBuffer].writeUInt8(value, this._currentOffset++);
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeUInt8(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(100);
            this._writingBufferLength = 0;
        }
        if(this._offset + 1 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeUInt8(value,  this._currentOffset);
        this._offset++;
        this._currentOffset++;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readInt8 = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            this._offset++;
            return this._buffers[this._currentBuffer].readInt8(this._currentOffset++);
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            return this.readInt8();
        }
    }
    throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeInt8 = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            this._offset++;
            this._buffers[this._currentBuffer].writeInt8(value, this._currentOffset++);
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeInt8(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset  + 1 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeInt8(value,  this._currentOffset);
        this._offset++;
        this._currentOffset++;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readDoubleBE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+8)
            {
                this._offset+=8;
                var data = this._buffers[this._currentBuffer].readDoubleBE(this._currentOffset);
                this._currentOffset+=8;
                return data;
            }else
            {
                var buffer = new Buffer(8);
                for(var i=0; i<8; i++)
                {
                    buffer.writeUInt8(this.readUInt8(), i);
                }
                return buffer.readDoubleBE(0);
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            return this.readDoubleBE();
        }
    }
    throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeDoubleBE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+8)
            {
                this._offset+=8;
                this._buffers[this._currentBuffer].writeDoubleBE(value, this._currentOffset);
                this._currentOffset+=8;
            }else
            {
                var buffer = new Buffer(8);
                buffer.writeDoubleBE(value, 0);
                for(var i=0; i<8; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeDoubleBE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 8 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeDoubleBE(value,  this._currentOffset);
        this._offset+=8;
        this._currentOffset+=8;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readFloatBE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
            {
                this._offset+=4;
                var data = this._buffers[this._currentBuffer].readFloatBE(this._currentOffset);
                this._currentOffset+=4;
                return data;
            }
            else
            {
                var buffer = new Buffer(4);
                for(var i=0; i<4; i++)
                {
                    buffer.writeUInt8(this.readUInt8(), i);
                }
                return buffer.readFloatBE(0);
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            return this.readFloatBE();
        }
    }
    throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeFloatBE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
            {
                this._offset+=4;
                this._buffers[this._currentBuffer].writeFloatBE(value, this._currentOffset);
                this._currentOffset+=4;
            }else
            {
                var buffer = new Buffer(4);
                buffer.writeFloatBE(value, 0);
                for(var i=0; i<4; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeFloatBE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 4 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeFloatBE(value,  this._currentOffset);
        this._offset+=4;
        this._currentOffset+=4;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readInt32BE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
   {
       if(this._buffers[this._currentBuffer].length > this._currentOffset)
       {
           if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
           {
               this._offset+=4;
               var data = this._buffers[this._currentBuffer].readInt32BE(this._currentOffset);
               this._currentOffset+=4;
               return data;
           }else
           {
               var buffer = new Buffer(4);
              for(var i=0; i<4; i++)
              {
                  buffer.writeUInt8(this.readUInt8(), i);
              }
              return buffer.readInt32BE(0);
           }
       }else
       {
           this._currentOffset = 0;
           this._currentBuffer++;
           return this.readInt32BE();
       }
   }
   throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeInt32BE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
            {
                this._offset+=4;
                this._buffers[this._currentBuffer].writeInt32BE(value, this._currentOffset);
                this._currentOffset+=4;
            }else
            {
                var buffer = new Buffer(4);
                buffer.writeInt32BE(value, 0);
                for(var i=0; i<4; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeInt32BE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 4 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeInt32BE(value,  this._currentOffset);
        this._offset+=4;
        this._currentOffset+=4;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readUInt32BE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
   {
       if(this._buffers[this._currentBuffer].length > this._currentOffset)
       {
           if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
           {
               this._offset+=4;
               var data = this._buffers[this._currentBuffer].readUInt32BE(this._currentOffset);
               this._currentOffset+=4;
               return data;
           }else
           {
              var buffer = new Buffer(4);
              for(var i=0; i<4; i++)
              {
                  buffer.writeUInt8(this.readUInt8(), i);
              }
              return buffer.readUInt32BE(0);
           }
       }else
       {
           this._currentOffset = 0;
           this._currentBuffer++;
           return this.readUInt32BE();
       }
   }
   throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeUInt32BE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
            {
                this._offset+=4;
                this._buffers[this._currentBuffer].writeUInt32BE(value, this._currentOffset);
                this._currentOffset+=4;
            }else
            {
                var buffer = new Buffer(4);
                buffer.writeUInt32BE(value, 0);
                for(var i=0; i<4; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeUInt32BE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 4 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeUInt32BE(value,  this._currentOffset);
        this._offset+=4;
        this._currentOffset+=4;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readInt16BE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
   {
       if(this._buffers[this._currentBuffer].length > this._currentOffset)
       {
           if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
           {
               this._offset+=2;
               var data = this._buffers[this._currentBuffer].readInt16BE(this._currentOffset);
               this._currentOffset+=2;
               return data;
           }else
           {
                var buffer = new Buffer(2);
                for(var i=0; i<2; i++)
                {
                 buffer.writeUInt8(this.readUInt8(), i);
                }
                return buffer.readInt16BE(0);
           }
       }else
       {
           this._currentOffset = 0;
           this._currentBuffer++;
           return this.readInt16BE();
       }
   }
   throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeInt16BE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+2)
            {
                this._offset+=2;
                this._buffers[this._currentBuffer].writeInt16BE(value, this._currentOffset);
                this._currentOffset+=2;
            }else
            {
                var buffer = new Buffer(2);
                buffer.writeInt16BE(value, 0);
                for(var i=0; i<2; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeInt16BE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 2 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeInt16BE(value,  this._currentOffset);
        this._offset+=2;
        this._currentOffset+=2;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
p.readUInt16BE = function()
{
    this._freezeWritingBufferRelatingToOffset();
    if(this._buffers.length > this._currentBuffer)
   {
       if(this._buffers[this._currentBuffer].length > this._currentOffset)
       {
           if(this._buffers[this._currentBuffer].length > this._currentOffset+4)
           {
               this._offset+=2;
               var data = this._buffers[this._currentBuffer].readUInt16BE(this._currentOffset);
               this._currentOffset+=2;
               return data;
           }else
           {
                var buffer = new Buffer(2);
                for(var i=0; i<2; i++)
                {
                 buffer.writeUInt8(this.readUInt8(), i);
                }
                return buffer.readUInt16BE(0);
           }
       }else
       {
           this._currentOffset = 0;
           this._currentBuffer++;
           return this.readUInt16BE();
       }
   }
   throw(new Error("You tried to read outside buffer boundaries"));
};
p.writeUInt16BE = function(value)
{

    if(this._buffers.length > this._currentBuffer)
    {
        if(this._buffers[this._currentBuffer].length > this._currentOffset)
        {
            if(this._buffers[this._currentBuffer].length > this._currentOffset+2)
            {
                this._offset+=2;
                this._buffers[this._currentBuffer].writeUInt16BE(value, this._currentOffset);
                this._currentOffset+=2;
            }else
            {
                var buffer = new Buffer(2);
                buffer.writeUInt16BE(value, 0);
                for(var i=0; i<2; i++)
                {
                    this.writeInt8(buffer.readInt8(i));
                }
            }
        }else
        {
            this._currentOffset = 0;
            this._currentBuffer++;
            this.writeUInt16BE(value);
        }
    }else
    {
        if(this._writingBuffer == undefined)
        {
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        if(this._offset + 2 >= this._length + this._writingBuffer.length)
        {
             this._freezeWritingBuffer();
            this._currentOffset = 0;
            this._currentBuffer++;
            this._writingBuffer = new Buffer(DEFAULT_SIZE_WRITING_BUFFER);
            this._writingBufferLength = 0;
        }
        this._writingBuffer.writeUInt16BE(value,  this._currentOffset);
        this._offset+=2;
        this._currentOffset+=2;
        this._writingBufferLength = this._writingBufferLength > this._currentOffset?this._writingBufferLength:this._currentOffset;
    }
};
/**
 * Reads 29 bits int
 * @see http://download.macromedia.com/pub/labs/amf/amf3_spec_121207.pdf for more information
 */
p.readInt29 = function()
{
    var data = this.readUInt8() & 255;
    //2 bytes or more
    if(data & 128)
    {
      data = (data ^128) <<7;
      var d = this.readUInt8() & 255;
      //3 bytes or more
      if(d & 128)
      {
          data = (data|(d ^ 128)) <<7;
          d = this.readUInt8() & 255;
          //4 bytes
          if(d & 128)
          {
              data = (data|(d ^ 128)) <<8;
              d = this.readUInt8() & 255;
              data |= d;
              //negative
              if(data & 0x10000000)
              {
                  data |= 0xe0000000;
              }
          }else
          {
              data |=d;
          }
      }else
      {
          data |=d;
      }
    }
    return data;
};

p.writeInt29 = function(value)
{

    if(value != undefined)
    {
        if(value < MIN_INT_29 || value > MAX_INT_29)
        {
            throw(new Error("Int must be between "+ MIN_INT_29+" and "+ MAX_INT_29+ " but got "+value+" instead"));
        }
        value += value < 0 ? 0x20000000 : 0;
        var tmp = undefined;
        if (value > 0x1fffff)
        {
            tmp = value;
            value >>= 1
            this.writeUInt8(0x80 | ((value >> 21) & 0xff));
        }

        if (value > 0x3fff)
        {
          this.writeUInt8(0x80 | ((value >> 14) & 0xff));
        }
        if (value > 0x7f)
        {
            this.writeUInt8(0x80 | ((value >> 7) & 0xff))
        }
        if(tmp != undefined)
        {
            value = tmp;
        }
        if( value > 0x1fffff)
        {
            this.writeUInt8(value & 0xff)
        }else
        {
            this.writeUInt8(value & 0x7f)
        }
    }
}


p.hasNext = function()
{
    return this._offset < this._length+this._writingBufferLength;
};
/**
 * Resets offset
 */
p.rewind = function()
{
    this._currentOffset = 0;
    this._currentBuffer = 0;
    this._offset = 0;
};
p.clone = function()
{
    this._freezeWritingBuffer();
    var buffer = new Buffer(this._length);
    var len = 0;
    for(var i=0; i<this._buffers.length; i++)
    {
        this._buffers[i].copy(buffer, len, 0, this._buffers[i].length);
        len+=this._buffers[i].length;
    }
    var dynBuffer = new DynBuffer();
    dynBuffer._buffers.push(buffer);
    dynBuffer._length = buffer.length;
    dynBuffer._lengths.push(buffer.length);
    return dynBuffer;
};
p.size = function()
{
    return this._length + this._writingBufferLength;
};
/**
 * Converts to a DynBuffer with only one buffer
 */
p.toDynBuffer = function()
{
    return this.clone();
};
/**
 * Converts to a Buffer
 */
p.toBuffer = function()
{
    this._freezeWritingBuffer();
    var buffer = this.clone();
    if(buffer.length > 0)
    {
        return buffer._buffers[0];
    }else
    {
        return new Buffer(0);
    }
};
/**
 * Copies current data to another buffer
 * @param buffer DynBuffer to copy to
 */
p.copyTo = function(buffer)
{
    if(!buffer instanceof DynBuffer)
    {
        throw(new Error("Buffer must be DynBuffer instance to receive a copy of this DynBuffer"));
    }
    buffer._writingBuffer = undefined;
    buffer._writingBufferLength = 0;
    buffer._length = this._length;
    buffer._lengths = this._lengths.concat();
    buffer._buffers = [];
    for(var i=0; i<this._buffers.length; i++)
    {
        var buf = new Buffer(this._buffers[i].length);
        this._buffers[i].copy(buf, 0, 0, this._buffers[i].length);
        buffer._buffers.push(buf);
    }
    //don't change current position and force recalculation of offsets
    buffer.position = buffer.position;
};
/**
 * Converts buffer to string
 * @param encoding Encoding used to convert. Currently ascii, binary, ucs2, hex,  utf8 or base64 are supported. (same as supported buffer encoding)
 * @param start Start index of conversion. If start is negative, index will be buffer.length - start
 * @param end End index of conversion. If end is negative, index will be buffer.length - end
 */
p.toString = function(encoding, start, end)
{
    if(end > this._length || end == undefined)
    {
        this._freezeWritingBuffer();
    }
    if(start < 0)
    {
        start = this._length + start;
    }
    if(start == undefined || start <0)
    {
        start = 0;
    }
    if(end < 0)
    {
        end = this._length + end;
    }
    if(end == undefined || end > this._length)
    {
        end = this._length;
    }/*
    if(end <= start)
    {
        return "";
    }*/
    if(encoding == undefined)
    {
        encoding = "base64";
    }
    if(this._buffers.length == 1 ||(this._buffers.length > 1 && end+start < this._buffers.length))
    {
        return this._buffers[0].toString(encoding, start, end+start);
    }else
    {
        var dynbuffer = this.clone();
        dynbuffer.copyTo(this);
        return this.toString(encoding, start, end+start);
    }
};
p.__defineGetter__("bytesAvailable", function()
{
    return this._length - this._offset + this._writingBufferLength;
});
p.__defineGetter__("position", function()
{
    return this._offset;
});
//TODO : CHECK IF CORRECT
p.__defineSetter__("position", function(position)
{
    if(position > this._length)
    {
        this._freezeWritingBuffer();
    }
    this._offset = position<0?0:position>this._length?this._length:position;
    for(var i=0; i<this._lengths.length; i++)
    {
        if(this._lengths[i]>=this._offset)
        {
            break;
        }
    }
    this._currentBuffer = i;
    if(this._currentBuffer < this._buffers.length)
    {
        this._currentOffset = this._buffers[this._currentBuffer].length-(this._lengths[i]-this._offset);
    }else
    {
        this._currentOffset = 0;
    }
});
p.__defineGetter__("length", function()
{
    return this._length + this._writingBufferLength;
});


module.exports = DynBuffer;