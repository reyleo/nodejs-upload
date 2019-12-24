var express = require("express");
var multer  = require("multer");
var path = require("path");

var app = express();
var uploadPath = 'M:\\PhotoExport\\!Uploads'
var storage = multer.diskStorage({
	destination: uploadPath,
	filename: function(req, file, callback) {
		var now = new Date();
		var timestamp = '' + now.getFullYear() + pad((now.getMonth() + 1), 2)
			+ pad(now.getDate(), 2) + '_' 
			+ pad(now.getHours(), 2) + pad(now.getMinutes(), 2) + pad(now.getSeconds(), 2) ;
		callback(null, file.fieldname + '-' + timestamp + extension(file.mimetype));
	}
});
var upload = multer({ storage: storage}).single('photo');

function pad(v, n) {
	var s = new String(v);
	var l = s.length;
	var p = '';
	while (l++ < n) p += '0';
	return p + s; 
} 

function extension(mime) {
	switch(mime) {
		case 'image/jpeg': return '.jpg';
		case 'image/png': return '.png';
	}
	return '';
}

app.use('/public', express.static(__dirname + '/public'));

app.get('/upload', function (req, res) {
	res.sendFile(__dirname + path.sep + 'index.html');
});

app.post('/upload', function(req, res) {
	upload(req, res, function(err) {
		if (err) {
			res.send( { error: err, status: 1 } );
		} else {
			res.send( { status: 0 } );
			console.log("Uploaded file " + req.file.originalname + ' of type ' + req.file.mimetype);
		}
	});
});


app.listen(8080, function() {
	console.log("Uploader started on port 8080");
	console.log("Ready to save files in " + uploadPath);
});
