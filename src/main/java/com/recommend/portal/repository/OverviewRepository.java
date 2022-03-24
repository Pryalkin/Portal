package com.recommend.portal.repository;

import com.recommend.portal.domain.Overview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OverviewRepository extends JpaRepository<Overview, Long> {

    List<Overview> findByGroupOverview(String group);

}
