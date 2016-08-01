'use strict';

const assert = require( 'assert' );

const seneca = require( 'seneca' )()
	.use( 'entity' )
	.use( require( './shop.service' ) )
	.client({port:9003,pin:'role:shop,info:purchase'})
	.error( assert.fail );

addProduct();

function addProduct () {
	seneca.act( 'role:shop,add:product,data:{ name:Apple,price:1.99 }', function ( err, saveApple ) {
		this.act( 'role:shop,get:product', { 'id' : saveApple.id }, function ( err, apple ) {
			assert.equal( apple.name, saveApple.name );
			doPurchase( apple );
		} );
	} );
}

function doPurchase ( apple ) {
	seneca.act( 'role:shop,cmd:purchase', { 'id' : apple.id }, function ( err, purchase ) {
		assert.equal( purchase.product, apple.id );
	} );
}
