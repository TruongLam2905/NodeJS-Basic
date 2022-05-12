const http = require("http");
var fs = require("fs");
var async = require("async");
var bodyParser = require("body-parser")
//Sử dụng thư viện querysting để phân tích body 
const qs = require('querystring');

 
//Hằng số chứa form HTML hiển thị ra trong trường hợp method là GET
var mysql = require('mysql');
//Khởi tao kết nối với MySQL Server
var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "firstdatabase"
});
//Tiến hàng kết nối
con.connect(function(err) {
    if (err) throw err;
    console.log("Success")
    //Kết nôi thành công
});
const formHTML = fs.readFileSync("create.html");
//Sử dụng phương thức createServer
http.createServer(function(req, res) {
    //Thêm header
    res.writeHead(200, {'Content-Type': 'text/html'});
 
    //Kiểm tra URL và method
    if (req.url === '/' && req.method === 'GET') {
        //Trả về một form
        res.write(formHTML)
 
        //Kết thúc phản hồi
        res.end();
    }
    
    if (req.url === '/create' && req.method === 'POST') {
        //Biến để chứa body
        let body = ''
        
        //Bắt sự kiện data trong streams
        req.on('data', function(data) {
            body += data
        })
        console.log(body) 
        
        req.on('end', function() {
            //phân tích Body
             let postData = qs.parse(body);
             var user = postData.username;
             var pass = postData.password;
             var display = postData.displayname;
             con.query("INSERT INTO account(username,password,displayname) VALUES(?, ?, ?)",[user,pass,display], function (err, result) {
                if (err) throw err;
                console.log("Thêm bản ghi thành công !!!");
              });
             //In ra trong terminal
             //Phản hồi lại clients
             res.write(`Full Name: ${postData.username} <br>
             Password: ${postData.password}<br>
             Displayname: ${postData.displayname}`) 
            
             //Kết thúc phản hồi
             res.end();
        })
     }
}).listen(3000); //Sử dụng port 3000 để lắng nghe