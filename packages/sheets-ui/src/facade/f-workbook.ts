/**
 * Copyright 2023-present DreamNum Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { IDisposable, Nullable } from '@univerjs/core';
import type { IMouseEvent, IPointerEvent, RenderManagerService } from '@univerjs/engine-render';
import type { ICellPosWithEvent, IDragCellPosition, IEditorBridgeServiceVisibleParam, IHoverRichTextInfo, IHoverRichTextPosition, IScrollState, SheetSelectionRenderService } from '@univerjs/sheets-ui';
import { awaitTime, ICommandService, ILogService, toDisposable } from '@univerjs/core';
import { DeviceInputEventType, IRenderManagerService } from '@univerjs/engine-render';
import { DragManagerService, HoverManagerService, ISheetSelectionRenderService, SetCellEditVisibleOperation, SheetScrollManagerService } from '@univerjs/sheets-ui';
import { FWorkbook } from '@univerjs/sheets/facade';
import { type IDialogPartMethodOptions, IDialogService, type ISidebarMethodOptions, ISidebarService, KeyCode } from '@univerjs/ui';
import { filter } from 'rxjs';
import { CellFEventName, type ICellEventParam, type IFSheetsUIEventParamConfig, type IUIEventBase } from './f-event';

export interface IFWorkbookSheetsUIMixin {
    /**
     * Open a sidebar.
     * @deprecated
     * @param params the sidebar options
     * @returns the disposable object
     */
    openSiderbar(params: ISidebarMethodOptions): IDisposable;

    /**
     * Open a dialog.
     * @deprecated
     * @param dialog the dialog options
     * @returns the disposable object
     */
    openDialog(dialog: IDialogPartMethodOptions): IDisposable;

    /**
     * Subscribe to cell click events
     * @param callback - The callback function to be called when a cell is clicked
     * @returns A disposable object that can be used to unsubscribe from the event
     */
    onCellClick(callback: (cell: IHoverRichTextInfo) => void): IDisposable;

    /**
     * Subscribe cell hover events
     * @param callback - The callback function to be called when a cell is hovered
     * @returns A disposable object that can be used to unsubscribe from the event
     */
    onCellHover(callback: (cell: IHoverRichTextPosition) => void): IDisposable;

    /**
     * Subscribe to pointer move events on workbook. Just like onCellHover, but with event information.
     * @param {function(ICellPosWithEvent): any} callback The callback function accept cell location and event.
     */
    onCellPointerMove(callback: (cell: ICellPosWithEvent, event: IPointerEvent | IMouseEvent) => void): IDisposable;
    /**
     * Subscribe to cell pointer down events.
     * @param {function(ICellPosWithEvent): any} callback The callback function accept cell location and event.
     */
    onCellPointerDown(callback: (cell: ICellPosWithEvent) => void): IDisposable;
    /**
     * Subscribe to cell pointer up events.
     * @param {function(ICellPosWithEvent): any} callback The callback function accept cell location and event.
     */
    onCellPointerUp(callback: (cell: ICellPosWithEvent) => void): IDisposable;

    onDragOver(callback: (cell: IDragCellPosition) => void): IDisposable;

    onDrop(callback: (cell: IDragCellPosition) => void): IDisposable;

    /**
     * Start the editing process
     * @returns A boolean value
     * @example
     * ```ts
     * univerAPI.getActiveWorkbook().startEditing();
     * ```
     */
    startEditing(): boolean;

    /**
     * Use endEditingAsync as instead
     * @deprecated
     * End the editing process
     * @async
     * @param save - Whether to save the changes
     * @returns A promise that resolves to a boolean value
     * @example
     * ``` ts
     * univerAPI.getActiveWorkbook().endEditing(true);
     * ```
     */
    endEditing(save?: boolean): Promise<boolean>;

    /**
     * @async
     * @param {boolean} save - Whether to save the changes, default is true
     * @returns {Promise<boolean>} A promise that resolves to a boolean value
     */
    endEditingAsync(save?: boolean): Promise<boolean>;
    /*
     * Get scroll state of specified sheet.
     * @returns {IScrollState} scroll state
     * @example
     * ``` ts
     * univerAPI.getActiveWorkbook().getScrollStateBySheetId($sheetId)
     * ```
     */
    getScrollStateBySheetId(sheetId: string): Nullable<IScrollState>;

    /**
     * Disable selection. After disabled, there would be no response for selection.
     * @returns {FWorkbook} FWorkbook instance
     * @example
     * ```ts
     * univerAPI.getActiveWorkbook().disableSelection();
     * ```
     */
    disableSelection(): FWorkbook;

    /**
     * Enable selection. After this you can select range.
     * @example
     * ```ts
     * univerAPI.getActiveWorkbook().enableSelection();
     * ```
     */
    enableSelection(): FWorkbook;

    /**
     * Set selection invisible, Unlike disableSelection, selection still works, you just can not see them.
     * @example
     * ```ts
     * univerAPI.getActiveWorkbook().transparentSelection();
     * ```
     */
    transparentSelection(): FWorkbook;

    /**
     * Set selection visible.
     * @example
     * ```ts
     * univerAPI.getActiveWorkbook().showSelection();
     * ```
     */
    showSelection(): FWorkbook;
}

