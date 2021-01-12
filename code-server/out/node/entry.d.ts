import { DefaultedArgs } from "./cli";
export declare const runVsCodeCli: (args: DefaultedArgs) => void;
export declare const openInExistingInstance: (args: DefaultedArgs, socketPath: string) => Promise<void>;
