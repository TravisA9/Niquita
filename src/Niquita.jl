module Niquita

type Point
  x::Float32
  y::Float32
  Point(x,y) = new(x,y)
end

 if something
   c = a + b # Some coment
 elseif somethingelse
   c = a * b
 else
   c = a - b
 end

 if startswith(msg, "say:")
     println("EMITTING MESSAGE: $msg")
     for (k,v) in connections
         if k != client.id
             write(v, (usernames[client.id] * ": " * msg[5:end]))
         end
     end
 end


function makePoint(x::Float32, y::Float32)
    # this is a useless Function to make a Point
    point = Point(x,y)
    return point
end

struct Foo
           bar
           baz::Int
           qux::Float64
end
# package code goes here

end
