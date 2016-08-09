'use strict';

const _ = require( 'lodash' );

function hashtags ( options ) {
	let seneca = this;
	let plugin = 'hashtags';

	seneca.add( 'role:hashtags,cmd:create', cmdCreate );
	seneca.add( 'role:hashtags,cmd:createFeedReference', cmdCreateFeedReference );

	function cmdCreate ( msg, reply ) {
		let dataHashtags = _.uniq( msg.data.Hashtags );

		let promisedHashtags = dataHashtags.map( hashtag => {
			return new Promise( function ( resolve, reject ) {

				seneca.make( 'hashtag' ).load$( { 'name' : hashtag }, ( err, resHashtag ) => {

					if ( err ) {
						return reject( err );
					}

					if ( !resHashtag ) {
						let hashtagEntity  = seneca.make( 'hashtag' );
						hashtagEntity.name = hashtag;
						hashtagEntity.save$( ( err, resNewHashtag ) => {
							resolve( resNewHashtag );
						} );
					} else {
						resolve( resHashtag );
					}

				} );
			} );

		} );

		Promise.all( promisedHashtags )
			.then( function ( hashtags ) {
				reply( null, hashtags );
			} )
			.catch( function ( err ) {
				reply( err );
			} );
	}

	function cmdCreateFeedReference( msg, reply ) {
		let promisedFeedHashtags = msg.data.Hashtags.map( function ( hashtag ) {
			return new Promise( function ( resolve, reject ) {

				let feedHashtags       = seneca.make( 'hashtag' );
				feedHashtags.FeedId    = msg.data.FeedId;
				feedHashtags.HashtagId = hashtag.id;
				feedHashtags.save$( function ( err, newFeedHashtags) {
					if ( err ) {
						return reject( err );
					}

					return resolve( newFeedHashtags );
				} );
			} );
		} );

		Promise.all( promisedFeedHashtags )
			.then( function ( feedHashtags ) {
				reply( null, feedHashtags );
			} )
			.catch( function ( err ) {
				reply( err );
			} );

	}
}

module.exports = hashtags;
