import type { INodeType, INodeTypeDescription } from 'n8n-workflow';

import { flightFields, flightOperations } from './FlightDescription';
import { hotelFields, hotelOperations } from './HotelDescription';

/**
 * Declarative-style node for the RapidAPI Flight & Hotel Data APIs.
 *
 * Flights  -> google-flights-live-api.p.rapidapi.com
 * Hotels   -> booking-live-api.p.rapidapi.com
 *
 * Both hosts authenticate with the same `x-rapidapi-key` header, injected by
 * the credential. The matching `x-rapidapi-host` header is set per operation
 * because the two APIs live on different hosts.
 *
 * Prices returned by these APIs are live and go stale within minutes. Do not
 * cache or reuse an earlier result; re-run the search and record when it ran.
 *
 * This is an independent API that returns publicly available flight and hotel
 * pricing. It is not affiliated with, endorsed by, or sponsored by Google or
 * Booking.com.
 */
export class FlightHotelData implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Flight & Hotel Data',
		name: 'flightHotelData',
		icon: 'file:flightHotelData.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Search real-time flight fares and hotel prices through the RapidAPI Flight & Hotel Data APIs',
		defaults: {
			name: 'Flight & Hotel Data',
		},
		// Cast keeps this source compatible with both the enum-based and the
		// string-literal-union definitions of connection types in n8n-workflow.
		inputs: ['main'] as INodeTypeDescription['inputs'],
		outputs: ['main'] as INodeTypeDescription['outputs'],
		usableAsTool: true,
		credentials: [
			{
				name: 'rapidApiFlightHotelApi',
				required: true,
			},
		],
		requestDefaults: {
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			json: true,
		},
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Flight',
						value: 'flight',
					},
					{
						name: 'Hotel',
						value: 'hotel',
					},
				],
				default: 'flight',
			},
			...flightOperations,
			...flightFields,
			...hotelOperations,
			...hotelFields,
		],
	};
}
