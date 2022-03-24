package com.recommend.portal.repository;

import com.recommend.portal.domain.GeneralOverview;
import com.recommend.portal.domain.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GeneralOverviewRepository extends JpaRepository<GeneralOverview, Long> {

    List<GeneralOverview> findByOverviewGroupOverview(String group);
    List<GeneralOverview> findByUserUsername(String username);

}
