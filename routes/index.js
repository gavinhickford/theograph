
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.theograph = function(db){
  return function(req, res){
    var collection = db.get('eventcollection');
	collection.find({},{},function(e,docs){
	  res.render('theograph', {
	    title : 'D3 Theograph',
	    "eventlist" : docs
	  });
	});
  };
};

exports.newevent = function(req, res){
  res.render('newevent', {title: 'Add new event'}); 
} 

exports.addevent = function(db) {
    return function(req, res) {
	    // Get our form values. these rely on the "name" attributes
		var eventType = req.body.type;
		var eventSpecialty = req.body.specialtyname;
		var start = req.body.start;
		var end = req.body.end;
		
		// Set our collection
		var collection = db.get('eventcollection');
		
		// Submit to the DB
		collection.insert({
		    "type" : eventType,
			"specialty-name" : eventSpecialty,
			"start" : start,
			"end" : end
		}, function (err, doc) {
		    if (err) {
			    // If it failed, return error
				res.send("There was a problem adding the information to the database");
			}
			else{
			    // If it worked, set the header so the address bar doesn't still say add event
				res.location("theograph");
				// And forward to success page
				res.redirect("theograph");
			}
		});
	}
}