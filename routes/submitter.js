var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');
var multer = require('multer');

function isAuthenticated(req, res, next) {

  if (req.session.loggedin)
      return next();

  res.redirect('/auth');
}

//display books page
router.get('/',isAuthenticated, function(req, res, next){
  dbConn.query('SELECT * FROM users ORDER BY id desc',function(err,rows){
    if(err){
      req.flash('error',err);

      //render to views/books/index.ejs
      res.render('./pages/backend/index',{data:''});
    }else{
      //render to views/books/index.ejs
      // res.render('books',{data:rows});
      res.render('./pages/backend/index', {
        title:'Users',
        link: "submitter/home",
        data:rows
      })
    }
  });
});

//display add home page
router.get('/add',isAuthenticated,function(req,res,next){
  //render to add.ejs
  res.render('./pages/backend/index', {
    title:'User Add',
    link: "submitter/add",
    name:'',
    author:''
  })
});

// add a new book
router.post('/add',isAuthenticated, function(req, res, next) {

  let name = req.body.name;
  let email = req.body.email;
  let pass = req.body.pass;

  let errors = false;

  if(name.length === 0 || email.length === 0) {
      errors = true;

      // set flash message
      req.flash('error', "Please enter name and author");
      // render to add.ejs with flash message
      res.render('./pages/backend/index', {
        title:'Add a user',
        link: "submitter/add",
        name:name,
        email:email,
        pass:pass
      })
  }

  // if no error
  if(!errors) {

      var form_data = {
          name: name,
          email: email,
          password:pass
      }

      // insert query
      dbConn.query('INSERT INTO users SET ?', form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              req.flash('error', err)

              res.render('./pages/backend/index', {
                title:'Login',
                link: "submitter/add",
                name: form_data.name,
                email: form_data.email,
                pass :form_data.password
              })
          } else {

              req.flash('success', 'Book successfully added');
              res.redirect('/submitter');
          }
      })
  }
})

// display edit book page
router.get('/edit/(:id)',isAuthenticated, function(req, res, next) {

  let id = req.params.id;

  dbConn.query('SELECT * FROM users WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err

      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'User not found with id = ' + id)
          res.redirect('/submitter')
      }
      // if book found
      else {

          res.render('./pages/backend/index', {
            link: "submitter/edit",
            title: 'Edit Book',
            id: rows[0].id,
            name: rows[0].name,
            email: rows[0].email,
            pass:rows[0].password
          })
      }
  })
})

// update book data
router.post('/update/:id',isAuthenticated, function(req, res, next) {

  let id = req.params.id;
  let name = req.body.name;
  let email = req.body.email;
  let pass = req.body.pass;

  let errors = false;

  if(name.length === 0 || email.length === 0) {
      errors = true;

      // set flash message
      req.flash('error', "Please enter email and password");

      res.render('./pages/backend/index', {
        link: "submitter/edit",
        title: 'Edit User',
        id: req.params.id,
        name: name,
        email: email,
        pass:pass
      })

  }

  // if no error
  if( !errors ) {

      var form_data = {
          name: name,
          password: pass,
          email: email
      }
      // if(img.mimetype == "image/jpeg" || img.mimetype == "image/png" || img.mimetype == "image/gif"){
          // update query
          dbConn.query('UPDATE users SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                res.render('./pages/backend/index', {
                  link: "submitter/edit",
                  title: 'Edit Book',
                  id: req.params.id,
                  name: form_data.name,
                  email: form_data.email,
                  pass: form_data_pass
                })
            } else {
                req.flash('success', 'User successfully updated');
                res.redirect('/submitter');
            }
          })
      // }

  }
})

// delete book
router.get('/delete/(:id)',isAuthenticated, function(req, res, next) {

  let id = req.params.id;

  dbConn.query('DELETE FROM users WHERE id = ' + id, function(err, result) {
      //if(err) throw err
      if (err) {
          // set flash message
          req.flash('error', err)
          // redirect to books page
          res.redirect('/submitter')
      } else {
          // set flash message
          req.flash('success', 'Book successfully deleted! ID = ' + id)
          // redirect to books page
          res.redirect('/submitter')
      }
  })
})

module.exports = router;

