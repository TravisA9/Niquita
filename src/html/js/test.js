
str = 'function makePoint(x::Float32, y::Float32)\nbaremodule myBareModule\n# this is a useless Function to make a Point\npoint = Point(x,y)\nreturn point\nend';

rules = [
  {action: "none", name:"string",          expr:/^("[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*")/,   groups:1},
  {action: "none", name:"stringTic",       expr:/^('[^\\\r\n]*(?:\\.[^\\\r\n]*)*')/,     groups:1},
  {action: "none", name:"stringTipple",    expr:/^("""[^\\\r\n]*(?:\\.[^\\\r\n]*)*""")/, groups:1},
  {action: "none", name:"stringTippleTic", expr:/^('''[^\\\r\n]*(?:\\.[^\\\r\n]*)*''')/, groups:1},

  {action: "none", name:"longComment",     expr:/^#=((?:\s|.)*?)=#/,                     groups:1},
  {action: "none", name:"comment",         expr:/^(#[^=].*)/,                            groups:1},

  // Comprehensions and such spell trouble: x = [(i,j) for i=1:3 for j=1:i if i+j == 4]
  {action: "none", name:"comprehension",   expr:/^(\[+(?:.*)\bfor*\b(?:.*)\])/,          groups:1},
  {action: "none", name:"arrayIndexing",   expr:/^(\[+.*:*\bend\b\])/,                   groups:1},
  {action: "none", name:"generator",       expr:/^(\w+\(+(?:.*)\bfor*\b(?:.*)\))/,       groups:1},

  {action: "push", name:"function",        expr:/^\bfunction\b\s(\w*!*)*\((.*)\)/,       groups:2},
  {action: "push", name:"JuliaFile",       expr:/^\bJuliaFile\b\s[C:\\]*([\w\\]*.jl)/,   groups:1},
  {action: "push", name:"module",          expr:/^\bmodule\b\s([\w\\]*)/,                groups:1},
  {action: "push", name:"baremodule",      expr:/^\bbaremodule\b\s([\w\\]*)/,            groups:1},
  {action: "push", name:"do",              expr:/^(\w*\s*=*\s\w*)\((.*)\)\s*\bdo\b(.*)/, groups:3},

  // Cool trick: ([^;\n]*;?) ...get everything til  ; || \n
  {action: "push", name:"quote",           expr:/^(\w*\s*=\s*)\bquote\b/,                groups:1},
  {action: "push", name:"macroDef",        expr:/^\bmacro\b(\s+\w+\(.*\))/,              groups:1},
  {action: "push", name:"while",           expr:/^\bwhile\b([^;\n]*;?)/,                 groups:1},
  {action: "push", name:"type",            expr:/^\btype\b(.*)/,                         groups:1},
  {action: "push", name:"struct",          expr:/^\bstruct\b(.*)/,                       groups:1},
  {action: "push", name:"structMutable",   expr:/^\bmutable\b\s+\bstruct\b(.*)/,         groups:1},
  {action: "push", name:"begin",           expr:/^(\w*\s*=\s*)\bbegin\b/,                groups:1},
  {action: "push", name:"for",             expr:/^\bfor\b([^;\n]*;?)/,                   groups:1},
  {action: "push", name:"if",              expr:/^\bif\b([^;\n]*;?)/,                    groups:1},
  {action: "pupo", name:"elseif",          expr:/^\belseif\b([^;\n]*;?)/,                groups:1},
  {action: "pupo", name:"else",            expr:/^\belse\b/,                             groups:1},
  {action: "push", name:"try",             expr:/^(.*)\btry\b/,                          groups:1},
  {action: "pupo", name:"catch",           expr:/^\bcatch\b([^;\n]*;?)/,                 groups:1},
  {action: "pupo", name:"finally",         expr:/^\bfinally\b([^;\n]*;?)/,               groups:1},
  {action: "pop" , name:"end",             expr:/^\bend\b/,                              groups:1},

  {action: "none", name:"boolean",         expr:/^\b(true|false)\b/,                     groups:1},
  {action: "none", name:"number",          expr:/^(\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?\b)/, groups:1}, // TODO: fix
  {action: "none", name:"operator",        expr:/^(\+=?|-=?|\*=?|\/[\/=]?|\\=?|\^=?|%=?|÷=?|!=?=?|&=?|\|[=>]?|\$=?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥])/, groups:1},
  {action: "none", name:"punctuation",     expr:/^([{}[\];,.:])/,                        groups:1},
  // SPEACIAL USE: {name:"lines", expr:/^(.*\s)/, groups:1},
  {action: "none", name:"keyword",         expr:/^\b(abstract|bitstype|break|ccall|const|continue|export|global|immutable|import|importall|local|return|typealias|using)\b/, groups:1},
  {action: "none", name:"print",           expr:/^\b(print|println)\b/,                  groups:1},
  {action: "none", name:"macro",           expr:/^(@\w+)/,                               groups:1},
  {action: "none", name:"tuple",           expr:/^(\(.*\))/,                             groups:1},

  {action: "none", name:"word",            expr:/^(\w+)/,                                groups:1},

  {action: "none", name:"spaceNewline",    expr:/^([\n\r\t\r\s])/,                       groups:1}
  // {name:"newline",         expr:/^(\n|\r)/,                              groups:1},
  // {name:"space",           expr:/^(\s+)/,                                groups:1}
    // mutable struct, let ... end,
    ];
    tree = {type:"root", children:[] };
    stack = [{type:"root", node:tree}];


////////////////////////////////////////////////////////////////////////////////
function dumpTokens(str){
  tree = {type:"root", children:[] };
  stack = [{type:"root", node:tree}];
    newstring = getNextToken(str);

    printOut(newstring);
    while (newstring !== null) {
      newstring = getNextToken(newstring.match[newstring.match.length-1]);
      var token = printOut(newstring);
      console.log( token.type + ": " + newstring.action );
      var node = stack[stack.length-1].node;
      //     "none" "push" "pop" "pupo"
      switch (newstring.action) {
            case "none": node.children.push(token); break;

            case "push": node.children.push(token);
                         var newNode = node.children[node.children.length-1];
                         stack.push({type: token.name, node:newNode });  break;

            case "pop":  stack.pop(); node.children.push(token); break;

            case "pupo": stack.pop();
                         node = stack[stack.length-1].node;
                         node.children.push(token);
                         break;
      }

    }
}
////////////////////////////////////////////////////////////////////////////////
function printOut(obj){
   if(obj.match ===null){return;}

    switch (obj.match.length) {
      case 1: // console.log( obj.name + ": " + obj.match[0] );
              return {type: obj.name, data:[obj.match[0]], children:[] };
              break;
      case 2: // console.log( obj.name + ": " + obj.match[0] );
              return {type: obj.name, data:[obj.match[0]], children:[] };
              break;
      case 3: // console.log( obj.name + ": " + obj.match[1] );
              return {type: obj.name, data:[obj.match[1]], children:[] };
              break;
      case 4: // console.log( obj.name + ": " + obj.match[1] + "  -  " + obj.match[2] );
              return {type: obj.name, data:[obj.match[1],obj.match[2]], children:[] };
              break;
    }

}
////////////////////////////////////////////////////////////////////////////////
function getNextToken(str){
  //eat newline: var s = str.split(/^\n/); (s.length == 1) ? str = s[0]:str = s[1];

    for (var i = 0; i < rules.length; i++) {
      result = str.split(rules[i].expr);
      if(result.length > 1){
        return { action:rules[i].action, name:rules[i].name, match:result};
      }
    }
  return null;
}
////////////////////////////////////////////////////////////////////////////////
// dumpTokens(str);






//  newstring = getNextToken(str);
// getNextToken(newstring.match[newstring.match.length-1]);
