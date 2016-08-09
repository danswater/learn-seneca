'use strict';
const moment = require( 'moment' );

function feeds ( options ) {
	let seneca = this;
	let plugin = 'feeds';

	seneca.add( 'role:feeds,cmd:create', cmdCreate );
	seneca.add( 'role:feeds,cmd:get', cmdGet );
	seneca.add( 'role:feeds,cmd:getAll', cmdGetAll );
	seneca.add( 'role:feeds,cmd:delete', cmdDelete );

	function cmdCreate ( msg, reply ) {
		let data = msg.data;

		let mediaPattern = {
			'role' : 'media',
			'cmd'  : 'create'
		};

		let mediaData = { 'Url' : 'www.google.com', 'Width' : 240, 'Height' : 240, 'Format' : 'jpg' };

		mediaPattern = Object.assign( {}, mediaPattern, { 'data' : mediaData } );

		seneca.act( mediaPattern, ( err, media ) => {

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

			let feed = seneca.make( 'feeds' );
			feed.data$( feedOptions );
			feed.save$( ( err, resNewFeed ) => {
				if ( err ) {
					return reply( err );
				}

				return reply( null, resNewFeed );
			} );

		} );
	}

	function cmdGet ( msg, reply ) {
		seneca.make( 'feeds' ).load$( msg.id, reply );
	}

	function cmdGetAll ( msg, reply ) {
		seneca.make( 'feeds' ).list$( reply );
	}

	function cmdDelete ( msg, reply ) {
		seneca.make( 'feeds' ).remove$( msg.id, reply );
	}

	return {
		'name' : plugin
	};
}

module.exports = feeds;
