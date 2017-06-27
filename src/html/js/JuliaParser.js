// scopes = /\b(JuliaFile|module|function|while|do|type|struct|for|if|else|elseif|try|catch|finally|end)\b/g; // omit 'g' to make match act like exec but in array form
scopes = /\b(JuliaFile|module|function|while|do|type|struct|for|if|else|elseif|try|catch|finally|end)\b/g; // omit 'g' to make match act like exec but in array form

// var content = "";
//'\n if this \n else that end\nusing HttpServer\nusing WebSockets\n\n#global Dict to store open connections in\nglobal connections = Dict{Int,WebSocket}()\nglobal usernames   = Dict{Int,String}()\n\nfunction decodeMessage( msg )\n if this \n else that end   String(copy(msg))\nend\nfunction eval_or_describe_error(strmsg)\n   try\n       return eval(parse(strmsg, raise = false))\n   catch err\n        iob = IOBuffer()\n        dump(iob, err)\n        return String(take!(iob))\n   end\nend\n\nwsh = WebSocketHandler() do req, client\n    global connections\n    connections[client.id] = client\n    while true\n        val = client |> read |> decodeMessage |> eval_or_describe_error\n    while something end    output = String(take!(Base.mystreamvar))\n        val = val == nothing ? "<br>" : val\n        write(client,"$val<br>$output")\n    end\nend\n\nonepage = readstring(Pkg.dir("CodeServer","src","repl.html"))\nhttph = HttpHandler() do req::Request, res::Response\n  Response(onepage)\nend\n\nserver = Server(httph, wsh)\nprintln("Repl server listening on 8080...")\n\neval(Base,parse("mystreamvar = IOBuffer()"))\neval(Base,parse("STDOUT = mystreamvar"))\n\nrun(server,8080)\n\n';

