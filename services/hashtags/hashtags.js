'use strict';

function hashtags ( options ) {
	let seneca = this;
	let plugin = 'hashtags';

	seneca.add( 'role:hastags,cmd:create', cmdCreate );

	function cmdCreate ( msg, reply ) {
		let dataHashtags = _.uniq( msg.data.Hashtags );

		let hashtags = dataHashtags.map( hashtag => {
			let newHashtag = [];

			seneca.make( 'user' ).load$( { 'name' : hashtag }, ( err, resHashtag ) => {
				if ( !resHashtag ) {
					seneca.make( 'user' );
					seneca.data$( hashtag );
					seneca.save$( ( err, resNewHashtag ) => {
						newHashtag.push( resNewHashtag );
					} );
				} else {
					newHashtag.push( resNewHashtag );
				}
			} );

			return newHashtag
		} );

		reply( null, hashtags );
	}
}

module.exports = hashtags;
