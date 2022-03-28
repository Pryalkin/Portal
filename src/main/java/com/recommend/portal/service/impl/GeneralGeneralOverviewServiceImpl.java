package com.recommend.portal.service.impl;

import com.recommend.portal.domain.*;
import com.recommend.portal.repository.*;
import com.recommend.portal.service.GeneralOverviewService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import static com.recommend.portal.constant.FileConstant.*;
import static java.nio.file.StandardCopyOption.REPLACE_EXISTING;
import static org.apache.commons.lang3.StringUtils.EMPTY;

@Service
@AllArgsConstructor
@Slf4j
public class GeneralGeneralOverviewServiceImpl implements GeneralOverviewService {

    private final GeneralOverviewRepository generalOverviewRepository;
    private final OverviewRepository overviewRepository;
    private final TagsRepository tagsRepository;
    private final ImagesRepository imagesRepository;
    private final UserRepository userRepository;
    private final RatingRepository ratingRepository;
    private final LikeAndDislikeRepository likeAndDislikeRepository;
    private final CommentsRepository commentsRepository;

    @Override
    public GeneralOverview saveReview(String group, String topic, Long grade, String advantages, String disadvantages, String tags1, String tags2, String tags3, MultipartFile image1, MultipartFile image2, MultipartFile image3, String username) throws IOException {
        GeneralOverview generalOverview = new GeneralOverview();
        generalOverview.setOverview(overviewRepository.save(new Overview(group, topic, grade, advantages, disadvantages)));
        generalOverview.setTags(getTagsList(tags1, tags2, tags3));
        User user = userRepository.findUserByUsername(username);
        generalOverview.setUser(user);
        generalOverview.setImages(saveImagesFromOverview(user, getListImageOverview(image1, image2, image3)));
        List<Rating> ratingList = new ArrayList<>();
        ratingList.add(ratingRepository.save(new Rating(grade, user)));
        generalOverview.setRating(ratingList);
        generalOverviewRepository.save(generalOverview);
        return generalOverview;
    }

    @Override
    public List<GeneralOverview> getAllGroupTopics(String group, Long iSortingCode) {
        List<GeneralOverview> generalOverviewList = generalOverviewRepository.findByOverviewGroupOverview(group);
        return sortGeneralOverview(generalOverviewList, iSortingCode);
    }

    @Override
    public List<GeneralOverview> getAllGroupTopicsForHome(Long iSortingCode) {
        List<GeneralOverview> generalOverviewList = generalOverviewRepository.findAll();
        return sortGeneralOverview(generalOverviewList, iSortingCode);
    }

    @Override
    public List<GeneralOverview> getAllUseReview(String username, Long iSortingCode) {
        List<GeneralOverview> generalOverviewList = generalOverviewRepository.findByUserUsername(username);
        return sortGeneralOverview(generalOverviewList, iSortingCode);
    }

    @Override
    public GeneralOverview getTopicGroup(Long id) {
        return generalOverviewRepository.findById(id).get();
    }

    @Override
    public GeneralOverview addUserRatingOrLikeAndDislike(Long rating, String username, Long id) {
       GeneralOverview generalOverview = generalOverviewRepository.findById(id).get();
       if (rating < 6) {
           return setRating(generalOverview, username, rating);
       } else {
           return setLikeAndDislike(generalOverview, username, rating);
       }
    }

    @Override
    public GeneralOverview getGeneralOverview(Long id) {
        return generalOverviewRepository.findById(id).orElse(null);
    }

    @Override
    public List<Comments> addComment(Comments comments, Long idGeneralOverview) {
        GeneralOverview generalOverview = generalOverviewRepository.findById(idGeneralOverview).get();
        if (comments.getComment() == null){
            return generalOverview.getComments();
        }
        comments.setDate(new Date());
        if (generalOverview.getComments() == null){
            List<Comments> commentsList = new ArrayList<>();
            return commentRegistration(generalOverview, commentsList, comments);
        } else {
            List<Comments> commentsList = generalOverview.getComments();
            return commentRegistration(generalOverview, commentsList, comments);
        }
    }

    @Override
    public List<Tags> getAllTags() {
        return tagsRepository.findAll();
    }

    @Override
    public void deleteReview(List<Long> ids) {
        Rating rating = new Rating();
        Overview overview = new Overview();
        for (Long id: ids) {
            for (Rating rat: generalOverviewRepository.findById(id).get().getRating()){
                rating = rat;
            }
            overview = generalOverviewRepository.findById(id).get().getOverview();
            generalOverviewRepository.deleteById(id);
            overviewRepository.delete(overview);
            ratingRepository.delete(rating);
        }
    }

    private List<GeneralOverview> sortGeneralOverview(List<GeneralOverview> generalOverviewList, Long i) {
        if (i == 1){
            return getAllGroupTopicsByDate(generalOverviewList);
        } else if (i == 2){
            return getAllGroupTopicsByRating(generalOverviewList);
        } else if (i == 3){
            return getAllGroupTopicsByLike(generalOverviewList);
        }
        return generalOverviewList;
    }

    private List<GeneralOverview> getAllGroupTopicsByLike(List<GeneralOverview> generalOverviewList) {
        generalOverviewList.sort(new Comparator<GeneralOverview>() {
            @Override
            public int compare(GeneralOverview g1, GeneralOverview g2) {
                long sumLikeG1 = g1.getLikeAndDislike().stream().filter(i -> i.getL1ke() == true).count();
                long sumLikeG2 = g2.getLikeAndDislike().stream().filter(i -> i.getL1ke() == true).count();
                if (sumLikeG1 == sumLikeG2) return 0;
                else if (sumLikeG1 < sumLikeG2) return 1;
                else return -1;
            }
        });
        return generalOverviewList;
    }

