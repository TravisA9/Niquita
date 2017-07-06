$(function(){
    var connection = new WebSocket('ws://'+window.location.host);
    var you = "you";
    connection.onmessage = function( message ){
        window.lastmessage = message;
        $("#content").append( $("<p class='received'></p>").html( message.data ) );
    }
    function sendMessage( message ){
        if(typeof connection === 'undefined' || connection === null){
                $("#content").append( $("<p class='received'>Connection not defined</p>"));
            } else {
                        if(connection.readyState==1){
                                    connection.send(message);
                                    $("#content").append( $("<p class='sent'></p>").html( you + ": " + message ) );
                                } else {
                                    $("#content").append( $("<p class='received'>Connection not ready</p>"));
                                };
        };
    };
    $("#sayer input[type=submit]").click(function(){
        if( $("#sayer input[name=say]").val().replace(/\s/gi,'').length )
            sendMessage( $("#sayer input[name=say]").val() );
        $("#sayer input[name=say]").val("").focus();
    });
    $("#sayer input[name=say]").keypress(function(e){
        if( e.which === 13 ) $("#sayer input[type=submit]").click();
    });
});
