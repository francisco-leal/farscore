import env from '#start/env'
import got from 'got'

const merkleRoot = (): string => env.get('MERKLE_ROOT_SECRET')

const addCursor = (cursor: string | null): string => cursor ? `&cursor=${cursor}` : ''

export const fetchCasts = async (cursor?: string | null) => {
  const url = `https://api.warpcast.com/v2/recent-casts?limit=1000${addCursor(cursor)}`
  const headers = {
    'Authorization': `Bearer ${merkleRoot()}`,
    'Content-Type': 'application/json'
  }

  try {
    const data = await got.get(url, { headers });

    return JSON.parse(data.body);
  } catch (error) {
    console.error(error.response.statusCode);
    return { statusCode: error.response.statusCode, data: []};
  }
}
