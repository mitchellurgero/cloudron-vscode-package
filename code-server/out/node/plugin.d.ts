import { Logger } from "@coder/logger";
import * as express from "express";
import * as pluginapi from "../../typings/pluginapi";
interface Plugin extends pluginapi.Plugin {
    /**
     * These fields are populated from the plugin's package.json
     * and now guaranteed to exist.
     */
    name: string;
    version: string;
    /**
     * path to the node module on the disk.
     */
    modulePath: string;
}
interface Application extends pluginapi.Application {
    plugin: Omit<Plugin, "init" | "router" | "applications">;
}
/**
 * PluginAPI implements the plugin API described in typings/pluginapi.d.ts
 * Please see that file for details.
 */
export declare class PluginAPI {
    /**
     * These correspond to $CS_PLUGIN_PATH and $CS_PLUGIN respectively.
     */
    private readonly csPlugin;
    private readonly csPluginPath;
    private readonly plugins;
    private readonly logger;
    constructor(logger: Logger, 
    /**
     * These correspond to $CS_PLUGIN_PATH and $CS_PLUGIN respectively.
     */
    csPlugin?: string, csPluginPath?: string);
    /**
     * applications grabs the full list of applications from
     * all loaded plugins.
     */
    applications(): Promise<Application[]>;
    /**
     * mount mounts all plugin routers onto r.
     */
    mount(r: express.Router): void;
    /**
     * loadPlugins loads all plugins based on this.csPlugin,
     * this.csPluginPath and the built in plugins.
     */
    loadPlugins(): Promise<void>;
    /**
     * _loadPlugins is the counterpart to loadPlugins.
     *
     * It differs in that it loads all plugins in a single
     * directory whereas loadPlugins uses all available directories
     * as documented.
     */
    private _loadPlugins;
    private loadPlugin;
    /**
     * _loadPlugin is the counterpart to loadPlugin and actually
     * loads the plugin now that we know there is no duplicate
     * and that the package.json has been read.
     */
    private _loadPlugin;
}
export {};
