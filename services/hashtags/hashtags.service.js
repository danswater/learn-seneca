'use strict';

const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './hashtags' ) )
	.listen( { 'port' : 9007, 'pin' : 'role:hashtags' } );
