const http = require("http");
const util = require('util');
var fs = require("fs");
var async = require("async");
var bodyParser = require("body-parser")
var express = require("express")
var router = express.Router();
//Sử dụng thư viện querysting để phân tích body 
const qs = require('querystring');

 
//Hằng số chứa form HTML hiển thị ra trong trường hợp method là GET
var mysql = require('mysql');
const { param } = require("express/lib/request");
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

http.createServer( function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}); // http header
   var url = req.url;
   
    if(url ==='/index' && req.method === 'GET'){
        var i = 0;
        con.query('select * from account',(err,rows) => {
            if(err) throw err;
            console.log(JSON.stringify(rows))
            res.json()
            // res.json({ data: rows})
            // console.log(typeof rows);
            // result = JSON.stringify(rows);
        })
        res.write(fs.readFileSync("index.html")); //write a response
        res.end(); //end the response
    }else if(url ==='/create'){

        if(req.method === 'GET') {
            res.write(fs.readFileSync("create.html"))
 
            //Kết thúc phản hồi
            res.end();
        }
        if(req.method === 'POST') {
            let body = ''
            console.log(body)
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
    //    res.write('<h1>contact us page<h1>'); //write a response
    //    res.end(); //end the response
    }else{
       res.write('<h1>Hello World!<h1>'); //write a response
       res.end(); //end the response
    }
   }).listen(3000, function(){
    console.log("server start at port 3000"); //the server object listens on port 3000
   });