'use strict';

module.exports = {
	'TOKEN_SECRET' : process.env.TOKEN_SECRET || 'YOUR_UNIQUE_JWT_TOKEN_SECRET',

	'MONGO_CONFIG' : {
		'uri' : process.env.CONFIG || 'mongodb://localhost:27017/user'
	},

	'MESH_CONFIG' : {
		'isbase' : true,
		'port'   : 9004,
		'pin'    : 'role:users'
	},

	'SENECA_CONFIG' : ( seneca ) => {
		return {
			'log' : {
				'map' : [
					{
						'plugin'  : 'users',
						'handler' : 'print'
					},
					{
						'level'   : 'all',
						'handler' : seneca.loghandler.file( 'user.log' )
					}
				]
			}
		};
	}
};
