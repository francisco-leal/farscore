import env from "#start/env";
import { User } from "#models/user";

export const MintPassport = async (user: User) => {
	console.log("Inside Mint");
	const apiURL = env.get("TALENT_PROTOCOL_API_URL");
	console.log("apiURL", apiURL);
	const url = `${apiURL}/passports`;
	console.log(url);
	const response = await fetch(url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"X-API-KEY": env.get("TALENT_PROTOCOL_API_KEY"),
		},
		body: JSON.stringify({ source: "farcaster", identifier: user.fid }), // body data type must match "Content-Type" header
	});
	return response.json(); // parses JSON response into native JavaScript objects
};
