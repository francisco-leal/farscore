import { init, fetchQuery } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY)
	throw new Error("AIRSTACK_TOKEN is not set in environment variables");

init(process.env.AIRSTACK_API_KEY);

const getUserPoaps = `
query FetchPoaps($identity: Identity!, $poapEventIds: [String!]) {
  Wallet(input: {identity: $identity, blockchain: ethereum}) {
    poaps(input: {blockchain: ALL, limit: 200, filter: { eventId: { _in: $poapEventIds}}}) {
      id
      chainId
      eventId
      owner {
        identity
      }
      createdAtBlockTimestamp
      createdAtBlockNumber
      tokenId
      tokenAddress
      tokenUri
    }
  }
}
`;

export const fetchPoaps = async (fid: number, poapEventIds: string[]) => {
	if (!fid) {
		return [];
	}

	let { data, error } = await fetchQuery(getUserPoaps, {
		identity: `fc_fid:${fid}`,
		poapEventIds: poapEventIds,
	});

	if (error || !data || !data.Wallet || !data.Wallet.poaps) {
		if (error) console.error(error);
		return [];
	}

	const poaps = data.Wallet.poaps;

	return poaps;
};
