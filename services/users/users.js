'use strict';

const utils  = require( './utils' );
const bcrypt = require( 'bcrypt' );

function users ( options ) {
	let seneca = this;
	let plugin = 'users';

	seneca.add( 'role:users,cmd:create', cmdCreate );
	seneca.add( 'role:users,cmd:get', cmdGet );
	seneca.add( 'role:users,cmd:getAll', cmdGetAll );
	seneca.add( 'role:users,cmd:delete', cmdDelete );
	seneca.add( 'role:users,cmd:signup', cmdSignUp );
	seneca.add( 'role:users,cmd:login', cmdLogin );

	function cmdCreate ( msg, reply ) {
		let user = seneca.make( 'user' );
		user.data$( msg.data );
		user.save$( reply );
	}

	function cmdGet ( msg, reply ) {
		let data = msg.data;
		seneca.make( 'user' ).load$( data.UserId, reply );
	}

	function cmdGetAll ( msg, reply ) {
		seneca.make( 'user' ).list$( reply );
	}

	function cmdDelete ( msg, reply ) {
		seneca.make( 'user' ).remove$( msg.id, reply );
	}

	function cmdSignUp ( msg, reply ) {
		let data = msg.data;
		seneca.make( 'user' ).load$( { 'Email' : data.Email }, ( err, existingUser ) => {
			if ( existingUser ) {
				return reply( null, {
					'status'  : 409,
					'message' : 'Email is already taken'
				} );
			}

			bcrypt.genSalt( 10, ( err, salt ) => {
				bcrypt.hash( data.Password, salt, ( err, hash ) => {

					let pattern = {
						'role' : 'users',
						'cmd'  : 'create'
					};

					data.Password = hash;

					pattern = Object.assign( {}, pattern, { 'data' : data } );

					seneca.act( pattern, ( err, newUser ) => {
						if ( err ) {
							return reply( err );
						}

						return reply( null, {
							'Token' : utils.createJWT( newUser )
						} );
					} );

				} );
			} );

		} );
	}

	function cmdLogin ( msg, reply ) {
		let data = msg.data;

		seneca.make( 'user' ).load$( { 'Email' : data.Email }, ( err, user ) => {
			if ( !user ) {
				return reply( null, {
					'status'  : 401,
					'message' : 'Invalid email or password'
				} );
			}

			bcrypt.compare( data.Password, user.Password, ( err, isMatch ) => {
				if ( !isMatch ) {
					return reply( null, {
						'status'  : 401,
						'message' : 'Invalid email or password'
					} );
				}

				return reply( null, { 'Token' : utils.createJWT( user ), 'User' : user } );
			} );

		} );
	}

	return {
		'name' : plugin
	};
}

module.exports = users;
