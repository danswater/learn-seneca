module.exports = (shipit) => {
	require( 'shipit-deploy' )( shipit );

	shipit.initConfig( {
		'default' : {
			'workspace'     : '/tmp/learn-seneca',
			'deployTo'      : '~/learn-seneca',
			'repositoryUrl' : 'https://github.com/danswater/learn-seneca.git',
			'ignores'       : ['.git', 'node_modules'],
			'rsync'         : ['--del'],
			'keepReleases'  : 2,
			'key'           : '~/.ssh/id_rsa',
			'shallowClone'  : true
		},
		'staging' : {
			'servers' : 'root@162.248.160.69'
		}
	} );

	shipit.on( 'cleaned', () => {
		return shipit.remote('pwd' );
	} );
};
