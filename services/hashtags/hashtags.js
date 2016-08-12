'use strict';

const Promise = require( 'bluebird' );
const _       = require( 'lodash' );

function hashtags ( options ) {
	let seneca = this;
	let plugin = 'hashtags';
	let act    = Promise.promisify( seneca.act, { 'context' : seneca } );

	seneca.add( 'role:hashtags,cmd:bulkCreate', cmdBulkCreate );
	seneca.add( 'role:hashtags,cmd:createFeedReference', cmdCreateFeedReference );
	seneca.add( 'role:hashtags,cmd:getByFeed', cmdGetByFeed );
	seneca.add( 'role:hashtags,cmd:get', cmdGet );

	function cmdBulkCreate ( msg, reply ) {
		let dataHashtags = _.uniq( msg.data.Hashtags );

		function hashtag ( hashtag ) {
			return new Promise( function ( resolve, reject ) {
				seneca.make( 'hashtag' ).load$( { 'Name' : hashtag }, ( err, resHashtag ) => {
					if ( err ) {
						return reject( err );
					}

					if ( !resHashtag ) {
						let hashtagEntity  = seneca.make( 'hashtag' );
						hashtagEntity.Name = hashtag;
						hashtagEntity.save$( ( err, resNewHashtag ) => {
							resolve( resNewHashtag );
						} );
					} else {
						resolve( resHashtag );
					}

				} );
			} );
		}

		Promise
			.map( dataHashtags, hashtag )
			.then( ( hashtags ) => {
				reply( null, hashtags );
			} )
			.catch( ( err ) => {
				reply( err );
			} );
	}

	function cmdCreateFeedReference( msg, reply ) {
		let data = msg.data;

		function hashtag ( hashtag ) {
			return new Promise( function ( resolve, reject ) {

				let feedHashtags       = seneca.make( 'hashtagFeed' );
				feedHashtags.FeedId    = msg.data.FeedId;
				feedHashtags.HashtagId = hashtag.id;
				feedHashtags.save$( function ( err, newFeedHashtags) {
					if ( err ) {
						return reject( err );
					}

					return resolve( newFeedHashtags );
				} );
			} );
		}

		Promise
			.map( data.Hashtags, hashtag )
			.then( ( feedHashtags ) => {
				reply( null, feedHashtags );
			} )
			.catch( ( err ) => {
				reply( err );
			} );
	}

	function cmdGetByFeed ( msg, reply ) {
		let data = msg.data;
		seneca.make( 'hashtagFeed' ).list$( { 'FeedId' : data.FeedId }, ( err, feedHashtags ) => {

			function feedHashtag ( feedHashtag ) {
				return new Promise ( ( resolve, reject ) => {

					let hashtagPattern = {
						'role' : 'hashtags',
						'cmd'  : 'get'
					};

					let hashtagData = {
						'Id' : feedHashtag.HashtagId
					};

					hashtagPattern = Object.assign( {}, hashtagPattern, { 'data' : hashtagData } );

					seneca.act( hashtagPattern, ( err, hashtags ) => {
						if ( err ) {
							return reject( err );
						}

						return resolve( hashtags );
					} );

				} );
			}

			Promise
				.map( feedHashtags, feedHashtag )
				.then( ( hashtags ) => {
					reply( null, hashtags );
				} )
				.catch( ( err ) => {
					reply( err );
				} );

		} );
	}

	function cmdGet ( msg, reply ) {
		let data = msg.data;
		seneca.make( 'hashtag' ).load$( data.Id, reply );
	}
}

module.exports = hashtags;
