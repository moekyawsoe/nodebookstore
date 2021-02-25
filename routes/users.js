const { name } = require('ejs');
var express = require('express');
var router = express.Router();
var connection = require('../lib/db');


//display login page
router.get('/',function(req, res,next){
  //render to views/user/add.ejs
  res.render('index', {
    title:'Login',
    link: "./templates/auth/login",
    email: '',
    password:''
  })
})

//display login page
router.get('/login',function(req,res,next){
   //render to views/user/add.ejs
   res.render('index', {
    title:'Login',
    link: "./templates/auth/login",
    email: '',
    password:''
  })

  //  res.render('auth/login',{
  //   title:'Login',
  //   email:'',
  //   password:''
  // })
})
//authenticate user
router.post('/authentication', function(req, res, next) {

  var email = req.body.email;
  var password = req.body.password;

      connection.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], function(err, rows, fields) {
          if(err) throw err

          // if user not found
          if (rows.length <= 0) {
              req.flash('error', 'Please correct enter email and Password!')
              res.redirect('/auth')
          }
          else { // if user found
              // render to views/user/edit.ejs template file
              req.session.loggedin = true;
              req.session.name = "Mg Mg";
              res.redirect('/auth/home');
          }
      })

})

//display home page
router.get('/home',function(req,res,next){
  if(req.session.loggedin){
    // res.render('books/index');
    res.redirect('/books');
  }else{
    req.flash('success','Please login first!');
    res.redirect('/login');
  }
});

//logout user
router.get('/logout',function(req,res){
  req.session.loggedin = false;
  req.session.name = "";
  req.flash('success','Login Again Here');
  res.redirect('/auth');
});

module.exports = router;
