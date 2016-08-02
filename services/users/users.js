'use strict';

function users ( options ) {
	let seneca = this;
	let plugin = 'users';

	seneca.add( 'role:users,cmd:create', cmdCreate );
	seneca.add( 'role:users,cmd:get', cmdGet );
	seneca.add( 'role:users,cmd:getAll', cmdGetAll );
	seneca.add( 'role:users,cmd:delete', cmdDelete );

	function cmdCreate ( msg, reply ) {
		let user = seneca.make( 'user' );
		user.data$( msg.data );
		user.save$( reply );
	}

	function cmdGet ( msg, reply ) {
		seneca.make( 'user' ).load$( msg.id, reply );
	}

	function cmdGetAll ( msg, reply ) {
		seneca.make( 'user' ).list$( reply );
	}

	function cmdDelete ( msg, reply ) {
		seneca.make( 'user' ).remove$( msg.id, reply );
	}

	return {
		'name' : plugin
	};
}

module.exports = users;
