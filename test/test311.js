if(typeof exports === 'object') {
	var assert = require("assert");
	var alasql = require('..');
} else {
	__dirname = '.';
};

describe('Test 311 Special SEARCHors', function() {

  it('0. Create database ',function(done){
    alasql('CREATE DATABASE test311;USE test31');
    done();
  });


  it('1. CREATE GRAPH',function(done){
//    var res = alasql.parse('CREATE GRAPH #Andrey');
    var data = [{a:1,b:10},{a:2,b:20},{a:3,b:30},{a:4,b:40},{a:5,b:50},{a:5,b:50}];
    var res = alasql('SEARCH DISTINCT(b)');
    var res = alasql('SEARCH UNION(a,b)');
    var res = alasql('SEARCH UNION ALL(a,b)');
    var res = alasql('SEARCH INTERSECT(a,b)');
    var res = alasql('SEARCH EXCEPT(a,b)');
    var res = alasql('SEARCH CROSS JOIN(a,b)');
    var res = alasql('SEARCH MERGE(@a,@b)');
    var res = alasql('SEARCH DELETE(@a,@b)'); // properties
    var res = alasql('SEARCH REMOVE(@a,@b)'); // graphs
    var res = alasql('SEARCH RETURNS(a AS b, b+1 AS c)'); // graphs

    var res = alasql('SEARCH ORDER BY() '); // graphs

    var res = alasql('SEARCH EVEN()'); // graphs
    var res = alasql('SEARCH ODD()'); // graphs
    var res = alasql('SEARCH NTH(2)'); // graphs -??
    var res = alasql('SEARCH SLICE(2,2)'); // graphs -??

// selector ORDER BY (a,b,c)

    console.log(res);

    done();    
  });


  it('99. Drop database ',function(done){
    alasql('DROP DATABASE test311');
    done();
  });

});

