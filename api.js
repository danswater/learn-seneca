'use strict';

function api ( options ) {
	let seneca   = this;
	let validOps = { 'sum' : 'sum', 'product' : 'product' };

	seneca.add( 'init:api', function ( msg, respond ) {
		seneca.act( 'role:web', {
			'use' : {
				'prefix' : 'api',
				'pin'    : 'role:api,path:*',
				'map'    : {
					'calculate' : { 'GET' : true, 'suffix' : '/:operation' }
				}
			}
		} );

		seneca.act( 'role:web', {
			'use' : {
				'prefix' : 'api',
				'pin'    : 'role:api,path:*',
				'map'    : {
					'shop' : { 'GET' : true, 'suffix' : '/:operation' }
				}
			}
		} );

		respond();
	} );

	seneca.add( 'role:api,path:calculate', function ( msg, respond ) {
			seneca.act( 'role:math', {
				'cmd'   : validOps[ msg.operation ],
				'left'  : msg.left,
				'right' : msg.right
			}, respond );
		} );

	seneca.add( 'role:api,path:shop', function ( msg, reply ) {
		let shopMsg = { 'role' : 'shop', 'id' : msg.pid };
		if ( 'get' === msg.operation ) {
			shopMsg.get = 'product';
		}

		if ( 'purchase' === msg.operation ) {
			shopMsg.cmd = 'operation';
		}

		seneca.act( shopMsg, reply );
	} );
}

module.exports = api;
