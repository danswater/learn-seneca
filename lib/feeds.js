'use strict';
const express = require( 'express' );
const utils   = require( './utils' );
const router  = express.Router();

function feedApi ( seneca ) {
	router.get( '/feeds', utils.ensureAuthenticated, function ( req, res ) {
		let msg =  { 'role' : 'feeds', 'cmd' : 'getAll' };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.get( '/feeds/:id', utils.ensureAuthenticated, function ( req, res ) {
		let msg = { 'role' : 'feeds', 'cmd' : 'get', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.post( '/feeds', utils.ensureAuthenticated, function ( req, res ) {
		req.body.UserId = req.user;

		let msg = Object.assign( {}, { 'role' : 'feeds', 'cmd' : 'create' }, { 'data' : req.body } );
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.delete( '/feeds/:id', utils.ensureAuthenticated, function ( req, res ) {
		let msg = { 'role' : 'feeds', 'cmd' : 'delete', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	return router;
}

module.exports = feedApi;
