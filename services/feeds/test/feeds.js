'use strict';

const Seneca = require( 'seneca' );
const expect = require( 'chai' ).expect;

describe( 'User Service', function () {
	let seneca;

	beforeEach( function () {
		seneca = Seneca()
			.use( 'entity' )
			.use( require( '../feeds' ) )
			.use( 'mesh' )
			.error( expect.fail );
	} );

	it ( 'should create new feed', function ( done ) {
		let msg = {
			'role' : 'feeds',
			'cmd'  : 'create',
			'data' : {
				'UserId'      : 1,
				'Title'       : 'My First Feed',
				'Description' : 'My First Feed Description',
				'Filedata'    : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgI',
				'Hashtags'    : 'Happy,Alive,Funny'
			}
		};

		seneca.act( msg, function ( err, newFeed ) {
			expect( newFeed ).to.not.be.equal( undefined );
			expect( newFeed ).to.be.a( 'object' );

			expect( newFeed.id ).to.be.a( 'string' );
			expect( newFeed.Title ).to.be.a( 'string' );
			expect( newFeed.Description ).to.be.a( 'string' );
			expect( newFeed.Hashtags ).to.be.a( 'array' );

			done();
		} );
	} );

	it ( 'should create new feed', function ( done ) {
		let msg = {
			'role' : 'feeds',
			'cmd'  : 'create',
			'data' : {
				'UserId'      : 1,
				'Title'       : 'My First Feed',
				'Description' : 'My First Feed Description',
				'Filedata'    : 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgI',
				'Hashtags'    : 'Happy,Alive,Funny'
			}
		};

		seneca.act( msg, function ( err, newFeed ) {

			let msg = {
				'role' : 'feeds',
				'cmd'  : 'getAll'
			};

			seneca.act( msg, function ( err, feeds ) {
				expect( feeds ).to.not.be.equal( undefined );
				expect( feeds ).to.be.a( 'array' );

				let feed = feeds[ 0 ];
				expect( feed.id ).to.be.a( 'string' );
				expect( feed.Title ).to.be.a( 'string' );
				expect( feed.Description ).to.be.a( 'string' );
				expect( feed.Hashtags ).to.be.a( 'array' );

				done();
			} );
		} );

	} );
} );
