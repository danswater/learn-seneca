'use strict';

const Seneca = require( 'seneca' );
const expect = require( 'chai' ).expect;

describe( 'Hashtags Service', function () {
	let seneca;

	beforeEach( function () {
		seneca = Seneca()
			.use( 'entity' )
			.use( require( '../hashtags' ) )
			.use( 'mesh' )
			.error( expect.fail );
	} );

	it ( 'should create new hashtag', function ( done ) {
		let msg = {
			'role' : 'hashtags',
			'cmd'  : 'bulkCreate',
			'data' : {
				'Hashtags' : [ 'Alive', 'Test', 'Hello' ]
			}
		};

		seneca.act( msg, function ( err, hashtags ) {
			expect( hashtags ).to.not.be.equal( undefined );
			expect( hashtags ).to.be.a( 'array' );

			let hashtag = hashtags[ 0 ];
			expect( hashtag.id ).to.be.a( 'string' );
			expect( hashtag.Name ).to.be.a( 'string' );

			done();
		} );
	} );

	it ( 'should create new feed reference', function ( done ) {
		let msg = {
			'role' : 'hashtags',
			'cmd'  : 'createFeedReference',
			'data' : {
				'FeedId'   : 'eqw1',
				'Hashtags' : [ {
					'id'     : 'eqw1'
				} ]
			}
		};

		seneca.act( msg, function ( err, feedHashtags ) {
			expect( feedHashtags ).to.not.be.equal( undefined );
			expect( feedHashtags ).to.be.a( 'array' );

			let feedHashtag = feedHashtags[ 0 ];
			expect( feedHashtag.FeedId ).to.be.a( 'string' );
			expect( feedHashtag.HashtagId ).to.be.a( 'string' );

			done();
		} );

	} );
} );
