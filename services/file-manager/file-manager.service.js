'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './file-manager' ) )
	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9006,
		'pin'    : 'role:fileManager'
	} );
