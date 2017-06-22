var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element
var topWindow = null;


///////////////////////////// desktop //////////////////////////////////////////
var curYPos, curXPos, curDown;
desktop = document.getElementById('All')
window.addEventListener('mousemove', function(e){
  if(curDown){
    window.scrollTo(document.body.scrollLeft + (curXPos - e.pageX), document.body.scrollTop + (curYPos - e.pageY));
  }
  event.stopPropagation();
});

window.addEventListener('mousedown', function(e){
  curYPos = e.pageY;
  curXPos = e.pageX;
  curDown = true;
  event.stopPropagation();
});

window.addEventListener('mouseup', function(e){
  curDown = false;
});

////////////////////////////////////////////////////////////////////////////////






 test = document.getElementById("test")
 test.addEventListener('mousedown', function(e){
  // e.target.getAttribute("d"); // getter
 e.target.setAttribute("d", "M0,3 C100,3 100,200 200,200"); // setter .setAttribute("class", "democlass")
  e.target.parentNode.setAttribute("height", "210px")
   //curYPos = e.pageY;
   //curXPos = e.pageX;
   //curDown = true;
   event.stopPropagation();
 });


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
function _drag_init(elem) {
//event.stopPropagation();
    FocusWindow(elem)
       selected = elem;
       var rect = elem.getBoundingClientRect();
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;
}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = document.all ? window.event.clientX : e.pageX;
    y_pos = document.all ? window.event.clientY : e.pageY;
    if (selected !== null) {
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px'; // not sure yet why I had to subtract 35!
    }
}

// Destroy the object when we are done
function _destroy() {
    selected = null;
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

}

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


//document.getElementById('draggable').onmousedown = function () {    _drag_init(this);    return false;};

document.onmousemove = _move_elem;
document.onmouseup = _destroy;
