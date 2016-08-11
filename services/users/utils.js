'use strict'

const moment = require( 'moment' );
const jwt    = require( 'jwt-simple' );
const config = require( './config' );

module.exports = {
	createJWT
}

/*
 |--------------------------------------------------------------------------
 | Generate JSON Web Token
 |--------------------------------------------------------------------------
 */

function createJWT ( user ) {
	let  payload = {
		'sub' : user.id,
		'iat' : moment().unix(),
		'exp' : moment().add( 14, 'days' ).unix()
	};

	return jwt.encode( payload, config.TOKEN_SECRET );
}
