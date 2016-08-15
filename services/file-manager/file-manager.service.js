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

	console.log( 'File-manager service booted!' );
}

require( 'seneca' )()
	.use( 'entity' )
	.use( require( './file-manager' ) )
	.use( 'mesh', config.MESH_CONFIG )
	.ready( boot );
