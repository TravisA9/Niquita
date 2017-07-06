components = {
      "function":{  "class":"funcbox func",    "icon":"fa fa-gears fa",     "name":"name", "args":true , "div":false },
      "While":{     "class":"funcbox While",   "icon":"fa fa-refresh fa",   "name":"name", "args":true , "div":false },
      "forEach":{   "class":"funcbox forEach", "icon":"fa fa-refresh fa",   "name":"name", "args":true , "div":false },
      "forloop":{   "class":"funcbox forloop", "icon":"fa fa-refresh fa",   "name":"name", "args":true , "div":false },
      "comment":{   "class":"comment",         "icon":"fa fa-comment",      "name":"name", "args":true , "div":false },
      "array":{     "class":"funcbox array",   "icon":"fa fa-th fa",        "name":"",     "args":false, "div":true },
      "type":{      "class":"funcbox type",    "icon":"fa fa-sitemap fa",   "name":"name", "args":true , "div":true }

}



function BuildWindow(item, isglobal){
component = components[item.type]
var view = document.getElementById("All")
var win = templateFunc.children[1].cloneNode(true);
var win = document.createElement("div");
win.setAttribute("class", component["class"] + isglobal) // "global"
win.setAttribute("style", "z-index: 800; left: 39px; top: 612px;")
win.setAttribute("contenteditable", "false")
var head = document.createElement("div");
head.setAttribute("class", "head draggable")

  var one = document.createElement("i");


  one.setAttribute("class", component["icon"])
  // head.appendChild(one);

  if(component["div"]){ var two = document.createElement("div");
        two.appendChild(one);
  }
  else{ var two = document.createElement("span");
        head.appendChild(one);
  }
  two.setAttribute("class", component["name"])
  two.setAttribute("contenteditable", "true")
  two.innerHTML = item.name;
  head.appendChild(two);

if(component["args"]) {
    var three = document.createElement("span");

  three.setAttribute("class", "args")
  three.setAttribute("contenteditable", "true")
  three.innerHTML = item.args;
        if(component["div"]){ two.appendChild(three);}
  else{ head.appendChild(three);}
}

  var four = document.createElement("i");
  four.setAttribute("class", "close fa fa-trash fa")
  head.appendChild(four);

var body = document.createElement("div");
body.setAttribute("class", "Body")
body.setAttribute("contenteditable", "true")
for (var i = 0; i < item.code.length; i++) {
  if( item.code[i]["text"] ){
    body.innerHTML = item.code[i]["text"]
  }else{
    body.innerHTML = "CODE BLOCK!"
  }

}


win.appendChild(head);
win.appendChild(body);
win.onmousedown = function () { _drag_init(this); };
win.onclick = function () { FocusWindow(this); };
// win.addEventListener('mousedown', function(){alert("hello")});
view.appendChild(win);

}

/*
<div class="funcbox func global" style="z-index: 800; left: 39px; top: 612px;">

<div class="funcbox func">
      <div class="head" contenteditable="false">
          <i class="fa fa-cog fa"></i>
          <span class="name" contenteditable="true">MyFunction</span>
          <span class="args" contenteditable="true">X::Int64, p::Point</span>
          <i class="close fa fa-trash fa"></i>
      </div>
  <div class="Body" contenteditable="true"><br>p.x += X<br></div>
  </div>*/




function Build(){

  document.getElementById("All").append(f);
  win = document.getElementById("travis");
  win.addEventListener("click", function() { _drag_init(this); });
  //win.onmousedown = function () { _drag_init(this); };
  //win.onclick = function () { FocusWindow(this); };

}
  arrayTemplate   = document.getElementById("array_template")
  commentTemplate = document.getElementById("comment_template")
  typeTemplate    = document.getElementById("type_template")
  forLoopTemplate = document.getElementById("forLoop_template")
  forEachTemplate = document.getElementById("forEach_template")
  whileTemplate   = document.getElementById("While_template")
  funcTemplate    = document.getElementById("funct_template")
  identifiers = {"array":"#array_template", "comment":"#comment_template",
   "type":"#type_template", "for":"#forLoop_template", "forEach":"#forEach_template",
   "while":"#While_template", "function":"#funct_template"}
  // Template = document.getElementById("") Template = document.getElementById("") Template = document.getElementById("")