////////////////////////////////////////////////////////////////////////////////
//parse();
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
function getComplement(type, str){
 var match ="";

  switch (type) {
    //case "JuliaFile": match = /JuliaFile(\s[C:\\]*[\w\\]*.jl)/.exec(str); break;
    case "JuliaFile": match = str.match(/JuliaFile(\s[C:\\]*([\w\\]*.jl))/); break;
    //case "module": match = /module(\s[\w\\]*)/.exec(str); break;
    case "module": match = str.match(/module((\s[\w\\]*))/); break;
    //case "function": match = /function\s(\w*!)*\((.*)\)/.exec(str); break;
    case "function": match = str.match(/function((\s\w*!*)*\((.*)\))/);
    break;
  /*  case "for": match = scopes.exec(str); break;
    case "if": match = scopes.exec(str); break;*/
  }
if(match!==null && match.length>0){
  if(match.length ==4){  return [match[2],match[3],match[1]];
   }
  if(match.length ==3){ alert(match); return [match[2],match[3],match[1]];
   }
  else if(match.length ==2){ return [match[2],"",match[1]]; alert(match[1]);}
  else if(match.length ==1){ return [match[1],"",match[1]]; }
}
return ["","",""];
}
////////////////////////////////////////////////////////////////////////////////
function parse(content){

      var node = document.getElementById("code")
      var parent = node.parentNode

      str = content
node.innerHTML = str;

      m = [{ type: "root", start: 0, id: 0, length: 0 }];
      var match = "";

var index = 1;
var last = 0;
var data = ["","",""];
var eat = 0;
     while((match = scopes.exec(str)) != null){
            if(match !== null){
              if(data!==null && data[2]){
                eat = data[2].length;
              }else{ eat = 0; }

            var code = str.slice(last + eat, match.index );

            last = (match.index + match[1].length);
                if(code.length){
                      m.push( { id: index++, type: "code", code: code } );
                }

             data = getComplement(match[1], str.slice(match.index, str.length ));
                m.push( { id: index++, type: match[1], args: data  } );

            }
      }
      // flush out last bit of code...
        m.push( { id: index, type: "code",
        code: str.slice( last, str.length ) } );

 stack = [{type:m[0].type, id:0, parent:0}]; // , address: ""
//...................................
for (var i = 1; i < m.length; i++) {
        var word = m[i].type;
        var last = stack[stack.length-1].type;

      m[i].parent = stack[stack.length-1].id; // Sets as sibling

      if(word == "end"){ stack.pop(); m[i].parent = stack[stack.length-1].id;  //  linkAndPop(stack, m, i);
      }else if(word == "code"){ m[i].parent = stack[stack.length-1].id;
      }else{

                if(stack.length > 0){
                      if((last == "if" || last == "elseif") && (word == "elseif" || word == "else")){
                            stack.pop(); m[i].parent = stack[stack.length-1].id; }

                      if((last == "try"  || last == "catch") && (word == "catch" || word == "finally")){
                            stack.pop(); m[i].parent = stack[stack.length-1].id; }
                }
                stack.push({type: word, id: m[i].id, parent: (stack[stack.length-1] == undefined)? 0:stack[stack.length-1].id });
      }
}
//...................................

    n = nest(m, 0);
 alert(JSON.stringify(n))
// console.log(JSON.stringify(n));
ht = buildComponents(n);
alert(ht)
node.innerHTML = ht;

 //buildComponents(n);

 codeLoaded();
}
////////////////////////////////////////////////////////////////////////////////
function nest(arr, parent) {
    var out = []
    for(var i in arr) {
        if(arr[i].parent == parent) {
            var children = nest(arr, arr[i].id)
            if(children.length) { arr[i].children = children }
            out.push(arr[i])
        }
    }
    return out
}
////////////////////////////////////////////////////////////////////////////////
function GenerateId(){ return "id" + Math.random().toString(16).slice(2); }
////////////////////////////////////////////////////////////////////////////////
function buildComponents(n){
  var s = "", code = "", buf = "";
  var tabs = [];
    for (var i = 0; i < n.length; i++) {
      //if(n[i].code){ s += n[i].code; }

      // get Children
      var children = "";
      if(n[i].children != undefined) { children = buildComponents(n[i].children); }


      switch (n[i].type) {

        // Component begin "" folder-o
        case "JuliaFile": s += '<div class="JuliaFile global" style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable"><i class="fa fa-folder-o fa"></i>' + n[i].args[0] + '</div><div class="Body">' + children; break;
        case "module": s += '<div class="module " style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable">module ' + n[i].args[0] + '</div><div class="Body">' + children; break;
        case "function": s += '<div class="function global" style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable"><i class="fa fa-gears fa"></i><span class="name">'
        + n[i].args[0] + ' </span> <span class="args">'
        + n[i].args[1] + '</span></div><div class="Body">' + children; break;

        case "type": s += '<div class="type global" style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable"><i class="fa fa-object-ungroup fa"></i><span class="name">'
        + n[i].args[0] + ' </span> <span class="args">'
        + n[i].args[1] + '</span></div><div class="Body">' + children; break;
        case "struct": s += '<div class="struct global" style="z-index: 400; left: 95px; top: 502px;"><div class="head draggable"><i class="fa fa-object-group fa"></i><span class="name">'
        + n[i].args[0] + ' </span> <span class="args">'
        + n[i].args[1] + '</span></div><div class="Body">' + children; break;


        case "while": s += '<div class="while"><div class="head"><i class="fa fa-history fa"></i>while ' + n[i].args[0] + '</div><div class="Body">' + children; break;
        case "do": s += '<div class="do"><div class="head"><i class="fa fa-gear fa"></i> ' + n[i].args[0] + 'do</div><div class="Body">' + children; break;
        case "for": s += '<div class="for"><div class="head">for ' + n[i].args[0] + '</div><div class="Body">' + children; break;

        // Tablike starters
        case "try": var id = GenerateId(); tabs.push(  {tab:"try", id:id}  );
                buf += '<div id="' + id + '" class="try" style="display:block;"><div class="head">try</div><div class="Body">' + children;
                break;
        case "if": var id = GenerateId(); tabs.push(  {tab:"if", id:id}  );
                 buf += '<div id="' + id + '" class="if" style="display:block;"><div class="head">if</div><div class="Body">' + children;
                break;
        // Tablike inner blocks
        case "catch": var id = GenerateId(); tabs.push(  {tab:"catch", id:id}  );
                 buf += code + '</div></div><div id="' + id + '" class="catch" style="display:none;"><div class="head">catch</div><div class="Body">' + children;
                 code = ""; break;
        case "elseif": var id = GenerateId(); tabs.push(  {tab:"elseif", id:id}  );
                 buf += code + '</div></div><div id="' + id + '" class="elseif" style="display:none;"><div class="head">elseif</div><div class="Body">' + children;
                 code = ""; break;
        case "else": var id = GenerateId(); tabs.push(  {tab:"else", id:id}  );
                 buf += code + '</div></div><div id="' + id + '" class="else" style="display:none;"><div class="head">else</div><div class="Body">' + children;
                 code = ""; break; //default:

        case "code": s += parseCode(n[i].code); break;

        case "end":
                    if( tabs.length > 0){// end of tabbed block
                        s += '<div class="tabBox ' + tabs[0].tab + '">'
                        for (var t in tabs) {
                            s += '<span class="tablink" onclick="openCity(' + tabs[t].id + ', this)" id="'
                            + tabs[t].id + '">' + tabs[t].tab + '</span>';
                        }
                        s += buf + code + '<div class="end">end</div> </div></div>   </div>'; // WAS: str.slice(n[i].start, n[i].length)
                    } else{ // end of normal block
                        s += code + '<div class="end">end</div> </div></div>'; //  buf +
                    }
                    tabs = [];
                    buf = ""; code = "";
         break;
      }// Switch
     } // end of for loop
     return s;
}
