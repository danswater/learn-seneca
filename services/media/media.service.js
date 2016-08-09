'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './media' ) )
	// .listen( { 'port' : 9008, 'pin' : 'role:media' } );

	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9008,
		'pin'    : 'role:media'
	} );
