package com.study.hz.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsDto {
    private Long totalUsers;
    private Long totalHelps;
    private Long totalHelpOffers;
    private Long totalHoles;
    private Long totalLosts;
    private Long totalDynamics;
    private Long totalComments;
    private Long totalLikes;
    private Long totalCollections;
}
