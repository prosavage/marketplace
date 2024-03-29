import { useRouter } from "next/router";
import { DirectoryResource, Resource } from "@savagelabs/types";
import { getResourceIconURL } from "../../util/cdn";
import useFallbackImageInSSR from "../../util/UseFallbackImageInSRR";

export default function ResourceIcon(props: {
  resource: Resource | DirectoryResource;
  size: string;
}) {
  const router = useRouter();
  // https://marketplace-savagelabs.b-cdn.net/resources/5fe543e4617b45c9499e40d1/icon.png
  // const fallback = "https://marketplace-savagelabs.b-cdn.net/defaults/default-icon.svg"
  const fallback = `/static/defaults/default-icon.svg`;
  const fallbackImageProps = useFallbackImageInSSR(fallback);
  return (
    <img
      onClick={() => router.push(`/resources/${props.resource._id}`)}
      src={
        props.resource?.hasIcon
          ? getResourceIconURL(props.resource._id)
          : fallback
      }
      alt=""
      height={props.size}
      width={props.size}
      {...fallbackImageProps}
    />
  );
}
