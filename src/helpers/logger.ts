/* eslint-disable no-console */
class Logger {
  static logger = new Logger();

  public log = (msg: string, data?: any) => {
    if (!data) {
      console.log(msg);
      return;
    }
    console.log(msg, data);
  };

  public error = (msg: string, data?: any) => {
    if (!data) {
      console.error(msg);
      return;
    }
    console.error(msg, data);
  };
}

export default Logger.logger;
