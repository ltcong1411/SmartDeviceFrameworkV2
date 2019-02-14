/**
 * Copyright © 2016-2019 The Thingsboard Authors
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
package org.thingsboard.server.common.msg.system;

import lombok.Data;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.msg.MsgType;
import org.thingsboard.server.common.msg.TbActorMsg;
import org.thingsboard.server.common.msg.TbMsg;

import java.io.Serializable;

/**
 * Created by ashvayka on 15.03.18.
 */
@Data
public final class ServiceToRuleEngineMsg implements TbActorMsg, Serializable {

    private final TenantId tenantId;
    private final TbMsg tbMsg;

    @Override
    public MsgType getMsgType() {
        return MsgType.SERVICE_TO_RULE_ENGINE_MSG;
    }
}
