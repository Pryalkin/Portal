package com.recommend.portal.domain;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
public class Rating implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Long rating;
    @OneToOne
    private User user;

    public Rating(Long rating, User user) {
        this.rating = rating;
        this.user = user;
    }
}
