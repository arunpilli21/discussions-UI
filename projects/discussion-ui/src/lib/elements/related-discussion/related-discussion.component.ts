import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import _ from 'lodash-es';
import { DiscussionService } from '../../services/discussion.service';
import { ConfigService } from '../../services/config.service';
import * as CONSTANTS from './../../common/constants.json';
import { NSDiscussData } from './../../models/discuss.model';
@Component({
  selector: 'lib-related-discussion',
  templateUrl: './related-discussion.component.html',
  styleUrls: ['./related-discussion.component.scss'],
  // host: { class: 'margin-left-l' },
})
export class RelatedDiscussionComponent implements OnInit, OnChanges {
  @Input() catId: any
  @Input() topicId: any

  relatedDiscussions: any[]
  fetchSingleCategoryLoader = false;
  similarPosts: any;

  constructor(private router: Router,
    private configService: ConfigService,
    private discussionService: DiscussionService,
  ) { }

  ngOnInit() {

  }

  ngOnChanges() {
    if (this.catId) {
      this.fetchRelatedDiscussionData(this.catId)
    }
  }

  fetchRelatedDiscussionData(cid: number) {
    this.fetchSingleCategoryLoader = true
    this.discussionService.fetchSingleCategoryDetails(cid).subscribe(
      (data: NSDiscussData.ICategoryData) => {
        this.relatedDiscussions = [];
        _.filter(data.topics, (topic) => {
          if (this.topicId != topic.tid) {
            this.relatedDiscussions.push(topic)
          }
        })
        this.fetchSingleCategoryLoader = false
      },
      (err: any) => {
        console.log('Error in fetching category details')
        // this.openSnackbar(err.error.message.split('|')[1] || this.defaultError)
        this.fetchSingleCategoryLoader = false
      })
  }

  getDiscussion(discuss) {
    this.router.navigate([`${this.configService.getRouterSlug()}${CONSTANTS.ROUTES.DISCUSSION}topic/${discuss.slug}`]);
  }


}
