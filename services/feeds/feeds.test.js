'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './feeds' ) )
	.error( assert.fail );

createFeed();

function createFeed () {
	var pattern = {
		'role' : 'feeds',
		'cmd'  : 'create'
	}

	var data = {
		'UserId'      : 1,
		'Title'       : 'My First Feed',
		'Description' : 'My First Feed Description',
		'Media'       : 1,
		'Filedata'    : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgI'
	};

	var pattern = Object.assign( {}, pattern, { 'data' : data } )

	seneca.act( pattern, function ( err, newFeed ) {
		seneca.act( 'role:feeds,cmd:get', { 'id' : newFeed.id }, function ( err, feed ) {
			console.log( feed );
			assert.equal( newFeed.Title, feed.Title );
		} );
	} );
}
