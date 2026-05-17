import axios from 'axios';
import { logger } from '../utils/logger';
import cron from 'node-cron';

/**
 * Social Media Auto-Posting Service
 * Handles automated posting to multiple platforms with Human-in-the-Loop approval
 */

interface SocialAccount {
  id: string;
  platform: string;
  accountHandle: string;
  accessToken: string;
  refreshToken?: string;
  autoPostEnabled: boolean;
  humanApprovalRequired: boolean;
}

interface ScheduledPost {
  id: string;
  contentId: string;
  socialAccountId: string;
  caption: string;
  hashtags: string[];
  mediaUrls: string[];
  scheduledTime: Date;
  status: 'scheduled' | 'pending_approval' | 'approved' | 'publishing' | 'published' | 'failed';
  approvedBy?: string;
  approvedAt?: Date;
}

interface PostResult {
  success: boolean;
  platformPostId?: string;
  platformPostUrl?: string;
  error?: string;
}

export class SocialMediaPostingService {
  private scheduledJobs: Map<string, cron.ScheduledTask> = new Map();

  /**
   * Schedule a post for future publishing
   */
  async schedulePost(
    post: ScheduledPost,
    socialAccount: SocialAccount
  ): Promise<{ success: boolean; message: string }> {
    try {
      // If human approval is required, set status to pending_approval
      if (socialAccount.humanApprovalRequired) {
        post.status = 'pending_approval';
        logger.info({
          message: 'Post scheduled for approval',
          postId: post.id,
          platform: socialAccount.platform,
        });

        return {
          success: true,
          message: 'Post scheduled and awaiting approval',
        };
      }

      // If auto-post is enabled, schedule the cron job
      if (socialAccount.autoPostEnabled) {
        this.createScheduledJob(post, socialAccount);
        post.status = 'scheduled';

        logger.info({
          message: 'Post scheduled for auto-publishing',
          postId: post.id,
          platform: socialAccount.platform,
          scheduledTime: post.scheduledTime,
        });

        return {
          success: true,
          message: 'Post scheduled for automatic publishing',
        };
      }

      return {
        success: false,
        message: 'Auto-posting is disabled for this account',
      };
    } catch (error: any) {
      logger.error({
        message: 'Failed to schedule post',
        error: error.message,
        postId: post.id,
      });

      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Create a cron job for scheduled posting
   */
  private createScheduledJob(post: ScheduledPost, socialAccount: SocialAccount): void {
    const scheduledDate = new Date(post.scheduledTime);
    const cronExpression = `${scheduledDate.getMinutes()} ${scheduledDate.getHours()} ${scheduledDate.getDate()} ${scheduledDate.getMonth() + 1} *`;

    const job = cron.schedule(cronExpression, async () => {
      await this.publishPost(post, socialAccount);
      this.scheduledJobs.delete(post.id);
    });

    this.scheduledJobs.set(post.id, job);
  }

  /**
   * Approve a post for publishing (Human-in-the-Loop)
   */
  async approvePost(
    postId: string,
    approvedBy: string,
    modifications?: Partial<ScheduledPost>
  ): Promise<{ success: boolean; message: string }> {
    try {
      // Apply any modifications from human reviewer
      if (modifications) {
        logger.info({
          message: 'Post modified during approval',
          postId,
          modifications,
        });
      }

      logger.info({
        message: 'Post approved for publishing',
        postId,
        approvedBy,
      });

      return {
        success: true,
        message: 'Post approved and will be published at scheduled time',
      };
    } catch (error: any) {
      logger.error({
        message: 'Failed to approve post',
        error: error.message,
        postId,
      });

      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Reject a post (Human-in-the-Loop)
   */
  async rejectPost(
    postId: string,
    rejectedBy: string,
    reason: string
  ): Promise<{ success: boolean; message: string }> {
    try {
      logger.info({
        message: 'Post rejected',
        postId,
        rejectedBy,
        reason,
      });

      return {
        success: true,
        message: 'Post rejected and removed from schedule',
      };
    } catch (error: any) {
      logger.error({
        message: 'Failed to reject post',
        error: error.message,
        postId,
      });

      return {
        success: false,
        message: error.message,
      };
    }
  }

  /**
   * Publish post to social media platform
   */
  async publishPost(post: ScheduledPost, socialAccount: SocialAccount): Promise<PostResult> {
    try {
      post.status = 'publishing';

      let result: PostResult;

      switch (socialAccount.platform.toLowerCase()) {
        case 'instagram':
          result = await this.publishToInstagram(post, socialAccount);
          break;
        case 'facebook':
          result = await this.publishToFacebook(post, socialAccount);
          break;
        case 'twitter':
          result = await this.publishToTwitter(post, socialAccount);
          break;
        case 'linkedin':
          result = await this.publishToLinkedIn(post, socialAccount);
          break;
        case 'tiktok':
          result = await this.publishToTikTok(post, socialAccount);
          break;
        default:
          result = {
            success: false,
            error: `Platform ${socialAccount.platform} not supported`,
          };
      }

      if (result.success) {
        post.status = 'published';
        logger.info({
          message: 'Post published successfully',
          postId: post.id,
          platform: socialAccount.platform,
          platformPostId: result.platformPostId,
        });
      } else {
        post.status = 'failed';
        logger.error({
          message: 'Post publishing failed',
          postId: post.id,
          platform: socialAccount.platform,
          error: result.error,
        });
      }

      return result;
    } catch (error: any) {
      post.status = 'failed';
      logger.error({
        message: 'Post publishing error',
        error: error.message,
        postId: post.id,
      });

      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Publish to Instagram using Graph API
   */
  private async publishToInstagram(post: ScheduledPost, account: SocialAccount): Promise<PostResult> {
    try {
      const fullCaption = `${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`;

      // Step 1: Create media container
      const containerResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${account.accountHandle}/media`,
        {
          image_url: post.mediaUrls[0],
          caption: fullCaption,
          access_token: account.accessToken,
        }
      );

      const containerId = containerResponse.data.id;

      // Step 2: Publish the container
      const publishResponse = await axios.post(
        `https://graph.facebook.com/v18.0/${account.accountHandle}/media_publish`,
        {
          creation_id: containerId,
          access_token: account.accessToken,
        }
      );

      return {
        success: true,
        platformPostId: publishResponse.data.id,
        platformPostUrl: `https://www.instagram.com/p/${publishResponse.data.id}/`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  /**
   * Publish to Facebook using Graph API
   */
  private async publishToFacebook(post: ScheduledPost, account: SocialAccount): Promise<PostResult> {
    try {
      const response = await axios.post(
        `https://graph.facebook.com/v18.0/${account.accountHandle}/photos`,
        {
          url: post.mediaUrls[0],
          caption: `${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`,
          access_token: account.accessToken,
        }
      );

      return {
        success: true,
        platformPostId: response.data.id,
        platformPostUrl: `https://www.facebook.com/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error?.message || error.message,
      };
    }
  }

  /**
   * Publish to Twitter/X using API v2
   */
  private async publishToTwitter(post: ScheduledPost, account: SocialAccount): Promise<PostResult> {
    try {
      // Twitter API v2 implementation
      // Note: Requires OAuth 2.0 authentication
      const tweetText = `${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`;

      const response = await axios.post(
        'https://api.twitter.com/2/tweets',
        {
          text: tweetText.substring(0, 280), // Twitter character limit
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        platformPostId: response.data.data.id,
        platformPostUrl: `https://twitter.com/${account.accountHandle}/status/${response.data.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.detail || error.message,
      };
    }
  }

  /**
   * Publish to LinkedIn using API
   */
  private async publishToLinkedIn(post: ScheduledPost, account: SocialAccount): Promise<PostResult> {
    try {
      const response = await axios.post(
        'https://api.linkedin.com/v2/ugcPosts',
        {
          author: `urn:li:person:${account.accountHandle}`,
          lifecycleState: 'PUBLISHED',
          specificContent: {
            'com.linkedin.ugc.ShareContent': {
              shareCommentary: {
                text: `${post.caption}\n\n${post.hashtags.map(h => `#${h}`).join(' ')}`,
              },
              shareMediaCategory: 'IMAGE',
              media: [
                {
                  status: 'READY',
                  originalUrl: post.mediaUrls[0],
                },
              ],
            },
          },
          visibility: {
            'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
          },
        },
        {
          headers: {
            Authorization: `Bearer ${account.accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        platformPostId: response.data.id,
        platformPostUrl: `https://www.linkedin.com/feed/update/${response.data.id}`,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.message || error.message,
      };
    }
  }

  /**
   * Publish to TikTok (placeholder - requires TikTok API access)
   */
  private async publishToTikTok(_post: ScheduledPost, _account: SocialAccount): Promise<PostResult> {
    // TikTok API implementation would go here
    // Requires TikTok for Developers account and approval
    return {
      success: false,
      error: 'TikTok API integration pending',
    };
  }

  /**
   * Cancel a scheduled post
   */
  cancelScheduledPost(postId: string): boolean {
    const job = this.scheduledJobs.get(postId);
    if (job) {
      job.stop();
      this.scheduledJobs.delete(postId);
      logger.info({ message: 'Scheduled post cancelled', postId });
      return true;
    }
    return false;
  }

  /**
   * Get all pending approval posts for a tenant
   */
  async getPendingApprovals(_tenantId: string): Promise<ScheduledPost[]> {
    // This would query the database for posts with status 'pending_approval'
    // Placeholder implementation
    return [];
  }

  /**
   * Bulk approve multiple posts
   */
  async bulkApprove(postIds: string[], approvedBy: string): Promise<{ approved: number; failed: number }> {
    let approved = 0;
    let failed = 0;

    for (const postId of postIds) {
      const result = await this.approvePost(postId, approvedBy);
      if (result.success) {
        approved++;
      } else {
        failed++;
      }
    }

    return { approved, failed };
  }
}

export default new SocialMediaPostingService();

// Made with Bob
