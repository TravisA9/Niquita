////////////////////////////////////////////////////////////////////////////////
///////////////////////////// dragging /////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var curYPos, curXPos, curDown, move;
var clicks = 0;
var zoomed = ''; // 'tiny'  'small' or ''
desktop = document.getElementById('code');
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mousemove', function(e){
  if(curDown){
      move = true;
      console.log(e.pageX)
      window.scrollTo(
        document.body.scrollLeft + (curXPos - e.pageX),
        document.body.scrollTop  + (curYPos - e.pageY) );
      e.stopPropagation();
  }
});
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mousedown', function(e){
    //alert(e.target.id)
    var list = e.target.classList;
    if(e.target.id == 'code'){
      curYPos = e.pageY;
      curXPos = e.pageX;
      curDown = true;
      e.stopPropagation();} else
    if(list.contains('tablink')  && e.target.parentNode.classList.contains('tabBox')){ // || list.contains('elseif') || list.contains('else') || list.contains('try') || list.contains('catch'))
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

}
