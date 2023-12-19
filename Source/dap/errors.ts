{
	("$schema");
	: "https://biomejs.dev/schemas/1.4.1/schema.json",
	"organizeImports":
	{
		("enabled");
		: true
	}
	,
	"formatter":
	{
		("enabled");
		: true,
		"formatWithErrors": true,
		"indentStyle": "tab",
		"lineWidth": 80,
		"indentWidth": 4
	}
	,
	"javascript":
	{
		("formatter");
		:
		{
			("enabled");
			: true,
			"arrowParentheses": "always",
			"indentStyle": "tab",
			"jsxQuoteStyle": "double",
			"lineWidth": 80,
			"quoteProperties": "asNeeded",
			"quoteStyle": "double",
			"semicolons": "always",
			"trailingComma": "all"
		}
	}
	,
	"linter":
	{
		("enabled");
		: true,
		"rules":
		{
			("a11y");
			:
			{
				("all");
				: true
			}
			,
			"all": true,
			"complexity":
			{
				("all");
				: true,
				"noForEach": "off",
				"useLiteralKeys": "off",
				"noExcessiveCognitiveComplexity": "off"
			}
			,
			"correctness":
			{
				("all");
				: true,
				"noUnusedVariables": "off"
			}
			,
			"nursery":
			{
				("all");
				: true,
				"useImportRestrictions": "off",
				"noUselessLoneBlockStatements": "off",
				"noDefaultExport": "off"
			}
			,
			"performance":
			{
				("all");
				: true
			}
			,
			"security":
			{
				("all");
				: true
			}
			,
			"style":
			{
				("all");
				: true,
				"useNamingConvention": "off",
				"noUselessElse": "off"
			}
			,
			"suspicious":
			{
				("all");
				: true,
				"noConsoleLog": "off"
			}
		}
	}
}
/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

import * as l10n from "@vscode/l10n";
import Dap from "./api";
import { ProtocolError } from "./protocolError";

export enum ErrorCodes {
	SilentError = 9222,
	UserError = 9223,
	NvmOrNvsNotFound = 9224,
	NvsNotFound = 9225,
	NvmHomeNotFound = 9226,
	CannotLaunchInTerminal = 9227,
	CannotLoadEnvironmentVariables = 9228,
	CannotFindNodeBinary = 9229,
	NodeBinaryOutOfDate = 9230,
	InvalidHitCondition = 9231,
	InvalidLogPointBreakpointSyntax = 9232,
	BrowserNotFound = 9233,
	AsyncScopesNotAvailable = 9234,
	ProfileCaptureError = 9235,
	InvalidConcurrentProfile = 9236,
	InvalidBreakpointCondition = 9237,
	ReplError = 9238,
	SourceMapParseFailed = 9239,
	BrowserLaunchFailed = 9240,
	TargetPageNotFound = 9241,
	BrowserAttachFailed = 9242,
	TaskCancelled = 9243,
	ThreadNotAvailable = 9244,
	CwdDoesNotExist = 9245,
}

export function reportToConsole(dap: Dap.Api, error: string) {
	dap.output({
		category: "console",
		output: `${error}\n`,
	});
}

export function createSilentError(
	text: string,
	code = ErrorCodes.SilentError,
): Dap.Error {
	return {
		__errorMarker: true,
		error: {
			id: code,
			format: text,
			showUser: false,
		},
	};
}

export function createUserError(
	text: string,
	code = ErrorCodes.UserError,
): Dap.Error {
	return {
		__errorMarker: true,
		error: {
			id: code,
			format: text,
			showUser: true,
		},
	};
}

export const nvmNotFound = () =>
	createUserError(
		l10n.t(
			"Attribute 'runtimeVersion' requires Node.js version manager 'nvs', 'nvm' or 'fnm' to be installed.",
		),
		ErrorCodes.NvmOrNvsNotFound,
	);

export const nvsNotFound = () =>
	createUserError(
		l10n.t(
			"Attribute 'runtimeVersion' with a flavor/architecture requires 'nvs' to be installed.",
		),
		ErrorCodes.NvsNotFound,
	);

export const nvmHomeNotFound = () =>
	createUserError(
		l10n.t(
			"Attribute 'runtimeVersion' requires Node.js version manager 'nvm-windows' or 'nvs'.",
		),
		ErrorCodes.NvmHomeNotFound,
	);

export const nvmVersionNotFound = (version: string, versionManager: string) =>
	createUserError(
		l10n.t(
			"Node.js version '{0}' not installed using version manager {1}.",
			version,
			versionManager,
		),
		ErrorCodes.NvmHomeNotFound,
	);

export const cannotLaunchInTerminal = (errorMessage: string) =>
	createUserError(
		l10n.t("Cannot launch debug target in terminal ({0}).", errorMessage),
		ErrorCodes.CannotLaunchInTerminal,
	);

export const cannotLoadEnvironmentVars = (errorMessage: string) =>
	createUserError(
		l10n.t(
			"Can't load environment variables from file ({0}).",
			errorMessage,
		),
		ErrorCodes.CannotLoadEnvironmentVariables,
	);

