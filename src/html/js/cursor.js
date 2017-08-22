////////////////////////////////////////////////////////////////////////////////
var currentLine;
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
function removeNode(child){
    var parent = child.parentNode;
    parent.removeChild(child);
}
////////////////////////////////////////////////////////////////////////////////
function getLine(key){
  var sel = document.getSelection();
  var range = sel.getRangeAt(0);

  //var node = lastSelected;
  var node = sel.anchorNode.parentNode;
  col = sel.anchorOffset;


 if(node === undefined){alert('node is null!'); return;}
/*
        if(node.classList.contains('ln')){ ; }
        else if(lastSelected.parentNode.classList.contains('ln')){
            node = node.parentNode; }
        else if(node.parentNode.parentNode.classList.contains('ln')){
            node = node.parentNode.parentNode; }


            //var col = range.startOffset;
            //  var myNode = node.getSelection().anchorNode;node.textContent ||
            var line = 0;
              if (key == '13'){
                var range = document.getSelection().getRangeAt(0);
                node = range.startContainer;
console.log("::: ", node)
                while(node.parentNode.classList.contains('ln')){
                  node = node.parentNode;
                }
                node.innerHTML = '<span id="cursor"></span>';
                insertCaretAt( node, 0);

              }*/
              var text = node.innerText; // was node.innerText
              console.log("innerText: ", text);
               col = getCaretCharacterOffsetWithin(node);//text.length

//console.log("COL: ", col)
//console.log("text: ", text)
                //var n = node
                // for (var line=0; (n = n.previousSibling); line++);

                //return { text: (node.innerText || node.textContent), node:node, line:line, col:col};
//console.log("NODE: ", node)
                currentLine = { text:text, node:node, col:col}; // line:line,

                currentLine.text = currentLine.text.substr(0,currentLine.col) +
                                   '<span id="cursor"></span>' +
                                   currentLine.text.substr(currentLine.col,currentLine.text.length);

              //  currentLine.node = dumpTokens( currentLine.text );
              var parsed = dumpTokens( currentLine.text );
              console.log("Parsed: ", parsed);
                currentLine.node.innerHTML = parsed;



                insertCaretAt( );
                //insertCaretAt( currentLine.node , currentLine.col);

}

////////////////////////////////////////////////////////////////////////////////
// https://stackoverflow.com/questions/6249095/how-to-set-caretcursor-position-in-contenteditable-element-div
////////////////////////////////////////////////////////////////////////////////
function insertCaretAt() {
  var cursor = document.getElementById('cursor');
  if(cursor === null){ console.log("No caret found!"); return; }

  //col = getCaretCharacterOffsetWithin(node);
  var node = cursor.parentNode;
  var str  = node.childNodes[0].nodeValue
  var index  = str ? str.length:0;
  console.log("Before cursor: " , str);
      node.focus();
      var range = document.createRange();

      range.setStart(node.firstChild, index);
      range.setEnd(node.firstChild, index);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
      removeNode(cursor);
}
////////////////////////////////////////////////////////////////////////////////
function old_insertCaretAt(node, col) {
      node.focus();
      var range = document.createRange();

      range.setStart(node, col);
      range.setEnd(node, col);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
}
////////////////////////////////////////////////////////////////////////////////
function getCaretCharacterOffsetWithin(element) {
  var caretOffset = 0;
  var doc = element.ownerDocument || element.document;
  var win = doc.defaultView || doc.parentWindow;
  var sel;
  if (typeof win.getSelection != "undefined") {
    sel = win.getSelection();
    if (sel.rangeCount > 0) {
      var range = win.getSelection().getRangeAt(0);
      var preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      caretOffset = preCaretRange.toString().length;
    }
  } else if ( (sel = doc.selection) && sel.type != "Control") {
    var textRange = sel.createRange();
    var preCaretTextRange = doc.body.createTextRange();
    preCaretTextRange.moveToElementText(element);
    preCaretTextRange.setEndPoint("EndToEnd", textRange);
    caretOffset = preCaretTextRange.text.length;
  }
  return caretOffset;
}
////////////////////////////////////////////////////////////////////////////////













////////////////////////////////////////////////////////////////////////////////
function getCursor(cursor){
    var str = cursor.innerHTML;
    var length = str.search(/(<span id="cursor"><\/span>)/);
     var str2 = str.substring(0, length );
     str2 = str2.replace(/(<[^\/](\s|\S)*?>)/, ' ');
     str2 = str2.replace(/(<\/(\s|\S)*?>)/, '');
     return str2.length;
}
////////////////////////////////////////////////////////////////////////////////
function insertTextAtCursor(text) {
    var sel, range, html;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.getRangeAt && sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode( document.createTextNode(text) );
        }
    } else if (document.selection && document.selection.createRange) {
        document.selection.createRange().text = text;
    }
}
////////////////////////////////////////////////////////////////////////////////
function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var container = document.createElement("div");
            for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                container.appendChild(sel.getRangeAt(i).cloneContents());
            }
            html = container.innerHTML;
        }
    } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
            html = document.selection.createRange().htmlText;
        }
    }
    return html;
}
////////////////////////////////////////////////////////////////////////////////
