import {
  PutLogEventsCommand,
  PutLogEventsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
/* eslint-disable no-console */
import * as AWS from "@aws-sdk/client-cloudwatch-logs";

import { credentials, stage } from "../config";

const client = new AWS.CloudWatchLogs({
  credentials: {
    accessKeyId: credentials.accessKeyId,
    secretAccessKey: credentials.secretAccessKey,
  },
  region: "ap-northeast-2",
});

const GROUP = "lockceptron";
const STREAM = `tron-${stage}`;
class Logger {
  static logger = new Logger();

  private sendMsgToCloudWatch = (msg: string, data?: any) => {
    const input: PutLogEventsCommandInput = {
      logGroupName: GROUP,
      logStreamName: STREAM,
      logEvents: [
        {
          message: msg + (data ? ` ${JSON.stringify(data, null, 4)}` : null),
          timestamp: Date.now(),
        },
      ],
    };
    const command = new PutLogEventsCommand(input);
    client.send(command).catch((e) => console.error(e));
  };

  public log = (msg: string, data?: any) => {
    if (!data) {
      console.log(msg);
      this.sendMsgToCloudWatch(msg);
      return;
    }
    console.log(msg, data);
    this.sendMsgToCloudWatch(msg, data);
  };

  public error = (msg: string, data?: any) => {
    if (!data) {
      console.error(msg);
      this.sendMsgToCloudWatch(msg);
      return;
    }
    console.error(msg, data);
    this.sendMsgToCloudWatch(msg, data);
  };
}

export default Logger.logger;
