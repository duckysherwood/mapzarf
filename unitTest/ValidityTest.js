load("/appdata/lib/jsunit-1.3/jsunit/lib/JsUtil.js");
load("/appdata/lib/jsunit-1.3/jsunit/lib/JsUnit.js");
load("../Validator.js")
print("starting validity-checking test cases");

function ValidityTest(name)
{
    TestCase.call( this, name );
}


function ValidityTest_setUp() {
  print("ValidityTest set up");
}

function ValidityTest_testText() {
  this.assertTrue(Validator.isLegalText('Four score and seven years ago'));
  this.assertTrue(Validator.isLegalText('U.S. Census Bureau. Top Brass.'));

  this.assertFalse(Validator.isLegalText('<a href="http://foo.com/lasjf?alsjf">blah</a>'));
  this.assertTrue(Validator.isLegalText('\);drop tables'));
   
}

function ValidityTest_testInt() {
  this.assertTrue(Validator.isLegalInt(3));
  this.assertTrue(Validator.isLegalInt(-3));

  this.assertFalse(Validator.isLegalInt("lasjf"));
  this.assertFalse(Validator.isLegalInt(false));
  this.assertFalse(Validator.isLegalInt(3.1415926));
  this.assertFalse(Validator.isLegalInt(true));
  this.assertFalse(Validator.isLegalInt(false));
}

function ValidityTest_testWord() {
  this.assertTrue("blah", Validator.isLegalWord("blah"));
  this.assertTrue("taxReturn_1973", Validator.isLegalWord("taxReturn_1973"));
  this.assertTrue("alt.sex.sheep.bleat.bleat.bleat", 
              Validator.isLegalWord("alt.sex.sheep.bleat.bleat.bleat"));

  this.assertFalse(Validator.isLegalWord('\"));callDanger()'));
  this.assertFalse("multiple words", Validator.isLegalWord("this is a text not a word"));
  this.assertFalse("true", Validator.isLegalWord(true));
  this.assertFalse("false", Validator.isLegalWord(false));
}

function ValidityTest_testFloat() {
  this.assertTrue("3.25", Validator.isLegalFloat(3.25));
  this.assertTrue("-10.35", Validator.isLegalFloat(10.35));
  this.assertTrue("-.35", Validator.isLegalFloat(-.35));
  this.assertTrue(".35", Validator.isLegalFloat(.35));
  this.assertTrue("-0.35", Validator.isLegalFloat(-0.35));
  this.assertTrue("-3", Validator.isLegalFloat(-3));
  this.assertTrue("3", Validator.isLegalFloat(3));

  this.assertFalse("aslfdj", Validator.isLegalFloat("lskjfsa"));
  this.assertFalse("true", Validator.isLegalFloat(true));
  this.assertFalse("false", Validator.isLegalFloat(false));
}

function ValidityTest_testUrlString() {

  var url = "http://localhost/y.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/y.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/vanilla/x/y.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/poundSign.html#toppage";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/question-mark/x/y?";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/small-qstring/x/y?a=b";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/percent-20/x/y?a=b&c=d&f=//20";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/gobs/x/foo//2F?bar=baz//20&x=3#foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/moo-blah/x/foo//2F+other?bar=baz//20&#foo"
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://webfoot.com:2222/port/x/foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://ducky:#$//#^@webfoot.com:2222/uname-port/x/foo?bar=baz&x=3#foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://www.data.gov.bc.ca/dbc/catalogue/detail.page?config=dbc&P110=recorduid//3A17554";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://www.data.gov.bc.ca/dbc/catalogue/detail.page?config=dbc&P110=recorduid//3A175544&recorduid=175544&title=BC//20Schools//20-%20School%20Locations%20-%20Current";
  this.assertTrue(url, Validator.isLegalUrl(url), url);

  url = "http://localhost.com/port/x/foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://localhost.com:2222/port/x/foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "http://localhost.com:2222/foo.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);

  // This could actually be a valid relative (file) URL
  url = "http//tmp.webfoot.com/no-colon/x/y"; // no colon
  this.assertTrue(url, Validator.isLegalUrl(url), url);

  url = "http://tmp.webfoot.com/space space/x/y?x-y"; // space
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = "http://tmp.webfoot.com/scary,chars!/x/y?x-y";  // scary chars
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = 'http://tmp.webfoot.com/evil");chars!/x/y';  // evil chars
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = "http://23!9724@tmp.webfoot.com/bad-username/x/y?"; // bad username
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = ":http://ducky@tmp.webfoot.com/leading-colon/x/y?"; // leading colon
  this.assertFalse(url, Validator.isLegalUrl(url), url);

  // @@@ why is this failing?
  url = "http://a.tile.openstreetmap.org/%24%7Bz%7D/%24%7Bx%7D/%24%7By%7D.png";
  this.assertTrue(url, Validator.isLegalUrl(url), url);

  // relative URLs
  url = "/vanilla/x/y";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "./poundSign#toppage";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "../question-mark/x/y?";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "/small-qstring/x/y?a=b";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "./percent-20/x/y?a=b&c=d&f=//20";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "../gobs/x/foo//2F?bar=baz//20&x=3#foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "/moo-blah/x/foo//2F+other?bar=baz//20&#foo"
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "./x/foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "../x/foo?bar=baz&x=3#foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "../../../x/triple-double?bar=baz&x=3#foo";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "./dotFile.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);
  url = "nakedFile.html";
  this.assertTrue(url, Validator.isLegalUrl(url), url);

  url = "space space/x/y?x-y"; // space
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = "scary,chars!/x/y?x-y";  // scary chars
  this.assertFalse(url, Validator.isLegalUrl(url), url);
  url = '/evil");chars!/x/y';  // evil chars
  this.assertFalse(url, Validator.isLegalUrl(url), url);

  // booleans
  this.assertFalse("true", Validator.isLegalUrl(true));
  this.assertFalse("false", Validator.isLegalUrl(false));
}


ValidityTest.prototype = new TestCase();
ValidityTest.glue();
// ValidityTest.prototype.setUp = new ValidityTest_setUp;
// ValidityTest.prototype.testInt = new ValidityTest_testInt;
// ValidityTest.prototype.testFloat = new ValidityTest_testFloat;
// ValidityTest.prototype.testWord = new ValidityTest_testWord;
// ValidityTest.prototype.testUrlString = new ValidityTest_testUrlString;

function ValidityTestSuite() {
    TestSuite.call( this, "ValidityTestSuite" );
    this.addTestSuite( ValidityTest );
}

ValidityTestSuite.prototype = new TestSuite();
ValidityTestSuite.prototype.suite = function() {
  return new ValidityTestSuite();
}


function AllTests()
{
    TestSuite.call( this, "AllTests" );
}

function AllTests_suite() {
    var suite = new AllTests();
    suite.addTest( ValidityTestSuite.prototype.suite());
    return suite;
}

AllTests.prototype = new TestSuite();
AllTests.prototype.suite = AllTests_suite;

var args;
if( this.WScript )
{
    args = new Array();
    for( var i = 0; i < WScript.Arguments.Count(); ++i )
        args[i] = WScript.Arguments( i );
}
else if( this.arguments )
    args = arguments;
else
    args = new Array();

var result = TextTestRunner.prototype.main( args );
JsUtil.prototype.quit( result );

