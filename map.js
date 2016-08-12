'use strict';

const Promise = require( 'bluebird' );

let feeds = [
	{ 'id' : 1 },
	{ 'id' : 2 },
	{ 'id' : 3 },
	{ 'id' : 4 }
];

Promise.map( feeds, ( feed ) => {
	feed.name = 'hey';
	return feed;
} )
.then( console.log );
