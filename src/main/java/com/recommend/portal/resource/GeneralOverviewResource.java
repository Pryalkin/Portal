package com.recommend.portal.resource;

import com.fasterxml.jackson.databind.util.JSONPObject;
import com.recommend.portal.domain.*;
import com.recommend.portal.exception.ExceptionHandling;
import com.recommend.portal.service.impl.GeneralGeneralOverviewServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import static org.springframework.http.HttpStatus.NO_CONTENT;
import static org.springframework.http.HttpStatus.OK;

@RestController
@RequestMapping(path = {"/overview"})
@CrossOrigin(origins = "*")
public class GeneralOverviewResource extends ExceptionHandling {

    private final GeneralGeneralOverviewServiceImpl generalOverviewService;
    public static final String SUCCESS_RATING = "Your score has been taken into account.";

    @Autowired
    public GeneralOverviewResource(GeneralGeneralOverviewServiceImpl generalOverviewService) {
        this.generalOverviewService = generalOverviewService;
    }


    @PostMapping("/save")
    public ResponseEntity<GeneralOverview> saveGeneralOverview(@RequestParam("group") String group,
                                                               @RequestParam("topic") String topic,
                                                               @RequestParam("grade") String grade,
                                                               @RequestParam("advantages") String advantages,
                                                               @RequestParam("disadvantages") String disadvantages,
                                                               @RequestParam("tags1") String tags1,
                                                               @RequestParam("tags2") String tags2,
                                                               @RequestParam("tags3") String tags3,
                                                               @RequestParam(value = "image1", required = false) MultipartFile image1,
                                                               @RequestParam(value = "image2", required = false) MultipartFile image2,
                                                               @RequestParam(value = "image3", required = false) MultipartFile image3,
                                                               @RequestParam("username") String username) throws IOException {
        GeneralOverview generalOverview = generalOverviewService.saveReview(group, topic, Long.parseLong(grade), advantages, disadvantages, tags1, tags2, tags3, image1, image2, image3, username);
        return new ResponseEntity<>(new GeneralOverview(), OK);
    }

    @PostMapping("/delete")
    public ResponseEntity<HttpResponse> deleteGeneralOverview(@RequestParam("ids") String ids) throws IOException, ParseException {
        List<Long> list = (List<Long>) new JSONParser().parse(ids);
        generalOverviewService.deleteReview(list);
        return response(NO_CONTENT, "Reviews successfully removed");
    }

    @GetMapping("/tags")
    public ResponseEntity<List<Tags>> getAllTags() {
        return new ResponseEntity<>(generalOverviewService.getAllTags(), OK);
    }

    @MessageMapping("/addRating")
    @SendTo("/topic/hi")
    public ResponseEntity<GeneralOverview> addRating(ConstantClass constantClass) {
        GeneralOverview generalOverview = new GeneralOverview();
        if (constantClass.getNumberRating() == 0){
            generalOverview = generalOverviewService.getGeneralOverview(constantClass.getId());
        } else {
            generalOverview = generalOverviewService.addUserRatingOrLikeAndDislike(constantClass.getNumberRating(), constantClass.getUsername(), constantClass.getId());
        }
        return new ResponseEntity<>(generalOverview, OK);
    }

    @MessageMapping("/addComment/{id}")
    @SendTo("/topic/comment")
    public ResponseEntity<List<Comments>> addComment(@DestinationVariable("id") String id,
                                                     Comments comments) {
        List<Comments> commentsList = generalOverviewService.addComment(comments, Long.parseLong(id));
        return new ResponseEntity<>(commentsList, OK);
    }

    private ResponseEntity<HttpResponse> response(HttpStatus httpStatus, String message) {
        HttpResponse body = new HttpResponse(httpStatus.value(), httpStatus, httpStatus.getReasonPhrase().toUpperCase(), message.toUpperCase());
        return new ResponseEntity<>(body, httpStatus);
    }


}
