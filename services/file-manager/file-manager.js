'use strict';

const cloudinary = require( 'cloudinary' );
const config     = require( './config' );

function fileManager ( options ) {
	let seneca = this;
	let plugin = 'fileManager';

	seneca.add( 'init:fileManager', init );
	seneca.add( 'role:fileManager,cmd:upload', cmdUpload );

	function init ( msg, reply ) {
		cloudinary.config( {
			'cloud_name' : config.CLOUD_NAME,
			'api_key'    : config.CLOUD_API_KEY,
			'api_secret' : config.CLOUD_SECRET
		} );

		reply();
	}

	function cmdUpload ( msg, reply ) {
		cloudinary.uploader.upload( msg.data.Filedata, function ( res ) {
			reply( null, res );
		} );
		// reply( null, {
		// 	'Url'    : 'www.google.com/image.jpg',
		// 	'Width'  : 120,
		// 	'Height' : 120,
		// 	'Format' : 'jpg'
		// } );
	}

	return {
		'name' : plugin
	}
}

module.exports = fileManager;
