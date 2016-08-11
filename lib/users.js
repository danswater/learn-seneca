'use strict';
const express = require( 'express' );
const utils   = require( './utils' );
const router  = express.Router();

function userApi ( seneca ) {
	router.get( '/users', function ( req, res ) {
		let msg = 'role:users,cmd:getAll';
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.get( '/users/:id', function ( req, res ) {
		let msg = { 'role' : 'users', 'cmd' : 'get', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.post( '/users', function ( req, res ) {
		let msg = Object.assign( {}, { 'role' : 'users', 'cmd' : 'signup' }, { 'data' : req.body } );
		seneca.act( msg, function ( err, token ) {
			if ( token.status ) {
				return res.status( token.status ).send( { 'why' : token.message } );
			}

			return res.json( token );
		} );
	} );

	router.delete( '/users/:id', function ( req, res ) {
		let msg = { 'role' : 'users', 'cmd' : 'delete', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	return router;
}

module.exports = userApi;
