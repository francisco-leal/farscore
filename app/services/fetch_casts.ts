import env from "#start/env";
import got from "got";
import { MerkleResponse } from "./types.js";

const merkleRoot = (): string => env.get("MERKLE_ROOT_SECRET");

const addCursor = (cursor: string | null | undefined): string =>
	cursor ? `&cursor=${cursor}` : "";

const emptyResponse = { result: {}, next: {} } as MerkleResponse;

export const fetchCasts = async (cursor?: string | null) => {
	const url = `https://api.warpcast.com/v2/recent-casts?limit=1000${addCursor(cursor)}`;
	const headers = {
		Authorization: `Bearer ${merkleRoot()}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await got.get(url, { headers });

		if (response.statusCode !== 200) {
			return { statusCode: response.statusCode, data: emptyResponse };
		} else {
			return {
				statusCode: response.statusCode,
				data: JSON.parse(response.body) as MerkleResponse,
			};
		}
	} catch (error) {
		console.error(error.response.statusCode);
		return { statusCode: error.response.statusCode, data: emptyResponse };
	}
};

export const fetchFollowersWarpcast = async (
	fid: number,
	cursor?: string | null,
) => {
	const url = `https://api.warpcast.com/v2/followers?fid=${fid}&limit=1000${addCursor(cursor)}`;
	const headers = {
		Authorization: `Bearer ${merkleRoot()}`,
		"Content-Type": "application/json",
	};

	try {
		const response = await got.get(url, { headers });

		if (response.statusCode !== 200) {
			return { statusCode: response.statusCode, data: emptyResponse };
		} else {
			return {
				statusCode: response.statusCode,
				data: JSON.parse(response.body) as MerkleResponse,
			};
		}
	} catch (error) {
		console.error(error.response.statusCode);
		return { statusCode: error.response.statusCode, data: emptyResponse };
	}
};