////////////////////////////////////////////////////////////////////////////////
function BuildWindows(item, isglobal){
  text = ""
  if( item.code[0]["text"] !== undefined ){
    text = item.code[0]["text"]
  }

  options = {position:item.position, name:item.name, args:item.args, icon:item.icon,
     type:item.type+isglobal, ParsedCode: text}

  var source   = $(identifiers[item.type]).html();
  var template = Handlebars.compile(source)
  document.getElementById("All").append(template(options));
}


  var transform = {
    "function":{"<>":"div",'id':'${name}',"class":"funcbox ${type} ${class}",
                "contenteditable":"false","style":"z-index: 500; ${position}","html":[
                {"<>":"div","class":"head","html":[
                    {"<>":"i","class":"fa fa-${icon} fa"},
                    {"<>":"span","class":"name","html":"${name}"},
                    {"<>":"span","class":"args","contenteditable":"true","html":"${args}"},
                    {"<>":"i","class":"close fa fa-trash fa"}
                  ]},
                {"<>":"div","class":"Body","contenteditable":"true","html":"${parsedCode}"}
              ]},
    "array":{"<>":"div",'id':'${name}',"class":"funcbox ${type} ${class}","style":"z-index: 500; ${position}","html":[
              {"<>":"div","class":"head","html":[
                  {"<>":"div","contenteditable":"true","html":[
                      {"<>":"i","class":"close fa fa-${icon} fa","html":""},
                      {"<>":"span","class":"name","contenteditable":"true","html":"${name}"}
                    ]},
                  {"<>":"i","class":"close fa fa-trash fa","html":""}
                ]},
              {"<>":"div","class":"Body","contenteditable":"true","html":"${parsedCode}"}
            ]},
    "type":{"<>":"div",'id':'${name}',"class":"funcbox ${type} ${class}","contenteditable":"false",
            "style":"z-index: 500; ${position}","html":[
              {"<>":"div","class":"head","html":[
                  {"<>":"div","html":[
                      {"<>":"i","class":"close fa fa-${icon} fa","html":""},
                      {"<>":"span","class":"name","contenteditable":"true","html":"${name}"},
                      {"<>":"span","class":"","contenteditable":"true","html":"${args}"}
                    ]},
                  {"<>":"i","class":"close fa fa-trash fa","html":""}
                ]},
              {"<>":"div","class":"Body","contenteditable":"true","html":"${parsedCode}"}
            ]},
    "comment":{"<>":"span","class":"comment","spellcheck":"true","contenteditable":"false",
                "style":"z-index: 500; ${position}","html":[
                {"<>":"i","class":"fa fa-${icon}","html":""},
                {"<>":"span","contenteditable":"true","html":[
                    {"<>":"div","class":"remove","contenteditable":"false","html":[
                        {"<>":"i","class":"fa fa-times-circle fa","html":""}
                      ]},
                    {"<>":"i","html":"${parsedCode}"}
                  ]}
              ]}
  };
////////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
  $('#get-data').click(function () {
    //var showData = $('#show-data');

    $.getJSON('Program.json', function (data) {

alert(JSON.stringify(data))

      var items = data.items.map(function (item) {
        //data = {}
        //text = ""
        //if( item.code[0]["text"] !== undefined ){ text = item.code[0]["text"]; }
        //isglobal  = " global"
        //data[item.type] = { position:item.position, name:item.name, args:item.args, icon:item.icon, type:item.type+isglobal, ParsedCode: text};

                        //alert(JSON.stringify(data))

        document.getElementById('All').innerHTML = json2html.transform(data,transform);
      });

      //showData.empty();

      if (items.length) {
        var content = '<li>' + items.join('</li><li>') + '</li>';
        var list = $('<ul />').html(content);
        showData.append(list);
      }
    });
//Build()


    showData.text('Loading the JSON file.');
  });
});
////////////////////////////////////////////////////////////////////////////////
