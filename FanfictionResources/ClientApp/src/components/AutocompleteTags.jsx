import React from 'react'
import Autosuggest from 'react-autosuggest'
import { FormControl } from 'react-bootstrap';

export function AutocompleteTags({ addTag, ...props }) {
  const { className, onBlur, onChange, onFocus, onKeyDown, onPaste, placeholder, ref, value, __proto__, ...other } = props;
  const handleOnChange = (e, { newValue, method }) => {
    if (method === 'enter') {
      e.preventDefault()
    } else {
      props.onChange(e)
    }
  }

  const inputValue = (props.value && props.value.trim().toLowerCase()) || ''
  const inputLength = inputValue.length
  const tags = [];
  Object.entries(other).forEach(([key, value]) => tags.push(value));
  let suggestions = tags.filter((tags) => {
    return tags.name.toLowerCase().slice(0, inputLength) === inputValue
  })

  const renderInputComponent = inputProps => (
    <div>
      <FormControl type="text" {...inputProps} />
    </div>
  );

  return (
    <Autosuggest renderInputComponent={renderInputComponent}
      ref={props.ref}
      suggestions={suggestions}
      shouldRenderSuggestions={(value) => value && value.trim().length > 0}
      getSuggestionValue={(suggestion) => suggestion.name}
      renderSuggestion={(suggestion) => <span>{suggestion.name}</span>}
      inputProps={{ ...props, onChange: handleOnChange }}
      onSuggestionSelected={(e, { suggestion }) => {
        addTag(suggestion.name)
      }}
      onSuggestionsClearRequested={() => { }}
      onSuggestionsFetchRequested={() => { }}
    />
  )
}