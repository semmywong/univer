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
import "./chunk-EELX3IHN.js";
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

// src/sheets-multi-units/lazy.ts
function getLazyPlugins() {
  return [
    [UniverSheetsDataValidationUIPlugin],
    [UniverSheetsConditionalFormattingUIPlugin],
    [UniverSheetsFilterUIPlugin, { useRemoteFilterValuesGenerator: false }],
    [UniverSheetsDrawingUIPlugin]
  ];
}
export {
  getLazyPlugins as default
};
