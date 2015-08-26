var request = require('request');
var md5 = require('md5');
var _ = require('underscore');
var fs = require('fs');

function IssuuClient(opt){
	this.opt = opt ? opt : {};
	extendMethods(this);
}

IssuuClient.prototype = {
	// opt.name = file name
	// opt.title = file title
	documentsList: function(opt, cb){
		var method = 'issuu.documents.list';
		this.apiCall(method, opt, cb);
	},

	documentUpload: function(file_path, opt, cb){
		var method = 'issuu.document.upload';
		this.uploadApiCall(file_path, method, opt, cb);
	},

	apiCall: function(method, data, cb){
		var endpoint = 'http://api.issuu.com/1_0';
		var qs = this.apiCallParamsWithData(method, data);
		console.log(JSON.stringify(qs));
		var req_opt = {url: endpoint, qs: qs, json: true};
		request.get(req_opt, function(err, res, data){
			if(err) return cb(err);
			if(res.statusCode != 200) return cb(data);
			if(!data.rsp) return cb({msg: 'response error, rsp param not found', data: data})
			if(!data.rsp._content) return cb({msg: 'response error, rsp._content param not found', data: data})
			return cb(null, data.rsp._content);
		})
	},

	uploadApiCall: function(file_path, method, data, cb){
		var endpoint = 'http://upload.issuu.com/1_0';
		var form = this.apiCallParamsWithData(method, data);
		form.file = fs.createReadStream(file_path);
		var req_opt = {url: endpoint, formData: form, json: true};
		request.post(req_opt, function(err, res, data){
			if(err) return cb(err);
			if(res.statusCode != 200) return cb(data);
			if(!data.rsp) return cb({msg: 'response error, rsp param not found', data: data})
			if(!data.rsp._content) return cb({msg: 'response error, rsp._content param not found', data: data})
			return cb(null, data.rsp._content);
		})
	},

	apiCallParamsWithData: function(method, data){
		data = cloneObj(data);
		data.action = method;
		data.format = 'json';
		data.apiKey = this.opt.api_key;
		data.signature = this.getApiCallSignature(data);
		return data;
	},

	getApiCallSignature: function(data){
		var data_arr = _.map(data, function(val, key){return {key: key, val: val}});
		var data_sorted_arr = _.sortBy(data_arr, 'key');
		var signature_str = _.reduce(data_sorted_arr, function(full_str, data_item){return full_str + data_item.key + data_item.val}, '');
		var signature_str_with_secret = this.opt.api_secret + signature_str;
		var signature_hash = md5(signature_str_with_secret);
		return signature_hash;
	}
}

function extendMethods(obj){
	obj.document = {};
	obj.document.upload = function(file_path, opt, cb){obj.documentsList(file_path, opt, cb)};
	obj.documents = {};
	obj.documents.list = function(opt, cb){obj.documentsList(opt, cb)};
}

function cloneObj(obj){
	return JSON.parse(JSON.stringify(obj));
}

module.exports = IssuuClient;