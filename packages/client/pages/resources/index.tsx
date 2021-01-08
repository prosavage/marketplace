import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Resources() {
    const router = useRouter();
  
    useEffect(() => {
      router.push("/directory/resources/plugin");
    }, []);
  
    return <div>Redirecting</div>;
  }
  