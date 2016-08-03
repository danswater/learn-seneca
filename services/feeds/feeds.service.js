'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './feeds' ) )
	.listen( { 'port' : 9005, 'pin' : 'role:feeds' } );