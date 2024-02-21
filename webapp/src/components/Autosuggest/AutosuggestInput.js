import React from "react";
import Autosuggest from "react-autosuggest";
import "./autosuggest.css";

const renderSuggestion = (suggestion) => <div>{suggestion.label}</div>;

const getSuggestionValue = (suggestion) => suggestion.label;

export const AutosuggestInput = ({
  selectedLabel,
  setSelectedLabel,
  suggestions,
  placeholder,
}) => {
  const onChange = (_, { newValue }) => {
    setSelectedLabel(newValue);
  };

  const onSuggestionsClearRequested = () => {};

  const onSuggestionsFetchRequested = () => {};

  const inputProps = {
    placeholder,
    value: selectedLabel,
    onChange,
  };

  return (
    <Autosuggest
      suggestions={suggestions || []}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      getSuggestionValue={getSuggestionValue}
      renderSuggestion={renderSuggestion}
      inputProps={inputProps}
      focusInputOnSuggestionClick={false}
    />
  );
};
