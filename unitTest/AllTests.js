load("/appdata/lib/jsunit-1.3/jsunit/lib/JsUtil.js");
load("/appdata/lib/jsunit-1.3/jsunit/lib/JsUnit.js");
load("../Validator.js")
load("./ValidityTest.js")
print("starting validity-checking test cases");


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

