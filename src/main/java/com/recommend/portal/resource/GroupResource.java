package com.recommend.portal.resource;

import com.recommend.portal.domain.GeneralOverview;
import com.recommend.portal.exception.ExceptionHandling;
import com.recommend.portal.service.GeneralOverviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
@Slf4j
public class GroupResource extends ExceptionHandling {

    private final GeneralOverviewService generalOverviewService;

    @GetMapping("/{group}/{i}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroup(@PathVariable("group") String group,
                                                                  @PathVariable("i") String i){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllGroupTopics(group, Long.parseLong(i));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }

    @GetMapping("/{i}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroupForHome(@PathVariable("i") String i){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllGroupTopicsForHome(Long.parseLong(i));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }

    @GetMapping("/topic/{id}")
    public ResponseEntity<GeneralOverview> getTopicGroup(@PathVariable("id") String id){
        GeneralOverview generalOverview = generalOverviewService.getTopicGroup(Long.parseLong(id));
        return new ResponseEntity<>(generalOverview, HttpStatus.OK);
    }

    @GetMapping("/user/{username}/{i}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroupForUser(@PathVariable("username") String username,
                                                                         @PathVariable("i") String i){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllUseReview(username, Long.parseLong(i));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }


}
