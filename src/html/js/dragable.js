var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
var topWindow = null;

////////////////////////////////////////////////////////////////////////////////
var codeLoaded = function(){
   // Bind the functions...
   var elems = document.getElementsByClassName('draggable');

   for (var i = 0; i < elems.length; i++) {
             var elem = elems[i];
               elem.onmousedown = function () { _drag_init(this.parentNode); };
   };

   var elems = document.getElementsByClassName('global');
   for (var i = 0; i < elems.length; i++) {
             var elem = elems[i];
               elem.onclick = function () { FocusWindow(this); };
   };
};

function FocusWindow(elem) {
  event.stopPropagation();
    //alert("!")
    if (topWindow != null){
        topWindow.style.zIndex="400";
    }
    topWindow = elem;
    elem.style.zIndex="800";

    //return topWindow
}
// Will be called when user starts dragging an element
scale = 1;
function _drag_init(elem) {
    //
    var desktop = document.getElementById('code'); // $( "#code" ).

    if(desktop.classList.contains('tiny'))  { scale = 3; }else
    if(desktop.classList.contains('small')) { scale = 2; }else
    { scale = 1; }
//alert("Drag " + scale)
    FocusWindow(elem)
       selected = elem;
       var rect = elem.getBoundingClientRect();
    x_elem = (x_pos) - (selected.offsetLeft);
    y_elem = (y_pos) - (selected.offsetTop );
    //window.scrollTo(0, 0);
    //alert(desktop.offsetTop);
    event.stopPropagation();
}

// Called while user is dragging an element
function _move_elem(e) {

    x_pos = (document.all ? window.event.clientX : e.pageX)*scale;
    y_pos = (document.all ? window.event.clientY : e.pageY)*scale;
    if (selected !== null) {
        selected.style.left = ((x_pos - x_elem)) + 'px';
        selected.style.top = ((y_pos - y_elem)) + 'px'; // not sure yet why I had to subtract 35!
    }
    e.stopPropagation();
}

// Destroy the object when we are done
function _destroy() {
    selected = null;
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
}



//document.getElementById('draggable').onmousedown = function () {    _drag_init(this);    return false;};

document.onmousemove = _move_elem;
document.onmouseup = _destroy;
