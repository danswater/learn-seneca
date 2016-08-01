'use strict';

const seneca = require( 'seneca' )()
	.use( require( './api' ) )
	.use( 'entity' )
	.client( { 'type' : 'tcp', 'pin' : 'role:math' } )
	.client( { 'port' : 9002,  'pin' : 'role:shop' } );

const app = require( 'express' )()
	.use( require( 'body-parser' ).json() )
	.use( seneca.export( 'web' ) )
	.listen( 8081 );

seneca.act( 'role:shop,add:product,data:{ name:Apple,price:1.99 }', console.log );
