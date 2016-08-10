'use strict';

function media ( options ) {
	let seneca = this;
	let plugin = 'media';

	seneca.add( 'role:media,cmd:create', cmdCreate );
	seneca.add( 'role:media,cmd:get', cmdGet );

	function cmdCreate ( msg, reply ) {
		let mediaEntity    = seneca.make( 'media' );
		mediaEntity.Url    = msg.data.Url;
		mediaEntity.Format = msg.data.Format;
		mediaEntity.save$( ( err, resNewMedia ) => {

			if ( err ) {
				return reply( err );
			}

			return reply( null, resNewMedia );
		} );
	}

	function cmdGet( msg, reply ) {
		let data = msg.data;
		seneca.make( 'media' ).load$( data.Id, reply );
	}

	return {
		'name' : plugin
	}
}

module.exports = media;
