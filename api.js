'use strict';

function api ( options ) {
	let validOps = { 'sum' : 'sum', 'product' : 'product' };

	this.add( 'init:api', function ( msg, respond ) {
		this.act( 'role:web', {
			'use' : {
				'prefix' : 'api',
				'pin'    : 'role:api,path:*',
				'map'    : {
					'calculate' : { 'GET' : true, 'suffix' : '/:operation' }
				}
			}
		} );

		this.act( 'role:web', {
			'use' : {
				'prefix' : 'api',
				'pin' : 'role:api,path:*',
				'map' : {
					'shop' : { 'GET' : true, 'suffix' : '/:operation' }
				}
			}
		} );

		respond();
	} );

	this.add( 'role:api,path:calculate',
		function ( msg, respond ) {
			this.act( 'role:math', {
				'cmd'   : validOps[ msg.operation ],
				'left'  : msg.left,
				'right' : msg.right
			}, respond );
		} );

	this.add( 'role:api,path:shop', function ( msg, reply ) {
		let shopMsg = { 'role' : 'shop', 'id' : msg.pid };
		if ( 'get' === msg.operation ) {
			shopMsg.get = 'product';
		}

		if ( 'purchase' === msg.opeation ) {
			shopMsg.cmd = 'purchase';
		}

		this.act( shopMsg, reply );
	} );
}

module.exports = api;