    private List<GeneralOverview> getAllGroupTopicsByRating(List<GeneralOverview> generalOverviewList) {
        generalOverviewList.sort(new Comparator<GeneralOverview>() {
            @Override
            public int compare(GeneralOverview g1, GeneralOverview g2) {
                double ratingG1 = g1.getRating().stream().mapToLong(i -> i.getRating()).sum() / g1.getRating().size();
                double ratingG2 = g2.getRating().stream().mapToLong(i -> i.getRating()).sum() / g2.getRating().size();
                if (ratingG1 == ratingG2) return 0;
                else if (ratingG1 < ratingG2) return 1;
                else return -1;
            }
        });
        return generalOverviewList;
    }

    private List<GeneralOverview> getAllGroupTopicsByDate(List<GeneralOverview> generalOverviewList) {
        generalOverviewList.sort(new Comparator<GeneralOverview>() {
            @Override
            public int compare(GeneralOverview g1, GeneralOverview g2) {
                if (g1.getOverview().getDate().equals(g2.getOverview().getDate())) return 0;
                else if (g1.getOverview().getDate().before(g2.getOverview().getDate())) return 1;
                else return -1;
            }
        });
        return generalOverviewList;
    }

    private GeneralOverview setLikeAndDislike(GeneralOverview generalOverview, String username, Long rating){
        LikeAndDislike likeAndDislike = new LikeAndDislike();
        if (rating == 6) {
            likeAndDislike = new LikeAndDislike(true, null, userRepository.findUserByUsername(username));
        } else if (rating == 7){
            likeAndDislike = new LikeAndDislike(null, true, userRepository.findUserByUsername(username));
        }
        if (generalOverview.getLikeAndDislike() == null){
            List<LikeAndDislike> likeAndDislikeList = new ArrayList<>();
            likeAndDislikeList.add(likeAndDislikeRepository.save(likeAndDislike));
            generalOverview.setLikeAndDislike(likeAndDislikeList);
        } else {
            List<LikeAndDislike> likeAndDislikeList = generalOverview.getLikeAndDislike();
            likeAndDislikeList.add(likeAndDislikeRepository.save(likeAndDislike));
            generalOverview.setLikeAndDislike(likeAndDislikeList);
        }
        return generalOverviewRepository.save(generalOverview);
    }

    private GeneralOverview setRating(GeneralOverview generalOverview, String username, Long rating){
        Rating newRating = new Rating(rating, userRepository.findUserByUsername(username));
        List<Rating> ratingList = generalOverview.getRating();
        ratingList.add(ratingRepository.save(newRating));
        generalOverview.setRating(ratingList);
        return generalOverviewRepository.save(generalOverview);
    }


    private List<Comments> commentRegistration(GeneralOverview generalOverview, List<Comments> commentsList, Comments comments) {
        comments.setUser(userRepository.findUserByUsername(comments.getUser().getUsername()));
        comments.setDate(new Date());
        commentsList.add(commentsRepository.save(comments));
        generalOverview.setComments(commentsList);
        generalOverview = generalOverviewRepository.save(generalOverview);
        return generalOverview.getComments();
    }


    private List<MultipartFile> getListImageOverview(MultipartFile image1, MultipartFile image2, MultipartFile image3) {
        List<MultipartFile> overviewImages = new ArrayList<>();
        if (image1 != null) overviewImages.add(image1);
        if (image2 != null) overviewImages.add(image2);
        if (image3 != null) overviewImages.add(image3);
        return overviewImages;
    }

    private List<Tags> getTagsList(String tags1, String tags2, String tags3) {
        List<Tags> tagsList = new ArrayList<>();
        Tags tag = new Tags();
        tag = (checkIfTagExistsInDB(tags1)) ? tagsRepository.findByTag(tags1).get() : tagsRepository.save(new Tags(tags1));
        tagsList.add(tag);
        if (!tags2.equals(EMPTY)) {
            tag = (checkIfTagExistsInDB(tags2)) ? tagsRepository.findByTag(tags1).get() : tagsRepository.save(new Tags(tags2));
            tagsList.add(tag);
        }
        if (!tags3.equals(EMPTY)) {
            tag = (checkIfTagExistsInDB(tags3)) ? tagsRepository.findByTag(tags3).get() : tagsRepository.save(new Tags(tags3));
            tagsList.add(tag);
        }
        return tagsList;
    }

    private boolean checkIfTagExistsInDB(String tag) {
        return tagsRepository.findByTag(tag).isPresent();
    }


    private List<Images> saveImagesFromOverview(User user, List<MultipartFile> overviewImages) throws IOException {
        List<Images> images = new ArrayList<>();
        for (MultipartFile imageOverview : overviewImages) {
            if (imageOverview != null) {
                Path userFolder = Paths.get(USER_FOLDER + user.getUsername()).toAbsolutePath().normalize();
                if (!Files.exists(userFolder)) {
                    Files.createDirectories(userFolder);
                    log.info(DIRECTORY_CREATED + userFolder);
                }
                Files.deleteIfExists(Paths.get(userFolder + user.getUsername() + DOT + JPG_EXTENSION));
                String filename = generateName();
                Files.copy(imageOverview.getInputStream(), userFolder.resolve(filename + DOT + JPG_EXTENSION), REPLACE_EXISTING);
                images.add(imagesRepository.save(new Images( setOverviewImageUrl(user.getUsername(), filename))));
            }
        }
        return images;
    }

    private String setOverviewImageUrl(String username,String filename) {
        return ServletUriComponentsBuilder.fromCurrentContextPath().
                path(USER_IMAGE_PATH + username + FORWARD_SLASH + filename + DOT + JPG_EXTENSION).toUriString();
    }

    private String generateName() {
        return RandomStringUtils.randomAlphanumeric(10);
    }

}