export class FWorkbookSheetsUIMixin extends FWorkbook implements IFWorkbookSheetsUIMixin {
    override openSiderbar(params: ISidebarMethodOptions): IDisposable {
        this._logDeprecation('openSiderbar');

        const sideBarService = this._injector.get(ISidebarService);
        return sideBarService.open(params);
    }

    override openDialog(dialog: IDialogPartMethodOptions): IDisposable {
        this._logDeprecation('openDialog');

        const dialogService = this._injector.get(IDialogService);
        const disposable = dialogService.open({
            ...dialog,
            onClose: () => {
                disposable.dispose();
            },
        });

        return disposable;
    }

    private _logDeprecation(name: string): void {
        const logService = this._injector.get(ILogService);

        logService.warn('[FWorkbook]', `${name} is deprecated. Please use the function of the same name on "FUniver".`);
    }

    override addUIEvent(event: keyof IFSheetsUIEventParamConfig, _callback: (params: IFSheetsUIEventParamConfig[typeof event]) => void): IDisposable {
        const worksheet = this.getActiveSheet();
        const baseParams: IUIEventBase = {
            workbook: this,
            worksheet,
        };

        switch (event) {
            case CellFEventName.CellClicked:
                this.onCellClick((cell) => {
                    this.fireEvent(this.Event.CellClicked, {
                        row: cell.location.row,
                        column: cell.location.col,
                        ...baseParams,
                    } as ICellEventParam);
                });
                break;
            case CellFEventName.CellPointerDown:
                this.onCellPointerDown((cell) => {
                    this.fireEvent(this.Event.CellPointerDown, this.generateCellParams(cell));
                });
                break;
            case CellFEventName.CellPointerUp:
                this.onCellPointerUp((cell) => {
                    this.fireEvent(this.Event.CellPointerUp, this.generateCellParams(cell));
                });
                break;
            case CellFEventName.CellPointerMove:
                this.onCellPointerMove((cell) => {
                    this.fireEvent(this.Event.CellPointerMove, this.generateCellParams(cell));
                });
                break;
            case CellFEventName.CellHover:
                this.onCellHover((cell) => {
                    this.fireEvent(this.Event.CellHover, this.generateCellParams(cell));
                });
                break;
            case CellFEventName.DragOver:
                this.onDragOver((cell) => {
                    this.fireEvent(this.Event.DragOver, {
                        row: cell.location.row,
                        column: cell.location.col,
                        ...baseParams,
                    });
                });
                break;
            case CellFEventName.Drop:
                this.onDrop((cell) => {
                    this.fireEvent(this.Event.Drop, {
                        row: cell.location.row,
                        column: cell.location.col,
                        ...baseParams,
                    });
                });
        }

        return toDisposable(() => {
            //
        });
    }

    generateCellParams(cell: IHoverRichTextPosition | ICellPosWithEvent): ICellEventParam {
        const worksheet = this.getActiveSheet();
        return {
            row: cell.row,
            column: cell.col,
            workbook: this,
            worksheet,
        };
    }

    override onCellClick(callback: (cell: IHoverRichTextInfo) => void): IDisposable {
        const hoverManagerService = this._injector.get(HoverManagerService);
        return toDisposable(
            hoverManagerService.currentClickedCell$
                .pipe(filter((cell) => !!cell))
                .subscribe((cell) => {
                    callback(cell);
                })
        );
    }

    override onCellHover(callback: (cell: IHoverRichTextPosition) => void): IDisposable {
        const hoverManagerService = this._injector.get(HoverManagerService);
        return toDisposable(
            hoverManagerService.currentRichText$
                .pipe(filter((cell) => !!cell))
                .subscribe(callback)
        );
    }

    override onCellPointerDown(callback: (cell: ICellPosWithEvent) => void): IDisposable {
        const hoverManagerService = this._injector.get(HoverManagerService);
        return toDisposable(
            hoverManagerService.currentPointerDownCell$.subscribe(callback)
        );
    }

    override onCellPointerUp(callback: (cell: ICellPosWithEvent) => void): IDisposable {
        const hoverManagerService = this._injector.get(HoverManagerService);
        return toDisposable(
            hoverManagerService.currentPointerUpCell$.subscribe(callback)
        );
    }

