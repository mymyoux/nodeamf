var ByteArray = require("amf").ByteArray;
var Test = require("./mapping/Test");
var Test2 = require("./mapping/Test2");
var TestDyn = require("./mapping/TestDyn");
var AMF = require("amf").AMF;
var XML = require("amf").XML;
var XMLDocument = require("amf").XMLDocument;
    /*
exports.testCreation = function(test){
    test.expect(3);
    var b = new ByteArray();
    test.equal(b.length, 0 , "There should be 0 length");
    test.equal(b.position, 0 , "There should be at position 0");
    test.equal(b.bytesAvailable, 0 , "There should be no available byte");
    test.done();
};
exports.testSimpleWriting = function(test){

    var b = new ByteArray();
    b.writeBoolean(true);

    test.equal(b.length, 1);
    test.equal(b.position, 1);
    test.equal(b.toString("base64"), "AQ==", "base64(true) == AQ==");
    test.equal(b.bytesAvailable, 0 , "There should be no available byte");
    b.clear();
    test.equal(b.length, 0 , "There should be 0 length");
    test.equal(b.position, 0 , "There should be at position 0");
    test.equal(b.bytesAvailable, 0 , "There should be no available byte");
    b.writeBoolean(1);
    test.equal(b.toString("base64"), "AQ==", "1 == true");
    b.clear();
    b.writeBoolean(-1);
    test.equal(b.toString("base64"), "AQ==", "-1 == true");
    b.clear();
    b.writeBoolean("test");
    test.equal(b.toString("base64"), "AQ==", "'test' == true");
    b.clear();
    b.writeBoolean({});
    test.equal(b.toString("base64"), "AQ==", "{} == true");
    b.clear();
    b.writeBoolean(false);
    test.equal(b.toString("base64"), "AA==", "base64(false) == AA==");
    b.clear();
    b.writeBoolean(undefined);
    test.equal(b.toString("base64"), "AA==", "undefined == false");
    b.clear();
    b.writeBoolean(null);
    test.equal(b.toString("base64"), "AA==", "null == false");
    b.clear();
    b.writeBoolean(0);
    test.equal(b.toString("base64"), "AA==", "0 == false");
    b.clear();
    b.writeBoolean("");
    test.equal(b.toString("base64"), "AA==", "'' == false");
    b.clear();

    //writeByte
    b.writeByte(4)
    test.equal(b.toString("base64"), "BA==");
    b.clear();
    b.writeByte(128);
    test.equal(b.toString("base64"), "gA==");
    b.clear();
    b.writeByte(255);
    test.equal(b.toString("base64"), "/w==");
    b.clear();
    b.writeByte(-128);
    test.equal(b.toString("base64"), "gA==");
    b.clear();
    b.writeByte(-256);
    test.equal(b.toString("base64"), "AA==");
    b.clear();

    //short
    b.writeShort(32767);
    test.equal(b.toString("base64"), "f/8=");
    b.clear();
    b.writeShort(32768);
    test.equal(b.toString("base64"), "gAA=");
    b.clear();
    b.writeShort(-32769);
    test.equal(b.toString("base64"), "f/8=");
    b.clear();
    b.writeShort(-5147854454654);
    test.equal(b.toString("base64"), "wII=");
    b.clear();


    //int
    b.writeInt(2147483647);
    test.equal(b.toString("base64"), "f////w==");
    b.clear();
    b.writeInt(2147483648);
    test.equal(b.toString("base64"), "gAAAAA==");
    b.clear();
    b.writeInt(-2147483649);
    test.equal(b.toString("base64"), "f////w==");
    b.clear();
    b.writeInt(-45);
    test.equal(b.toString("base64"), "////0w==");
    b.clear();
    b.writeInt(-5147854454654);
    test.equal(b.toString("base64"), "a/bAgg==");
    b.clear();
    b.writeInt(2147483649);
    test.equal(b.toString("base64"), "gAAAAQ==");
    b.clear();

    //unsigned int
    b.writeUnsignedInt(-1);
    test.equal(b.toString("base64"), "/////w==");
    b.clear();
    b.writeUnsignedInt(2147483647);
    test.equal(b.toString("base64"), "f////w==");
    b.clear();
    b.writeUnsignedInt(2147483648);
    test.equal(b.toString("base64"), "gAAAAA==");
    b.clear();
    b.writeUnsignedInt(-2147483649);
    test.equal(b.toString("base64"), "f////w==");
    b.clear();
    b.writeUnsignedInt(-45);
    test.equal(b.toString("base64"), "////0w==");
    b.clear();
    b.writeUnsignedInt(-5147854454654);
    test.equal(b.toString("base64"), "a/bAgg==");
    b.clear();
    b.writeUnsignedInt(2147483649);
    test.equal(b.toString("base64"), "gAAAAQ==");
    b.clear();

    //double
    b.writeDouble(-34561984559569.54454455);
    test.equal(b.toString("base64"), "wr9vFs/50Ys=");
    b.clear();

    //float
    b.writeFloat(-34561984559569.54454455);
    test.equal(b.toString("base64"), "1ft4tg==");
    b.clear();

    //string without length
    b.writeUTFBytes("bonjour la \r\nvie");
    test.equal(b.toString("base64"), "Ym9uam91ciBsYSANCnZpZQ==", "bonjour la \r\nvie");
    b.clear();
    b.writeUTFBytes("é");
    test.equal(b.toString("base64"), "w6k=", "é");
    b.clear();
    b.writeUTFBytes("&é'(-è_çà)=");
    test.equal(b.toString("base64"), "JsOpJygtw6hfw6fDoCk9", "&é'(-è_çà)=");
    b.clear();

    //string
    b.writeUTF("&é'(-è_çà)=");
    test.equal(b.toString("base64"), "AA8mw6knKC3DqF/Dp8OgKT0="    , "&é'(-è_çà)=");
    b.clear();
    b.writeUTF("");
    test.equal(b.toString("base64"), "AAA="    , "empty string");
    b.clear();
    test.done();
};
exports.testSimpleReading = function(test){
    var b = new ByteArray();
    b.writeBoolean(true);
    b.position = 0;

    test.equal(b.readBoolean(), true);
    test.equal(b.bytesAvailable, 0 , "There should be no available byte");
    b.clear();

    b.writeBoolean(1);
    b.position = 0;

    test.equal(b.readBoolean(), true);
    b.clear();
    b.writeBoolean(-1);
    b.position = 0;
    test.equal(b.readBoolean(), true);
    b.clear();
    b.writeBoolean("test");
    b.position = 0;
    test.equal(b.readBoolean(), true);
    b.clear();
    b.writeBoolean({});
    b.position=0;
    test.equal(b.readBoolean(), true);
    b.clear();
    b.writeBoolean(false);
    b.position=0;
    test.equal(b.readBoolean(), false);
    b.clear();
    b.writeBoolean(undefined);
    b.position=0;
    test.equal(b.readBoolean(), false);
    b.clear();
    b.writeBoolean(null);
    b.position=0;
    test.equal(b.readBoolean(), false);
    b.clear();
    b.writeBoolean(0);
    b.position=0;
    test.equal(b.readBoolean(),false);
    b.clear();
    b.writeBoolean("");
    b.position=0;
    test.equal(b.readBoolean(), false);
    b.clear();

    //writeByte
    b.writeByte(4)
    b.position=0;
    test.equal(b.readByte(), 4);
    b.clear();
    b.writeByte(128);
    b.position=0;
    test.equal(b.readByte(), -128);
    b.clear();
    b.writeByte(255);
    b.position=0;
    test.equal(b.readByte(), -1);
    b.clear();
    b.writeByte(-128);
    b.position=0;
    test.equal(b.readByte(), -128);
    b.clear();
    b.writeByte(-256);
    b.position=0;
    test.equal(b.readByte(), 0);
    b.clear();

    //short
    b.writeShort(32767);
    b.position=0;
    test.equal(b.readShort(), 32767);
    b.clear();
    b.writeShort(32768);
    b.position=0;
    test.equal(b.readShort(), -32768);
    b.clear();
    b.writeShort(-32769);
    b.position=0;
    test.equal(b.readShort(), 32767);
    b.clear();
    b.writeShort(-5147854454654);
    b.position=0;
    test.equal(b.readShort(), -16254);
    b.clear();

    //int
    b.writeInt(2147483647);
    b.position=0;
    test.equal(b.readInt(), 2147483647);
    b.clear();
    b.writeInt(2147483648);
    b.position=0;
    test.equal(b.readInt(), -2147483648);
    b.clear();
    b.writeInt(-2147483649);
    b.position=0;
    test.equal(b.readInt(), 2147483647);
    b.clear();
    b.writeInt(-45);
    b.position=0;
    test.equal(b.readInt(), -45);
    b.clear();
    b.writeInt(-5147854454654);
    b.position=0;
    test.equal(b.readInt(), 1811333250);
    b.clear();
    b.writeInt(2147483649);
    b.position=0;
    test.equal(b.readInt(), -2147483647);
    b.clear();

    //unsigned int
    b.writeUnsignedInt(-1);
    b.position=0;
    test.equal(b.readUnsignedInt(), 4294967295);
    b.clear();
    b.writeUnsignedInt(2147483647);
    b.position=0;
    test.equal(b.readUnsignedInt(), 2147483647);
    b.clear();
    b.writeUnsignedInt(2147483648);
    b.position=0;
    test.equal(b.readUnsignedInt(), 2147483648);
    b.clear();
    b.writeUnsignedInt(-2147483649);
    b.position=0;
    test.equal(b.readUnsignedInt(), 2147483647);
    b.clear();
    b.writeUnsignedInt(-45);
    b.position=0;
    test.equal(b.readUnsignedInt(), 4294967251);
    b.clear();
    b.writeUnsignedInt(-5147854454654);
    b.position=0;
    test.equal(b.readUnsignedInt(), 1811333250);
    b.clear();
    b.writeUnsignedInt(2147483649);
    b.position=0;
    test.equal(b.readUnsignedInt(), 2147483649);
    b.clear();

    //double
    b.writeDouble(-34561984559569.54454455);
    b.position=0;
    test.equal(b.readDouble(), -34561984559569.54454455);
    b.clear();

    //float
    b.writeFloat(-34561984559569.54454455);
    b.position=0;
    test.equal(b.readFloat(), -34561983512576);
    b.clear();

    //string without length
    b.writeUTFBytes("bonjour la \r\nvie");
    b.position=0;
    test.equal(b.readUTFBytes(16),"bonjour la \r\nvie");

    b.clear();
    b.writeUTFBytes("é");
    b.position=0;
    test.equal(b.readUTFBytes(2), "é");
    b.clear();
    b.writeUTFBytes("&é'(-è_çà)=");
    b.position=0;
    test.equal(b.readUTFBytes(15), "&é'(-è_çà)=");
    b.clear();

    //string
    b.writeUTF("&é'(-è_çà)=");
    b.position=0;
    test.equal(b.readUTF(), "&é'(-è_çà)=");
    b.clear();
    b.writeUTF("");
    b.position=0;
    test.equal(b.readUTF(), "");
    b.clear();
    test.done();
}
exports.testAMFWriting = function(test){
    var b = new ByteArray();
    //undefined
    b.writeObject(undefined);
    test.equal(b.toString("base64"), "AA==");
    b.clear();
    //null
    b.writeObject(null);
    test.equal(b.toString("base64"), "AQ==");
    b.clear();
    //boolean
    b.writeObject(true);
    test.equal(b.toString("base64"), "Aw==");
    b.clear();
    b.writeObject(false);
    test.equal(b.toString("base64"), "Ag==");
    b.clear();
    //int
    b.writeObject(157899797);
    test.equal(b.toString("base64"), "BKXS3BU=");
    b.clear();
    b.writeObject(0);
    test.equal(b.toString("base64"), "BAA=");
    b.clear();
    b.writeObject(-1);
    test.equal(b.toString("base64"), "BP////8=");
    b.clear();
    b.writeObject(-157899797);
    test.equal(b.toString("base64"), "BNqto+s=");
    b.clear();
    //double
    b.writeObject(0.000001);
    test.equal(b.toString("base64"), "BT6wxvegte2N");
    b.clear();
    b.writeObject(-157899797.5454);
    test.equal(b.toString("base64"), "BcGi0rgrFz6r");
    b.clear();
    //string
    b.writeObject("bonjour");
    test.equal(b.toString("base64"), "Bg9ib25qb3Vy");
    b.clear();
    b.writeObject("&é'(-è_çà)=");
    test.equal(b.toString("base64"), "Bh8mw6knKC3DqF/Dp8OgKT0=");
    b.clear();
    b.writeObject("");
    test.equal(b.toString("base64"), "BgE=");
    b.clear();
    //XMLDOC



    //date
    var date = new Date();
    date.setTime(1326467010887);
    b.writeObject(date);
    test.equal(b.toString("base64"), "CAFCc015hRRwAA==");
    b.clear();

    //array
    b.writeObject([]);
    test.equal(b.toString("base64"), "CQEB");
    b.clear();
    b.writeObject([undefined, null, true, false, 157899797, 0, -1, -157899797, 0.000001, -157899797.5454, "bonjour", "&é'(-è_çà)=", date, "", []]);
    test.equal(b.toString("base64"), "CR8BAAEDAgSl0twVBAAE/////wTaraPrBT6wxvegte2NBcGi0rgrFz6rBg9ib25qb3VyBh8mw6knKC3DqF/Dp8OgKT0IAUJzTXmFFHAABgEJAQE=");
    b.clear();
    b.writeObject(["bonjour", "non", "bonjour", "bonjour", "non", "bonjour"]);
    test.equal(b.toString("base64"), "CQ0BBg9ib25qb3VyBgdub24GAAYABgIGAA==");
    b.clear();
    var date2 = new Date();
    date2.setTime(1326467010888);
    var a = ["bonjour", date2, "non", date, "bonjour", "bonjour", "non", "bonjour", date, date2];
    b.writeObject(a);
    test.equal(b.toString("base64"), "CRUBBg9ib25qb3VyCAFCc015hRSAAAYHbm9uCAFCc015hRRwAAYABgAGAgYACAQIAg==");
    b.clear();
    //with named properties
    a = ["firstword"];
    a["test"] = "secondword";
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMJdGVzdAYVc2Vjb25kd29yZAEGE2ZpcnN0d29yZA==");
    b.clear();
    a = ["bonjour"];
    a["test"] = "bonjour";
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMJdGVzdAYPYm9uam91cgEGAg==");
    b.clear();
    a = ["bonjour"];
    a["x"] = "a";
    a["bonjour2"] = "test2";
    a["test"] = "bonjour";
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMDeAYDYRFib25qb3VyMgYLdGVzdDIJdGVzdAYPYm9uam91cgEGCg==", "array with 3 properties");
    b.clear();
    a = ["bonjour"];
    a["x"] = "a";
    a["a"] = "x";
    a["test"] = "bonjour";
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMDeAYDYQIGAAl0ZXN0Bg9ib25qb3VyAQYG", "array with 3 properties and references");
    b.clear();
    a = ["bonjour"];
    a["x"] = "a";
    a["a"] = ["x", "bonjour", ["test"]];
    a["test"] = "bonjour";
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMDeAYDYQIJBwEGAAYPYm9uam91cgkDAQYJdGVzdAYGBAEGBA==", "array with 3 properties and references and arrays of arrays");
    b.clear();
    a = ["bonjour"];
    a["x"] = date;
    a["a"] = [date, "bonjour", [date2]];
    a["test"] = date2;
    b.writeObject(a);
    test.equal(b.toString("base64"), "CQMDeAgBQnNNeYUUcAADYQkHAQgCBg9ib25qb3VyCQMBCAFCc015hRSAAAl0ZXN0CAgBBgQ=", "array with 3 properties and references and arrays of arrays and objects");
    b.clear();


    //object
    //dynamic objects
    b.writeObject({});
    test.equal(b.toString("base64"), "CgsBAQ==", "object");
    b.clear();
    b.writeObject({"ah":["oui"],"arf":"oui", "test":"oui"});
    test.equal(b.toString("base64"), "CgsBBWFoCQMBBgdvdWkHYXJmBgIJdGVzdAYCAQ=="    , "object");
    b.clear();
    b.writeObject({"arf":date, "ah":["oui", date],"test":"oui"});
    test.equal(b.toString("base64"), "CgsBB2FyZggBQnNNeYUUcAAFYWgJBQEGB291aQgCCXRlc3QGBAE="    , "object with dates");
    b.clear();

    //static object without read/writeExternal
    var Test2 = require("./mapping/Test2");
    var t = new Test2();
    b.writeObject(t);
    test.equal(b.toString("base64"), "ChM3bmlvb3QuaW8ubmlvb3RjbGllbnQ6OlRlc3QyBWlkBAA=");
    b.clear();




    //external
    var Test = require("./mapping/Test");
    t = new Test();
   b.writeObject(t);
   test.equal(b.toString("base64"), "Cgc1bmlvb3QuaW8ubmlvb3RjbGllbnQ6OlRlc3QBAAAAAS3///7TwEaBR64UeuHCNAo9BPz//AAAAcYAB2JvbmpvdXIAG2JvbmpvdXJAImlfKMOnw6Anw6jDpyLDqSkiKAAHYm9uam91cnRlc3QKCwEJaGloaQYRYXZlbnR1cmUB");
   b.clear();

    //both dynamic and static objects
    var TestDyn = require("./mapping/TestDyn");
    t = new TestDyn();
    b.writeObject(t);
    test.equal(b.toString("base64"), "Chs7bmlvb3QuaW8ubmlvb3RjbGllbnQ6OlRlc3REeW4FaWQEAAlkeW5hBgd5ZXMB");
    b.clear();


    //bytearray
    b.writeBoolean(true);
    b.writeBoolean(true);
    b.position = 0;
    test.equals(b.readBoolean(), true);
    test.equals(b.readBoolean(), true);
    test.equals(b.bytesAvailable, 0);
    test.equals(b.clone().toString("base64"), "AQE=");
    b.clear();


    //test for save with multiple buffer inside DynBuffer
    b.writeBoolean(true);
    test.equals(b.toString("base64"), "AQ==");
    b.writeBoolean(true);
    b.position = 0;
    test.equals(b.readBoolean(), true);
    test.equals(b.readBoolean(), true);
    test.equals(b.bytesAvailable, 0);
    test.equals(b._buffer.clone().length, b._buffer.length);
    test.equals(b._buffer.length, 2);
    test.equals(b.toString("base64"), "AQE=");
    b.position = 0;
    test.equals(b.readBoolean(), true);
    test.equals(b.readBoolean(), true);
    test.equals(b.bytesAvailable, 0);
    test.equals(b.clone().toString("base64"), b._buffer.toString("base64"));
    test.equals(b.toString("base64"), "AQE=");
    b.clear();

    //byteArray
    var byteArray = new ByteArray();
    b.writeObject(byteArray);
    test.equal(b.length, 2, "empty byteArray");
    test.equal(b.toString("base64"), "DAE=", "empty byteArray");
    b.clear();

    var byteArray = new ByteArray();
    byteArray.writeBoolean(true);
    test.equal(byteArray.toString("base64"), "AQ==", "'test' == true");
    byteArray.writeObject(465);
    b.writeObject(byteArray);
    test.equal(b.toString("base64"), "DAkBBINR", "byteArray");
    b.clear();


    b.writeObject([byteArray]);
    test.equal(b.toString("base64"), "CQMBDAkBBINR", "byteArray");
    b.clear();
    b.writeObject(byteArray);
    test.equal(b.toString("base64"), "DAkBBINR", "byteArray");
    b.clear();

    b.writeObject(byteArray);
    b.writeObject(true);
    test.equal(b.toString("base64"), "DAkBBINRAw==", "byteArray and true");
    b.clear();

    b.writeObject([byteArray, "test"]);
    test.equal(b.toString("base64"), "CQUBDAkBBINRBgl0ZXN0", "byteArray");
    b.clear();

    b.writeObject([byteArray, byteArray]);
    test.equal(b.toString("base64"), "CQUBDAkBBINRDAI=", "byteArray");
    b.clear();


    var xml = new XML("<root>\n  <node>bonjour</node>\n</root>");
    var xmlDoc = new XMLDocument("<root><node>bonjour</node></root>");
    var xmlEmpty = new XML();
    var xmlDocEmpty = new XMLDocument();
    var b = new ByteArray();
    b.writeObject(["test", {},{"test":"no"}, xmlEmpty, xmlDocEmpty, xml, xml, xmlDoc, xmlDoc]);
    b.position = 0;
    var object = b.readObject();
    var i = 0;
    test.equal(object[i++], "test");
    test.deepEqual(object[i++], {});
    test.deepEqual(object[i++], {"test":"no"});
    test.deepEqual(object[i++], xmlEmpty);
    test.deepEqual(object[i++], xmlDocEmpty);
    test.deepEqual(object[i++], xml);
    test.deepEqual(object[i++], xml);
    test.deepEqual(object[i++], xmlDoc);
    test.deepEqual(object[i++], xmlDoc);
    test.equal(object.length, i);

    test.done();
}
exports.testAMFReading = function(test)
{
    var bufferToRead = "CT8BAAEDAgSl0twVBAAE/////wTaraPrBT6wxvegte2NBcGi0rgrFz6rBg9ib25qb3VyBh8mw6kn"+
    "KC3DqF/Dp8OgKT0IAUJzTXmFFHAABgEJAQEKCwEBCQ0BBgAGB25vbgYABgAGBAYACRUBBgAIAUJ3"+
    "qw/QlIAABgQIAgYABgAGBAYACAIIDAkDCXRlc3QGFXNlY29uZHdvcmQBBhNmaXJzdHdvcmQMCQEE"+
    "g1EJBQEMEAYGCQUBDBAMEAoBBgYHb3VpB2FyZgYMBWFoCQMBBgwBCgEOCAIQCQUBBgwIAgYGDAEK"+
    "EzduaW9vdC5pby5uaW9vdGNsaWVudDo6VGVzdDIFaWQEAQoHNW5pb290LmlvLm5pb290Y2xpZW50"+
    "OjpUZXN0AQAAAAEt///+08BGgUeuFHrhwjQKPQT8//wAAAHGAAdib25qb3VyABtib25qb3VyQCJp"+
    "XyjDp8OgJ8Oow6ciw6kpIigAB2JvbmpvdXJ0ZXN0CgEJaGloaQYRYXZlbnR1cmUBBhdhYWFhYWFh"+
    "YWFhYQobO25pb290LmlvLm5pb290Y2xpZW50OjpUZXN0RHluFAQACWR5bmEGB3llcwEJAwN4CAID"+
    "YQkHAQgCBgAJAwEIDAYIDAEGAAoJAQAAAAEt///+08BGgUeuFHrhwjQKPQT8//wAAAHGAAdib25q"+
    "b3VyABtib25qb3VyQCJpXyjDp8OgJ8Oow6ciw6kpIigAB2JvbmpvdXJ0ZXN0CgEYBhoBCgUEhlc=";
    var buffer = new ByteArray(bufferToRead, "base64");

    //needed variables

    AMF.addMapping(Test2);
    AMF.addMapping(Test);
    AMF.addMapping(TestDyn);
    var byteArray = new ByteArray();
    byteArray.writeBoolean(true);
    byteArray.writeObject(465);
    var date = new Date();
    date.setTime(1326467010887);
    var date2 = new Date();
    date2.setTime(1626467010888);
    var a = ["bonjour", date2, "non", date, "bonjour", "bonjour", "non", "bonjour", date, date2];
    var a2 = ["bonjour"];
    a2["test"] = date2;
    a2["x"] = date;
    a2["a"] = [date, "bonjour", [date2]];
    var a3 = ["firstword"];
    a3["test"] = "secondword";
    var test2 = new Test2();
    test2.id = 1;
    var t = new Test();
    t.id = -301;
    var tDyn = new TestDyn();
    tDyn.id = 0;
    var lastTest = new Test2();
    lastTest.id = 855;


    var b = new ByteArray(bufferToRead, "base64");
    test.equal(b.toString("base64"), bufferToRead);
    test.equal(b.position, 0);
    var object = b.readObject();
    var i = 0;
    test.equal(object[i++], undefined);
    test.equal(object[i++], null);
    test.equal(object[i++], true);
    test.equal(object[i++], false);
    test.equal(object[i++], 157899797);
    test.equal(object[i++], 0);
    test.equal(object[i++], -1);
    test.equal(object[i++], -157899797);
    test.equal(object[i++], 0.000001);
    test.equal(object[i++], -157899797.5454);
    test.equal(object[i++], "bonjour");
    test.equal(object[i++], "&é'(-è_çà)=");
    test.equal(object[i++].getTime(), date.getTime());
    test.equal(object[i++],"");
    test.deepEqual(object[i++],[]);
    test.deepEqual(object[i++],{});
    test.deepEqual(object[i++],["bonjour", "non", "bonjour", "bonjour", "non", "bonjour"]);
    test.deepEqual(object[i++],a);
    test.deepEqual(object[i++],a3);
    test.equal(object[i++].toString("base64"),byteArray.toString("base64"));
    var next = object[i++];
    test.deepEqual(next[0].toString("base64"),byteArray.toString("base64"));
    test.equal(next[1],"test");
    next = object[i++];
    test.deepEqual(next[0].toString("base64"),byteArray.toString("base64"));
    test.deepEqual(next[1].toString("base64"),byteArray.toString("base64"));
    test.deepEqual(object[i++], {"arf":"oui", "test":"oui","ah":["oui"]});
    test.deepEqual(object[i++], {"ah":["oui", date],"arf":date, "test":"oui"});
    test.ok(object[i] instanceof Test2, "test2");
    test.deepEqual(object[i++], test2, "test2");
    test.ok(object[i] instanceof Test, "test");
    test.deepEqual(object[i++], t, "test");
    test.equal(object[i++], "aaaaaaaaaaa");
    test.ok(object[i] instanceof TestDyn, "TestDyn");
    test.deepEqual(object[i++], tDyn,"testdyn");
    test.deepEqual(object[i++], a2);
    test.deepEqual(object[i++], t);
    test.ok(object[i] instanceof Test2, "test2");
    test.deepEqual(object[i++], lastTest);
    test.equal(object.length, i);

    b = new ByteArray("CRMBBgl0ZXN0CgsBAQoBAAYFbm8BCwEHBTw+C0s8cm9vdD4KICA8bm9kZT5ib25qb3VyPC9ub2Rl"+
    "Pgo8L3Jvb3Q+CwoHQzxyb290Pjxub2RlPmJvbmpvdXI8L25vZGU+PC9yb290PgcMBgl0ZXN0", "base64");
    object = b.readObject();
    var i = 0;
    var xml = new XML("<root>\n  <node>bonjour</node>\n</root>");
    var xmlDoc = new XMLDocument("<root><node>bonjour</node></root>");
    var xmlEmpty = new XML();
    var xmlDocEmpty = new XMLDocument();
    test.equal(object[i++], "test");//to be sure that xml are saved into objects references not string
    test.deepEqual(object[i++], {});
    test.deepEqual(object[i++], {"test":"no"});
    test.deepEqual(object[i++], xmlEmpty);
    test.deepEqual(object[i++], xmlDocEmpty);
    test.deepEqual(object[i++], xml);
    test.deepEqual(object[i++], xml);
    test.deepEqual(object[i++], xmlDoc);
    test.deepEqual(object[i++], xmlDoc);
    test.deepEqual(i, object.length);
    test.equal(b.readObject(), "test");
    test.done();
}

exports.testDecompression = function(test)
{
    var uncompressed = "CT8BAAEDAgSl0twVBAAE/////wTaraPrBT6wxvegte2NBcGi0rgrFz6rBg9ib25qb3VyBh8mw6kn"+
    "KC3DqF/Dp8OgKT0IAUJzTXmFFHAABgEJAQEKCwEBCQ0BBgAGB25vbgYABgAGBAYACRUBBgAIAUJ3"+
    "qw/QlIAABgQIAgYABgAGBAYACAIIDAkDCXRlc3QGFXNlY29uZHdvcmQBBhNmaXJzdHdvcmQMCQEE"+
    "g1EJBQEMEAYGCQUBDBAMEAoBBWFoCQMBBgdvdWkHYXJmBg4GBg4BCgEMCQUBBg4IAhAIAgYGDgEK"+
    "EzduaW9vdC5pby5uaW9vdGNsaWVudDo6VGVzdDIFaWQEAQoHNW5pb290LmlvLm5pb290Y2xpZW50"+
    "OjpUZXN0AQAAAAEt///+08BGgUeuFHrhwjQKPQT8//wAAAHGAAdib25qb3VyABtib25qb3VyQCJp"+
    "XyjDp8OgJ8Oow6ciw6kpIigAB2JvbmpvdXJ0ZXN0CgEJaGloaQYRYXZlbnR1cmUBBhdhYWFhYWFh"+
    "YWFhYQobO25pb290LmlvLm5pb290Y2xpZW50OjpUZXN0RHluFAQACWR5bmEGB3llcwEJAwN4CAID"+
    "YQkHAQgCBgAJAwEIDAYIDAEGAAoJAQAAAAEt///+08BGgUeuFHrhwjQKPQT8//wAAAHGAAdib25q"+
    "b3VyABtib25qb3VyQCJpXyjDp8OgJ8Oow6ciw6kpIigAB2JvbmpvdXJ0ZXN0CgEYBhoBCgUEhlc=";

    var compress = "eNq1kM8rBVEUx++ZuXNm7jWep/dexEK9BU9iIVJPfiSxslDKUsMbvSvN1cw8PCsSOzt/gEhIZKMs"+
    "MWUtdrKxlrWNPHfkx8rS2Zxv3/ut77kfNgAEdI3u3z1mKKEVNfThZO/Z6D+7ed05f9kyrnbvLtrq"+
    "+o+xZlp6c7LkY1NzdNSSa48Op6KDaKe1z4KhYKy8kV4gCAyAVwGwakCCpic9tQhSJCyjHJVcOq65"+
    "3V5VlqV9P1maZTOdhW4QYiZwZ6RXWJJ+ATA1K/wgjLXNgK6PMwPsJOLnspMcDKfIdEBTloTp+LOY"+
    "QEwAB1sFMGFpSVURG6keT0gZdgjZ8Slm5oXrhfn8hCrsNESBAje7/44AIQTaK5X3+8uRtdHT9MrT"+
    "dRfvo2+VN+XfEPMLC2n8EoNZMZWLybREh9FBNjpqzeZ+UvEnObCiKAqsdRZVScl3Aeuc3+GNvX8f"+
    "M1z20pSwQtlz0Cy7ATBdX7Y03WEmxEQVD8tGy1awOfuHy+uxAbhBNyc/APclqCU=";

    var compressThenDeflate = "AYUBev542rWQzysFURTH75m5c2buNZ6n917EQr0FT2IhUk9+JLGyUMpSwxu9K83VzDw8KxI7O3+A"+
    "SEhkoywxZS12srGWtY08d+THytLZnG/f+63vuR82AAR0je7fPWYooRU19OFk79noP7t53Tl/2TKu"+
    "du8u2ur6j7FmWnpzsuRjU3N01JJrjw6nooNop7XPgqFgrLyRXiAIDIBXAbBqQIKmJz21CFIkLKMc"+
    "lVw6rrndXlWWpX0/WZplM52FbhBiJnBnpFdYkn4BMDUr/CCMtc2Aro8zA+wk4ueykxwMp8h0QFOW"+
    "hOn4s5hATAAHWwUwYWlJVREbqR5PSBl2CNnxKWbmheuF+fyEKuw0RIECN7v/jgAhBNorlff7y5G1"+
    "0dP0ytN1F++jb5U35d8Q8wsLafwSg1kxlYvJtESH0UE2OmrN5n5S8Sc5sKIoCqx1FlVJyXcB65zf"+
    "4Y29fx8zXPbSlLBC2XPQLLsBMF1ftjTdYSbERBUPy0bLVrA5+4fL67EBuEE3Jz8A9yWoJQ=="

    var deflate = "tZDPKwVRFMfvmblzZu41nqf3XsRCvQVPYiFST34ksbJQylLDG70rzdXMPDwrEjs7f4BISGSjLDFl"+
    "LXaysZa1jTx35MfK0tmcb9/7re+5HzYABHSN7t89ZiihFTX04WTv2eg/u3ndOX/ZMq527y7a6vqP"+
    "sWZaenOy5GNTc3TUkmuPDqeig2intc+CoWCsvJFeIAgMgFcBsGpAgqYnPbUIUiQsoxyVXDquud1e"+
    "VZalfT9ZmmUznYVuEGImcGekV1iSfgEwNSv8IIy1zYCujzMD7CTi57KTHAynyHRAU5aE6fizmEBM"+
    "AAdbBTBhaUlVERupHk9IGXYI2fEpZuaF64X5/IQq7DREgQI3u/+OACEE2iuV9/vLkbXR0/TK03UX"+
    "76NvlTfl3xDzCwtp/BKDWTGVi8m0RIfRQTY6as3mflLxJzmwoigKrHUWVUnJdwHrnN/hjb1/HzNc"+
    "9tKUsELZc9AsuwEwXV+2NN1hJsREFQ/LRstWsDn7h8vrsQG4QTcnPwA=";
    var b = new ByteArray(compressThenDeflate, "base64");
    b.decompress(function(success)
    {
        test.ok(success);
        test.equal(b.toString("base64"), compress);
        b.decompress(function(success)
       {
           test.ok(success);
           test.equal(b.toString("base64"), uncompressed);
           b.compress(function(succes)
           {
               test.ok(success);
               test.equal(b.toString("base64"), deflate);
               test.done();
           });

       });
    });

}

exports.testConversion = function(test)
{
    var b = new ByteArray();
    b.writeInt(4);
    b.position = 0;
    test.equal(b.readInt(), 4);
    b.clear();
    b.writeInt(45.4);
    b.position = 0;
    test.equal(b.readInt(), 45);
    b.clear();
    b.writeInt(45.9);
    b.position = 0;
    test.equal(b.readInt(), 45);
    b.clear();
    b.writeByte(4878789.5478);
    b.position = 0;
    test.equal(b.readByte(), -59);
    b.clear();
    b.writeByte(undefined);
    b.position = 0;
    test.equal(b.readByte(), 0);
    b.clear();
    b.writeByte(true);
    b.position = 0;
    test.equal(b.readByte(), 1);
    b.clear();
    b.writeByte(false);
    b.position = 0;
    test.equal(b.readByte(), 0);
    b.clear();
    b.writeByte(null);
    b.position = 0;
    test.equal(b.readByte(), 0);
    b.clear();
    b.writeByte({});
    b.position = 0;
    test.equal(b.readByte(), 0);
    b.clear();
    b.writeByte({"arf":"oui"});
    b.position = 0;
    test.equal(b.readByte(), 0);
    test.done();

}     */
var node = require("import");
//log
node.import.niootserver.io.mapping.ApplicationMessage;
require("./mapping/TestDyn");
exports.testAdvanced = function(test)
{
    new node.ApplicationMessage();
  /*  var b = new ByteArray("CgdJbmlvb3QuaW8ubWFwcGluZzo6QXBwbGljYXRpb25NZXNzYWdlAQAIRGVidWdBcHABAAAAAAEAAAAAAQoLAQ9hcHBOYW1lBhlCYXJhdGhvbi5zd2YFdHIGgW1BcHBsaWNhdGlvbiA6IFtBcHBsaWNhdGlvbiBuYW1lPSJEZWJ1Z0FwcCJdIGpvaW5lZCB0byBbU29ja2V0Tm9kZSBob3N0PSIxNzguMTcwLjExNC4yNiIgcG9ydD0iMTUxOSIgY29ubmVjdGVkPSJmYWxzZSJdDWNhbGxlcgZnW25pb290LmlvLm5pb290c2VydmVyLmFwcGxpY2F0aW9uczo6QXBwbGljYXRpb246OTldD2NvbW1hbmQEAAtjb2xvcgSBhMJCC2xldmVsBAEB","base64");
    b.position = 0;
    console.log(b.readObject());
    b.clear();*/
    var data0 = "CgdJbmlvb3QuaW8ubWFwcGluZzo6QXBwbGljYXRpb25NZXNzYWdlAQAIRGVidWdBcHABAAAAAAEAAAAAAQoLAQ9hcHBOYW1lBhlCYXJhdGhvbi5zd2YFdHIGgW1BcHBsaWNhdGlvbiA6IFtBcHBsaWNhdGlvbiBuYW1lPSJEZWJ1Z0FwcCJdIGpvaW5lZCB0byBbU29ja2V0Tm9kZSBob3N0PSIxNzguMTcwLjExNC4yNiIgcG9ydD0iMTUxOSIgY29ubmVjdGVkPSJmYWxzZSJdDWNhbGxlcgZnW25pb290LmlvLm5pb290c2VydmVyLmFwcGxpY2F0aW9uczo6QXBwbGljYXRpb246OTldD2NvbW1hbmQEAAtjb2xvcgSBhMJCC2xldmVsBAEB";
    var data = "CgsBD2FwcE5hbWUGGUJhcmF0aG9uLnN3ZgV0cgaBbUFwcGxpY2F0aW9uIDogW0FwcGxpY2F0aW9u"+
        "IG5hbWU9IkRlYnVnQXBwIl0gam9pbmVkIHRvIFtTb2NrZXROb2RlIGhvc3Q9IjE3OC4xNzAuMTE0"+
        "LjI2IiBwb3J0PSIxNTE5IiBjb25uZWN0ZWQ9ImZhbHNlIl0NY2FsbGVyBmdbbmlvb3QuaW8ubmlv"+
        "b3RzZXJ2ZXIuYXBwbGljYXRpb25zOjpBcHBsaWNhdGlvbjo5OV0PY29tbWFuZAQAC2NvbG9yBIGE"+
        "wkILbGV2ZWwEAQE=";
    var data2 = "CgcDZQEACERlYnVnQXBwAQAAAAABAAAAAAEKCwENY2FsbGVyBmdbbmlvb3QuaW8ubmlvb3RzZXJ2"+
    "ZXIuYXBwbGljYXRpb25zOjpBcHBsaWNhdGlvbjo5OV0PY29tbWFuZAQABXRyBoFtQXBwbGljYXRp"+
    "b24gOiBbQXBwbGljYXRpb24gbmFtZT0iRGVidWdBcHAiXSBqb2luZWQgdG8gW1NvY2tldE5vZGUg"+
    "aG9zdD0iMTc4LjE3MC4xMTQuMjYiIHBvcnQ9IjE1MTkiIGNvbm5lY3RlZD0iZmFsc2UiXQtjb2xv"+
    "cgSBhMJCC2xldmVsBAEPYXBwTmFtZQYZQmFyYXRob24uc3dmAQ==";

   var data3= "CgcDZQEACERlYnVnQXBwAQAAAAABAAAAAAEKCwENY2FsbGVyBmdbbmlvb3QuaW8ubmlvb3RzZXJ2"+
    "ZXIuYXBwbGljYXRpb25zOjpBcHBsaWNhdGlvbjo5OV0PYXBwTmFtZQYZQmFyYXRob24uc3dmD2Nv"+
    "bW1hbmQEAAtjb2xvcgSBhMJCC2xldmVsBAEFdHIGgW1BcHBsaWNhdGlvbiA6IFtBcHBsaWNhdGlv"+
    "biBuYW1lPSJEZWJ1Z0FwcCJdIGpvaW5lZCB0byBbU29ja2V0Tm9kZSBob3N0PSIxNzguMTcwLjEx"+
    "NC4yNiIgcG9ydD0iMTUxOSIgY29ubmVjdGVkPSJmYWxzZSJdAQ==";
    var data4 = "CgcDZQEACERlYnVnQXBwAQAAAAABAAAAAAEKCwENY2FsbGVyBmdbbmlvb3QuaW8ubmlvb3RzZXJ2"+
    "ZXIuYXBwbGljYXRpb25zOjpBcHBsaWNhdGlvbjo5OV0PYXBwTmFtZQYZQmFyYXRob24uc3dmD2Nv"+
    "bW1hbmQEAAtjb2xvcgSBhMJCC2xldmVsBAEFdHIGgW1BcHBsaWNhdGlvbiA6IFtBcHBsaWNhdGlv"+
    "biBuYW1lPSJEZWJ1Z0FwcCJdIGpvaW5lZCB0byBbU29ja2V0Tm9kZSBob3N0PSIxNzguMTcwLjEx"+
    "NC4yNiIgcG9ydD0iMTUxOSIgY29ubmVjdGVkPSJmYWxzZSJdAQoHA2UBAAhEZWJ1Z0FwcAEAAAAA"+
    "AQAAAAABCgsBDWNhbGxlcgZnW25pb290LmlvLm5pb290c2VydmVyLmFwcGxpY2F0aW9uczo6QXBw"+
    "bGljYXRpb246OTldD2FwcE5hbWUGGUJhcmF0aG9uLnN3Zg9jb21tYW5kBAALY29sb3IEgYTCQgts"+
    "ZXZlbAQBBXRyBoFtQXBwbGljYXRpb24gOiBbQXBwbGljYXRpb24gbmFtZT0iRGVidWdBcHAiXSBq"+
    "b2luZWQgdG8gW1NvY2tldE5vZGUgaG9zdD0iMTc4LjE3MC4xMTQuMjYiIHBvcnQ9IjE1MTkiIGNv"+
    "bm5lY3RlZD0iZmFsc2UiXQE=";
  /*  var b = new ByteArray("CgsBD2FwcE5hbWUGGUJhcmF0aG9uLnN3ZgV0cgaBbUFwcGxpY2F0aW9uIDogW0FwcGxpY2F0aW9u"+
    "IG5hbWU9IkRlYnVnQXBwIl0gam9pbmVkIHRvIFtTb2NrZXROb2RlIGhvc3Q9IjE3OC4xNzAuMTE0"+
    "LjI2IiBwb3J0PSIxNTE5IiBjb25uZWN0ZWQ9ImZhbHNlIl0NY2FsbGVyBmdbbmlvb3QuaW8ubmlv"+
    "b3RzZXJ2ZXIuYXBwbGljYXRpb25zOjpBcHBsaWNhdGlvbjo5OV0PY29tbWFuZAQAC2NvbG9yBIGE"+
    "wkILbGV2ZWwEAQE=");
    b.position = 0;
    console.log(b.readObject());   */
   /*var b = new ByteArray();    /*appName=Barathon.swf
    tr=Application : [Application name="DebugApp"] joined to [SocketNode host="178.170.114.26" port="1519" connected="false"]
    caller=[nioot.io.niootserver.applications::Application:99]
    command=0
    color=4342338
    level=1                       */  /*
    AMF.addMapping(node.ApplicationMessage);
    var app = new node.ApplicationMessage();
    app.application = "DebugApp";
    app.applicationID = 0;
    app.data =  {command:0, level:1, color:4342338,appName:"Barathon.swf",tr:'Application : [Application name="DebugApp"] joined to [SocketNode host="178.170.114.26" port="1519" connected="false"]',caller:"[nioot.io.niootserver.applications::Application:99]"};

    b.writeObject(app);
    b.position = 0;   */
   //var breal = new ByteArray("CgdJbmlvb3QuaW8ubWFwcGluZzo6QXBwbGljYXRpb25NZXNzYWdlAQAIRGVidWdBcHABAAAAAAEAAAAAAQoLAQ9hcHBOYW1lBhlCYXJhdGhvbi5zd2YFdHIGgW1BcHBsaWNhdGlvbiA6IFtBcHBsaWNhdGlvbiBuYW1lPSJEZWJ1Z0FwcCJdIGpvaW5lZCB0byBbU29ja2V0Tm9kZSBob3N0PSIxNzguMTcwLjExNC4yNiIgcG9ydD0iMTUxOSIgY29ubmVjdGVkPSJmYWxzZSJdDWNhbGxlcgZnW25pb290LmlvLm5pb290c2VydmVyLmFwcGxpY2F0aW9uczo6QXBwbGljYXRpb246OTldD2NvbW1hbmQEAAtjb2xvcgSBhMJCC2xldmVsBAEB","base64");
   // data0 = "CgcDYwEAAAABAQAIRGVidWdBcHABCgsBEXBhc3N3b3JkAQE=";
    data0 = ":CgcDaQEACERlYnVnQXBwAQAAAAABAAAAAAEKCwEPYXBwTmFtZQYZQmFyYXRob24uc3dmBXRyBoFtQXBwbGljYXRpb24gOiBbQXBwbGljYXRpb24gbmFtZT0iRGVidWdBcHAiXSBqb2luZWQgdG8gW1NvY2tldE5vZGUgaG9zdD0iMTc4LjE3MC4xMTQuMjYiIHBvcnQ9IjE1MTkiIGNvbm5lY3RlZD0iZmFsc2UiXQ1jYWxsZXIGZ1tuaW9vdC5pby5uaW9vdHNlcnZlci5hcHBsaWNhdGlvbnM6OkFwcGxpY2F0aW9uOjk5XQ9jb21tYW5kBAALY29sb3IEgYTCQgtsZXZlbAQBAQ==";
    var breal = new ByteArray(data0,"base64");
    console.log(breal.readObject());
    breal.position = 0;
    console.log(breal.toString("base64"));
    for(var i=0; i<10; i++)
    {
        console.log(breal.readUnsignedByte());
    }
       /*
    breal.position = 0;
    console.warn(breal.readObject());
    console.log(app);
    breal.position = 0;
    console.warn(breal.readObject().readData);
    breal.position = 0;
    for(var i=0; i<10; i++)
    {
        console.log(b._buffer.readUInt8()+":"+breal._buffer.readUInt8());
    }
   // test.equal(b.toString("base64"), data);
    console.log(b.toString("base64"));   */
    test.done();

}