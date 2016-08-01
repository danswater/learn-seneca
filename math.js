'use strict';
const fs     = require( 'fs' );

module.exports = function math ( options ) {

	var log;

	this.add( 'init:math', init );
	this.wrap( 'role:math', wrap );

	this.add( 'role:math,cmd:sum', sum )
	this.add( 'role:math,cmd:sum', sumValidation );
	this.add( 'role:math,cmd:product', product );

	function init ( msg, respond ) {
		fs.open( options.logFile, 'a', ( err, fd ) => {
			if ( err ) {
				return respond( err );
			}

			log = makeLog ( fd );
			respond();
		} );
	}

	function wrap ( msg, respond ) {
		msg.left  = Number( msg.left ).valueOf();
		msg.right = Number( msg.right ).valueOf();
		this.prior( msg, respond );
	}

	function sum ( msg, reply ) {
		var out = { 'answer' : ( msg.left + msg.right ) };
		log( 'sum ' + msg.left + ' + ' + msg.right + ' = ' + out.answer + '\n' );
		reply( null, out );
	}

	function sumValidation ( msg, reply ) {
		let left = parseInt( msg.left, 10 );
		let right = parseInt( msg.right, 10 );

		if ( !Number.isFinite( left ) || !Number.isFinite( right ) ) {
			return reply( new Error( 'Expected left and right to be numbers' ) );
		}

		this.prior( {
			'role'  : 'math',
			'cmd'   : 'sum',
			'left'  : left,
			'right' : right
		}, reply );
	}

	function product ( msg, reply ) {
		var out = { 'answer' : ( msg.left * msg.right ) };
		log( 'product ' + msg.left + ' + ' + msg.right + ' = ' + out.answer + '\n' );
		reply( null, out );
	}

	function makeLog ( fd ) {
		return function ( entry ) {
			fs.write( fd, new Date().toISOString() + ' ' + entry, null,' utf8', ( err ) => {
				if ( err ) {
					return console.log( err );
				}

				fs.fsync( fd, ( err ) => {
					if ( err ) {
						return console.log( err );
					}
				} );
			} );
		}
	}

}
