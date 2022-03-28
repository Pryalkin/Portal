package com.recommend.portal.resource;

import com.recommend.portal.domain.GeneralOverview;
import com.recommend.portal.exception.ExceptionHandling;
import com.recommend.portal.service.GeneralOverviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/group")
@RequiredArgsConstructor
//@CrossOrigin(origins = "*")
public class GroupResource extends ExceptionHandling {

    private final GeneralOverviewService generalOverviewService;

    @GetMapping("/{group}/{iSortingCode}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroup(@PathVariable("group") String group,
                                                                  @PathVariable("iSortingCode") String iSortingCode){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllGroupTopics(group, Long.parseLong(iSortingCode));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }

    @GetMapping("/{iSortingCode}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroupForHome(@PathVariable("iSortingCode") String iSortingCode){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllGroupTopicsForHome(Long.parseLong(iSortingCode));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }

    @GetMapping("/topic/{id}")
    public ResponseEntity<GeneralOverview> getTopicGroup(@PathVariable("id") String id){
        GeneralOverview generalOverview = generalOverviewService.getTopicGroup(Long.parseLong(id));
        return new ResponseEntity<>(generalOverview, HttpStatus.OK);
    }

    @GetMapping("/user/{username}/{iSortingCode}")
    public ResponseEntity<List<GeneralOverview>> getAllTopicGroupForUser(@PathVariable("username") String username,
                                                                         @PathVariable("iSortingCode") String iSortingCode){
        List<GeneralOverview> generalOverviewList = generalOverviewService.getAllUseReview(username, Long.parseLong(iSortingCode));
        return new ResponseEntity<>(generalOverviewList, HttpStatus.OK);
    }

}
