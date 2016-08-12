'use strict';

require( 'seneca' )()
	.use( 'entity' )
	.use( require( './hashtags' ) )
	.use( 'mesh', {
		'ibase' : true,
		'port'  : 9007,
		'pin'   : 'role:hashtags'
	} );
