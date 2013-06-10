
/*
 * GET Thank you page.
 */

exports.page = function(req, res){
  res.render('thankyou', {title: 'Thank you for emailing me', saved: {}});
};