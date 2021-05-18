export const handleError = (errorData: any, inputNameToParams: Object) => {
  const errorMap = {};
  if (errorData.errors) {
    for (const error of errorData.errors) {
      console.log(error.param);
      errorMap[inputNameToParams[error.param]] = error.msg;
    }
  }
  return errorMap;
};
