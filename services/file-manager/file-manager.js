'use strict';

const cloudinary = require( 'cloudinary' );

function fileManager ( options ) {
	let seneca = this;
	let plugin = 'fileManager';

	seneca.add( 'init:fileManager', init );
	seneca.add( 'role:fileManager,cmd:upload', cmdUpload );

	function init ( msg, reply ) {
		cloudinary.config( {
			'cloud_name' : 'danswater',
			'api_key'    : '797561536523747',
			'api_secret' : 'AFYoMgP1n9DTz3wdyubtQBJzLKs'
		} );

		reply();
	}

	function cmdUpload ( msg, reply ) {
		// cloudinary.uploader.upload( msg.data.Filedata, function ( res ) {
		// 	reply( null, res );
		// } );
		reply( null, {
			'Url'    : 'www.google.com/image.jpg',
			'Width'  : 120,
			'Height' : 120,
			'Format' : 'jpg'
		} );
	}

	return {
		'name' : plugin
	}
}

module.exports = fileManager;
