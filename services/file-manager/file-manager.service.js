'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './file-manager' ) )
	.listen( { 'port' : 9006, 'pin' : 'role:fileManager' } );
