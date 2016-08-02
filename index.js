'use strict';

const seneca = require( 'seneca' )()
	.use( require( './api' ) )
	.use( 'entity' )
	.client( { 'type' : 'tcp', 'pin' : 'role:math' } )
	// .client( { 'port' : 9002,  'pin' : 'role:shop' } )
	.client( { 'port' : 9004,  'pin' : 'role:users' } );

const app = require( 'express' )()
	.use( require( 'body-parser' ).json() )
	.use( '/api/v1', require( './lib/users' )( seneca ) )
	.use( seneca.export( 'web' ) )
	.listen( 8081 );

// seneca.act( 'role:shop,add:product,data:{ name:Apple,price:1.99 }', console.log );
seneca.act( 'role:users,cmd:create,data:{email:testfoo@gmail.com,username:testfoo,displayname:testfoo}', console.log );
