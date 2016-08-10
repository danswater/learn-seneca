'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './media' ) )
	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9008,
		'pin'    : 'role:media'
	} );
