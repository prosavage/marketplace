import { Button, Flex } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { InputField } from "../../components/app/InputField";
import { UserPreview } from "../../components/user/UserPreview";
import getAxios from "../../utils/AxiosInstance";
import { handleError } from "../../utils/ErrorHandler";

const UserIndex: React.FC = ({}) => {
  const [user, setUser] = useState();

  useEffect(() => {
    // getAxios().get(`/directory/user/${query}`).then(res => )
  });

  return (
    <Flex h={"100vh"} p={10} flexDir={"column"}>
      <Formik
        initialValues={{ query: "" }}
        onSubmit={async (values, { setErrors }) => {
          if (values.query.length === 0) {
            setErrors({ query: "Enter a id." });
            return;
          }
          try {
            const response = await getAxios().get(
              "/directory/user/" + values.query
            );
            setUser(response.data.payload.user);
          } catch (err) {
            console.log(err.response.data);
            if (err.response.data.errors) {
              setErrors(handleError(err.response.data, { id: "query" }));
            } else {
              setErrors({ query: err.response.data.error });
            }
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField
              label={"user search"}
              placeholder={"search by id"}
              name={"query"}
            />
            <Button colorScheme={"blue"} isLoading={isSubmitting} mt={4}>
              Search
            </Button>
          </Form>
        )}
      </Formik>
      <UserPreview user={user} />
    </Flex>
  );
};

export default UserIndex;
