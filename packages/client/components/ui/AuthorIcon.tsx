import {useRouter} from "next/router";
import {FUser} from "@savagelabs/types";
import {getAuthorIconURL} from "../../util/cdn";
import useFallbackImageInSSR from "../../util/UseFallbackImageInSRR";
import {CSSProperties} from "react";

export default function AuthorIcon(props: {
    overrideUserId?: string;
    user?: FUser;
    size: string;
    style?: CSSProperties;
    onClick?: () => void;
    overrideSrc?: string;
}) {
    const router = useRouter();
    // https://marketplace-savagelabs.b-cdn.net/resources/5fe543e4617b45c9499e40d1/icon.png
    // const fallback = "https://marketplace-savagelabs.b-cdn.net/defaults/default-user.svg"
    const fallback = `/marketplace/static/defaults/default-user.svg`;
    const fallbackImageProps = useFallbackImageInSSR(fallback);


    const getUserID = () => {
        if (props.overrideUserId) {
            return props.overrideUserId;
        }

        return props.user._id
    }

    const hasIcon = () => {
        return props.user?.hasIcon || props.overrideUserId
    }

    const getFileURL = () => {
        if (props.overrideSrc) {
          return props.overrideSrc
        }
    
        return hasIcon() ? getAuthorIconURL(getUserID()) : fallback
      }

    return (
        <img
            onClick={props.onClick}
            style={{borderRadius: "50%", ...props.style}}
            src={getFileURL()}
            alt=""
            width={props.size}
            height={props.size}
            {...fallbackImageProps}
        />
    );
}
