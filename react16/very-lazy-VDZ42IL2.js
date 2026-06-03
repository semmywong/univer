import {
  UniverActionRecorderPlugin
} from "./chunk-OODONFGJ.js";
import {
  UniverSheetsFindReplacePlugin
} from "./chunk-OYGJFSZ7.js";
import {
  UniverSheetsSortUIPlugin
} from "./chunk-HULPMK72.js";
import {
  UniverUniscriptPlugin
} from "./chunk-FWKPL3UB.js";
import "./chunk-GMDX6E2J.js";
import "./chunk-A3DRKKMY.js";
import "./chunk-WLDOIN2T.js";
import {
  UniverSheetsCrosshairHighlightPlugin
} from "./chunk-OJHA33IR.js";
import {
  UniverSheetsHyperLinkUIPlugin
} from "./chunk-S5SISZBG.js";
import "./chunk-RFXGFDX7.js";
import {
  UniverDebuggerPlugin
} from "./chunk-ZXTLQD3D.js";
import {
  UniverWatermarkPlugin
} from "./chunk-3YXIJJFN.js";
import "./chunk-YLBIX6C6.js";
import "./chunk-NDFRXY75.js";
import "./chunk-QNLVDCTT.js";
import "./chunk-EELX3IHN.js";
import "./chunk-4WFKK57W.js";
import "./chunk-ZRNNT5XD.js";
import "./chunk-JOLJB4PF.js";
import "./chunk-PMQ6VONS.js";
import "./chunk-6TFPYHPE.js";
import "./chunk-LRJMVVNG.js";
import "./chunk-YQ2EA2FS.js";
import "./chunk-QIKL6BZO.js";
import "./chunk-EQ2B2W73.js";
import "./chunk-DO7PIA5W.js";

// src/sheets/very-lazy.ts
var IS_E2E = false;
function getVeryLazyPlugins() {
  const plugins = [
    [UniverActionRecorderPlugin],
    [UniverSheetsHyperLinkUIPlugin],
    [UniverSheetsSortUIPlugin],
    [UniverSheetsCrosshairHighlightPlugin],
    [UniverSheetsFindReplacePlugin],
    [UniverWatermarkPlugin]
  ];
  if (!IS_E2E) {
    plugins.push([UniverDebuggerPlugin]);
    plugins.push([UniverUniscriptPlugin, {
      getWorkerUrl(_, label) {
        if (label === "json") {
          return "/vs/language/json/json.worker.js";
        }
        if (label === "css" || label === "scss" || label === "less") {
          return "/vs/language/css/css.worker.js";
        }
        if (label === "html" || label === "handlebars" || label === "razor") {
          return "/vs/language/html/html.worker.js";
        }
        if (label === "typescript" || label === "javascript") {
          return "/vs/language/typescript/ts.worker.js";
        }
        return "/vs/editor/editor.worker.js";
      }
    }]);
  }
  return plugins;
}
export {
  getVeryLazyPlugins as default
};
