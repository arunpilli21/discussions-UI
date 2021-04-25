import { DiscussionService } from './../../services/discussion.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { DiscussionEventsService } from './../../discussion-events.service';
import { TelemetryUtilsService } from './../../telemetry-utils.service';
import { NSDiscussData } from './../../models/discuss.model';

/* tslint:disable */
import * as _ from 'lodash'
import { IdiscussionConfig } from '../../models/discussion-config.model';
import { ConfigService } from '../../services/config.service';
/* tslint:enable */
@Component({
  selector: 'lib-lib-entry',
  templateUrl: './lib-entry.component.html',
  styleUrls: ['./lib-entry.component.scss']
})
export class LibEntryComponent implements OnInit {

  data: IdiscussionConfig;
  headerOption = true;
  banner: any
  private bannerSubscription: any
  bannerOption: boolean;
  currentRoute = 'all-discussions'

  constructor(
    public activatedRoute: ActivatedRoute,
    private discussionService: DiscussionService,
    private configService: ConfigService,
    private location: Location,
    private discussionEventService: DiscussionEventsService,
    private telemetryUtils: TelemetryUtilsService

  ) {
    this.bannerSubscription = this.activatedRoute.data.subscribe(data => {
      if (data && data.pageData) {
        this.banner = data.pageData.data.banner || []
      }
    })
  }

  ngOnInit() {
    this.configService.setConfig(this.activatedRoute);
    // this.activatedRoute.data.subscribe((data) => {
    this.data = this.configService.getConfig();
    if (!this.data) {
      // fallback for query params
      this.configService.setConfigFromParams(this.activatedRoute);
      this.data = this.configService.getConfig();
    }
    this.discussionService.userName = _.get(this.data, 'userName');
    const rawCategories = _.get(this.data, 'categories');
    this.discussionService.forumIds = _.get(rawCategories, 'result');
    this.discussionService.initializeUserDetails(this.discussionService.userName);
    this.headerOption = this.configService.getHeaderOption()
    this.bannerOption = this.configService.getBannerOption()
  }

  goBack() {
    this.location.back();
  }

  close(event) {
    const eventAction = {
      action: 'DF_CLOSE'
    };
    this.discussionEventService.emitTelemetry(eventAction);
    this.telemetryUtils.logInteract(event, NSDiscussData.IPageName.LIB_ENTRY);
  }
}
