try{window.parent._dv_win['dvCallback_1412503155009143']($dv,window,'34c64216600946b5b1f77f4f0aa483c4','tps10209.doubleverify.com');}catch(e){try{var image=window.document.createElement('img');image.src=window.location.protocol+'//tps30.doubleverify.com/visit.jpg?ctx=818052&cmp=1619415&dvtagver=6.1.src&dvp_cbError='+encodeURIComponent(e.message)}catch(e){}}$dv.pubSub.subscribe ('ImpressionServed', $uid, 'SendAdEntitiesForMA', function() {var tag = $dv.tags[$uid];var targetWin = tag.t2tIframeWindow;if(!targetWin){var t2tIframeId = tag.t2tIframeId;if(t2tIframeId){var iFrame = window.parent.getElementById(t2tIframeId);if(iFrame){targetWin = iFrame.contentWindow;}}}if(targetWin){var dateNow = 0;if(Date.now){dateNow = Date.now();} else {dateNow = +new Date();}var message = {action : 'notifyMultipleAdsAdEntityInformationReady',adEntityInformation : {comparisonItems : [{name : 'cmp', value : 2397396, bitFlag : 1, maxTimeMS : 5000, eventToFire : 'CampaignMultipleAd'},{name : 'clcd', value : 2397394, bitFlag : 2, maxTimeMS : 5000},{name : 'plmt', value : 2398506, bitFlag : 4, maxTimeMS : 5000},{name : 'mp', value : 5, bitFlag : 8, maxTimeMS : 5000},{name : 'adv', value : 2397395, bitFlag : 16, maxTimeMS : 5000, eventToFire : 'LobMultipleAd'},{name : 'cmpMP', value : 719218835, bitFlag : 32, maxTimeMS : 5000}],dvTagCreatedTS : tag.t2tIframeCreationTime,visitJSPostMessageTS : dateNow}};var stringifyFunc = null;if(window.JSON){stringifyFunc = window.JSON.stringify;} else {if(window.parent && window.parent.JSON){stringifyFunc = window.parent.JSON.stringify;}}if(!stringifyFunc){return;}var msgString = stringifyFunc(message);targetWin.postMessage(msgString, '*');setTimeout(function(){targetWin.postMessage(msgString, '*');}, 100);setTimeout(function(){targetWin.postMessage(msgString, '*');}, 500);}});    	$dv.pubSub.subscribe ('ImpressionServed', $uid, 'SendAdEntitiesForBSBAConsolidation', function() {
            'use strict';
            var stringifyFunc = null;
			if(window.JSON){
				stringifyFunc = window.JSON.stringify;
			} else {
				if(window.parent && window.parent.JSON){
					stringifyFunc = window.parent.JSON.stringify;
				}
			}
			if(!stringifyFunc){
				return;
			}
            var targetWin;
            var tag = $dv.tags[$uid];
            var bsmsg = {
                action : 'notifyBrandShieldAdEntityInformation',
                bsAdEntityInformation : {
                    comparisonItems : [{name : 'cmp', value : 2397396},{name : 'plmt', value : 2398506}], verboseReporting : false  }
            };
            var bsstring = stringifyFunc(bsmsg);

            var findAndSend = function(){
                if(!targetWin) {
                    if (tag) {
                        targetWin = tag.t2tIframeWindow;
                        if (!targetWin) {
                            var t2tIframeId = tag.t2tIframeId;
                            //get t2t window and post the AdEntities to it.
                            if (t2tIframeId) {
                                var iFrame = window.parent.getElementById(t2tIframeId);
                                if (iFrame) {
                                    targetWin = iFrame.contentWindow;
                                }
                            }
                        }
                    }
                }

                if(targetWin){
                    targetWin.postMessage(bsstring, '*');
                }
            };

            findAndSend();
            setTimeout(findAndSend, 100);
            setTimeout(findAndSend, 500);
        });$dv.pubSub.subscribe('ImpressionServed', $uid, 'RTN_LatencyTemp', function () {try {var beforeVisitCall = '';var templateStartTime = parent.getCurrentTime();var dv_win = parent.window._dv_win;if (dv_win && dv_win.t2tTimestampData) {if (dv_win.t2tTimestampData.length >= 2) {beforeVisitCall = dv_win.t2tTimestampData[1].beforeVisitCall;}}var latency = 0;if (beforeVisitCall != '' && templateStartTime != '') {latency = templateStartTime - beforeVisitCall;}if(latency > 1000 && latency < 90000) {$dv.registerEventCall($uid, { dvp_ltncy: latency });}} catch (e) {};});var impId = '34c64216600946b5b1f77f4f0aa483c4';var dvObj = $dv;var isTpImp = dvObj == window.$dv;var rtnName = isTpImp ? 'ImpressionServed' : 'BeforeDecisionRender';var eventStr = isTpImp ? 'event' : 'bsevent'; var contextWin = isTpImp ? parent : window;dvObj.pubSub.subscribe(rtnName, impId, 'AADID_RTN', function () {try {function dvsg(){function w(c){function d(c){for(var b='',d,e=7;0<=e;e--)d=c>>>4*e&15,b+=d.toString(16);return b}if(null==c||''==c)return'';for(var g=[1518500249,1859775393,2400959708,3395469782],c=c+String.fromCharCode(128),l=Math.ceil((c.length/4+2)/16),m=Array(l),e=0;e<l;e++){m[e]=Array(16);for(var f=0;16>f;f++)m[e][f]=c.charCodeAt(64*e+4*f)<<24|c.charCodeAt(64*e+4*f+1)<<16|c.charCodeAt(64*e+4*f+2)<<8|c.charCodeAt(64*e+4*f+3)}m[l-1][14]=8*(c.length-1)/Math.pow(2,32);m[l-1][14]=Math.floor(m[l-1][14]);m[l-1][15]=8*(c.length-1)&4294967295;for(var c=1732584193,f=4023233417,p=2562383102,q=271733878,r=3285377520,h=Array(80),n,i,j,k,s,e=0;e<l;e++){for(var b=0;16>b;b++)h[b]=m[e][b];for(b=16;80>b;b++)h[b]=(h[b-3]^h[b-8]^h[b-14]^h[b-16])<<1|(h[b-3]^h[b-8]^h[b-14]^h[b-16])>>>31;n=c;i=f;j=p;k=q;s=r;for(b=0;80>b;b++){var t=Math.floor(b/20),o;a:{switch(t){case 0:o=i&j^~i&k;break a;case 1:o=i^j^k;break a;case 2:o=i&j^i&k^j&k;break a;case 3:o=i^j^k;break a}o=void 0}t=(n<<5|n>>>27)+o+s+g[t]+h[b]&4294967295;s=k;k=j;j=i<<30|i>>>2;i=n;n=t}c=c+n&4294967295;f=f+i&4294967295;p=p+j&4294967295;q=q+k&4294967295;r=r+s&4294967295}return d(c)+d(f)+d(p)+d(q)+d(r)}function x(){var c=contextWin.document.createElement('canvas');if(c.getContext&&c.getContext('2d')){var d=c.getContext('2d');d.textBaseline='top';d.font='14px \'Arial\'';d.textBaseline='alphabetic';d.fillStyle='#f60';d.fillRect(0,0,62,20);d.fillStyle='#069';d.fillText('!image!',2,15);d.fillStyle='rgba(102, 204, 0, 0.7)';d.fillText('!image!',4,17);return c.toDataURL()}return null}try{var g=[];g.push(['tz',(new Date).getTimezoneOffset()]);var u;try{u=!!window.sessionStorage}catch(y){u=!0}g.push(['hss',u?'1':'0']);var v;try{v=!!window.localStorage}catch(z){v=!0}g.push(['hls',v?'1':'0']);g.push(['odb',typeof window.openDatabase||'']);g.push(['cpu',navigator.cpuClass||'']);g.push(['pf',navigator.platform||'']);g.push(['dnt',navigator.doNotTrack||'']);g.push(['canv',x()]);return w(g.join('=!!!='))}catch(A){return''}};var url = dvObj.tags[impId].protocol + '/' + '/' + (dvObj.tags[impId].ServerPublicDns || dvObj.tags[impId].serverPublicDns) + '/' + eventStr + '.gif?impid=' + impId + '&aadid=' + dvsg();dvObj.domUtilities.addImage(url, dvObj.tags[impId].tagElement.parentNode);} catch (e) {};});        $dv.pubSub.subscribe('ImpressionServed', $uid, 'ConsolidatedEventEvaluation', function () {					try{ var startTime = (new Date).getTime();						setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 100,dvp_eventUnload:-1});			}, 100);									setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 500,dvp_eventUnload:-1});			}, 500);									setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 1000,dvp_eventUnload:-1});			}, 1000);									setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 2000,dvp_eventUnload:-1});			}, 2000);									setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 5000,dvp_eventUnload:-1});			}, 5000);									setTimeout(function(){ 			$dv.registerEventCall($uid, {dvp_eventSent: 10000,dvp_eventUnload:-1});			}, 10000);								    var sendUnloadEventCall = function(){				var timeUnloaded = (new Date).getTime() - startTime;				$dv.registerEventCall($uid, {dvp_eventUnload: timeUnloaded});			};									if (window.addEventListener) {				window.addEventListener('unload', function () { sendUnloadEventCall(); }, false);				window.addEventListener('beforeunload', function () { sendUnloadEventCall(); }, false);			}			else if (window.attachEvent) {				window.attachEvent('onunload', function () { sendUnloadEventCall(); }, false);				window.attachEvent('onbeforeunload', function () { sendUnloadEventCall(); }, false);			}			else {				window.document.body.onunload = function () { sendUnloadEventCall(); };				window.document.body.onbeforeunload = function () {  sendUnloadEventCall(); };			} }catch(ex){} });try{$dv.pubSub.publish('ImpressionServed', $uid);}catch(e){}