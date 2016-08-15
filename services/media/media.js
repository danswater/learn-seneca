'use strict';

function media ( options ) {
	let seneca = this;
	let plugin = 'media';

	seneca.add( 'role:media,cmd:create', cmdCreate );
	seneca.add( 'role:media,cmd:get', cmdGet );

	function cmdCreate ( msg, reply ) {
		let data = msg.data;

		let mediaEntity    = seneca.make( 'media' );
		mediaEntity.Url    = data.url;
		mediaEntity.Format = data.format;
		mediaEntity.Width  = data.width;
		mediaEntity.Height = data.Height;

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
