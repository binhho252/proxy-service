import { Controller, Get, Query } from '@nestjs/common';
import { ProxyService } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @Get('video-info')
  async getVideoInfo(@Query('url') url: string) {
    if (!url) {
      return { error: 'URL parameter is required' };
    }
    try {
      const videoInfo = await this.proxyService.fetchVideoInfo(url);
      return videoInfo;
    } catch (error) {
      return { error: error.message };
    }
  }
}
