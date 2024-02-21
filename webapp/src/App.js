import React, { useEffect, useState } from "react";
import { AutosuggestInput } from "./components/Autosuggest/AutosuggestInput";
import HorizontalFlow from "./components/FlowChart/FlowChart";
import axios from "axios";
import { useQuery } from "react-query";

function App() {
  const [selectedId, setSelectedId] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [allSuggestions, setAllSuggestions] = useState([]);

  useEffect(() => {
    if (allSuggestions.length > 0) {
      const service = allSuggestions.find(
        (service) => service.label === selectedLabel
      );
      service && setSelectedId(service.id);
    }
  }, [selectedLabel, allSuggestions]);

  const { data: suggestions } = useQuery(
    ["suggestions", selectedLabel],
    async () => {
      try {
        return axios
          .get(`http://localhost:8080/services`, {
            params: { searchValue: selectedLabel },
          })
          .then((res) => {
            if (allSuggestions.length === 0) {
              setAllSuggestions(res.data);
            }
            return res.data;
          });
      } catch (error) {
        throw new Error("Failed to fetch suggestions");
      }
    }
  );

  const { data: leftElements } = useQuery(
    ["leftElements", selectedId],
    async () => {
      try {
        return axios
          .get(`http://localhost:8080/dataFlows/left`, {
            params: { serviceId: selectedId },
          })
          .then((res) => res.data);
      } catch (error) {
        throw new Error("Failed to fetch left elements");
      }
    }
  );

  const { data: rightElements } = useQuery(
    ["rightElements", selectedId],
    async () => {
      try {
        return axios
          .get(`http://localhost:8080/dataFlows/right`, {
            params: { serviceId: selectedId },
          })
          .then((res) => res.data);
      } catch (error) {
        throw new Error("Failed to fetch right elements");
      }
    }
  );

  const { data: centerElement } = useQuery(
    ["centerElement", selectedId],
    async () => {
      try {
        return axios
          .get(`http://localhost:8080/serviceById`, {
            params: { serviceId: selectedId },
          })
          .then((res) => res.data);
      } catch (error) {
        throw new Error("Failed to fetch service");
      }
    }
  );

  return (
    <>
      <AutosuggestInput
        selectedLabel={selectedLabel}
        setSelectedLabel={setSelectedLabel}
        placeholder="Choose service"
        suggestions={suggestions}
      />
      <HorizontalFlow
        leftElements={leftElements || []}
        centerElement={centerElement || {}}
        rightElements={rightElements || []}
        setSelectedLabel={setSelectedLabel}
      />
    </>
  );
}

export default App;
