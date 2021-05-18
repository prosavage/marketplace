import { Box } from "@chakra-ui/react";
import React from "react";
import { User } from "../../types/User";
import AuthorIcon from "./AuthorIcon";

interface UserPreviewProps {
  user: User;
}

export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  return (
    <Box mt={4}>
      <AuthorIcon user={user} size={"128px"} />
    </Box>
  );
};
