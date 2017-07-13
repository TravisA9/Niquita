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
    if(e.target.id == 'code'){
        curYPos = e.pageY;
        curXPos = e.pageX;
        curDown = true;
        e.stopPropagation();}
});
////////////////////////////////////////////////////////////////////////////////
desktop.addEventListener('mouseup', function(e){
      curDown = false;
      setTimeout( function (){ move = false; }, 600);
});
////////////////////////////////////////////////////////////////////////////////
///////////////////////////// Zooming //////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
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
