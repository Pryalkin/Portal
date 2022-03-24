package com.recommend.portal.repository;

import com.recommend.portal.domain.Tags;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TagsRepository extends JpaRepository<Tags, Long> {

    Optional<Tags> findByTag(String tag);
}
