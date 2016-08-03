'use strict';

function feeds ( options ) {
	let seneca = this;
	let plugin = 'feeds';

	seneca.add( 'role:feeds,cmd:create', cmdCreate );
	seneca.add( 'role:feeds,cmd:get', cmdGet );
	seneca.add( 'role:feeds,cmd:getAll', cmdGetAll );
	seneca.add( 'role:feeds,cmd:delete', cmdDelete );

	function cmdCreate ( msg, reply ) {
		let feed = seneca.make( 'feeds' );
		feed.data$( msg.data );
		feed.save$( reply );
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
