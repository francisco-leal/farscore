import { init, fetchQueryWithPagination } from "@airstack/node";

if (!process.env.AIRSTACK_API_KEY) throw new Error("AIRSTACK_TOKEN is not set in environment variables");

init(process.env.AIRSTACK_API_KEY);

const getSocialFollowersQuery = `
query FetchFollowers($identity: Identity!) {
  SocialFollowers(
    input: {filter: {identity: {_eq: $identity}}, blockchain: ALL, limit: 200}
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

export const fetchFollowers = async (fid: number, maxFollowers: number) => {
  if (!fid) {
    return { data: []}
  }

  const followers = [];

  let {data, hasNextPage, getNextPage, error} = await fetchQueryWithPagination(getSocialFollowersQuery, { identity: `fc_fid:${fid}` });

  if (error || !data || !data.SocialFollowers || !data.SocialFollowers.Follower || !data.SocialFollowers.Follower.length) {
    if(error) console.error(error);
    return { data: []}
  }

  followers.push(...data.SocialFollowers.Follower);
  while (hasNextPage) {
    const result = await getNextPage();
    if (result) {
      data = result.data;
      error = result.error;
      if (error || !data || !data.SocialFollowers || !data.SocialFollowers.Follower || !data.SocialFollowers.Follower.length) {
        if(error) console.error(error);

        break;
      }

      followers.push(...data.SocialFollowers.Follower);
      hasNextPage = result.hasNextPage;
      getNextPage = result.getNextPage;
    } else {
      hasNextPage = false;
    }

    if (followers.length >= maxFollowers) {
      console.log("Forcing break - max followers reached")
      break;
    }
  }

  return { data: followers}
};
