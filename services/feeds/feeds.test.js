'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './feeds' ) )
	// .use( require( '../file-manager/file-manager' ) )
	.use( require( '../media/media' ) )
	.use( require( '../hashtags/hashtags' ) )
	.error( assert.fail )
	.ready( createFeed );


function createFeed () {
	var pattern = {
		'role' : 'feeds',
		'cmd'  : 'create'
	}

	var data = {
		'UserId'      : 1,
		'Title'       : 'My First Feed',
		'Description' : 'My First Feed Description',
		'Filedata'    : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgI',
		'Hashtags'    : 'Happy,Alive,Funny'
	};

	pattern = Object.assign( {}, pattern, { 'data' : data } )

	seneca.act( pattern, function ( err, newFeed ) {

		let feedsGetPattern = {
			'role' : 'feeds',
			'cmd'  : 'get'
		};

		let feedsGetData = {
			'id' : newFeed.id
		};

		feedsGetPattern = Object.assign( {}, feedsGetPattern, feedsGetData );

		seneca.act( feedsGetPattern, function ( err, feed ) {
			assert.equal( newFeed.Title, feed.Title );
		} );
	} );
}
