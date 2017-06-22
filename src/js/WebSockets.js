$(function(){
    var connection = new WebSocket('ws://'+window.location.host);
    var you = "you";
    ////////////////////////////////////////////////////////////////////////////
    connection.onmessage = function( message ){
        window.lastmessage = message;
        $("#content").append( $("<p class='received'></p>").html( message.data ) );
    }
    ////////////////////////////////////////////////////////////////////////////
    function changeUsername( username ){
        you = username;
        connection.send('setusername:'+ username);
        $("#sayer span").html( username );
    }
    ////////////////////////////////////////////////////////////////////////////
    function sendMessage( message ){
        connection.send('say:'+ message);
        $("#content").append( $("<p class='sent'></p>").html( you + ": " + message ) );
    }
    ////////////////////////////////////////////////////////////////////////////
    $("#sayer input[type=submit]").click(function(){
        if( $("#sayer input[name=say]").val().replace(/\s/gi,'').length )
            sendMessage( $("#sayer input[name=say]").val() );
        $("#sayer input[name=say]").val("").focus();
    });
    $("#sayer input[name=say]").keypress(function(e){
        if( e.which === 13 ) $("#sayer input[type=submit]").click();
    });
    $("#pick_username").submit(function(e){
        var uname = $(this).find("input.username").val();
        if( !uname.replace(/\s/gi,'').length ) alert("Please select a valid username");
        else {
            changeUsername( uname );
            $("#welcome").hide();
            $("#chat").show();
        }
        e.stopImmediatePropagation();
        e.preventDefault();
        return false
    });
});
