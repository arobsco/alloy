/*
Copyright 2019 Adobe. All rights reserved.
This file is licensed to you under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License. You may obtain a copy
of the License at http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
OF ANY KIND, either express or implied. See the License for the specific language
governing permissions and limitations under the License.
*/

import createRequest from "./createRequest";

const createTracker = ({ config }) => {
  let lifecycle;

  const makeServerCall = (endpoint, beforeHook, afterHook) => ({ data }) => {
    const request = createRequest(config);
    return request.send(data, endpoint, beforeHook, afterHook);
  };

  const makeHookCall = hook => (...args) => lifecycle[hook](...args);

  return {
    lifecycle: {
      onComponentsRegistered(tools) {
        ({ lifecycle } = tools);
      }
    },
    commands: {
      interact: makeServerCall(
        "interact",
        makeHookCall("onBeforeViewStart"),
        makeHookCall("onViewStartResponse")
      ),
      collect: makeServerCall(
        "collect",
        makeHookCall("onBeforeEvent"),
        makeHookCall("onEventResponse")
      )
    }
  };
};

createTracker.namespace = "DataCollector";

export default createTracker;
