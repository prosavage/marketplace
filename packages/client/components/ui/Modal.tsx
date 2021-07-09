import React, {ReactChildren} from "react"
import { useEffect } from "react";
import { ReactFragment } from "react";
import { useState } from "react";
import ReactDom from "react-dom";
import styled from "styled-components";
import PropsTheme from "../../styles/theme/PropsTheme";
import Button from "./Button";

interface ModalProps {
    show: boolean,
    onClose: () => void;
    children: any;
    title?: string;
}

export const Modal: React.FC<ModalProps> = ({show, onClose, children, title}) => {

        const [isBrowser, setIsBrowser] = useState(false);

        const modalWrapperRef = React.useRef(null);

        // check if the user has clickedinside or outside the modal
        const backDropHandler = (e) => {
        if (!modalWrapperRef?.current?.contains(e.target)) {
            onClose();
            }
        }

        const handleCloseClick = (e) => {
            e.preventDefault();
            onClose();
          };
        

        // You have to wait for SSR to finish,
        // useEffect will only run when it's finished and on the client.
        useEffect(() => {
            setIsBrowser(true);

            // attach event listener to the whole windor with our handler
            window.addEventListener('click', backDropHandler);

            // remove the event listener when the modal is closed
            return () => window.removeEventListener('click', backDropHandler);
        }, [])

        const modalContent = show ? (
            <StyledModalOverlay>
              <StyledModalWrapper ref={modalWrapperRef}>
                <StyledModal>
                    <StyledModalHeader>
                    <Button onClick={handleCloseClick}>
                        Close
                    </Button>
                    </StyledModalHeader>
                    {title && <h1>{title}</h1>}
                    <StyledModalBody>{children}</StyledModalBody>
                </StyledModal>
              </StyledModalWrapper>
            </StyledModalOverlay>
          ) : null;
        
          if (isBrowser) {
            return ReactDom.createPortal(
              modalContent,
              document.getElementById("modal-root")
            );
          } else {
            return null;
          }
}

const StyledModalBody = styled.div`
  padding-top: 10px;
`;

const StyledModalHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  font-size: 25px;
`;

const StyledModalOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
`;

const StyledModalWrapper = styled.div`
 width: 500px;
height: 600px; 
`;

const StyledModal = styled.div`
background: ${(props: PropsTheme) => props.theme.backgroundSecondary};

height:100%;
width:100%;
border-radius: 5px;
padding: 1em;
`;
