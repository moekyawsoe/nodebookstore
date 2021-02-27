var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

/* GET home page. */
router.get('/',function(req, res, next) {

dbConn.query('SELECT * FROM books ORDER BY id ',function(err,rows){
    if(err){
      req.flash('error',err);

      //render to views/books/index.ejs
      res.render('./pages/index',{data:''});
    }else{
      //render to views/books/index.ejs
      // res.render('books',{data:rows});
      res.render('./pages/index', {
        title:'Book Store',
        link: "frontend/index",
        data:rows,
        stemp:''
      })
    }
  });
});

/* GET search page. */
router.get('/search',function(req, res, next) {
  var searchData = req.query.typeahead;

  dbConn.query('SELECT * FROM books where author like"%'+req.query.typeahead+'%" or name like"%'+req.query.typeahead+'%"',function(err,rows){
  // dbConn.query('SELECT * from books where id=1',function(err,rows){
      if(err){
        req.flash('error',err);

        //render to views/books/index.ejs
        res.render('./pages/index',{data:''});
      }else{
        //render to views/books/index.ejs
        // res.render('books',{data:rows});
        res.render('./pages/index', {
          title:'Book Store',
          link: "frontend/index",
          data:rows,
          stemp:searchData
        })
      }
    });
  });


module.exports = router;
