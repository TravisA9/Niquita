using HttpServer
using WebSockets, Requests
import HttpServer.mimetypes

#global Dict to store open connections in
global connections = Dict{Int,WebSocket}()
global usernames   = Dict{Int,String}()

function decodeMessage( msg )
    String(copy(msg))
end

wsh = WebSocketHandler() do req, client
    global connections
    @show connections[client.id] = client
    while true
        msg = read(client)
        msg = decodeMessage(msg)
        if startswith(msg, "setusername:")
            println("SETTING USERNAME: $msg")
            usernames[client.id] = msg[13:end]
        end
        if startswith(msg, "say:")
            println("EMITTING MESSAGE: $msg")
            for (k,v) in connections
                if k != client.id
                    write(v, (usernames[client.id] * ": " * msg[5:end]))
                end
            end
        end
    end
end

dir = Pkg.dir("Blocks","src") # ,"client.html"
println(dir)
# onepage = readstring(Pkg.dir("CodeServer","src","client.html"))
httph = HttpHandler() do req::Request, res::Response

  page = ""
  if ismatch(r"/?username=Hello/",req.resource)
     Response(readstring(dir*"\\html\\client.html"))
  else
    uri = URI(req.resource)
    key = match(r"(?:\.(\w+$))", uri.path)[1]
    mime = mimetypes[ key ]
    # println(dir, "     ", replace(uri.path, "/", "\\"), "     Key: ", mime)
    # for windows
    Response(200, Dict{AbstractString,AbstractString}([("Content-Type",mime)]),readstring(dir* replace(uri.path, "/", "\\") ))
    #Response(200, Dict{AbstractString,AbstractString}([("Content-Type",mime)]),readstring(dir* uri.path ))
  end

end

server = Server(httph, wsh)
println("Server listening on 8000...")
run(server,8000)
