import {Team, TeamWithUsers} from "@savagelabs/types";
import { useRouter } from "next/router";
import { getTeamIconURL } from "../../util/cdn";
import useFallbackImageInSSR from "../../util/UseFallbackImageInSRR";

export default function TeamIcon(props: {
  overrideSrc?: string;
  team?: Team | TeamWithUsers;
  size: string;
  style?: Object;
}) {
  const router = useRouter();
  // https://marketplace-savagelabs.b-cdn.net/resources/5fe543e4617b45c9499e40d1/icon.png
  // const fallback = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.svg"
  const fallback = `/marketplace/static/defaults/default-user.svg`;
  const fallbackImageProps = useFallbackImageInSSR(fallback);

  const getFileURL = () => {
    if (props.overrideSrc) {
      return props.overrideSrc
    }

    return props.team?.hasIcon ? getTeamIconURL(props.team._id) : fallback
  }

  return (
    <img
      style={{ borderRadius: "50%", ...props.style }}
      src={getFileURL()}
      alt=""
      width={props.size}
      height={props.size}
      {...fallbackImageProps}
    />
  );
}