    override onCellPointerMove(callback: (cell: ICellPosWithEvent, event: IPointerEvent | IMouseEvent) => void): IDisposable {
        const hoverManagerService = this._injector.get(HoverManagerService);
        return toDisposable(
            hoverManagerService.currentCellPosWithEvent$
                .pipe(filter((cell) => !!cell))
                .subscribe((cell: ICellPosWithEvent) => {
                    callback(cell, cell.event);
                })
        );
    }

    override onDragOver(callback: (cell: IDragCellPosition) => void): IDisposable {
        const dragManagerService = this._injector.get(DragManagerService);
        return toDisposable(
            dragManagerService.currentCell$
                .pipe(filter((cell) => !!cell))
                .subscribe((cell: IDragCellPosition) => {
                    callback(cell);
                })
        );
    }

    override onDrop(callback: (cell: IDragCellPosition) => void): IDisposable {
        const dragManagerService = this._injector.get(DragManagerService);
        return toDisposable(
            dragManagerService.endCell$
                .pipe(filter((cell) => !!cell))
                .subscribe((cell: IDragCellPosition) => {
                    callback(cell);
                })
        );
    }

    override startEditing(): boolean {
        const commandService = this._injector.get(ICommandService);
        return commandService.syncExecuteCommand(SetCellEditVisibleOperation.id, {
            eventType: DeviceInputEventType.Dblclick,
            unitId: this._workbook.getUnitId(),
            visible: true,
        } as IEditorBridgeServiceVisibleParam);
    }

    override async endEditing(save?: boolean): Promise<boolean> {
        const commandService = this._injector.get(ICommandService);
        commandService.syncExecuteCommand(SetCellEditVisibleOperation.id, {
            eventType: DeviceInputEventType.Keyboard,
            keycode: save ? KeyCode.ENTER : KeyCode.ESC,
            visible: false,
            unitId: this._workbook.getUnitId(),
        } as IEditorBridgeServiceVisibleParam);

        // wait for the async cell edit operation to complete
        await awaitTime(0);
        return true;
    }

    override endEditingAsync(save = true): Promise<boolean> {
        return this.endEditing(save);
    }

    /**
     * Get scroll state of specified sheet.
     * @param {string} sheetId - sheet id
     * @returns {IScrollState} scroll state
     * @example
     * ``` ts
     * univerAPI.getActiveWorkbook().getScrollStateBySheetId($sheetId)
     * ```
     */
    override getScrollStateBySheetId(sheetId: string): Nullable<IScrollState> {
        const unitId = this._workbook.getUnitId();
        const renderManagerService = this._injector.get(IRenderManagerService);
        const render = renderManagerService.getRenderById(unitId);
        if (!render) return null;
        const scm = render.with(SheetScrollManagerService);
        return scm.getScrollStateByParam({ unitId, sheetId });
    }

    override disableSelection(): FWorkbook {
        const unitId = this._workbook.getUnitId();
        const renderManagerService = this._injector.get(IRenderManagerService) as RenderManagerService;
        const render = renderManagerService.getRenderById(unitId);
        if (render) {
            (render.with(ISheetSelectionRenderService) as SheetSelectionRenderService).disableSelection();
        }
        return this;
    }

    override enableSelection(): FWorkbook {
        const unitId = this._workbook.getUnitId();
        const renderManagerService = this._injector.get(IRenderManagerService) as RenderManagerService;
        const render = renderManagerService.getRenderById(unitId);
        if (render) {
            (render.with(ISheetSelectionRenderService) as SheetSelectionRenderService).enableSelection();
        }
        return this;
    }

    override transparentSelection(): FWorkbook {
        const unitId = this._workbook.getUnitId();
        const renderManagerService = this._injector.get(IRenderManagerService) as RenderManagerService;
        const render = renderManagerService.getRenderById(unitId);
        if (render) {
            (render.with(ISheetSelectionRenderService) as SheetSelectionRenderService).transparentSelection();
        }
        return this;
    }

    override showSelection(): FWorkbook {
        const unitId = this._workbook.getUnitId();
        const renderManagerService = this._injector.get(IRenderManagerService) as RenderManagerService;
        const render = renderManagerService.getRenderById(unitId);
        if (render) {
            (render.with(ISheetSelectionRenderService) as SheetSelectionRenderService).showSelection();
        }
        return this;
    }
}

FWorkbook.extend(FWorkbookSheetsUIMixin);
declare module '@univerjs/sheets/facade' {
    // eslint-disable-next-line ts/naming-convention
    interface FWorkbook extends IFWorkbookSheetsUIMixin {}
}
