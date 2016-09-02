'use strict';

const seneca = require( 'seneca' );
const config = require( './config' );

function boot ( err ) {
	if ( err ) {
		return process.exit( !console.error( err ) );
	}

	console.log( 'Feed services booted!' );
}

require( 'seneca' )()
	.use( 'entity' )
	.use( require( './feeds' ) )
	.use( 'mesh', config.MESH_CONFIG )
	.use( 'mongo-store', config.MONGO_CONFIG )
	.ready( boot );
