export const validateEmail = (email: string): boolean => {
  return /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(email);
};

export const validatePassword = (password: string) => {
  return (
    hasPasswordLength(password) &&
    containsSpecialCharacters(password) &&
    containsNumbers(password) &&
    containsUppercaseChar(password)
  );
};

export const hasPasswordLength = (str: string) => {
  return str.length > 8;
};

export const containsSpecialCharacters = (str: string) => {
  return /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g.test(str);
};

export const containsNumbers = (str: string) => {
  return /\d/.test(str);
};

export const containsUppercaseChar = (str: string) => {
  let hasUppercase = false;
  for (const char of str) {
    if (containsSpecialCharacters(char)) continue;
    if (char === char.toUpperCase()) hasUppercase = true;
  }
  return hasUppercase;
};

export function parseISOString(s) {
  const split = s.split("/");
  // normalize months since they start from fucking 0-11 instead of 1-12 in javascript
  // this is because Java 1.0 had 0-11, - and they were told to copy.
  const date = new Date(
    Number.parseInt(split[2]),
    Number.parseInt(split[0]) - 1,
    Number.parseInt(split[1])
  );
  return date;
}

export const validateISODate = (dateStr: string) => {
  try {
    const date = parseISOString(dateStr);

    return !isNaN(date.getTime()) && date.getTime() > 0;
  } catch (e) {
    console.log("invalid");
    return false;
  }
};

export const validateUsername = (username: string) => {
  return username.length >= 3 && username.length <= 20;
};

export const validateResourceTitle = (title: string) => {
  return moreThanFourAndLessThenThirtyFive(title);
};

export const validateResourceDescription = (desc: string | null) => {
  if (desc === null) return false;
  return desc.length >= 4 && desc.length <= 50;
};

const moreThanFourAndLessThenThirtyFive = (str: string) => {
  return str.length >= 4 && str.length <= 35;
};

export const validateResourceVersion = (version: string) => {
  return version.length > 0;
};

export const validateResourceThread = (thread: string) => {
  return thread.length > 0;
};

export const validateVersionDescription = (desc: string) => {
  return desc.length > 4;
};

export const validateVersionTitle = (title: string) => {
  return title.length >= 2 && title.length <= 30;
};

export const validateVersionVersionString = (ver: string) => {
  return ver.length >= 2 && ver.length <= 30;
};
