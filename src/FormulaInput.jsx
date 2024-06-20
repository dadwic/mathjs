// FormulaInput.js
import React, { useState, useEffect, useRef } from "react";
import useStore from "./store";
import { useTags } from "./api";
import { Autocomplete, TextField, Chip, Box, Typography } from "@mui/material";
import { evaluate } from "mathjs";

const FormulaInput = () => {
  const autocompleteRef = useRef(null);
  const { tags, addTag, removeTag, updateTag } = useStore();
  const { data: suggestions } = useTags();
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calculateFormula = () => {
      try {
        const formula = tags.map((tag) => tag.value).join(" ");
        const res = evaluate(formula);
        setResult(res);
        setError(null);
      } catch (err) {
        setResult(null);
        setError("Error in formula (use operators between tags)");
      }
    };

    calculateFormula();
  }, [tags]);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleAddTag = (event, newValue) => {
    if (newValue) {
      addTag(newValue);
      setInputValue("");
      autocompleteRef.current.clear();
    }
  };

  const handleDeleteTag = (index) => {
    removeTag(index);
  };

  return (
    <Box>
      <Box mb={2} display="flex" flexWrap="wrap" gap={1}>
        {tags.map((tag, index) => (
          <Chip
            key={tag.id}
            label={
              <TextField
                value={tag.value}
                onChange={(e) =>
                  updateTag(index, { ...tag, value: e.target.value })
                }
                variant="standard"
                size="small"
              />
            }
            onDelete={() => handleDeleteTag(index)}
          />
        ))}
      </Box>
      <Autocomplete
        freeSolo
        ref={autocompleteRef}
        options={suggestions || []}
        getOptionLabel={(option) => option.name}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleAddTag}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Add Tag"
            variant="filled"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddTag(null, {
                  name: inputValue,
                  value: inputValue,
                  id: `${Date.now()}`,
                  category: "",
                });
              }
            }}
          />
        )}
      />
      {result !== null && (
        <Typography variant="h6" mt={2}>
          Result: {result}
        </Typography>
      )}
      {error && (
        <Typography variant="h6" color="error" mt={2}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default FormulaInput;
