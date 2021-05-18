import { useRouter } from "next/router";
import { User } from "../../types/User";
import { getAuthorIconURL } from "../../utils/cdn";
import useFallbackImageInSSR from "../../utils/useFallbackImageInSSR";

export default function AuthorIcon(props: { user?: User; size: string }) {
  const router = useRouter();
  // https://marketplace-savagelabs.b-cdn.net/resources/5fe543e4617b45c9499e40d1/icon.png
  // const fallback = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.svg"
  const fallback = `/marketplace/static/defaults/default-user.svg`;
  const fallbackImageProps = useFallbackImageInSSR(fallback);
  return (
    <>
      {props.user ? (
        <img
          style={{ borderRadius: "50%" }}
          src={
            props.user?.hasIcon ? getAuthorIconURL(props.user._id) : fallback
          }
          alt=""
          width={props.size}
          height={props.size}
          {...fallbackImageProps}
        />
      ) : null}
    </>
  );
}
