if(typeof exports === 'object') {
	var assert = require("assert");
	var alasql = require('..');
} else {
	__dirname = '.';
};

describe('Test 308 sub SEARCH', function() {

  it('0. Create database ',function(done){
    alasql('CREATE DATABASE test308;USE test308');
    done();
  });


  it('1. SET selector',function(done){
    var data = [{a:1,b:10},{a:2,b:20}];
    var res = alasql('SET @q = (SEARCH / b FROM ?)',[data]);
    assert.deepEqual(alasql.vars.q,[ 10, 20 ]);
    done();    
  });

  it('2. SUM and other aggregators',function(done){
    var data = [{a:1,b:10},{a:2,b:20},{a:2,b:30}];
    var res = alasql('SEARCH SUM(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 60 ]);
    var res = alasql('SEARCH AVG(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 20 ]);
    var res = alasql('SEARCH ARRAY(/b) FROM ?',[data]);
    assert.deepEqual(res,[ [10,20,30] ]);
    var res = alasql('SEARCH ARRAY(/b) @(LEN(_))FROM ?',[data]);
    assert.deepEqual(res,[ 3 ]);
    var res = alasql('SEARCH COUNT(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 3 ]);
    var res = alasql('SEARCH MIN(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 10 ]);
    var res = alasql('SEARCH MAX(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 30 ]);
    var res = alasql('SEARCH FIRST(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 10 ]);
    var res = alasql('SEARCH LAST(/b) FROM ?',[data]);
    assert.deepEqual(res,[ 30 ]);
    done();    
  });

  it('2. SUM with nested selector',function(done){
    var data = [{a:1,b:{c:100}},{a:2},{a:2,b:{c:300}}];
    var res = alasql('SEARCH SUM(/b c) FROM ?',[data]);
    assert.deepEqual(res,[ 400 ]);
    done();    
  });

  it('3. Complex SUM with tree selector',function(done){
    var data = [{a:1,b:{c:100}},{c:200},{a:2,b:{d:[{c:300}]}}];
    var res = alasql('SEARCH SUM((/)*c) FROM ?',[data]);
    assert.deepEqual(res,[ 600 ]);
    done();    
  });

  it('4. SUM over graph',function(done){
    alasql('SET @olga = (CREATE VERTEX "Olga" SET age=19)');
    alasql('SET @helen = (CREATE VERTEX "Helen" SET age=42)');
    alasql('SET @pablo = (CREATE VERTEX "Pablo" SET age=35)');
    alasql('SET @andrey = (CREATE VERTEX "Andrey" SET age=44)');
    alasql('SET @sofia = (CREATE VERTEX "Sofia" SET age=23)');
    alasql('CREATE EDGE FROM @olga TO @pablo');
    alasql('CREATE EDGE FROM @helen TO @andrey');
    alasql('CREATE EDGE FROM @pablo TO @sofia');
    alasql('CREATE EDGE FROM @andrey TO @sofia');

    var res = alasql('SEARCH SUM("Olga" (>>)+ age)');
//    console.log(res);
    assert.deepEqual(res, [58]);

    var res = alasql('SEARCH "Olga" SUM((>>)+ age)');
//    console.log(res);
    assert.deepEqual(res, [58]);

    var res = alasql('SEARCH COUNT("Olga" (>>)+ age)');
//    console.log(res);
    assert.deepEqual(res, [2]);

    var res = alasql('SEARCH @person \
      SUM((>>)+ age) @age \
      OK(@age > 50) \
      @[(@person->name),(@age)]');
    assert.deepEqual(res, [ [ 'Olga', 58 ], [ 'Helen', 67 ] ] );

    var res = alasql('SEARCH @person \
      COUNT((>>)+ age) @n \
      OK(@n > 1) \
      @(@person->name)');
    assert.deepEqual(res, [ [ 'Olga', 'Helen' ]] );


//   console.log(res);
//    assert.deepEqual(res, [58]);

    done();    
  });



  it('99. Drop database ',function(done){
    alasql('DROP DATABASE test308');
    done();
  });

});

