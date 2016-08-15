'use strict';

module.exports = {
	'MONGO_CONFIG' : {
		'uri' : process.env.CONFIG || 'mongodb://localhost:27017/feed'
	},

	'MESH_CONFIG' : {
		'isbase' : true,
		'port'   : 9005,
		'pin'    : 'role:feeds'
	},
};
