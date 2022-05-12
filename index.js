const http = require("http");
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
const { response } = require("express");
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

function readFile(input) {
    return fs.readFileSync(input)
}
const formHTML = fs.readFileSync("index.html");
//Sử dụng phương thức createServer
http.createServer(function(req, res) {
    //Thêm header
    res.writeHead(200, {'Content-Type': 'text/html'});
    var path = req.url
    var userid;
    var hasNumber = /\d/;
    if(hasNumber.test(path)) {
        var id = path.split('/')[2];
        userid = id;
    }
    // userid = id;
    console.log(userid); 
    if ((req.url === '/index' || req.url === '/') && req.method === 'GET') {
        
        res.write(readFile('index.html'));
        res.end();
        //Kết thúc phản hồi
    } else if(req.url === '/create') {
        if(req.method === 'GET') {
            res.write(readFile('create.html'))
     
            //Kết thúc phản hồi
            res.end();
        }
        if(req.method === 'POST') {

            let body = ''
        
        //Bắt sự kiện data trong streams
            req.on('data', async function(data) {
                body += await data
            })
            console.log(body) 
            
            req.on('end', async function() {
                //phân tích Body
                let postData = await qs.parse(body);
                var user =  postData.username;
                var pass =  postData.password;
                var display = postData.displayname;
                con.query("INSERT INTO account(username,password,displayname) VALUES(?, ?, ?)",[user,pass,display], function (err, result) {
                    if (err) throw err;
                    console.log("Thêm bản ghi thành công !!!");
                    console.log(result)
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
    } else if(req.url === '/api/list') {
        var sql = "select id,username,password,displayname from account"
        con.query(sql, function(err,result){
            if (err) {
                throw err;
            }                
            res.writeHead(200, {'Content-Type': 'application/json'});
            res.write(JSON.stringify(result).trim());
            res.end();
        })
    } else if(req.url === '/api/'+ userid +'' && req.method === 'GET') {
        var sql = "select id,username,password,displayname from account where id = "+ userid +"";
        con.query(sql, function(err,result){
            if (err) {
                throw err;
            }                
            // console.log(JSON.stringify(result).trim());
            res.writeHead(200, {'Content-Type': 'application/json'});
            
            console.log(JSON.stringify(result).trim());
            res.write(JSON.stringify(result).trim());
            res.end();
        })
    } else if(req.url === '/delete/'+ userid +'' && req.method === 'GET') {
        console.log(userid);
        var sql = "delete from account where id = "+ userid +"";
        con.query(sql, async function(err,data){
            if (err) throw err;
            console.log(" record(s) updated");
        })
        res.write("Delete successfully!");

    } else  if(req.url === '/update/'+ userid +'') {
        if(req.method === 'GET') {
            res.write(readFile('update.html'));
            res.end();
        }
        if(req.method === 'POST') {
            let body = ''
        
        //Bắt sự kiện data trong streams
            req.on('data', async function(data) {
                body += await data
            })
            console.log(body) 
            
            req.on('end', async function() {
                //phân tích Body
                let postData = await qs.parse(body);
                var user =  postData.username;
                var pass =  postData.password;
                var display = postData.displayname;
                console.log(user,pass,display);
                var sql = `update account set username = '${user}', password = '${pass}', displayname = '${display}' where id = '${userid}'`;
                console.log(sql);
                con.query(sql,function (err, result) {
                    if (err) throw err;
                    console.log("Thêm bản ghi thành công !!!");
                    console.log(result)
                });
                //In ra trong terminal
                //Phản hồi lại clients
                res.write('Update done!') 
                //Kết thúc phản hồi
                res.end();
            })
        }
    }
    // else {
    //     res.writeHead(404, { 'Content-Type': 'application/json' });
    //     res.end(JSON.stringify({ message: 'Route not found!' }));
    // }

        
    
}).listen(3000); //Sử dụng port 3000 để lắng nghe