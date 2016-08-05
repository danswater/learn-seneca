'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './hashtags' ) )
	.error( assert.fail )
	.ready( createHashtags );

function createHashtags () {
	let pattern = {
		'role' : 'hashtags',
		'cmd'  : 'create'
	};

	var data = {
		'Hashtags' : [ 'Funny', 'Happy', 'Alive' ]
	};

	var pattern = Object.assign( {}, pattern, data );

	seneca.act( pattern, function ( err, newHashtags ) {
		assert.equal( newHashtags.length, 3 );
	} );
}
