(function () {

window.addEventListener('load', function() {
	document.getElementById('imageSelect').addEventListener('change', uploadImage);
});



function uploadImage() {
	if (this.files.length > 0) {
		var uploader = new Uploader(this.files, document.getElementById('uploadStatus'));
	}
}

function Progress(parent) {
	var bar = document.createElement('div');
	var obj = document.createElement('div');

	obj.className = 'progress-bar-outer';
	bar.className = 'progress-bar-inner';

	this.obj = obj;
	this.bar = bar;

	this.obj.appendChild(bar);
	parent.appendChild(this.obj);

	this.percent = 0;
	this.update(0) 
}

Progress.prototype.update = function(percent) {
	this.percent = percent;
	this.bar.innerHTML = percent;
	this.bar.style.width = '' + percent + '%';
};
Progress.prototype.remove = function() {
	this.obj.parentNode.removeChild(this.obj);
}

function Uploader(files, parent) {
	var xhr = new XMLHttpRequest();
	this.ctrl = new Progress(parent);
	var self = this;

	xhr.upload.addEventListener('progress', function(e) {
		if (e.lengthComputable) {
			var percent = Math.round((e.loaded * 100) / e.total);
			self.ctrl.update(percent);
		}
	}, false);

	xhr.upload.addEventListener('load', function(e) {
		self.ctrl.update(100);
		window.setTimeout(function() {
			self.ctrl.remove();
		}, 2000);
		
	}, false);	

	var data = new FormData();
	Array.from(files).forEach((f => data.append('photos', f)));


	xhr.open('POST', '/upload', true);
	xhr.send(data);
}

})();