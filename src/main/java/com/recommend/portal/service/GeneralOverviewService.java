package com.recommend.portal.service;

import com.recommend.portal.domain.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface GeneralOverviewService {
    GeneralOverview saveReview(String group, String topic, Long grade, String advantages, String disadvantages, String tags1, String tags2, String tags3, MultipartFile image1, MultipartFile image2, MultipartFile image3, String username) throws IOException;
    List<GeneralOverview> getAllGroupTopics(String group, Long i);
    List<GeneralOverview> getAllUseReview(String username, Long i);
    List<GeneralOverview> getAllGroupTopicsForHome(Long i);
    GeneralOverview getTopicGroup(Long id);
    GeneralOverview addUserRatingOrLikeAndDislike(Long rating, String username, Long id);
    GeneralOverview getGeneralOverview(Long id);
    List<Comments> addComment(Comments comments, Long idGeneralOverview);
    List<Tags> getAllTags();
    void deleteReview(List<Long> id);
}
