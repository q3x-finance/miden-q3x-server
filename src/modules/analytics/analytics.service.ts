import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AnalyticsRepository } from './analytics.repository';
import {
  TrackEventDto,
  TrackPageViewDto,
  StartSessionDto,
  EndSessionDto,
  TrackTransactionDto,
  GenerateReportDto,
  AnalyticsQueryDto,
  AnalyticsReport,
} from './analytics.dto';
import { AnalyticsEventType } from './analytics.entity';
import { Parser } from 'json2csv';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly analyticsRepository: AnalyticsRepository) {}

  // Event tracking methods
  async trackEvent(
    eventData: TrackEventDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      await this.analyticsRepository.createEvent({
        ...eventData,
        ipAddress,
        userAgent,
      });
    } catch (error) {
      this.logger.error('Failed to track event:', error);
    }
  }

  async trackPageView(
    pageViewData: TrackPageViewDto,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<void> {
    try {
      // Track page view event
      await this.analyticsRepository.createEvent({
        eventType: AnalyticsEventType.PAGE_VIEW,
        userAddress: pageViewData.userAddress,
        sessionId: pageViewData.sessionId,
        metadata: {
          page: pageViewData.page,
          timeSpent: pageViewData.timeSpent,
        },
        ipAddress,
        userAgent,
      });

      // Update session page views
      if (pageViewData.sessionId) {
        const session = await this.analyticsRepository.getSession(
          pageViewData.sessionId,
        );
        if (session) {
          await this.analyticsRepository.updateSession(pageViewData.sessionId, {
            pageViews: session.pageViews + 1,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to track page view:', error);
    }
  }

  async trackEndpointCall(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    userAddress?: string,
    sessionId?: string,
    ipAddress?: string,
    errorDetails?: any,
  ): Promise<void> {
    try {
      await this.analyticsRepository.createEndpointStat({
        endpoint,
        method,
        responseTime,
        statusCode,
        userAddress,
        sessionId,
        ipAddress,
        errorDetails: errorDetails ? errorDetails : null,
      });

      // Update session API calls
      if (sessionId) {
        const session = await this.analyticsRepository.getSession(sessionId);
        if (session) {
          await this.analyticsRepository.updateSession(sessionId, {
            apiCalls: session.apiCalls + 1,
          });
        }
      }
    } catch (error) {
      this.logger.error('Failed to track endpoint call:', error);
    }
  }

  async trackTransaction(transactionData: TrackTransactionDto): Promise<void> {
    try {
      await this.analyticsRepository.createTransactionStat(transactionData);
    } catch (error) {
      this.logger.error('Failed to track transaction:', error);
    }
  }

  // Session management methods
  async startSession(
    sessionData: StartSessionDto,
    ipAddress?: string,
  ): Promise<string> {
    try {
      const { nanoid } = await import('nanoid');
      const sessionId = nanoid(32);

      await this.analyticsRepository.createSession({
        sessionId,
        userAddress: sessionData.userAddress,
        startTime: new Date(),
        ipAddress,
        userAgent: sessionData.userAgent,
        isActive: true,
      });

      return sessionId;
    } catch (error) {
      this.logger.error('Failed to start session:', error);
      throw error;
    }
  }

  async endSession(sessionData: EndSessionDto): Promise<void> {
    try {
      const session = await this.analyticsRepository.getSession(
        sessionData.sessionId,
      );
      if (session) {
        const endTime = new Date();
        const duration = Math.floor(
          (endTime.getTime() - session.startTime.getTime()) / 1000,
        );

        await this.analyticsRepository.updateSession(sessionData.sessionId, {
          endTime,
          duration,
          isActive: false,
        });
      }
    } catch (error) {
      this.logger.error('Failed to end session:', error);
    }
  }

  async updateSessionActivity(
    sessionId: string,
    userAddress?: string,
  ): Promise<void> {
    try {
      const session = await this.analyticsRepository.getSession(sessionId);
      if (session) {
        const updateData: any = { updatedAt: new Date() };
        if (userAddress && !session.userAddress) {
          updateData.userAddress = userAddress;
        }
        await this.analyticsRepository.updateSession(sessionId, updateData);
      }
    } catch (error) {
      this.logger.error('Failed to update session activity:', error);
    }
  }

  // Report generation methods
  async generateReport(
    reportData: GenerateReportDto,
  ): Promise<AnalyticsReport | Buffer> {
    try {
      const startDate = new Date(reportData.startDate);
      const endDate = new Date(reportData.endDate);

      const report = await this.buildAnalyticsReport(startDate, endDate);

      if (reportData.format === 'csv') {
        return this.exportToCSV(report);
      } else if (reportData.format === 'xlsx') {
        return this.exportToExcel(report);
      }

      return report;
    } catch (error) {
      this.logger.error('Failed to generate report:', error);
      throw error;
    }
  }

  private async buildAnalyticsReport(
    startDate: Date,
    endDate: Date,
  ): Promise<AnalyticsReport> {
    const [
      dailyActiveUsers,
      monthlyActiveUsers,
      avgSessionDuration,
      totalPageViews,
      totalApiCalls,
      newUsers,
      returningUsers,
      endpointStats,
      transactionStats,
      timeSeriesData,
    ] = await Promise.all([
      this.analyticsRepository.getDailyActiveUsers(startDate, endDate),
      this.analyticsRepository.getMonthlyActiveUsers(startDate, endDate),
      this.analyticsRepository.getAverageSessionDuration(startDate, endDate),
      this.analyticsRepository.getTotalPageViews(startDate, endDate),
      this.analyticsRepository.getTotalApiCalls(startDate, endDate),
      this.analyticsRepository.getNewUsers(startDate, endDate),
      this.analyticsRepository.getReturningUsers(startDate, endDate),
      this.analyticsRepository.getEndpointStats(startDate, endDate),
      this.analyticsRepository.getTransactionStats(startDate, endDate),
      this.analyticsRepository.getTimeSeriesData(startDate, endDate),
    ]);

    // Process transaction stats
    const volumeByToken: Record<string, { amount: string; count: number }> = {};
    const transactionsByType: Record<string, number> = {};
    let totalTransactions = 0;
    const totalVolume: Record<string, string> = {};

    transactionStats.forEach((stat) => {
      const { token, transactionType, totalAmount, transactionCount } = stat;

      if (!volumeByToken[token]) {
        volumeByToken[token] = { amount: '0', count: 0 };
      }
      volumeByToken[token].amount = (
        parseFloat(volumeByToken[token].amount) + parseFloat(totalAmount)
      ).toString();
      volumeByToken[token].count += parseInt(transactionCount);

      transactionsByType[transactionType] =
        (transactionsByType[transactionType] || 0) + parseInt(transactionCount);
      totalTransactions += parseInt(transactionCount);

      totalVolume[token] = (
        parseFloat(totalVolume[token] || '0') + parseFloat(totalAmount)
      ).toString();
    });

    // Process endpoint stats
    const mostUsedEndpoints = endpointStats.map((stat) => ({
      endpoint: stat.endpoint,
      method: stat.method,
      callCount: parseInt(stat.callCount),
      avgResponseTime: parseFloat(stat.avgResponseTime),
      errorRate: (parseInt(stat.errorCount) / parseInt(stat.callCount)) * 100,
    }));

    const slowestEndpoints = [...mostUsedEndpoints]
      .sort((a, b) => b.avgResponseTime - a.avgResponseTime)
      .slice(0, 10);

    const totalUsers = newUsers + returningUsers;
    const userRetentionRate =
      totalUsers > 0 ? (returningUsers / totalUsers) * 100 : 0;

    return {
      summary: {
        totalUsers,
        dailyActiveUsers,
        monthlyActiveUsers,
        totalSessions: 0, // This would need additional query
        avgSessionDuration,
        totalPageViews,
        totalApiCalls,
        totalTransactions,
        totalVolume,
      },
      userMetrics: {
        newUsers,
        returningUsers,
        userRetentionRate,
        avgTimeSpentPerUser: avgSessionDuration,
      },
      endpointMetrics: {
        mostUsedEndpoints: mostUsedEndpoints.slice(0, 10),
        slowestEndpoints,
      },
      transactionMetrics: {
        volumeByToken,
        transactionsByType,
        dailyVolume: [], // This would need additional processing
      },
      timeSeriesData: timeSeriesData.map((data) => ({
        date: data.date,
        activeUsers: parseInt(data.activeUsers),
        pageViews: parseInt(data.pageViews),
        apiCalls: parseInt(data.apiCalls),
        transactions: 0, // This would need additional query
      })),
    };
  }

  private exportToCSV(report: AnalyticsReport): Buffer {
    const fields = [
      'metric',
      'value',
      'date',
      'endpoint',
      'method',
      'callCount',
      'avgResponseTime',
      'errorRate',
    ];

    const data = [
      // Summary data
      { metric: 'Total Users', value: report.summary.totalUsers },
      { metric: 'Daily Active Users', value: report.summary.dailyActiveUsers },
      {
        metric: 'Monthly Active Users',
        value: report.summary.monthlyActiveUsers,
      },
      { metric: 'Total Page Views', value: report.summary.totalPageViews },
      { metric: 'Total API Calls', value: report.summary.totalApiCalls },
      { metric: 'Total Transactions', value: report.summary.totalTransactions },

      // Endpoint data
      ...report.endpointMetrics.mostUsedEndpoints.map((endpoint) => ({
        metric: 'Endpoint Usage',
        endpoint: endpoint.endpoint,
        method: endpoint.method,
        callCount: endpoint.callCount,
        avgResponseTime: endpoint.avgResponseTime,
        errorRate: endpoint.errorRate,
      })),

      // Time series data
      ...report.timeSeriesData.map((data) => ({
        metric: 'Time Series',
        date: data.date,
        value: data.activeUsers,
      })),
    ];

    const parser = new Parser({ fields });
    const csv = parser.parse(data);
    return Buffer.from(csv);
  }

  private exportToExcel(report: AnalyticsReport): Buffer {
    // For now, return CSV format as Excel requires additional dependencies
    return this.exportToCSV(report);
  }

  // Cleanup methods
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async cleanupOldSessions(): Promise<void> {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      // End sessions that are older than 30 days and still active
      const oldActiveSessions =
        await this.analyticsRepository.getActiveSessions();

      for (const session of oldActiveSessions) {
        if (session.startTime < thirtyDaysAgo) {
          await this.endSession({ sessionId: session.sessionId });
        }
      }

      this.logger.log('Cleanup of old sessions completed');
    } catch (error) {
      this.logger.error('Failed to cleanup old sessions:', error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async updateSessionDurations(): Promise<void> {
    try {
      const activeSessions = await this.analyticsRepository.getActiveSessions();
      const now = new Date();

      for (const session of activeSessions) {
        const duration = Math.floor(
          (now.getTime() - session.startTime.getTime()) / 1000,
        );
        await this.analyticsRepository.updateSession(session.sessionId, {
          duration,
        });
      }

      this.logger.log('Session durations updated');
    } catch (error) {
      this.logger.error('Failed to update session durations:', error);
    }
  }

  // Query methods
  async getEvents(query: AnalyticsQueryDto) {
    return this.analyticsRepository.getEvents(query);
  }

  async getActiveSessions(userAddress?: string) {
    return this.analyticsRepository.getActiveSessions(userAddress);
  }
}
