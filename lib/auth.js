'use strict';
const express = require( 'express' );
const moment  = require( 'moment' );
const router  = express.Router();


function authApi ( seneca ) {
	router.post( '/auth/login', function ( req, res ) {
		let msg = { 'role' : 'users', 'cmd' : 'login', 'data' : req.body };
		seneca.act( msg, function ( err, user ) {
			if ( user.status ) {
				return res.status( user.status ).send( { 'why' : user.message } );
			}

			res.status( 201 ).json( user );
		} );
	} );

	router.post( '/auth/signup', function ( req, res ) {
		let msg = Object.assign( {}, { 'role' : 'users', 'cmd' : 'signup' }, { 'data' : req.body } );
		seneca.act( msg, function ( err, token ) {
			if ( token.status ) {
				return res.status( token.status ).send( { 'why' : token.message } );
			}

			return res.status( 201 ).json( token );
		} );
	} );

	return router;
}

module.exports = authApi;
