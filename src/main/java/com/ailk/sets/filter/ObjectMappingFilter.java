package com.ailk.sets.filter;

import java.io.IOException;

import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;

public class ObjectMappingFilter extends ObjectMapper {
	
	private static final long serialVersionUID = 5747508129158905930L;

	public ObjectMappingFilter() {
		super();
		this.setSerializationInclusion(Include.NON_NULL);
		// 空值处理为空串
		this.getSerializerProvider().setNullValueSerializer(new JsonSerializer<Object>() {

			@Override
			public void serialize(Object value, JsonGenerator jg, SerializerProvider sp) throws IOException, JsonProcessingException {
				jg.writeString("");
			}
		});

	}

}
