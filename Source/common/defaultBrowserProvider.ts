/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import defaultBrowserModule from "default-browser";
import type execaType from "execa";
import { inject, injectable } from "inversify";
import { Execa } from "../ioc-extras";
import { once } from "./objUtils";
import { ChildProcessError } from "./processUtils";

export enum DefaultBrowser {
	Chrome = 0,
	Safari = 1,
	Firefox = 2,
	Edge = 3,
	OldEdge = 4,
	IE = 5,
}

const substrings = new Map([
	["chrome", DefaultBrowser.Chrome],
	["safari", DefaultBrowser.Safari],
	["firefox", DefaultBrowser.Firefox],
	["msedge", DefaultBrowser.Edge],
	["microsoft edge", DefaultBrowser.Edge],
	["appxq0fevzme2pys62n3e0fbqa7peapykr8v", DefaultBrowser.OldEdge],
	["ie.http", DefaultBrowser.IE],
]);

const getMatchingBrowserInString = (str: string) => {
	str = str.toLowerCase();
	for (const [needle, browser] of substrings.entries()) {
		if (str.includes(needle)) {
			return browser;
		}
	}
};

/**
 * Class that looks up the default browser on the current platform.
 */
export interface IDefaultBrowserProvider {
	/**
	 * Looks up the default browser, returning undefined if we're not sure. May
	 * reject if some underlying lookup fails.
	 */
	lookup(): Promise<DefaultBrowser | undefined>;
}

export const IDefaultBrowserProvider = Symbol("IDefaultBrowserProvider");

@injectable()
export class DefaultBrowserProvider implements IDefaultBrowserProvider {
	constructor(
		@inject(Execa) private readonly execa: typeof execaType,
		private readonly platform = process.platform
	) {}

	/**
	 * Cache the result of this function. This adds a few milliseconds
	 * (subprocesses out on all platforms) and people rarely change their
	 * default browser.
	 * @inheritdoc
	 */
	public lookup = once(() => {
		if (this.platform === "win32") {
			return this.lookupWindows();
		} else {
			return this.lookupUnix();
		}
	});

	private async lookupUnix() {
		const { name } = await defaultBrowserModule();
		return getMatchingBrowserInString(name);
	}

	private async lookupWindows() {
		const result = await this.execa("reg", [
			"QUERY",
			" HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
			"/v",
			"ProgId",
		]);
		if (result.failed) {
			throw ChildProcessError.fromExeca(result);
		}

		const match = /ProgId\s*REG_SZ\s*(\S+)/.exec(result.stdout);
		if (!match) {
			return undefined;
		}

		return getMatchingBrowserInString(match[1]);
	}
}
