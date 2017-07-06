module Two


macro sayhello()
           return :( println("Hello, world!") )
end


ex = quote
           x = 1
           y = 2
           x + y
end

end
