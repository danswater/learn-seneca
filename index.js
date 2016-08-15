'use strict';

const seneca = require( 'seneca' )()
	.use( 'entity' )
	.use( 'mesh' );

const app = require( 'express' )()
	.use( require( 'body-parser' ).json() )

	.use( '/api/v1', require( './lib/auth' )( seneca ) )
	.use( '/api/v1', require( './lib/users' )( seneca ) )
	.use( '/api/v1', require( './lib/feeds' )( seneca ) )

	.use( seneca.export( 'web' ) )
	.listen( 8081 );
