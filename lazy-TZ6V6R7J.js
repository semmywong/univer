import {
  UniverSheetsThreadCommentUIPlugin
} from "./chunk-Y5U4AWHK.js";
import {
  UniverSheetsNoteUIPlugin,
  UniverSheetsTableUIPlugin
} from "./chunk-3U4FOGDT.js";
import {
  UniverDocsMentionUIPlugin
} from "./chunk-XOYRTQEV.js";
import {
  UniverThreadCommentUIPlugin
} from "./chunk-D3GLWU6W.js";
import "./chunk-XI3C3F5Q.js";
import "./chunk-IUACCRKN.js";
import "./chunk-RFXGFDX7.js";
import "./chunk-L5ASSDDU.js";
import {
  UniverSheetsDrawingUIPlugin
} from "./chunk-YLBIX6C6.js";
import {
  UniverSheetsConditionalFormattingUIPlugin,
  UniverSheetsDataValidationUIPlugin,
  UniverSheetsFilterUIPlugin
} from "./chunk-IBH5ZSEJ.js";
import "./chunk-GNLECX4R.js";
import "./chunk-QNLVDCTT.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "./chunk-KSXDIHYA.js";
import {
  UniverSheetsFormulaUIPlugin
} from "./chunk-EELX3IHN.js";
import "./chunk-AOWMEGJQ.js";
import "./chunk-4WFKK57W.js";
import "./chunk-JOLJB4PF.js";
import "./chunk-PMQ6VONS.js";
import "./chunk-6TFPYHPE.js";
import "./chunk-LRJMVVNG.js";
import "./chunk-YQ2EA2FS.js";
import "./chunk-QIKL6BZO.js";
import "./chunk-EQ2B2W73.js";
import "./chunk-DO7PIA5W.js";

// src/sheets/lazy.ts
function getLazyPlugins() {
  return [
    [UniverDocsMentionUIPlugin],
    [UniverSheetsNumfmtUIPlugin],
    [UniverThreadCommentUIPlugin],
    [UniverSheetsThreadCommentUIPlugin],
    [UniverSheetsNoteUIPlugin],
    [UniverSheetsTableUIPlugin],
    [UniverSheetsFormulaUIPlugin],
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
