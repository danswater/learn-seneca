'use strict';

const assert = require( 'assert' );
const seneca = require( 'seneca' )();

seneca
	.use( 'entity' )
	.use( require( './users' ) )
	.error( assert.fail );

createUser();

function createUser () {
	seneca.act( 'role:users,cmd:create,data:{email:testfoo@gmail.com,username:testfoo,displayname:testfoo}', function ( err, newUser ) {
		seneca.act( 'role:users,cmd:get', { 'id' : newUser.id }, function ( err, user ) {
			assert.equal( newUser.username, user.username );
		} );
	} );
}
