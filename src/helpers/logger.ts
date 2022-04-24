import {
  DescribeLogStreamsCommand,
  DescribeLogStreamsCommandInput,
  PutLogEventsCommand,
  PutLogEventsCommandInput,
} from "@aws-sdk/client-cloudwatch-logs";
/* eslint-disable no-console */
import * as AWS from "@aws-sdk/client-cloudwatch-logs";
import * as util from "util";
import { AWS_CREDENTIAL, STAGE } from "../environments";

const client = new AWS.CloudWatchLogs({
  credentials: {
    accessKeyId: AWS_CREDENTIAL.accessKeyId,
    secretAccessKey: AWS_CREDENTIAL.secretAccessKey,
  },
  region: "ap-northeast-2",
});

const GROUP = "lockceptron";
const STREAM = `tron-${STAGE}`;
class Logger {
  static logger = new Logger();

  private getSequenceToken = async () => {
    const input: DescribeLogStreamsCommandInput = {
      logGroupName: GROUP,
      logStreamNamePrefix: STREAM,
    };
    const command = new DescribeLogStreamsCommand(input);
    const output = await client.send(command);
    if (!output.logStreams?.[0]) return {};
    const {
      logStreamName,
      uploadSequenceToken: sequenceToken,
    } = output.logStreams[0];
    return { logGroupName: GROUP, logStreamName, sequenceToken };
  };

  private sendMsgToCloudWatch = async (msg: string, data?: any) => {
    const {
      logGroupName,
      logStreamName,
      sequenceToken,
    } = await this.getSequenceToken();
    const input: PutLogEventsCommandInput = {
      logGroupName,
      logStreamName,
      logEvents: [
        {
          message: msg + (data ? ` ${util.inspect(data, false, 10)}` : ""),
          timestamp: Date.now(),
        },
      ],
      sequenceToken,
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
    console.log(msg, util.inspect(data));
    this.sendMsgToCloudWatch(msg, data);
  };

  public error = (msg: string, data?: any) => {
    if (!data) {
      console.error(msg);
      this.sendMsgToCloudWatch(msg);
      return;
    }
    console.error(msg, util.inspect(data, false, 10));
    this.sendMsgToCloudWatch(msg, data);
  };
}

export default Logger.logger;
