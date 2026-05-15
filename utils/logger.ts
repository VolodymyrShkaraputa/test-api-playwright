export class Logger {
  private recentLogs: { type: string; data: string }[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logRequest(method: string, url: string, headers: Record<string, string>, body?: any) {
    const logEntry = `
======================================Request======================================:

Method: ${method} URL: ${url}

| Headers:
${headers ? JSON.stringify(headers, null, 2) : 'The request has no headers'}

| Body:
${body ? JSON.stringify(body, null, 2) : 'The request has no body'}
`;

    this.recentLogs.push({
      type: 'Request Details',
      data: logEntry,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logResponse(status: number, body: any) {
    const logEntry = `
======================================Response======================================:

Status: ${status}

Body:
${JSON.stringify(body, null, 2)}
`;

    this.recentLogs.push({
      type: 'Response Details',
      data: logEntry,
    });
  }

  printLogs() {
    console.log('\n============== API LOGS ==============\n');

    this.recentLogs.forEach((log) => {
      console.log(log.data);
    });
  }

  clearLogs() {
    this.recentLogs = [];
  }
}
