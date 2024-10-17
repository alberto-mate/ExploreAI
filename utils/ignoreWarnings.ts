import { LogBox } from "react-native";

export function ignoreWarnings() {
  if (__DEV__) {
    const IGNORED_LOGS = ["Clerk:"];
    //const IGNORED_LOGS = [" "];
    LogBox.ignoreLogs(IGNORED_LOGS);
    const connectConsoleTextFromArgs = (arrayOfStrings: string[]): string =>
      arrayOfStrings
        .slice(1)
        .reduce(
          (baseString, currentString) =>
            baseString.replace("%s", currentString),
          arrayOfStrings[0],
        );

    // Explicitly typing 'logger' as a function that accepts any arguments and returns void
    const filterIgnoredMessages =
      (logger: (...args: any[]) => void): ((...args: any[]) => void) =>
      (...args: any[]): void => {
        const output = connectConsoleTextFromArgs(args);

        if (!IGNORED_LOGS.some((log) => output.includes(log))) {
          logger(...args);
        }
      };

    console.log = filterIgnoredMessages(console.log);
    console.info = filterIgnoredMessages(console.info);
    console.warn = filterIgnoredMessages(console.warn);
    console.error = filterIgnoredMessages(console.error);
  }
}