export const cwdDoesNotExist = (cwd: string) =>
	createUserError(
		l10n.t("The configured `cwd` {0} does not exist.", cwd),
		ErrorCodes.CwdDoesNotExist,
	);

export const cannotFindNodeBinary = (attemptedPath: string, reason: string) =>
	createUserError(
		l10n.t(
			'Can\'t find Node.js binary "{0}": {1}. Make sure Node.js is installed and in your PATH, or set the "runtimeExecutable" in your launch.json',
			attemptedPath,
			reason,
		),
		ErrorCodes.CannotFindNodeBinary,
	);

export const nodeBinaryOutOfDate = (
	readVersion: string,
	attemptedPath: string,
) =>
	createUserError(
		l10n.t(
			'The Node version in "{0}" is outdated (version {1}), we require at least Node 8.x.',
			attemptedPath,
			readVersion,
		),
		ErrorCodes.NodeBinaryOutOfDate,
	);

export const invalidHitCondition = (expression: string) =>
	createUserError(
		l10n.t(
			'Invalid hit condition "{0}". Expected an expression like "> 42" or "== 2".',
			expression,
		),
		ErrorCodes.InvalidHitCondition,
	);

export const profileCaptureError = () =>
	createUserError(
		l10n.t("An error occurred taking a profile from the target."),
		ErrorCodes.ProfileCaptureError,
	);

export const invalidConcurrentProfile = () =>
	createUserError(
		l10n.t("Please stop the running profile before starting a new one."),
		ErrorCodes.InvalidConcurrentProfile,
	);

export const replError = (message: string) =>
	createSilentError(message, ErrorCodes.ReplError);

export const browserNotFound = (
	browserType: string,
	requested: string,
	available: readonly string[],
) =>
	createUserError(
		requested === "*" && !available.length
			? l10n.t(
					'Unable to find an installation of the browser on your system. Try installing it, or providing an absolute path to the browser in the "runtimeExecutable" in your launch.json.',
			  )
			: l10n.t(
					'Unable to find {0} version {1}. Available auto-discovered versions are: {2}. You can set the "runtimeExecutable" in your launch.json to one of these, or provide an absolute path to the browser executable.',
					browserType,
					requested,
					JSON.stringify([...new Set(available)]),
			  ),
		ErrorCodes.BrowserNotFound,
	);

export const browserLaunchFailed = (innerError: Error) =>
	createUserError(
		l10n.t('Unable to launch browser: "{0}"', innerError.message),
		ErrorCodes.BrowserLaunchFailed,
	);

export const browserAttachFailed = (message?: string) =>
	createUserError(
		message ?? l10n.t("Unable to attach to browser"),
		ErrorCodes.BrowserAttachFailed,
	);

export const targetPageNotFound = () =>
	createUserError(
		l10n.t(
			'Target page not found. You may need to update your "urlFilter" to match the page you want to debug.',
		),
		ErrorCodes.TargetPageNotFound,
	);

export const invalidLogPointSyntax = (error: string) =>
	createUserError(error, ErrorCodes.InvalidLogPointBreakpointSyntax);

export const asyncScopesNotAvailable = () =>
	createSilentError(
		l10n.t("Variables not available in async stacks"),
		ErrorCodes.AsyncScopesNotAvailable,
	);

export const invalidBreakPointCondition = (
	params: Dap.SourceBreakpoint,
	error: string,
) =>
	createUserError(
		l10n.t(
			"Syntax error setting breakpoint with condition {0} on line {1}: {2}",
			JSON.stringify(params.condition),
			params.line,
			error,
		),
		ErrorCodes.InvalidBreakpointCondition,
	);

export const threadNotAvailable = () =>
	createSilentError(
		l10n.t("Thread not found"),
		ErrorCodes.ThreadNotAvailable,
	);

// use the compiledUrl instead of the source map url here, since the source
// map could be a very large data URI
export const sourceMapParseFailed = (compiledUrl: string, message: string) =>
	createUserError(
		l10n.t("Could not read source map for {0}: {1}", compiledUrl, message),
	);

export const uwpPipeNotAvailable = () =>
	createUserError(
		l10n.t("UWP webview debugging is not available on your platform."),
	);

export const noUwpPipeFound = () =>
	createUserError(
		l10n.t(
			"Could not connect to any UWP Webview pipe. Make sure your webview is hosted in debug mode, and that the `pipeName` in your `launch.json` is correct.",
		),
	);

/**
 * Returns if the value looks like a DAP error.
 */
export const isDapError = (value: unknown): value is Dap.Error =>
	typeof value === "object" && !!value && "__errorMarker" in value;

export const isErrorOfType = (
	error: unknown,
	code: ErrorCodes,
): error is ProtocolError =>
	error instanceof ProtocolError && error.cause.id === code;

export const browserProcessExitedBeforePort = (code: number) =>
	createUserError(
		l10n.t(
			"The browser process exited with code {0} before connecting to the debug server. Make sure the `runtimeExecutable` is configured correctly and that it can run without errors.",
			code,
		),
	);
