import {
  UniverUniscriptPlugin
} from "../chunk-FWKPL3UB.js";
import "../chunk-GMDX6E2J.js";
import "../chunk-A3DRKKMY.js";
import "../chunk-WLDOIN2T.js";
import "../chunk-NDFRXY75.js";
import {
  UniverSheetsUIPlugin
} from "../chunk-4WFKK57W.js";
import {
  DEFAULT_DOCUMENT_DATA_CN
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
import "../chunk-6TFPYHPE.js";
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

// src/docs-uniscript/main.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  },
  logLevel: 4 /* VERBOSE */
});
univer.registerPlugin(UniverRenderEnginePlugin);
univer.registerPlugin(UniverFormulaEnginePlugin);
univer.registerPlugin(UniverUIPlugin, {
  container: "app",
  ribbonType: "classic",
  footer: false
});
univer.registerPlugin(UniverDocsPlugin);
univer.registerPlugin(UniverDocsUIPlugin);
univer.registerPlugin(UniverSheetsPlugin);
univer.registerPlugin(UniverSheetsUIPlugin);
univer.registerPlugin(UniverUniscriptPlugin, {
  getWorkerUrl(moduleID, label) {
    if (label === "typescript" || label === "javascript") {
      return "/vs/language/typescript/ts.worker.js";
    }
    return "/vs/editor/editor.worker.js";
  }
});
univer.createUnit(1 /* UNIVER_DOC */, DEFAULT_DOCUMENT_DATA_CN);
window.univer = univer;
