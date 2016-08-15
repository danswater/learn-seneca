'use strict';

const seneca = require( 'seneca' );
const config = require( './config' );

let senecaConfig;
if ( process.env.NODE_ENV === 'production' ) {
	senecaConfig = config.SENECA_CONFIG( seneca );
}

function boot ( err ) {
	if ( err ) {
		return process.exit( !console.error( err ) );
	}

	console.log( 'User service booted!' );
}

seneca( senecaConfig )
	.use( 'entity' )
	.use( require( './users' ) )
	.use( 'mesh', config.MESH_CONFIG )
	.use( 'mongo-store', config.MONGO_CONFIG )
	.ready( boot );

