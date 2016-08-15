module.exports = (shipit) => {
	require( 'shipit-deploy' )( shipit );

	shipit.initConfig( {
		'default' : {
			'workspace'     : '/tmp/github-monitor',
			'deployTo'      : '/tmp/deploy_to',
			'repositoryUrl' : 'https://github.com/danswater/learn-seneca.git',
			'ignores'       : ['.git', 'node_modules'],
			'rsync'         : ['--del'],
			'keepReleases'  : 2,
			'key'           : '/path/to/key',
			'shallowClone'  : true
		},
		'staging' : {
			'servers' : 'root@162.248.160.69'
		}
	} );
};
