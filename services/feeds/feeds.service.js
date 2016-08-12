'use strict';

require( 'seneca' )()
	.use( 'entity' )
	.use( require( './feeds' ) )
	.use( 'mesh', {
		'isbase' : true,
		'port'   : 9005,
		'pin'    : 'role:feeds'
	} );
