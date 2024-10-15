package com.example.train.dto.response;

import java.io.Serializable;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class StationDetailResponse implements Serializable {
    private int id;
    private String name;
    @JsonProperty("is_delete")
    private boolean isDelete;

}
