var mysql = require('mysql');
//Khởi tao kết nối với MySQL Server
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "firstdatabase" 
});
//Tiến hành kết nối
con.connect(function(err) {
    if (err) throw err;
    //Kết nôi thành công
    console.log("Connected!");
    //Tiến hành khởi tạo databse
    con.query("SELECT * FROM account WHERE id = 1", function (err, result) {
      if (err) throw err;
      console.log(result);
    });
  });