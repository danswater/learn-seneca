'use strict';

const seneca = require( 'seneca' )();

let stats = {};

seneca.add( 'role:shop,info:purchase', function ( msg, respond ) {
	let productName = msg.purchase.name;
	stats[ productName ] = stats[ productName ] || 0;
	stats[ productName ]++;
	console.log( stats );
	respond();
} )
.listen( {port:9003,pin:'role:shop,info:purchase'} );
