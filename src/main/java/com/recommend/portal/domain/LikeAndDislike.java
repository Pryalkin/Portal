package com.recommend.portal.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class LikeAndDislike implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private Boolean l1ke;
    private Boolean dislike;
    @OneToOne
    private User user;

    public LikeAndDislike(Boolean l1ke, Boolean dislike, User user) {
        this.l1ke = l1ke;
        this.dislike = dislike;
        this.user = user;
    }
}
