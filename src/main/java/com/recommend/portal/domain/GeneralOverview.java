package com.recommend.portal.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class GeneralOverview implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    @OneToOne
    private Overview overview;
    @ManyToMany
    private List<Tags> tags;
    @OneToMany
    private List<Images> images;
    @OneToOne
    private User user;
    @OneToMany
    private List<Rating> rating;
    @OneToMany
    private List<LikeAndDislike> likeAndDislike;
    @OneToMany
    private List<Comments> comments;

}
