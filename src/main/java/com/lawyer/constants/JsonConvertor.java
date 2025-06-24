package com.lawyer.constants;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

import com.lawyer.model.ConvoDetails;

import jakarta.persistence.AttributeConverter;




public class JsonConvertor implements AttributeConverter<ConvoDetails, String> {

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Override
    public String convertToDatabaseColumn(ConvoDetails convoDetails) {
        try {
            return objectMapper.writeValueAsString(convoDetails);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert convoDetails to JSON", e);
        }
    }

    @Override
    public ConvoDetails convertToEntityAttribute(String dbData) {
        try {
            return objectMapper.readValue(dbData, ConvoDetails.class);
        } catch (IOException e) {
            throw new RuntimeException("Failed to convert JSON to convoDetails", e);
        }
    }
}

