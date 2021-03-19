"use strict";(function(){var r;let o=self.MonacoEnvironment,s=o&&o.baseUrl?o.baseUrl:"../../../../../";const t=(r=self.trustedTypes)===null||r===void 0?void 0:r.createPolicy("amdLoader",{createScriptURL:e=>e});if(typeof self.define!="function"||!self.define.amd){let e=s+"vs/loader.js";t&&(e=t.createScriptURL(e)),importScripts(e)}require.config({baseUrl:s,catchError:!0,trustedTypesPolicy:t}),require(["vs/workbench/services/extensions/worker/extensionHostWorker"],()=>{},e=>console.error(e))})();

//# sourceMappingURL=extensionHostWorkerMain.js.map
