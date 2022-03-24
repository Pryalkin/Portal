package com.recommend.portal.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Overview implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String groupOverview;
    private String topic;
    private Long grade;
    private String advantages;
    private String disadvantages;
    private Date date;

    public Overview(String group, String topic, Long grade, String advantages, String disadvantages) {
        this.groupOverview = group;
        this.topic = topic;
        this.grade = grade;
        this.advantages = advantages;
        this.disadvantages = disadvantages;
        this.date = new Date();
    }
}
