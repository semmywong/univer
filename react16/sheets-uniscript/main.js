import {
  UniverUniscriptPlugin
} from "../chunk-FWKPL3UB.js";
import "../chunk-GMDX6E2J.js";
import "../chunk-A3DRKKMY.js";
import "../chunk-WLDOIN2T.js";
import {
  UniverDebuggerPlugin
} from "../chunk-ZXTLQD3D.js";
import "../chunk-3YXIJJFN.js";
import "../chunk-YLBIX6C6.js";
import "../chunk-NDFRXY75.js";
import {
  UniverSheetsNumfmtUIPlugin
} from "../chunk-KSXDIHYA.js";
import {
  UniverSheetsNumfmtPlugin
} from "../chunk-AOWMEGJQ.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-4WFKK57W.js";
import {
  UNISCRIT_WORKBOOK_DATA_DEMO
} from "../chunk-ZRNNT5XD.js";
import {
  UniverDocsPlugin,
  UniverDocsUIPlugin
} from "../chunk-JOLJB4PF.js";
import "../chunk-LI6UXASZ.js";
import {
  UniverUIPlugin
} from "../chunk-PMQ6VONS.js";
import {
  zh_CN_default
} from "../chunk-P7FR5DXV.js";
import {
  UniverSheetsFormulaPlugin
} from "../chunk-6TFPYHPE.js";
import {
  UniverFormulaEnginePlugin,
  UniverSheetsPlugin
} from "../chunk-LRJMVVNG.js";
import {
  UniverRenderEnginePlugin
} from "../chunk-YQ2EA2FS.js";
import {
  Univer
} from "../chunk-QIKL6BZO.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-DO7PIA5W.js";

// src/sheets-uniscript/main.ts
var IS_E2E = false;
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app",
  ribbonType: "classic"
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverSheetsNumfmtPlugin);
univer.registerPlugin(UniverSheetsNumfmtUIPlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverSheetsFormulaPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(_, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
if (IS_E2E) {
  univer.registerPlugin(UniverDebuggerPlugin, {
    fab: false,
    performanceMonitor: {
      enabled: false
    }
  });
}
univer.createUnit(2 /* UNIVER_SHEET */, UNISCRIT_WORKBOOK_DATA_DEMO);
window.univer = univer;
