'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './hashtags' ) )
	.error( assert.fail )
	.ready( function () {
		createHashtags();
		createFeedHashtags();
	} );

function createHashtags () {
	let pattern = {
		'role' : 'hashtags',
		'cmd'  : 'create'
	};

	var data = {
		'Hashtags' : [ 'Funny', 'Happy', 'Alive' ]
	};

	pattern = Object.assign( {}, pattern, { 'data' : data } );

	seneca.act( pattern, function ( err, newHashtags ) {
		assert.equal( newHashtags.length, 3 );
	} );
}


function createFeedHashtags () {
	let pattern = {
		'role' : 'hashtags',
		'cmd'  : 'createFeedReference'
	};

	let data = {
		'FeedId'   : 1,
		'Hashtags' : [ {
			'id'   : 1,
			'name' : 'Funny'
		}, {
			'id'   : 2,
			'name' : 'Happy'
		}, {
			'id'   : 3,
			'name' : 'Alive'
		} ]
	};

	pattern = Object.assign( {}, pattern, { 'data' : data } );

	seneca.act( pattern, function ( err, newFeedHashtags ) {
		console.log( newFeedHashtags );
	} );
}
