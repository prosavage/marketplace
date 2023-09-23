export const cdnBaseURL = "https://marketplace-demo.b-cdn.net";

export const getAuthorIconURL = (authorId: string) => {
  return `${cdnBaseURL}/users/${authorId}/icon.png`;
};

export const getTeamIconURL = (authorId: string) => {
  return `${cdnBaseURL}/team/${authorId}/icon.png`;
};

export const getResourceIconURL = (resourceId: string) => {
  return `${cdnBaseURL}/resources/${resourceId}/icon.png`;
};

export const getCategoryIconURL = (categoryId: string) => {
  return `${cdnBaseURL}/categories/${categoryId}/icon.svg`;
};
