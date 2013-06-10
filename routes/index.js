
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Email form with Node.js', errors: {}, saved: {name:'', email:'', needs:''}});
};
