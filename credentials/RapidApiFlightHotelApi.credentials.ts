import type {
	IAuthenticateGeneric,
	ICredentialType,
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
}
