////////////////////////////////////////////////////////////////////////////////
///////////////////////////// dragging /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var curYPos, curXPos, curDown, move;
var clicks = 0;
var zoomed = ''; // 'tiny'  'small' or ''
desktop = document.getElementById('code');
var value = {val: 0, x:0, y:0};
var eventType = "";
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mousemove', function(e){
  if(curDown){
    move = true;
    if(eventType == "valueDrag"){
        var x = (e.pageX-value.x);
        var y = (e.pageY-value.y)
        if( y > 10){
              value.element.innerHTML = value.val + (x * (0.1/y)) ;
        }
        else{ value.element.innerHTML = value.val + x; }
        e.preventDefault();
    } else if(eventType == "boolean"){
        var x = (e.pageX-value.x); //var y = (e.pageY-value.y)
        if( x > 10){        value.element.innerHTML =  'true'; }
        else if( x < -10){  value.element.innerHTML = 'false'; }
        e.preventDefault();
    } else {
      //console.log(e.pageX)
      window.scrollTo(
        document.body.scrollLeft + (curXPos - e.pageX),
        document.body.scrollTop  + (curYPos - e.pageY) );
        e.stopPropagation();
    }
  }
});
////////////////////////////////////////////////////////////////////////////////
function getParentClass(node, c){
    while(!node.classList.contains(c)  ){
        if(node.classList.contains(desktop)){ return null; } // FAIL
        node = node.parentNode;
    }
    return node;
}
////////////////////////////////////////////////////////////////////////////////
// var text = window.getSelection().toString();
// var text = getSelectionHtml();
// Object.prototype.insertAfter = function (newNode) { this.parentNode.insertBefore(newNode, this.nextSibling); }
////////////////////////////////////////////////////////////////////////////////
desktop.onkeydown = function(e){            e = e || window.event;
  // if (e.keyCode == '13') {;}
  //alert( e.keyCode );
    if (e.keyCode === 9) {
      var win = getParentClass(lastSelected, "global")

      var list = win.getElementsByClassName("cmt");
      for (var i = 0; i < list.length; i++) {
        list[i].firstChild.style.display = 'block';
      }
var output = document.getElementById('text');
         // alert( win.innerText ); // getElementsByClassName("Body")[0]
         output.innerHTML = win.innerText;
         for (var i = 0; i < list.length; i++) {
           list[i].firstChild.style.display = '';
         }
    }
    if(e.ctrlKey && e.which === 83){ // Check for the Ctrl key being pressed, and if the key = [S] (83)
        alert('Ctrl+S!');
        e.preventDefault();
        return false;
    }
e.stopPropagation();
};
////////////////////////////////////////////////////////////////////////////////
desktop.onkeyup = function(e){            e = e || window.event; //.prop("selectionStart");
//setTimeout(f, 6000); alert("keyUp!")
if (e.keyCode === 13) {
        document.execCommand('insertHTML', false, '');
      return false;
    }


//e.stopPropagation();
var curs = document.getElementById('cursor');
if(curs !== null){removeNode(curs);} // just in case there is an orphan
    getLine(e.keyCode); // HAS: dumpTokens(str)
    e.preventDefault();
};

