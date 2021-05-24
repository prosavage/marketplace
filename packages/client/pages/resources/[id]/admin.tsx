import React, { useEffect, useState } from "react";
import { Role, User } from "../../../types/User";
import { Version } from "../../../types/Version";
import getAxios from "../../../util/AxiosInstance";
import { Category } from "../../../types/Category";
import ResourceViewParent from "./../../../components/pages/resource/ResourceViewParent";
import { Resource } from "../../../types/Resource";
import ResourceEdit from "../../../components/pages/resource/ResourceEdit";
import Head from "next/head";
import { useRouter } from "next/router";
import { userState } from "../../../atoms/user";
import { useRecoilValue } from "recoil";
import { toast } from "react-toastify";
import ResourceAdmin from "../../../components/pages/resource/ResourceAdmin";

export default function ResourceId(props: { id: string }) {
  // For general resource info.
  const [resource, setResource] = useState<Resource>();
  // For versions page and browser.
  const [versions, setVersions] = useState<Version[]>([]);
  // Author info for sidebar, and ownership purposes.
  const [author, setAuthor] = useState<User>();
  // Category for pushing back button.
  const [category, setCategory] = useState<Category>();

  const user = useRecoilValue(userState)

  useEffect(() => {
    getAxios()
      .get(`/resources/${props.id}`)
      .then((res) => setResource(res.data.payload.resource));
    getAxios()
      .get(`/directory/versions/resource/${props.id}/1`)
      .then((res) => {
        setVersions(res.data.payload.versions);
      });
  }, []);

  const router = useRouter();

  useEffect(() => {
    if (!resource) return;

    router.push(
      "/resources/[id]/admin",
      `/resources/${resource._id}.${resource.slug}/admin`,
      {shallow: true}
    );

    getAxios()
      .get(`/directory/user/${resource.owner}`)
      .then((res) => setAuthor(res.data.payload.user));

    getAxios()
      .get(`/category/${resource.category}`)
      .then((res) => setCategory(res.data.payload.category))
      .catch((err) => console.log(err.response.data));
  }, [resource]);

  useEffect(() => {
    // redirects if not admin...
    // undefined means not logged in.
    if (!user || !resource) return;

    // gotta redirect.
    if (user.role !== Role.USER) return
    
    
    router.push("/resources/[id]/", `/resources/${resource._id}.${resource.slug}/`)
  }, [user, resource])

  return (
    <ResourceViewParent
      resource={resource}
      category={category}
      versions={versions}
      author={author}
    >
      <Head>
        <title>{resource?.name}: Admin UI</title>
      </Head>
      <ResourceAdmin resource={resource} />
    </ResourceViewParent>
  );
}

export async function getServerSideProps({ params }) {
  const id = params.id.split(".")[0] as string;

  return { props: { id } };
}
