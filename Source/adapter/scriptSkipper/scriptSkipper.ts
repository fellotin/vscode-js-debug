/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/

export const IScriptSkipper = Symbol("IScriptSkipper");

export interface IScriptSkipper {
	isScriptSkipped(url: string): boolean;
}
