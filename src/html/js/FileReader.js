function readSingleFile(e) {
  var file = e.target.files[0];

  if (!file) { return; }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;

    //displayContents(contents);
    tree = []
    dumpTokens( '\nJuliaFile C:\\Niquita.jl \n ' + contents +  ' \n end' );
    codeLoaded();
  };
  reader.readAsText(file);
}
////////////////////////////////////////////////////////////////////////////////
  var ProjectFiles = [];
function displayContents(contents) {
  var element = document.getElementById('file-content');
  var fName = document.getElementById('file-input').value;
  //alert(fName);
  //content = contents;

  ProjectFiles.push({ file:fName, contents:contents});
  FindFiles(ProjectFiles, contents);
  parse( MakeFileBall(ProjectFiles) );
}
////////////////////////////////////////////////////////////////////////////////
function MakeFileBall(ProjectFiles){

  var str = "";
  for (var i=0; i < ProjectFiles.length; i++) {
      str += 'JuliaFile ' + ProjectFiles[i].file + ' \n' + ProjectFiles[i].contents + 'end \n ';
  }
  return str;
}
////////////////////////////////////////////////////////////////////////////////
var files = /(?:(?:[^#])include\("([\w+/\\]*\.jl)"\))/g;
////////////////////////////////////////////////////////////////////////////////
function FindFiles(ProjectFiles, contents){

      while((fileName = files.exec(contents)) != null){
            if(fileName !== null){
              if(search(fileName[1], ProjectFiles) == -1){
                  ProjectFiles.push({ file: fileName[1], contents:""});
              }
            }
      }
}
////////////////////////////////////////////////////////////////////////////////
function search(nameKey, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i].name === nameKey) { return i; }
    }
    return -1;
}
////////////////////////////////////////////////////////////////////////////////
//document.getElementById('file-input').addEventListener('change', readSingleFile, false);