////////////////////////////////////////////////////////////////////////////////
var tab = document.getElementById("tab");
////////////////////////////////////////////////////////////////////////////////
tab.addEventListener('mousedown', function(e){
  var cons = e.target.parentNode;
      if( cons.classList.contains('closed') ){
          cons.classList.remove('closed');
          cons.classList.add('opened');
      }else if( cons.classList.contains('opened') ){
          cons.classList.remove('opened');
          cons.classList.add('closed');
      }
});
////////////////////////////////////////////////////////////////////////////////
var lastSelected;
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mousedown', function(e){
    //alert(e.target.id)

    lastSelected = e.target;
    var list = e.target.classList;
    if(e.target.id == 'code'){
          curYPos = e.pageY;
          curXPos = e.pageX;
          curDown = true;
          e.stopPropagation();
    } else if( e.target.classList.contains('num') ){
          value.val = parseFloat(e.target.innerHTML);
          value.x = e.pageX;
          value.y = e.pageY;
          curDown = true;
          value.element = e.target;
          eventType = "valueDrag";
          e.stopPropagation();
          //e.preventDefault();
    } else if( e.target.classList.contains('bl') ){
            value.val = e.target.innerHTML;
            value.x = e.pageX; value.y = e.pageY;
            curDown = true;
            value.element = e.target;
            eventType = "boolean";
            e.stopPropagation();
            //e.preventDefault();
    } else if(list.contains('tablink')  && e.target.parentNode.classList.contains('tabBox')){ // || list.contains('elseif') || list.contains('else') || list.contains('try') || list.contains('catch'))
        var p = e.target.parentNode;
        var tabsList = p.getElementsByClassName('toggle');
        for (var i = 0; i < tabsList.length; i++) {
          tabsList[i].style.display = 'none';
        }
        var id = e.target.dataset.id
        var selected = document.getElementById(id);
        selected.style.display = 'block';
        //alert(e.target.dataset.id);

    }

      Selected = e.target.id;

});
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mouseup', function(e){
      curDown = false;
      setTimeout( function (){ move = false; }, 600);
      value.element = null;
      eventType = '';
});
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Zooming //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var scale = 1;
var escritorio = document.getElementById("desktop");
var lastBounds;
var Selected = "code";
////////////////////////////////////////////////////////////////////////////////
escritorio.addEventListener('mousewheel',function(e){

  if (Selected == "code"){
        e.preventDefault(); // never use mouse wheel to scroll page!
        var bounds = escritorio.getBoundingClientRect();
            var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

          scale += delta*0.1;
          if (scale > 1){ scale = 1;}
          if (scale < 0.09){ scale = 0.1;}
          var scl = 'scale(' + scale + ')';
                escritorio.style.zoom = scl;
                escritorio.style.MozTransform = scl;
                escritorio.style.WebkitTransform = scl;

          //var bounds = escritorio.getBoundingClientRect();
          var midX = (e.clientX - bounds.left)*scope;
          var midy = (e.clientY - bounds.top)*scope;
          window.scrollTo(bounds.left + midX, bounds.top + midy);

          // the problem here is that we need to get the [last]bounds after the transition
          // is complete. The need has to do with the fact that the offset tothe bounds changes
          // unpredictably relative to scale ...I think!
          // lastBounds = bounds;
        return false;
  }
},false);
////////////////////////////////////////////////////////////////////////////////
//var coords = document.getElementById("text");
/*
onmousemove = function(e){
  var bounds = escritorio.getBoundingClientRect();
  var y = (e.clientY - bounds.top)/scale;
  var x = (e.clientX - bounds.left)/scale;
  coords.innerHTML = 'Relative mouse coordinates <br> X: ' + x + '<br> Y: ' + y;
  //console.log("mouse location:", x, y);
}
*/
/*
//////////////////////////////OLD///////////////////////////////////////////////
//document.querySelector('.page-body').
desktop.addEventListener('click', function (event) {
      if(curDown || move) return;
      clicks++;
      setTimeout( function (){ zoom(clicks); clicks = 0; }, 600);
});
////////////////////////////////////////////////////////////////////////////////

function zoom(zoomOut){
    var desktop = document.getElementById('code');
      if (zoomOut === 3 && zoomed != 'tiny') {
        desktop.classList.remove('small');
        desktop.classList.add('tiny');
        zoomed = 'tiny';
      }else if (zoomOut === 2 && zoomed != 'small') {
        desktop.classList.remove('tiny');
        desktop.classList.add('small');
        zoomed = 'small';
      }else if (zoomOut === 1 && (zoomed == 'small' || zoomed == 'tiny')) {
        desktop.classList.remove('small');
        desktop.classList.remove('tiny');
        zoomed = '';
      }

}*/
