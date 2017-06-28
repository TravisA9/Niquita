
str = 'function makePoint(x::Float32, y::Float32)\nbaremodule myBareModule\n# this is a useless Function to make a Point\npoint = Point(x,y)\nreturn point\nend';

rules = [
  {name:"string",    expr:/^("[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*")/, groups:1},
  {name:"stringTic",    expr:/^('[^\\\r\n]*(?:\\.[^\\\r\n]*)*')/, groups:1},
  {name:"stringTipple",    expr:/^("""[^\\\r\n]*(?:\\.[^\\\r\n]*)*""")/, groups:1},
  {name:"stringTippleTic",    expr:/^('''[^\\\r\n]*(?:\\.[^\\\r\n]*)*''')/, groups:1},

  {name:"longComment", expr:/^#=((?:\s|.)*?)=#/, groups:1},
  {name:"comment", expr:/^(#[^=].*)/, groups:1},

  // Comprehensions and such spell trouble: x = [(i,j) for i=1:3 for j=1:i if i+j == 4]
  {name:"comprehension",   expr:/^(\[+(?:.*)\bfor*\b(?:.*)\])/,       groups:1},
  {name:"arrayIndexing",   expr:/^(\[+.*:*end\])/,       groups:1},
  {name:"generator",   expr:/^(\w+\(+(?:.*)\bfor*\b(?:.*)\))/,       groups:1},

  {name:"function",   expr:/^function\s(\w*!*)*\((.*)\)/,       groups:2},
  {name:"JuliaFile",  expr:/^JuliaFile\s[C:\\]*([\w\\]*.jl)/,   groups:1},
  {name:"module",     expr:/^module\s([\w\\]*)/,                groups:1},
  {name:"baremodule", expr:/^baremodule\s([\w\\]*)/,            groups:1},
  {name:"do",         expr:/^(\w*\s*=*\s\w*)\((.*)\)\s*do(.*)/, groups:3},

  {name:"boolean", expr:/^\b(true|false)\b/, groups:1},
  {name:"number", expr:/^(\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?\b)/, groups:1}, // TODO: fix
  {name:"operator", expr:/^(\+=?|-=?|\*=?|\/[\/=]?|\\=?|\^=?|%=?|÷=?|!=?=?|&=?|\|[=>]?|\$=?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥])/, groups:1},
  {name:"punctuation", expr:/^([{}[\];,.:])/, groups:1},
  {name:"newline", expr:/^(\n|\r)/, groups:1},
  // SPEACIAL USE: {name:"lines", expr:/^(.*\s)/, groups:1},
  {name:"keyword", expr:/^\b(abstract|bitstype|break|ccall|const|continue|export|global|immutable|import|importall|local|return|typealias|using)\b/, groups:1},
  {name:"print", expr:/^\b(print|println)\b/, groups:1},
  {name:"macro", expr:/^(@\w+)/, groups:1},
  {name:"word", expr:/^(\w+)/, groups:1},
  {name:"space", expr:/^(\s+)/, groups:1}
    // mutable struct, let ... end,
    ];

////////////////////////////////////////////////////////////////////////////////
function getNextToken(str){
  //eat newline: var s = str.split(/^\n/); (s.length == 1) ? str = s[0]:str = s[1];

    for (var i = 0; i < rules.length; i++) {
      result = str.split(rules[i].expr);
      if(result.length > 1){
        return {name:rules[i].name, match:result};
      }
    }
  return null;
}
////////////////////////////////////////////////////////////////////////////////
function dumpTokens(str){
    newstring = getNextToken(str);
    console.log( newstring )
    while (newstring !== null) {
      newstring = getNextToken(newstring.match[newstring.match.length-1]);
      console.log( newstring )
    }
}

dumpTokens(str);






//  newstring = getNextToken(str);
// getNextToken(newstring.match[newstring.match.length-1]);
