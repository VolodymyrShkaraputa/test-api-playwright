export class Logger {
  private recentLogs: { type: string; data: string }[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
    const logEntry = `Request-------->: ${method} ${url}\n\n| Headers: ${JSON.stringify(headers)} \n\n| Body: ${JSON.stringify(body, null, 2)}`;
    this.recentLogs.push({ type: 'Request Details', data: logEntry });
    console.log(logEntry);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logResponse(status: number, body: any) {
    console.log('================================================ \n');
    const logEntry = `Response-------->:\n\nStatus ${status}\n\nBody: ${JSON.stringify(body, null, 2)}`;
    this.recentLogs.push({ type: 'Response Details', data: logEntry });
    console.log(logEntry);
  }

  getRecentLogs() {
    const logs = this.recentLogs
      .map((log) => `${log.type}: ${JSON.stringify(log.data, null, 2)}`)
      .join('\n\n');
    return logs;
  }
}
