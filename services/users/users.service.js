'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './users' ) )
	.listen( { 'port' : 9004, 'pin' : 'role:users' } );
