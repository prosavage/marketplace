import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ResourceType } from "@savagelabs/types";
import getAxios from "../../../util/AxiosInstance";
import { validateResourceVersion } from "../../../util/Validation";
import CategorySelect, { Option } from "../../ui/CategorySelect";
import Input from "../../ui/Input";

export default function ResourceExtraMetadata(props: {
  version: string;
  category: Option;
  onVerChange: (change: string) => void;
  onCatChange: (category: Option) => void;
}) {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = () => {
    const newOptions = [];
    [ResourceType.MOD, ResourceType.SOFTWARE, ResourceType.PLUGIN].forEach(
      (category) => {
        getAxios()
          .get(`/directory/categories/${category}`)
          .then((res) => {
            const categories = res.data.payload.categories;
            newOptions.push({
              value: category,
              label: category,
              options: categories.map((entry) => {
                return {
                  value: entry._id,
                  label: entry.name,
                };
              }),
            });
          });
      }
    );
    setOptions(newOptions);
  };

  return (
    <ExtraMetadataWrapper>
      <InputContainer>
        <label>VERSION</label>
        <Input
          value={props.version}
          onChange={(e) => {
            props.onVerChange(e.target.value);
          }}
          type={"text"}
          placeholder={"1.0-STABLE"}
          invalid={!validateResourceVersion(props.version)}
        />
      </InputContainer>
      <InputContainer>
        <label>CATEGORY</label>
        <CategorySelect
          options={options}
          selected={props.category}
          handleChange={(opt) => {
            props.onCatChange(opt);
          }}
        />
      </InputContainer>
    </ExtraMetadataWrapper>
  );
}

const ExtraMetadataWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 350px;
  margin: 0 1em;

  @media (max-width: 700px) {
    margin: 0 0.5em;
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  width: 100%;
  margin: 0.5em 0;
`;
