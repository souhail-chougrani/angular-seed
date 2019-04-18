// prod environment
export const environment = {
	production: true
};

export const APP_URL = 'http://localhost:7000';
export const ENV_SERVICE_URL = 'https://c7o8rvuk52.execute-api.eu-west-1.amazonaws.com/prod';

// routing
export const ROUTING = {
	dashboard: 'dashboard',
	authorization: {
		login: 'auth/login',
		register: 'auth/register',
		forgot: 'auth/forgot',
		confirm: 'auth/confirm',
		lock: 'auth/lock'
	}
};
