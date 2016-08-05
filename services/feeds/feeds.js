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
		let data        = msg.data;
		let metaInfo    = data.Filedata.split( ',' );
		let feedOptions = {
			'Title'        : data.Title,
			'Description'  : data.Description,
			'Created'      : moment().format( 'YYYY-MM-DD H:mm:ss' ),
			'Views'        : 0,
			'CommentCount' : 0,
			'LikeCount'    : 0,
			'MediaId'      : 0,
			'FeedType'     : 'Image'

		};

		// call file-manager service
		// seneca.act( 'role:fileManager,cmd:upload', callback )

		// call media service
		// seneca.act( 'role:media,cmd:create', callback )

		let feed = seneca.make( 'feeds' );
		feed.data$( feedOptions );
		feed.save$( reply );

		// call hashtag service
		// seneca.act( 'role:hashtags,cmd:create', callback )
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
