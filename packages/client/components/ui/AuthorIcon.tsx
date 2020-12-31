import styled from "styled-components"
import { User } from "../../types/User"

export default function AuthorIcon(props: {author: User, size: string}) {
  return <Image src={"getAuthorIconURL(props.author._id)"} alt="" height={props.size}
}

const Image = styled.img`
  border-radius: 50%;
`