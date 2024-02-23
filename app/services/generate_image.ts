import satori from 'satori'
import { join } from 'path'
import * as fs from 'fs'
import { User } from '#models/user'
import { Connection } from '#models/connection'

export const generateScoreImage = async (fid: number) => {
  const user = await User.findBy('fid', fid)
  const score = user ? user.score : 0
  const username = user ? user.username : 'unknown'

  const regularFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-Regular.ttf')
  const regularFontData = fs.readFileSync(regularFontPath)

  const boldFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-SemiBold.ttf')
  const boldFontData = fs.readFileSync(boldFontPath)

  return await satori(
    {
      type: 'div',
      props: {
        children: [
          {
            type: 'p',
            props: {
              children: `@${username} farcaster score`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-regular',
                color: 'white',
                zIndex: 1,
              },
            },
          },
          {
            type: 'p',
            props: {
              children: `${score}`,
              style: {
                fontSize: 32,
                fontFamily: 'SpaceGrotesk-regular',
                color: 'white',
                zIndex: 1,
              },
            },
          },
          {
            type: 'p',
            props: {
              children: `by farscout.xyz`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-SemiBold',
                color: 'white',
                zIndex: 1,
              },
            },
          },
        ],
        style: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: "url('https://farscout.xyz/images/thumbnail.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    {
      width: 675,
      height: 675,
      fonts: [
        {
          data: regularFontData,
          name: 'SpaceGrotesk-Regular',
        },
        {
          data: boldFontData,
          name: 'SpaceGrotesk-SemiBold',
        },
      ],
    }
  )
}

export const generateLeaderboardImage = async () => {
  const topUsers = await User.query().where('score', '>', 0).orderBy('score', 'desc').limit(5)

  const regularFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-Regular.ttf')
  const regularFontData = fs.readFileSync(regularFontPath)

  const boldFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-SemiBold.ttf')
  const boldFontData = fs.readFileSync(boldFontPath)

  return await satori(
    {
      type: 'div',
      props: {
        children: [
          ...topUsers.map((user) => ({
            type: 'div',
            props: {
              children: [
                ...(user.profilePictureUrl
                  ? [
                      {
                        type: 'img',
                        props: {
                          src: user.profilePictureUrl,
                          style: {
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            marginRight: 10,
                          },
                        },
                      },
                    ]
                  : []),
                {
                  type: 'p',
                  props: {
                    children: `@${user.username}: ${user.score}`,
                    style: {
                      fontSize: 24,
                      fontFamily: 'SpaceGrotesk-Regular',
                      color: 'white',
                      zIndex: 1,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                },
              ],
              style: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: 32,
              },
            },
          })),
          {
            type: 'p',
            props: {
              children: `by farscout.xyz`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-SemiBold',
                color: 'white',
                zIndex: 1,
                marginTop: 32,
              },
            },
          },
        ],
        style: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: "url('https://farscout.xyz/images/thumbnail.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    {
      width: 675,
      height: 675,
      fonts: [
        {
          data: regularFontData,
          name: 'SpaceGrotesk-Regular',
        },
        {
          data: boldFontData,
          name: 'SpaceGrotesk-SemiBold',
        },
      ],
    }
  )
}

export const generateFollowersImage = async (fid: number) => {
  const topUsers = await User.query()
    .whereIn('fid', Connection.query().where('target_fid', fid).select('source_fid'))
    .orderBy('score', 'desc')
    .limit(5)

  const regularFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-Regular.ttf')
  const regularFontData = fs.readFileSync(regularFontPath)

  const boldFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-SemiBold.ttf')
  const boldFontData = fs.readFileSync(boldFontPath)

  return await satori(
    {
      type: 'div',
      props: {
        children: [
          ...topUsers.map((user) => ({
            type: 'div',
            props: {
              children: [
                ...(user.profilePictureUrl
                  ? [
                      {
                        type: 'img',
                        props: {
                          src: user.profilePictureUrl,
                          style: {
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            marginRight: 10,
                          },
                        },
                      },
                    ]
                  : []),
                {
                  type: 'p',
                  props: {
                    children: `@${user.username}: ${user.score}`,
                    style: {
                      fontSize: 24,
                      fontFamily: 'SpaceGrotesk-Regular',
                      color: 'white',
                      zIndex: 1,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                    },
                  },
                },
              ],
              style: {
                display: 'flex',
                alignItems: 'center',
                marginBottom: 32,
              },
            },
          })),
          {
            type: 'p',
            props: {
              children: `by farscout.xyz`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-SemiBold',
                color: 'white',
                zIndex: 1,
                marginTop: 32,
              },
            },
          },
        ],
        style: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: "url('https://farscout.xyz/images/thumbnail.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    {
      width: 675,
      height: 675,
      fonts: [
        {
          data: regularFontData,
          name: 'SpaceGrotesk-Regular',
        },
        {
          data: boldFontData,
          name: 'SpaceGrotesk-SemiBold',
        },
      ],
    }
  )
}

export const generateIntroMessage = async () => {
  const regularFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-Regular.ttf')
  const regularFontData = fs.readFileSync(regularFontPath)

  const boldFontPath = join(process.cwd(), '/public/font', 'SpaceGrotesk-SemiBold.ttf')
  const boldFontData = fs.readFileSync(boldFontPath)

  return await satori(
    {
      type: 'div',
      props: {
        children: [
          {
            type: 'p',
            props: {
              children: `farscout.xyz`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-regular',
                color: 'white',
                zIndex: 1,
              },
            },
          },
          {
            type: 'p',
            props: {
              children: `a simple reputation frame built on top of`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-regular',
                color: 'white',
                zIndex: 1,
              },
            },
          },
          {
            type: 'p',
            props: {
              children: `farcaster and airstack`,
              style: {
                fontSize: 24,
                fontFamily: 'SpaceGrotesk-SemiBold',
                color: 'white',
                zIndex: 1,
              },
            },
          },
        ],
        style: {
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundImage: "url('https://farscout.xyz/images/thumbnail.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        },
      },
    },
    {
      width: 675,
      height: 675,
      fonts: [
        {
          data: regularFontData,
          name: 'SpaceGrotesk-Regular',
        },
        {
          data: boldFontData,
          name: 'SpaceGrotesk-SemiBold',
        },
      ],
    }
  )
}
