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

import type { IThreadComment } from '@univerjs/thread-comment';
import { generateRandomId, ICommandService, type IDocumentBody, type Nullable, Range, Tools, UserManagerService } from '@univerjs/core';
import { SheetsThreadCommentModel } from '@univerjs/sheets-thread-comment';
import { FRange } from '@univerjs/sheets/facade';
import { AddCommentCommand, DeleteCommentTreeCommand, getDT } from '@univerjs/thread-comment';
import { FTheadCommentBuilder, FThreadComment } from './f-thread-comment';

export interface IFRangeCommentMixin {
    /**
     * Get the comment of the start cell in the current range.
     * @returns The comment of the start cell in the current range. If the cell does not have a comment, return `null`.
     */
    getComment(): Nullable<FThreadComment>;

    /**
     * Get the comments in the current range.
     * @returns {FThreadComment[]} The comments in the current range.
     */
    getComments(): FThreadComment[];

    /**
     * Add a comment to the start cell in the current range.
     * @param content The content of the comment.
     * @returns Whether the comment is added successfully.
     */
    addComment(content: IDocumentBody | FTheadCommentBuilder): Promise<boolean>;
    /**
     * Clear the comment of the start cell in the current range.
     * @returns Whether the comment is cleared successfully.
     */
    clearComment(): Promise<boolean>;

    /**
     * Clear all of the comments in the current range.
     * @returns Whether the comments are cleared successfully.
     */
    clearComments(): Promise<boolean>;
}

export class FRangeCommentMixin extends FRange implements IFRangeCommentMixin {
    override getComment(): Nullable<FThreadComment> {
        const injector = this._injector;
        const sheetsTheadCommentModel = injector.get(SheetsThreadCommentModel);
        const unitId = this._workbook.getUnitId();
        const sheetId = this._worksheet.getSheetId();
        const commentId = sheetsTheadCommentModel.getByLocation(unitId, sheetId, this._range.startRow, this._range.startColumn);
        if (!commentId) {
            return null;
        }

        const comment = sheetsTheadCommentModel.getComment(unitId, sheetId, commentId);
        if (comment) {
            return this._injector.createInstance(FThreadComment, comment);
        }

        return null;
    }

    override getComments(): FThreadComment[] {
        const injector = this._injector;
        const sheetsTheadCommentModel = injector.get(SheetsThreadCommentModel);
        const unitId = this._workbook.getUnitId();
        const sheetId = this._worksheet.getSheetId();
        const comments: FThreadComment[] = [];
        Range.foreach(this._range, (row, col) => {
            const commentId = sheetsTheadCommentModel.getByLocation(unitId, sheetId, row, col);
            if (commentId) {
                const comment = sheetsTheadCommentModel.getComment(unitId, sheetId, commentId);
                if (comment) {
                    comments.push(this._injector.createInstance(FThreadComment, comment));
                }
            }
        });

        return comments;
    }

    override addComment(content: IDocumentBody | FTheadCommentBuilder): Promise<boolean> {
        const injector = this._injector;
        const currentComment = this.getComment()?.getCommentData();
        const commentService = injector.get(ICommandService);
        const userService = injector.get(UserManagerService);
        const unitId = this._workbook.getUnitId();
        const sheetId = this._worksheet.getSheetId();
        const refStr = `${Tools.chatAtABC(this._range.startColumn)}${this._range.startRow + 1}`;
        const currentUser = userService.getCurrentUser();
        const commentData: Partial<IThreadComment> = content instanceof FTheadCommentBuilder ? content.build() : { text: content };

        return commentService.executeCommand(AddCommentCommand.id, {
            unitId,
            subUnitId: sheetId,
            comment: {
                text: commentData.text,
                dT: commentData.dT || getDT(),
                attachments: [],
                id: commentData.id || generateRandomId(),
                ref: refStr,
                personId: commentData.personId || currentUser.userID,
                parentId: currentComment?.id,
                unitId,
                subUnitId: sheetId,
                threadId: currentComment?.threadId || generateRandomId(),
            },
        });
    }

    override clearComment(): Promise<boolean> {
        const injector = this._injector;
        const currentComment = this.getComment()?.getCommentData();
        const commentService = injector.get(ICommandService);
        const unitId = this._workbook.getUnitId();
        const sheetId = this._worksheet.getSheetId();

        if (currentComment) {
            return commentService.executeCommand(DeleteCommentTreeCommand.id, {
                unitId,
                subUnitId: sheetId,
                threadId: currentComment.threadId,
                commentId: currentComment.id,
            });
        }

        return Promise.resolve(true);
    }

    override clearComments(): Promise<boolean> {
        const comments = this.getComments();
        const promises = comments.map((comment) => comment.deleteAsync());

        return Promise.all(promises).then(() => true);
    }
}

FRange.extend(FRangeCommentMixin);
declare module '@univerjs/sheets/facade' {
    // eslint-disable-next-line ts/naming-convention
    interface FRange extends IFRangeCommentMixin {}
}
