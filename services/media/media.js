'use strict';

function media ( options ) {
	let seneca = this;
	let plugin = 'media';

	seneca.add( 'role:media,cmd:create', cmdCreate );

	function cmdCreate ( msg, reply ) {
		let mediaEntity    = seneca.make( 'hashtag' );
		mediaEntity.Url    = msg.data.Url;
		mediaEntity.Format = msg.data.Format;
		mediaEntity.save$( ( err, resNewMedia ) => {

			if ( err ) {
				return reply( err );
			}

			return reply( null, resNewMedia );
		} );
	}

	return {
		'name' : plugin
	}
}

module.exports = media;
