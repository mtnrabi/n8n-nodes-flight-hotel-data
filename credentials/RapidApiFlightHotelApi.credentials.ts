import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	Icon,
	INodeProperties,
} from 'n8n-workflow';

/**
 * A single RapidAPI key authenticates both underlying REST APIs:
 *   - google-flights-live-api.p.rapidapi.com
 *   - booking-live-api.p.rapidapi.com
 *
 * The key is sent as the `x-rapidapi-key` header. The matching
 * `x-rapidapi-host` header is set per operation by the node, because the two
 * APIs live on different hosts.
 *
 * Every request you make is billed to your own RapidAPI subscription.
 */
export class RapidApiFlightHotelApi implements ICredentialType {
	name = 'rapidApiFlightHotelApi';

	displayName = 'RapidAPI Flight & Hotel Data API';

	icon: Icon = {
		light: 'file:rapidApiFlightHotelApi.svg',
		dark: 'file:rapidApiFlightHotelApi.dark.svg',
	};

	documentationUrl = 'https://rapidapi.com/mtnrabi/api/google-flights-live-api';

	properties: INodeProperties[] = [
		{
			displayName: 'RapidAPI Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			description:
				'Your own RapidAPI key (for example YOUR_RAPIDAPI_KEY). Sent as the x-rapidapi-key header. Subscribe to the Flights API and/or the Hotels API on RapidAPI first; the same key works for both.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'x-rapidapi-key': '={{$credentials.apiKey}}',
			},
		},
	};

	/**
	 * `GET /isalive` on the hotels host is the cheapest published endpoint on
	 * either API: no body, no search, and it is documented on the RapidAPI
	 * listing. A wrong key is rejected by the RapidAPI gateway before it ever
	 * reaches the backend, so this tells the user "your key works" without
	 * running a real flight or hotel search.
	 *
	 * The host header has to be set here as well as in the node, because
	 * `authenticate` only injects the key and the two APIs sit on different
	 * hosts.
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://booking-live-api.p.rapidapi.com',
			url: '/isalive',
			method: 'GET',
			headers: {
				'x-rapidapi-host': 'booking-live-api.p.rapidapi.com',
			},
		},
	};
}
