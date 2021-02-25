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
  dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows){
    if(err){
      req.flash('error',err);

      //render to views/books/index.ejs
      res.render('books',{data:''});
    }else{
      //render to views/books/index.ejs
      // res.render('books',{data:rows});
      res.render('./templates/books/index', {
        title:'Login',
        link: "home",
        data:rows
      })
    }
  });
});

//display add home page
router.get('/add',isAuthenticated,function(req,res,next){
  //render to add.ejs
  res.render('./templates/books/index', {
    title:'Login',
    link: "add",
    name:'',
    author:''
  })
});

// add a new book
router.post('/add',isAuthenticated, function(req, res, next) {

  let name = req.body.name;
  let author = req.body.author;

  let errors = false;

  if(name.length === 0 || author.length === 0) {
      errors = true;

      // set flash message
      req.flash('error', "Please enter name and author");
      // render to add.ejs with flash message
      res.render('./templates/books/index', {
        title:'Login',
        link: "add",
        name:name,
        author:author
      })
  }

  // if no error
  if(!errors) {

      var form_data = {
          name: name,
          author: author
      }

      // insert query
      dbConn.query('INSERT INTO books SET ?', form_data, function(err, result) {
          //if(err) throw err
          if (err) {
              req.flash('error', err)

              // render to add.ejs
              res.render('books/add', {
                  name: form_data.name,
                  author: form_data.author
              })
              res.render('./templates/books/index', {
                title:'Login',
                link: "add",
                name:form_data.name,
                author:form_data.author
              })
          } else {

              req.flash('success', 'Book successfully added');
              res.redirect('/books');
          }
      })
  }
})

// display edit book page
router.get('/edit/(:id)',isAuthenticated, function(req, res, next) {

  let id = req.params.id;

  dbConn.query('SELECT * FROM books WHERE id = ' + id, function(err, rows, fields) {
      if(err) throw err

      // if user not found
      if (rows.length <= 0) {
          req.flash('error', 'Book not found with id = ' + id)
          res.redirect('/books')
      }
      // if book found
      else {

          res.render('./templates/books/index', {
            link: "edit",
            title: 'Edit Book',
            id: rows[0].id,
            name: rows[0].name,
            author: rows[0].author,
            img: rows[0].img,
            file: rows[0].file
          })
      }
  })
})

// update book data
router.post('/update/:id',isAuthenticated, function(req, res, next) {

  let id = req.params.id;
  let name = req.body.name;
  let author = req.body.author;

  let errors = false;

  if(name.length === 0 || author.length === 0) {
      errors = true;

      // set flash message
      req.flash('error', "Please enter name and author");

      res.render('./templates/books/index', {
        link: "edit",
        title: 'Edit Book',
        id: req.params.id,
        name: name,
        author: author
      })

  }

  // if no error
  if( !errors ) {

      var form_data = {
          name: name,
          author: author
      }
      // if(img.mimetype == "image/jpeg" || img.mimetype == "image/png" || img.mimetype == "image/gif"){
          // update query
          dbConn.query('UPDATE books SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                res.render('./templates/books/index', {
                  link: "edit",
                  title: 'Edit Book',
                  id: req.params.id,
                  name: form_data.name,
                  author: form_data.author,
                })
            } else {
                req.flash('success', 'Book successfully updated');
                res.redirect('/books');
            }
          })
      // }

  }
})

// delete book
router.get('/delete/(:id)',isAuthenticated, function(req, res, next) {

  let id = req.params.id;

  dbConn.query('DELETE FROM books WHERE id = ' + id, function(err, result) {
      //if(err) throw err
      if (err) {
          // set flash message
          req.flash('error', err)
          // redirect to books page
          res.redirect('/books')
      } else {
          // set flash message
          req.flash('success', 'Book successfully deleted! ID = ' + id)
          // redirect to books page
          res.redirect('/books')
      }
  })
})

module.exports = router;

