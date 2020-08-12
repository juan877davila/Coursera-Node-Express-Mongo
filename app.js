const http= require("http");
const hostname= '127.0.0.1';
const Port =3000;

const server=http.createServer((req,res)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','text/plain');
    res.end('Hola Mundo!\n');
});

server.listen(Port,hostname,()=>{
    console.log(`Server running on http://${hostname}:${Port}`);
});