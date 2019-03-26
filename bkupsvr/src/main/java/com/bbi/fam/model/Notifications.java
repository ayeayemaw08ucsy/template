package com.bbi.fam.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class Notifications {

    private String message;

    public Notifications(String message) {
        this.message = message;
    }

}
