import styled from "styled-components"

export default function AuthorIcon(props: {author: AuthenticatorAssertionResponse, size: string}) {
  return <Image src={getAuthorIconURL(props.author._id)} alt="" height={props.size}
}

const Image = styled.img`
  border-radius: 50%;
`