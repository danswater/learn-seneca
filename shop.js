'use strict';

function shop ( options ) {

	this.add( 'role:shop,get:product', function( msg, reply ) {
		this.make( 'product' ).load$( msg.id, reply );
	} );

	this.add( 'role:shop,add:product', function ( msg, reply ) {
		let product = this.make( 'product' );
		product.data$( msg.data );
		product.save$( reply );
	} );

	this.add( 'role:shop,cmd:purchase', function ( msg, reply ) {
		this.make( 'product' ).load$( msg.id, function ( err, product ) {
			if ( err ) {
				return reply( err );
			}

			this.make( 'purchase' )
				.data$( {
					'when'    : Date.now(),
					'product' : product.id,
					'name'    : product.name,
					'price'   : product.price
				} )
				.save$( function ( err, purchase ) {
					if ( err ) {
						return reply( err );
					}

					this.act( 'role:shop,info:purchase', { 'purchase' : purchase } );
					reply( null, purchase );
				} );
		} );
	} );

	this.add( 'role:shop,info:purchase', function ( msg, reply ) {
		this.log.info( 'purchase', msg.purchase );
		reply();
	} );

}

module.exports = shop;
