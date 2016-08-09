'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './media' ) )
	.error( assert.fail )
	.ready( createMedia );

function createMedia () {
	let pattern = {
		'role' : 'media',
		'cmd'  : 'create'
	};

	let data = {
		'Url'    : 'www.google.com/image.jpg',
		'Format' : 'jpg'
	};

	pattern = Object.assign( {}, pattern, { 'data' : data } );

	seneca.act( pattern, ( err, newMedia ) => {
		console.log( newMedia );
	} );
}
