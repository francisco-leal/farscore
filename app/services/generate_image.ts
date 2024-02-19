import satori from 'satori';
import { join } from "path";
import * as fs from "fs";
import { User } from '#models/user';

export const generateImage = async (fid: number)  => {
  const user = await User.findBy('fid', fid);
  const score = user ? user.score : 0;
  const username = user ? user.username : "unknown";

  const regularFontPath = join(process.cwd(), "/public/font", "SpaceGrotesk-Regular.ttf");
  const regularFontData = fs.readFileSync(regularFontPath);

  const boldFontPath = join(process.cwd(), "/public/font", "SpaceGrotesk-SemiBold.ttf");
  const boldFontData = fs.readFileSync(boldFontPath);
  
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
                fontFamily: "SpaceGrotesk-regular",
                color: "white",
                zIndex: 1,
              }
            }
          },
          {
            type: 'p',
            props: {
              children: `${score}`,
              style: {
                fontSize: 32,
                fontFamily: "SpaceGrotesk-regular",
                color: "white",
                zIndex: 1,
              }
            }
          },
          {
            type: 'p',
            props: {
              children: `by farscore.xyz`,
              style: {
                fontSize: 24,
                fontFamily: "SpaceGrotesk-SemiBold",
                color: "white",
                zIndex: 1,
              }
            }
          },
        ],
        style: { display: 'flex', flexDirection: "column", position: 'relative', width: "100%", height: "100%", justifyContent: "center", alignItems: "center", backgroundColor: "black"},
      },
    },
    {
      width: 675,
      height: 675,
      fonts: [
        {
          data: regularFontData,
          name: "SpaceGrotesk-Regular"
        },
        {
          data: boldFontData,
          name: "SpaceGrotesk-SemiBold"
        }
      ]
    },
  )
}