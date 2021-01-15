export const validateEmail = (email: string) => {
    return email.match("^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$")
}

export const validatePassword = ()