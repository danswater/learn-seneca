'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './feeds' ) )
	.error( assert.fail );

createFeed();

function createFeed () {
	seneca.act( 'role:feeds,cmd:create,data:{UserId:testfoo@gmail.com,Title:My First Feed,Description:My First Feed Description,Media:1}', function ( err, newFeed ) {
		seneca.act( 'role:feeds,cmd:get', { 'id' : newFeed.id }, function ( err, feed ) {
			assert.equal( newFeed.Title, feed.Title );
		} );
	} );
}
