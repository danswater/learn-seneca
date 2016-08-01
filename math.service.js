'use strict';

require( 'seneca' )()
	.use( require( './math' ), { 'logFile' : './math.log' } )
	.listen( { 'type' : 'tcp', 'pin' : 'role:math' } );
