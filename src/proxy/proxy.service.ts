import { Injectable } from '@nestjs/common';
import ytdl from 'ytdl-core';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RequestLog } from './entities/request-log.entity';
import { HttpsProxyAgent } from 'https-proxy-agent';

@Injectable()
export class ProxyService {
  private readonly proxyList = [
    { host: 'proxy1.com', port: 8080, username: 'user1', password: 'pass1' },
    { host: 'proxy2.com', port: 8080, username: 'user2', password: 'pass2' },
  ];

  constructor(
    @InjectRepository(RequestLog)
    private requestLogsRepository: Repository<RequestLog>,
  ) {}

  private getRandomProxyConfig() {
    const randomProxy =
      this.proxyList[Math.floor(Math.random() * this.proxyList.length)];
    const proxy = `http://${randomProxy.username}:${randomProxy.password}@${randomProxy.host}:${randomProxy.port}`;
    return {
      proxy,
      headers: {
        'User-Agent': 'Mozilla/5.0',
      },
      httpsAgent: new HttpsProxyAgent(proxy),
    };
  }

  async fetchVideoInfo(url: string): Promise<any> {
    const proxyConfig = this.getRandomProxyConfig();
    try {
      const videoInfo = await ytdl.getBasicInfo(url, { requestOptions: proxyConfig });
      await this.logRequest(url, proxyConfig.proxy, 200, null);
      return videoInfo;
    } catch (error) {
      // eslint-disable-next-line prettier/prettier
      await this.logRequest(url, proxyConfig.proxy, error.statusCode || 500, error.message);
      throw error;
    }
  }

  private async logRequest(url: string, proxy: string, status: number, errorMessage: string | null) {
    const log = this.requestLogsRepository.create({
      url,
      proxy_instance: proxy,
      status,
      error_message: errorMessage,
    });
    await this.requestLogsRepository.save(log);
  }
}
