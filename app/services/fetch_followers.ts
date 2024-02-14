import { fetchQuery, init } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) throw new Error("AIRSTACK_TOKEN is not set in environment variables");

init(process.env.AIRSTACK_API_KEY);

const getSocialFollowersQuery = `
query FetchFollowers($identity: Identity!) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $identity}}, blockchain: ALL}
  ) {
    Follower {
      dappName
      followerProfileId
      followerAddress {
        addresses
        socials {
          profileName
        }
      }
    }
  }
}
`;

export interface GetFollowersResponse {
  Follower: {
    dappName: string;
    followerProfileId: string;
    followerAddress: {
      addresses: string[];
      socials: {
        profileName: string;
        profileImage: string;
      }[];
    };
  }[];
}

export interface FollowerStructure {
  dappName: string;
  followerProfileId: string;
  followerAddress: {
    addresses: string[];
    socials: {
      profileName: string;
      profileImage: string;
    }[];
  };
}

export const fetchFollowers = async (fid: number) => {
  if (!fid) {
    return { data: []}
  }

  const res = await fetchQuery(getSocialFollowersQuery, { identity: `fc_fid:${fid}` });

  return { data: res.data.SocialFollowers.Follower}
};
