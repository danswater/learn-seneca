'use strict';

const Seneca = require( 'seneca' );
const expect = require( 'chai' ).expect;

describe( 'User Service', function () {
	let seneca;

	beforeEach( function () {
		seneca = Seneca()
			.use( 'entity' )
			.use( require( '../users' ) )
			.error( expect.fail );
	} );

	it ( 'should create new user', function ( done ) {
		seneca.act( 'role:users,cmd:create,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo}', function ( err, newUser ) {
			expect( newUser ).to.not.be.equal( undefined );
			expect( newUser ).to.be.a( 'object' );

			expect( newUser.Email ).to.be.a( 'string' );
			expect( newUser.Username ).to.be.a( 'string' );
			expect( newUser.Displayname ).to.be.a( 'string' );

			done();
		} );
	} );

	it( 'should get specific user', function ( done ) {
		seneca.act( 'role:users,cmd:create,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo}', function ( err, newUser ) {
			let pattern = {
				'role' : 'users',
				'cmd'  : 'get',
				'data' : {
					'UserId' : newUser.id
				}
			};

			seneca.act( pattern, function ( err, user ) {
				expect( user ).to.not.be.equal( undefined );
				expect( user ).to.be.a( 'object' );

				expect( user.Email ).to.be.a( 'string' );
				expect( user.Username ).to.be.a( 'string' );
				expect( user.Displayname ).to.be.a( 'string' );

				done();
			} );
		} );
	} );

	it( 'should get all users', function ( done ) {
		seneca.act( 'role:users,cmd:create,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo}', function ( err, newUser ) {
			seneca.act( 'role:users,cmd:getAll', function ( err, user ) {
				expect( user ).to.not.be.equal( undefined );
				expect( user ).to.be.a( 'array' );

				expect( user[ 0 ].Email ).to.be.a( 'string' );
				expect( user[ 0 ].Username ).to.be.a( 'string' );
				expect( user[ 0 ].Displayname ).to.be.a( 'string' );

				done();
			} );
		} );
	} );

	it( 'should delete user', function ( done ) {
		seneca.act( 'role:users,cmd:create,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo}', function ( err, newUser ) {
			let pattern = {
				'role' : 'users',
				'cmd'  : 'delete',
				'data' : {
					'UserId' : newUser.id
				}
			};

			seneca.act( pattern, function ( err, user ) {
				expect( user ).to.be.equal( undefined );
				done();
			} );
		} );
	} );

	it( 'should be able to signup user', function ( done ) {
		seneca.act( 'role:users,cmd:signup,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo,Password:inosentelangangnagtataka}', function ( err, token ) {
			expect( token ).to.not.be.equal( undefined );
			expect( token.Token ).to.be.a( 'string' );

			done();
		} );
	} );

	it( 'should be able to login user', function ( done ) {
		seneca.act( 'role:users,cmd:signup,data:{Email:testfoo@gmail.com,Username:testfoo,Displayname:testfoo,Password:inosentelangangnagtataka}', function ( err, token ) {
			seneca.act( 'role:users,cmd:login,data:{Email:testfoo@gmail.com,Password:inosentelangangnagtataka}', function ( err, loggedUser ) {
				expect( loggedUser ).to.not.be.equal( undefined );
				expect( loggedUser.Token ).to.be.a( 'string' );

				expect( loggedUser.User ).to.be.a( 'object' );

				done();
			} );
		} );
	} );
} );
