waitForTag(convInfoInit);

function convInfoInit () {
    lpTag.external = lpTag.external || {};
    lpTag.external.convInfo = {
        getData: function () {
            let engagementEvents = lpTag.events.hasFired('LE_ENGAGER', '*')
              , convEvents = lpTag.events.hasFired('lpUnifiedWindow', 'conversationInfo')
              , windowStateEvents = lpTag.events.hasFired('lpUnifiedWindow', 'state')
              , renderEvents = lpTag.events.hasFired('RENDERER_STUB','AFTER_CREATE_ENGAGEMENT_INSTANCE')
              , engagementClicks = lpTag.events.hasFired('LP_OFFERS','OFFER_CLICK')
              , lpVidCookie = document.cookie.split('; ').find(row => row.startsWith('LPVID'))
              , lpVid = lpVidCookie ? lpVidCookie.split('=')[1] : undefined
              , lpSidCookie = document.cookie.split('; ').find(row => row.startsWith(`LPSID-${lpTag.site}`))
              , lpSid = lpSidCookie ? lpSidCookie.split('=')[1] : undefined

            let clickedEngagement = this._getLatest(engagementClicks) || {};
            let skillId = this._getLatest(convEvents, 'skill');
            let windowState = this._getLatest(windowStateEvents) || {};
            let engagementConf = this._findRenderEventConf(renderEvents, clickedEngagement.engagementId) || {};

            let data = {
                siteId: lpTag.site,
                sections: lpTag.section,
                campaignId: clickedEngagement.campaignId || this._getLatest(engagementEvents, 'campaignId'),
                engagementName: clickedEngagement.engagementName || engagementConf.name,
                engagementId: clickedEngagement.engagementId || this._getLatest(engagementEvents, 'engagementId'),
                window: clickedEngagement.windowId || this._getLatest(engagementEvents, 'windowId'),
                windowState: windowState.state,
                agentName: this._getLatest(convEvents, 'agentName'),
                agentId: this._getLatest(convEvents, 'agentId'),
                convId: this._getLatest(convEvents, 'conversationId'),
                skill: engagementConf.skillName || skillId,
                lpVid,
                lpSid,
                visitorId: this._getLatest(convEvents, 'visitorId')
            };

            return data;

        },
        showData: function (opts) {
            if (opts && opts.data && opts.data.line && opts.data.line.text === '/convinfo') {

                let data = lpTag.external.convInfo.getData()

                let div = document.createElement('div');
                div.id = 'lp_line_convinfo';
                div.innerText = JSON.stringify(data, null, '\t');
                document.getElementsByClassName('lpc_transcript')[0].appendChild(div);

                opts.data.line.text = '';
                let scrollable = document.getElementsByClassName('lp_location_center')[0];
                scrollable.scrollTop = scrollable.scrollHeight

                return data
            }
        },
        _getLatest: function (array, datum) {
            let event = array.reverse().find(item => {
                return item.data && datum ? item.data[datum] : true
            });
            if (event && event.data) return datum ? event.data[datum] : event.data;
            else return undefined;
        },
        _findRenderEventConf: function (renderEvents, engagementId) {
            let event = renderEvents.find(ev => {
                return ev && ev.data && ev.data.conf && (ev.data.conf.id === engagementId)
            });
            return event && event.data && event.data.conf
        }
    }

    lpTag.hooks.push({
        name: 'BEFORE_SEND_VISITOR_LINE',
        callback: lpTag.external.convInfo.showData
    })
}