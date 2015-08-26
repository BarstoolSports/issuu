# ISSUU NodeJS module

WARNING! Module in development. Only **documents.list** and **document.upload** methods supported. But you can add and test new methods by your self.

## Installation

Installation via npm:

```
$ npm install issuu --save
```

## Initialization

```js
var IssuuClient = require('issuu');

var credetials = {
	api_key: 'my_api_key',
	api_secret: 'my_api_secret'
}

var client = new IssuuClient(credetials);

client.documents.list({}, function(err, documents_list){
	if(err) return console.log(JSON.stringify(err));
	console.log(JSON.stringify(documents_list));
})

```

## Calling methods

You can use two methods for calling api. Firts:

```js
client.documents.list({}, function(err, documents_list){
	if(err) return console.log(JSON.stringify(err));
	console.log(JSON.stringify(documents_list));
})
```

Second:

```js
client.documentsList({}, function(err, documents_list){
	if(err) return console.log(JSON.stringify(err));
	console.log(JSON.stringify(documents_list));
})
```

## Useful links

- [issuu website](http://issuu.com/)
- [issuu api documentation](http://developers.issuu.com/api/)

## Contacts

Jaroslav Khorishchenko

[websnipter@gmail.com](websnipter@gmail.com)

