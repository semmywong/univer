import {
  UniverSheetsFilterPlugin
} from "../chunk-QNLVDCTT.js";
import {
  zh_CN_default
} from "../chunk-P7FR5DXV.js";
import {
  UniverRemoteSheetsFormulaPlugin
} from "../chunk-6TFPYHPE.js";
import {
  UniverFormulaEnginePlugin,
  UniverRPCWorkerThreadPlugin,
  UniverSheetsPlugin
} from "../chunk-LRJMVVNG.js";
import "../chunk-YQ2EA2FS.js";
import {
  Univer
} from "../chunk-QIKL6BZO.js";
import "../chunk-EQ2B2W73.js";
import "../chunk-DO7PIA5W.js";

// src/sheets/worker.ts
var univer = new Univer({
  locale: "zhCN" /* ZH_CN */,
  logLevel: 4 /* VERBOSE */,
  locales: {
    ["zhCN" /* ZH_CN */]: zh_CN_default
  }
});
univer.registerPlugins([
  [UniverSheetsPlugin, { onlyRegisterFormulaRelatedMutations: true }],
  [UniverFormulaEnginePlugin],
  [UniverRPCWorkerThreadPlugin],
  [UniverRemoteSheetsFormulaPlugin],
  [UniverSheetsFilterPlugin]
]);
self.univer = univer;
