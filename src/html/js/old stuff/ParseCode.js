
longcomment = /((?:(#=)(?:\s|.)*?(=#))|(#.*))/g;
comment = /(#.*)/g;
string = /((?:("""|'''|["'])(?:(?=(\\?))\3.)*?(?:\2)))/g;
// Linked functions: ((?:[\w]+\.)+(?:[\w]+))\(.+\) //EX: fast.faster.foo_bar(c)
functions = /([\w]+)(\((?:.)*\))+/g;
boolean = /\b(true|false)\b/g;
number = /(\b-?(0[box])?(?:[\da-f]+\.?\d*|\.\d+)(?:[efp][+-]?\d+)?j?\b)/g; //i;
// -?(0[box][\da-f]+)
operator = /\+=?|-=?|\*=?|\/[\/=]?|\\=?|\^=?|%=?|÷=?|!=?=?|&=?|\|[=>]?|\$=?|<(?:<=?|[=:])?|>(?:=|>>?=?)?|==?=?|[~≠≤≥]/g;
punctuation = /([{}[\];,.:])/g; // removed these: ()
newline = /\\n|\\r/g; // removed these: ()
lines = /(.*)\s/g //(?:(.+?)(?=\\n))(\\n)/g; //
keyword = /\b(abstract|baremodule|begin|bitstype|break|catch|ccall|const|continue|do|else|elseif|end|export|finally|for|function|global|if|immutable|import|importall|let|local|macro|module|print|println|quote|return|try|type|typealias|using|while)\b/g;
boolean = /\b(true|false)\b/g;
macro =/(@\w+)/g;

////////////////////////////////////////////////////////////////////////////////
function parseCode(str){
  match = string.exec(str);
  if(match != -1){
  str = str.replace(string, '<span class="str">$1</span>'); }
  // Keyword parse
  match = macro.exec(str);
  if(match != -1){
  str = str.replace(macro, '<span class="mkr">$1</span>'); }

  // Keyword parse
  match = keyword.exec(str);
  if(match != -1){
  str = str.replace(keyword, '<span class="kwd">$1</span>'); }

  // number parse
  match = number.exec(str);
  if(match != -1){
  str = str.replace(number, '<span class="num">$1</span>'); }


  // functions parse
  match = functions.exec(str);
  if(match != -1){
  str = str.replace(functions, '<span class="fnc">$1</span>$2'); }

  // comment parse
  match = comment.exec(str);
  if(match != -1){
  str = str.replace(comment, '<div class="cmt closeComment"><span><i class="fa fa-times fa"></i>$1</span><i class="fa fa-commenting fa"></i></div><br>'); }
  str = str.replace(lines, '<div class="line">$1</div>'); // <div>$1</div>

// boolean parse
var match = boolean.exec(str);

str = str.replace(boolean, '<span class="bl">$1</span>');
// operator parse
//var match = operator.exec(str); //kwd .str .pct .op .num, .bl .fnc .cmt
//if(match != -1){
//  str = str.replace(operator, '<span class="op">$1</span>'); }
// punctuation parse
var match = punctuation.exec(str);
if(match != -1){
str = str.replace(punctuation, '<span class="pct">$1</span>'); }
  return str;
}
////////////////////////////////////////////////////////////////////////////////
