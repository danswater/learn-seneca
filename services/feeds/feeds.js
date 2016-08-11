'use strict';
const moment  = require( 'moment' );
const Promise = require( 'bluebird' );

function feeds ( options ) {
	let seneca = this;
	let plugin = 'feeds';

	seneca.add( 'role:feeds,cmd:create', cmdCreate );
	seneca.add( 'role:feeds,cmd:get', cmdGet );
	seneca.add( 'role:feeds,cmd:getAll', cmdGetAll );
	seneca.add( 'role:feeds,cmd:delete', cmdDelete );

	function cmdCreate ( msg, reply ) {
		let data = msg.data;

		let fileManagerPattern = {
			'role' : 'fileManager',
			'cmd'  : 'upload'
		};

		let fileManagerData = {
			'Filedata' : data.Filedata
		};

		fileManagerPattern = Object.assign( {}, fileManagerPattern, { 'data' : fileManagerData } );

		seneca.act( fileManagerPattern, ( err, file ) => {

			let mediaPattern = {
				'role' : 'media',
				'cmd'  : 'create'
			};

			let mediaData = file;

			mediaPattern = Object.assign( {}, mediaPattern, { 'data' : mediaData } );

			seneca.act( mediaPattern, ( err, media ) => {

				let hashtagPattern = {
					'role' : 'hashtags',
					'cmd'  : 'create'
				};

				let hashtagData = {
					'Hashtags' : data.Hashtags.split( ',' )
				};

				hashtagPattern = Object.assign( {}, hashtagPattern, { 'data' : hashtagData } );

				seneca.act( hashtagPattern, ( err, hashtags ) => {

					let feedOptions = {
						'Title'        : data.Title,
						'Description'  : data.Description,
						'Created'      : moment().format( 'YYYY-MM-DD H:mm:ss' ),
						'Views'        : 0,
						'CommentCount' : 0,
						'LikeCount'    : 0,
						'MediaId'      : media.id,
						'FeedType'     : 'Image'
					};

					let feed = seneca.make( 'feed' );
					feed.data$( feedOptions );
					feed.save$( ( err, resNewFeed ) => {
						if ( err ) {
							return reply( err );
						}

						let hashtagFeedPattern = {
							'role' : 'hashtags',
							'cmd'  : 'createFeedReference'
						};

						let hashtagFeedData = {
							'Hashtags' : hashtags,
							'FeedId'   : resNewFeed.id
						};

						hashtagFeedPattern = Object.assign( {}, hashtagFeedPattern, { 'data' : hashtagFeedData } );

						seneca.act( hashtagFeedPattern, ( err, hashtagFeed ) => {

							let userPattern = {
								'role' : 'users',
								'cmd'  : 'get'
							};

							let userData = {
								'UserId' : data.UserId
							};

							userPattern = Object.assign( {}, userPattern, { 'data' : userData } );

							seneca.act( userPattern, ( err, user ) => {

								delete resNewFeed.Password;

								resNewFeed.User     = user;
								resNewFeed.Media    = media;
								resNewFeed.Hashtags = hashtagFeed;

								return reply( null, resNewFeed );
							} )
						} );
					} );
				} );

			} );

		} );

	}

	function cmdGet ( msg, reply ) {
		seneca.make( 'feed' ).load$( msg.id, reply );
	}

	function cmdGetAll ( msg, reply ) {
		seneca.make( 'feed' ).list$( ( err, feeds ) => {

			let promisedMedias = Promise.map( feeds, ( feed ) => {
				return new Promise( ( resolve, reject ) => {

					let mediaPattern = {
						'role' : 'media',
						'cmd'  : 'get'
					};

					let mediaData = {
						'Id' : feed.MediaId
					};

					mediaPattern = Object.assign( {}, mediaPattern, { 'data' : mediaData } );

					seneca.act( mediaPattern, ( err, media ) => {
						if ( err ) {
							return reject( err );
						}

						feed.Media = media;
						return resolve( feed );
					} );

				} );
			} );

			Promise.all( promisedMedias )
				.then( ( feeds ) => {

					let promisedHashtagFeeds = Promise.map( feeds, ( feed ) => {
						return new Promise ( ( resolve, reject ) => {

							let hashtagFeedPattern = {
								'role' : 'hashtags',
								'cmd'  : 'getByFeed'
							};

							let hashtagFeedData = {
								'FeedId' : feed.id,
							};

							hashtagFeedPattern = Object.assign( {}, hashtagFeedPattern, { 'data' : hashtagFeedData } );

							seneca.act( hashtagFeedPattern, ( err, hashtags ) => {
								if ( err ) {
									return reject( err );
								}
								feed.Hashtags = hashtags;
								return resolve( feed );
							} );

						} );
					} );

					Promise.all( promisedHashtagFeeds )
						.then( ( retFeeds ) => {
							reply( null, retFeeds );
						} )
						.catch( ( err ) => {
							reply( err );
						} );

				} )
				.catch( ( err ) => {
					reply( err );
				} );

		} );
	}

	function cmdDelete ( msg, reply ) {
		seneca.make( 'feed' ).remove$( msg.id, reply );
	}

	return {
		'name' : plugin
	};
}

module.exports = feeds;
