

rules = [
  {action: "none", name:"string",          expr:/^("[^"\\\r\n]*(?:\\.[^"\\\r\n]*)*")/,   groups:1},
  {action: "none", name:"stringTic",       expr:/^('[^\\\r\n]*(?:\\.[^\\\r\n]*)*')/,     groups:1},
  {action: "none", name:"stringTipple",    expr:/^("""[^\\\r\n]*(?:\\.[^\\\r\n]*)*""")/, groups:1},
  {action: "none", name:"stringTippleTic", expr:/^('''[^\\\r\n]*(?:\\.[^\\\r\n]*)*''')/, groups:1},

  {action: "pop" , name:"end",             expr:/^\bend\b/,                              groups:1},

  {action: "none", name:"longComment",     expr:/^#=((?:\s|.)*?)=#/,                     groups:1},
  {action: "none", name:"comment",         expr:/^(#[^=].*)/,                            groups:1},

  // Comprehensions and such spell trouble: x = [(i,j) for i=1:3 for j=1:i if i+j == 4]
  {action: "none", name:"comprehension",   expr:/^(\[+(?:.*)\bfor*\b(?:.*)\])/,          groups:1},
  {action: "none", name:"arrayIndexing",   expr:/^(\[+[^\]]*:*\bend\b\])/,                   groups:1},
  {action: "none", name:"generator",       expr:/^(\w+\(+(?:.*)\bfor*\b(?:.*)\))/,       groups:1},

  {action: "push", name:"function",        expr:/^\bfunction\b\s(\w*!*)*\((.*)\)/,       groups:2},
  {action: "push", name:"JuliaFile",       expr:/^\bJuliaFile\b\s(?:[C:\\]*)*([\w\\/]*.jl)/,   groups:1},
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
  {action: "push", name:"begin",           expr:/^(\w*\s*(?:(?:=)|(?:\->))\s*)\bbegin\b/,groups:1},
  {action: "push", name:"for",             expr:/^\bfor\b([^;\n]*;?)/,                   groups:1},
  {action: "push", name:"if",              expr:/^\bif\b([^;\n]*;?)/,                    groups:1},
  {action: "pupo", name:"elseif",          expr:/^\belseif\b([^;\n]*;?)/,                groups:1},
  {action: "pupo", name:"else",            expr:/^\belse\b/,                             groups:1},
  {action: "push", name:"try",             expr:/^(.*)\btry\b/,                          groups:1},
  {action: "pupo", name:"catch",           expr:/^\bcatch\b([^;\n]*;?)/,                 groups:1},
  {action: "pupo", name:"finally",         expr:/^\bfinally\b([^;\n]*;?)/,               groups:1},

  {action: "none", name:"boolean",         expr:/^\b(true|false)\b/,                     groups:1},
  {action: "none", name:"number",          expr:/^(\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?\b)/, groups:1}, // TODO: fix
  {action: "none", name:"operator",        expr:/^(\+=?|-=?|\*=?|\/[\/=]?|\\=?|\^=?|%=?|÷=?|!=?=?|&=?|\|[=>]?|\$=?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥])/, groups:1},
  {action: "none", name:"punctuation",     expr:/^([{}[\];,.:\(\)])/,                        groups:1},
  // SPEACIAL USE: {name:"lines", expr:/^(.*\s)/, groups:1},
  {action: "none", name:"keyword",         expr:/^\b(abstract|bitstype|break|ccall|const|continue|export|global|immutable|import|importall|local|return|typealias|using)\b/, groups:1},
  {action: "none", name:"print",           expr:/^\b(print|println)\b/,                  groups:1},
  {action: "none", name:"macro",           expr:/^(@\w+)/,                               groups:1},
  //{action: "none", name:"tuple",           expr:/^(\(.*\))/,                             groups:1},

  {action: "none", name:"word",            expr:/^(\w+)/,                                groups:1},
  {action: "none", name:"Newline",            expr:/^([\n\r]+)/,                                groups:1},

  {action: "none", name:"space",    expr:/^([\t\r\s]+)/,                       groups:1},
  {action: "none", name:"unidentified",    expr:/^(.)/,                       groups:1}
  // {name:"newline",         expr:/^(\n|\r)/,                              groups:1},
  // {name:"space",           expr:/^(\s+)/,                                groups:1}
    // mutable struct, let ... end,
    ];
    tree = [];
    stack = [];


////////////////////////////////////////////////////////////////////////////////
function dumpTokens(str){
  tree = [{type:"root", children:[] }];
  stack.push({type:"root", node:tree[0]});
  newstring = "";
    newstring = getNextToken(str);

    printOut(newstring);
    while (newstring !== null) {
            newstring = getNextToken(newstring.match[newstring.match.length-1]);
            var token = printOut(newstring);
            if(token === undefined){break;}
            //console.log( token.type + ": " + newstring.action );
            if(stack[stack.length-1] !== undefined ){
              var node = stack[stack.length-1].node;}
            //     "none" "push" "pop" "pupo"
            switch (newstring.action) {
                  case "none": node.children.push(token); break;

                  case "push": node.children.push(token);
                               var newNode = node.children[node.children.length-1];
                               stack.push({type: token.name, node:newNode });  break;

                  case "pop":  stack.pop(); // pop structure opening.
                               node = stack[stack.length-1].node;  // get new parent.
                               node.children.push(token); // push 'end' to new parent.
                               break;

                  case "pupo": stack.pop(); // pop structure opening.
                               node = stack[stack.length-1].node;
                               node.children.push(token); // get new parent.
                               var newNode = node.children[node.children.length-1];
                               stack.push({type: token.name, node:newNode });
                               break;
            }
    } // while
    tree.push({type:"end", children:[], data:[""]}); // make sure the root is closed.

    //alert("str");
    var html = document.getElementById("code");
    var components = toHTML(tree[0].children);
    // alert("Components: " + components)
    html.innerHTML = components;


}
////////////////////////////////////////////////////////////////////////////////
function GenerateId(){ return "id" + Math.random().toString(16).slice(2); }
////////////////////////////////////////////////////////////////////////////////
// tree is an array of nodes
////////////////////////////////////////////////////////////////////////////////
function toHTML(list){
  var str = "", buf = "", code = "";
  //var id = "someId";
  var tabs = [];

for (var i = 0; i < list.length; i++) {

    var children = "", data = "", type = "";
/*
        EXAMPLE:      {children:[], data:[], type:"module"}
*/

    if(list[i].children !== undefined){
          //var kids = list[i].children;
          children = '<div class="ln">' + toHTML(list[i].children) + '</div>';
      } else{
        children = "";
      }
    if(list[i].data !== undefined){
        data = list[i].data[0];
        if(list[i].data.length > 1){
        dats = list[i].data[1]; }
    }
        type = list[i].type;


switch (type) {
  // Comprehensions and such spell trouble: x = [(i,j) for i=1:3 for j=1:i if i+j == 4]
        case "stringTippleTic":
        case "stringTipple":
        case "stringTic":
        case "string":  str += '<span class="str">' + data + '</span>';
              break;
        case "macro":   str += '<span class="mkr">' + data + '</span>';
              break;
        case "keyword": str += '<span class="kwd">' + data + '</span>';
              break;
        case "number":  str += '<span class="num">' + data + '</span>';
              break;
        //case "": str += '<span class="fnc">' + data + '</span>'; break;
        case "longComment":
        case "comment": str += '<div class="cmt closeComment"><span><i class="fa fa-times fa"></i>'
             + data + '</span><i class="fa fa-commenting fa"></i></div><br>';
              break;
        // case "": str += '<div class="line">' + data + '</div>'; break;
        case "boolean": str += '<span class="bl">' + data + '</span>';
              break;

        case "unidentified":
        case "operator":
        case "punctuation":
        case "tuple":
        case "word":
        case "space": str += data; break;
        case "Newline": str += '</div><div class="ln">'; break;


        case "print": str += '<span class="sp">' + data + '</span>';
              break;

        case "comprehension":
        case "arrayIndexing":
        case "generator": str += '<span class="gen">' + data + '</span>';
              break;

        case "function":
        case "JuliaFile":
        case "type":
        case "struct":
        str += '<div class="' + type + ' global" style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable"><i class="fa fa-gears fa"></i><span class="name">'
        + data + ' </span> <span class="args">' + data + '</span></div><div class="Body">' + children;
              break;

              case "baremodule":
              case "module": str += '<div class="module " style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable">module ' + data + '</div><div class="Body">' + children;
              break;

        case "do": str += '<div class="' + type + '"><div class="head"><i class="fa fa-gear fa"></i> ' + data + 'do</div><div class="Body">' + children;
              break;
        case "quote": str += '<div class="' + type + '"><div class="head"><i class="fa fa-gear fa"></i> ' + data + 'quote</div><div class="Body">' + children;
              break;
        case "macroDef": str += '<div class="' + type + '"><div class="head"><i class="fa fa-gear fa"></i> ' + data + 'macroDef</div><div class="Body">' + children;
              break;
        case "while": str += '<div class="' + type + '"><div class="head"><i class="fa fa-history fa"></i>while ' + data + '</div><div class="Body">' + children;
              break;

        case "begin": str +=  '<div class="' + type + '"><div class="head"><i class="fa fa-gear fa"></i> ' + data + 'begin</div><div class="Body">' + children;
              break;
        case "for": str += '<div class="' + type + '"><div class="head">for ' + data + '</div><div class="Body">' + children;
              break;


        // Tablike starters
        // var id = GenerateId(); tabs.push(  {tab:"try", id:id}  );
        case "try":
        case "if":  var id = GenerateId(); tabs.push(  {tab:type, id:id}  );
                    buf += '<div id="' + id + '" class="' + type + '" style="display:block;"><div class="head">'
              + data + '</div><div class="Body">' + children;
              break;

        // Tablike inner blocks
        case "catch":
        case "elseif":
        case "else":
        case "finally": var id = GenerateId(); tabs.push(  {tab:type, id:id}  );
              buf += '</div></div><div id="' + id + '" class="' + type + '" style="display:none;"><div class="head">' + data + '</div><div class="Body">' + children;
              break;

        case "end":
                    if( tabs.length > 0){// end of tabbed block
                        str += '<div class="tabBox ' + tabs[0].tab + '">'
                        for (var t in tabs) {
                            str += '<span class="tablink" onclick="openCity(' + tabs[t].id + ', this)" id="'
                            + tabs[t].id + '">' + tabs[t].tab + '</span>';
                        }
                        str += buf + '<div class="end">end</div> </div></div>   </div>'; // WAS: str.slice(n[i].start, n[i].length)
                        tabs = []; buf = ""; children = "";
                    } else{ // end of normal block

                        str += '<div class="end">end</div> </div></div>'; //  buf + tabs = []; buf = "";
                        tabs = []; buf = ""; children = "";
                    }
         break;
} // switch
} // for
//console.log(str)
 return str;
}
////////////////////////////////////////////////////////////////////////////////
function printOut(obj){
   if(obj === null){return;}

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
    //alert("Warning: no token match! -->" + str.slice(0, 50) + '<-- length:' + str.length)
  return null;
}
////////////////////////////////////////////////////////////////////////////////
