'use strict';

const moment  = require( 'moment' );
const Promise = require( 'bluebird' );
const _       = require( 'lodash' );

function Feed ( obj ) {
	return _.omit( obj, [ 'UserId', 'MediaId' ] );
}

function feeds ( options ) {
	let seneca = this;
	let plugin = 'feeds';
	let act    = Promise.promisify( seneca.act, { 'context' : seneca } );

	seneca.add( 'role:feeds,cmd:create', cmdCreate );
	seneca.add( 'role:feeds,cmd:get', cmdGet );
	seneca.add( 'role:feeds,cmd:getAll', cmdGetAll );
	seneca.add( 'role:feeds,cmd:delete', cmdDelete );

	function cmdCreate ( msg, reply ) {
		let data = msg.data;

		function actFileManager ( filedata ) {
			let fileManagerPattern = {
				'role' : 'fileManager',
				'cmd'  : 'upload'
			};

			let fileManagerData = {
				'Filedata' : filedata
			};

			fileManagerPattern = Object.assign( {}, fileManagerPattern, { 'data' : fileManagerData } );

			return act( fileManagerPattern );
		}

		function actMedia ( file ) {
			let mediaPattern = {
				'role' : 'media',
				'cmd'  : 'create'
			};

			let mediaData = file;

			mediaPattern = Object.assign( {}, mediaPattern, { 'data' : mediaData } );

			return act( mediaPattern );
		}

		function actHashtags () {
			let hashtagPattern = {
				'role' : 'hashtags',
				'cmd'  : 'bulkCreate'
			};

			let hashtagData = {
				'Hashtags' : data.Hashtags.split( ',' )
			};

			hashtagPattern = Object.assign( {}, hashtagPattern, { 'data' : hashtagData } );

			return act( hashtagPattern );
		}

		function saveFeed ( feedOptions ) {
			let feed = seneca.make( 'feed' );
			feed.data$( feedOptions );

			let save$ = Promise.promisify( feed.save$, { 'context' : feed } );

			return save$();
		}

		function actHashtagFeed ( feed, hashtags ) {
			let hashtagFeedPattern = {
				'role' : 'hashtags',
				'cmd'  : 'createFeedReference'
			};

			let hashtagFeedData = {
				'Hashtags' : hashtags,
				'FeedId'   : feed.id
			};

			hashtagFeedPattern = Object.assign( {}, hashtagFeedPattern, { 'data' : hashtagFeedData } );

			return act( hashtagFeedPattern );
		}

		function actUser ( userId ) {
			let userPattern = {
				'role' : 'users',
				'cmd'  : 'get'
			};

			let userData = {
				'UserId' : userId
			};

			userPattern = Object.assign( {}, userPattern, { 'data' : userData } );

			return act( userPattern );
		}

		Promise.coroutine( function* () {
			try {
				let file     = yield actFileManager( data.Filedata );
				let media    = yield actMedia( file );
				let hashtags = yield actHashtags();

				let feedOptions = {
					'Title'        : data.Title,
					'Description'  : data.Description,
					'Created'      : moment().format( 'YYYY-MM-DD H:mm:ss' ),
					'Views'        : 0,
					'CommentCount' : 0,
					'LikeCount'    : 0,
					'MediaId'      : media.id,
					'FeedType'     : 'Image',
					'UserId'       : data.UserId
				};

				let resNewFeed   = yield saveFeed( feedOptions );
				let hashtagFeeds = yield actHashtagFeed( resNewFeed, hashtags );
				let user         = yield actUser( data.UserId );

				resNewFeed.User     = user;
				resNewFeed.Media    = media;
				resNewFeed.Hashtags = hashtags;

				return reply( null, Feed( resNewFeed ) );
			} catch ( err ) {
				return reply( err );
			}

		} )();
	}

	function cmdGet ( msg, reply ) {
		seneca.make( 'feed' ).load$( msg.id, reply );
	}

	function cmdGetAll ( msg, reply ) {
		seneca.make( 'feed' ).list$( ( err, feeds ) => {

			function media ( feed ) {
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
			}

			function hashtagFeed ( feed ) {
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
			}

			function user ( feed ) {
				return new Promise ( ( resolve, reject ) => {

					let userPattern = {
						'role' : 'users',
						'cmd'  : 'get'
					};

					let userData = {
						'UserId' : feed.UserId
					};

					userPattern = Object.assign( {}, userPattern, { 'data' : userData } );

					seneca.act( userPattern, ( err, user ) => {
						if ( err ) {
							return reject( err );
						}

						feed.User = user;
						return resolve( feed );
					} )

				} );
			}

			Promise
				.map( feeds, media )
				.map( hashtagFeed )
				.map( user )
				.map( Feed )
				.then( ( feeds ) => {
					reply( null, feeds );
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
