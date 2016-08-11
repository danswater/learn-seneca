'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './users' ) )
	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9004,
		'pin'    : 'role:users'
	} );
