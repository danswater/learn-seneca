'use strict';
const express = require( 'express' );
const router  = express.Router();

function feedApi ( seneca ) {
	router.get( '/feeds', function ( req, res ) {
		let msg =  { 'role' : 'feeds', 'cmd' : 'getAll' };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.get( '/feeds/:id', function ( req, res ) {
		let msg = { 'role' : 'feeds', 'cmd' : 'get', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.post( '/feeds', function ( req, res ) {
		let msg = Object.assign( {}, { 'role' : 'feeds', 'cmd' : 'create' }, { 'data' : req.body } );
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	router.delete( '/feeds/:id', function ( req, res ) {
		let msg = { 'role' : 'feeds', 'cmd' : 'delete', 'id' : req.params.id };
		seneca.act( msg, function ( err, user ) {
			res.json( user );
		} );
	} );

	return router;
}

module.exports = feedApi;
