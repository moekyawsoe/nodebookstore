var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

function search(req,res,next){
  var searchTerm = req.query.search;

  let query = 'SELECT * FROM books';
  if (searchTerm != ''){
    query = 'SELECT * FROM books WHERE name LIKE '%' + searchTerm + '%' OR author LIKE '%' + searchTerm + '%'';
  }
  dbConn.query(query,(err,result) => {
    if (err){
      req.searchResult = "";
      req.searchTerm = "";
      next();
    }
    req.data = result;
    req.searchTerm = searchTerm;
    next();
  })
}


/* GET home page. */
router.get('/',function(req, res, next) {

dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows){
    if(err){
      req.flash('error',err);

      //render to views/books/index.ejs
      res.render('index',{data:''});
    }else{
      //render to views/books/index.ejs
      // res.render('books',{data:rows});
      res.render('index', {
        title:'Book Store',
        link: "./pages/frontend/index",
        data:rows
      })
    }
  });
});

/* GET search page. */
router.get('/search',function(req, res, next) {

  dbConn.query('SELECT * FROM books ORDER BY id desc',function(err,rows){
      if(err){
        req.flash('error',err);

        //render to views/books/index.ejs
        res.render('index',{data:''});
      }else{
        //render to views/books/index.ejs
        // res.render('books',{data:rows});
        res.render('index', {
          title:'Book Store',
          link: "./pages/frontend/index",
          data:rows
        })
      }
    });
  });


module.exports = router;
