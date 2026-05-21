package com.study.hz.util;

import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonToken;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class ImagesDeserializer extends JsonDeserializer<List<String>> {
    @Override
    public List<String> deserialize(JsonParser p, DeserializationContext ctxt)
            throws IOException {
        if (p.currentToken() == JsonToken.START_ARRAY) {
            return p.readValueAs(List.class);
        } else if (p.currentToken() == JsonToken.VALUE_STRING) {
            String value = p.getValueAsString();
            if (value == null || value.trim().isEmpty()) {
                return new ArrayList<>();
            }
            // 如果是 JSON 字符串，尝试解析
            try {
                return new ObjectMapper().readValue(value, List.class);
            } catch (Exception e) {
                return Arrays.asList(value);
            }
        }
        return new ArrayList<>();
    }
}