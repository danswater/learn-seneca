'use strict';

module.exports = {
	'MONGO_CONFIG' : {
		'uri' : process.env.CONFIG || 'mongodb://localhost:27017/hashtag'
	},

	'MESH_CONFIG' : {
		'isbase' : true,
		'port'   : 9007,
		'pin'    : 'role:hashtags'
	},

	'SENECA_CONFIG' : ( seneca ) => {
		return {
			'log' : {
				'map' : [
					{
						'plugin'  : 'hashtags',
						'handler' : 'print'
					},
					{
						'level'   : 'all',
						'handler' : seneca.loghandler.file( 'hashtags.log' )
					}
				]
			}
		};
	}
};
