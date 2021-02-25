var mysql = require('mysql');

var connection = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'nodejs-crud'
});
connection.connect(function(error){
  if (!!error){
    console.log(error);
  }else{
    console.log('DB Connected..!')
  }
});

module.exports = connection;



