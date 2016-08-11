'use strict';

const moment = require( 'moment' );
const jwt    = require( 'jwt-simple' );
const config = require( '../services/users/config' );

module.exports = {
	ensureAuthenticated
};

function ensureAuthenticated( req, res, next ){

	if ( !req.header( 'Authorization' ) ) {
		return res.status( 401 ).send( { 'why' : 'Please make sure your request has an Authorization header.' } );
	}

	let token = req.header( 'Authorization' ).split( ' ' )[ 1 ];
	let payload = null;

	try {
		payload = jwt.decode( token, config.TOKEN_SECRET );
	} catch( err ) {
		return res.status( 401 ).send( { 'why' : err.message } );
	}

	if ( payload.exp <= moment().unix() ) {
		return res.status( 401 ).send( { 'why' : 'Token has expired' } );
	}

	req.user = payload.sub;

	next();
}
