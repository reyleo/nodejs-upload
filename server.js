import express from 'express';
import multer from 'multer';
import path from 'path';
const app = express();

const uploadPath = process.argv.length > 2 ? process.argv[2] : "";
if (!uploadPath) {
	console.error("Error: Please provide an upload path as the first argument.");
	process.exit(1);
}

const keepOriginalName = true;

var storage = multer.diskStorage({
	destination: uploadPath,
	filename: function(_req, file, callback) {
		if (keepOriginalName) {
			callback(null, file.originalname);
			return;
		}
		
		let filename = timestamp() + '_' + randomCode(4);
		let ext = extension(file.mimetype);
		if (ext === '') {
			callback(null, file.originalname)
		} else {
			callback(null, `upload-${filename}.${ext}`);
		}
	}
});
var upload = multer({ storage: storage}).array('photos');
const RANDOMS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomCode(len) {
	let code = '';
	for (let i = 0; i < len; i++) {
		let x = Math.floor(Math.random() * Math.floor(RANDOMS.length));
		code = code + RANDOMS.charAt(x);
	}
	return code;
}

function timestamp() {
	let now = new Date();
	return '' + now.getFullYear() + pad((now.getMonth() + 1), 2)
		+ pad(now.getDate(), 2) + '_' 
		+ pad(now.getHours(), 2) + pad(now.getMinutes(), 2) + pad(now.getSeconds(), 2);
}

function pad(v, n) {
	let s = new String(v);
	let l = s.length;
	let p = '';
	while (l++ < n) p += '0';
	return p + s; 
} 

function extension(mime) {
	switch(mime) {
		case 'image/jpeg': return 'jpg';
		case 'image/png': return 'png';
		case 'video/mp4': return 'mp4';
	}
	return '';
}

app.use('/public', express.static(path.dirname + '/public'));

app.get('/upload', function (_req, res) {
	res.sendFile(path.dirname + path.sep + 'index.html');
});

app.post('/upload', function(req, res) {	
	upload(req, res, function(err) {
		if (err) {
			res.send( { error: err, status: 1 } );
		} else {
			res.send( { status: 0 } );
			req.files.forEach(f => {
				console.log("Uploaded file " + f.originalname + ' of type ' + f.mimetype);
			});
		}
	});
});


app.listen(8080, function() {
	console.log("Uploader started on port 8080");
	console.log("Ready to save files in " + uploadPath);
});
