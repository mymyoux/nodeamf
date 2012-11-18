var id = 0;
function Test()
{
    this.id = id++;
}
var p = Test.prototype;
Test.getAlias = function()
{
    return "nioot.io.niootclient::Test";
};
p.writeExternal = function(output)
{
    output.writeBoolean(true);
    output.writeBoolean(false);
    output.writeInt(301);
    output.writeInt(-301);
    output.writeDouble(-45.01);
    output.writeFloat(-45.01);
    output.writeByte(4);
    output.writeByte(-4);
    output.writeShort(-4);
    output.writeUnsignedInt(454);
    output.writeUTF("bonjour");
    output.writeUTF("bonjour@\"i_(çà'èç\"é)\"(");
    output.writeUTF("bonjour");
    output.writeUTFBytes("test");
    output.writeObject({"hihi":"aventure"});
};
p.readExternal = function(input)
{
    input.readBoolean();
    input.readBoolean();
    input.readInt();
    this.id = input.readInt();
    input.readDouble();
    input.readFloat();
    input.readByte();
    input.readUnsignedByte();
    input.readUnsignedShort();
    input.readUnsignedInt();
    input.readUTF();
    input.readUTF();
    input.readUTF();
    input.readUTFBytes(0);
    input.readUTFBytes(4);
    input.readObject();

};
p.toString = function()
{
    return "[Super test! "+this.id+"]";
};
module.exports = Test;