'use strict';

module.exports = {
	'MONGO_CONFIG' : {
		'uri' : process.env.CONFIG || 'mongodb://localhost:27017/media'
	},

	'MESH_CONFIG' : {
		'isbase' : true,
		'port'   : 9008,
		'pin'    : 'role:media'
	},

	'SENECA_CONFIG' : ( seneca ) => {
		return {
			'log' : {
				'map' : [
					{
						'plugin'  : 'media',
						'handler' : 'print'
					},
					{
						'level'   : 'all',
						'handler' : seneca.loghandler.file( 'media.log' )
					}
				]
			}
		};
	}
};
