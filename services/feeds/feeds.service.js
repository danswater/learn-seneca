'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './feeds' ) )
	// .listen( { 'port' : 9005, 'pin' : 'role:feeds' } )
	// .client( { 'port' : 9008,  'pin' : 'role:media' } );

	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9005,
		'pin'    : 'role:feeds'
	} );
