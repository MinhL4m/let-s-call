import { useState } from "react";
import useConstant from "use-constant"; // to store that debounced function into the component
import AwesomeDebouncePromise from "awesome-debounce-promise"; // to debounce the async function
import { useAsync } from "react-async-hook"; // to get the result into my component

// Debounce hook that can be reuse
export const useDebouncedSearch = (searchFunction) => {
  // Handle the input text state
  const [inputText, setInputText] = useState("");

  // Debounce the original search async function
  const debouncedSearchFunction = useConstant(() =>
    AwesomeDebouncePromise(searchFunction, 500)
  );

  // The async callback is run each time the text changes,
  // but as the search function is debounced, it does not
  // fire a new request on each keystroke
  const searchResults = useAsync(async () => {
    if (inputText.length === 0) {
      return [];
    } else {
      return debouncedSearchFunction(inputText);
    }
  }, [debouncedSearchFunction, inputText]);

  // Return everything needed for the hook consumer
  return {
    inputText,
    setInputText,
    searchResults,
  };
};
