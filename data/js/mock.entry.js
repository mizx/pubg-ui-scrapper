
// Entry 에 대한 mock API.
// 브라우저에서 테스트를 위해서 사용한다.
// 세번째 인자로 true가 들어가면 function call이라는 의미고, 아니면 trigger이다.
(function() {
	function console_log() {
		console.log('%c[EGN] '+ arguments[0], 'color: #088;', Array.prototype.slice.call(arguments, 1));
	}
	engine.mock('GetLobbyUrl', function () {
		return "http://localhost:23847";
	}, true);

	engine.mock('GetLayoutMode', function () {
		return "NoSystemMenu";
	}, true);

	engine.mock('GetClientAuthData', function () {

		var getUriParameterByName = function (name, url) {
			if (!url) {
				url = window.location.href;
			}
			name = name.replace(/[\[\]]/g, "\\$&");
			var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
				results = regex.exec(url);
			if (!results) return null;
			if (!results[2]) return '';
			return decodeURIComponent(results[2].replace(/\+/g, " "));
		}

		var rst = {
			platformType:"None",
			userSerial: "76561198031450358",
			//+ Math.floor((Math.random() * 100) + 1),
		};

		var appid = getUriParameterByName("appid");
		if (appid != null)
		{
			rst.appId = appid;
			rst.accessToken = getUriParameterByName("token");
		}
		else
		{
			rst.app = "bro";
			var id = getUriParameterByName("id");
			if (id)
				rst.id = id;
		}
		rst.playerNetId = getUriParameterByName("netid") || rst.id || "NetId_" + Math.floor(Math.random() * 1000000);

		console_log(rst);
		
		return rst;

	}, true);

	engine.mock('GetDisplayResoultions', function () {
		return [
			{ X: 1024, Y: 768 },
			{ X: 1280, Y: 1024},
			{ X: 1920, Y: 1024 },
		];
	}, true);

	engine.mock('GetCurrentOptions', function () {
		return {
			resolution: '1280x1024',
			//resolution: '1280x124',
			quality: 'Low',
			fullscreen: 'true',
			gamma: '20',
			aim: '20',
			invertY:'false',
		};
	}, true);

	engine.mock('GetMapNames', function () {
		return ['Sanctuary', 'Highrise'];
	}, true);

	engine.mock('GetJoinMapNames', function () {
		return ['Any', 'Sanctuary', 'Highrise'];
	}, true);

	engine.mock('GetSearchServerResult', function () {
		return {
			bFinish: true,
			statusText: "Status message",
			entryList: [
				{
					serverName: 'Server1',
					currentPlayers: 5,
					maxPlayers: 12,
					gameType: 'FFA',
					mapName: 'TestMap',
					ping: 201,
					searchResultsIndex: 0,
				},
				{
					serverName: 'Server2',
					currentPlayers: 15,
					maxPlayers: 22,
					gameType: 'FFA',
					mapName: 'TestMap2',
					ping: 101,
					searchResultsIndex: 1,
				},
			],
		};
	}, true);

	engine.mock('IsXYRunning', function() {
		return false;
	}, true);

	engine.mock('CheckXYInstalledAndExecute', function(r, args) {
		console_log('checkxy');
		return false;
	}, true);

	engine.mock('GetGameVersion', function () {
		return "1.2.3"
	}, true);

	engine.mock('OpenExternalBrowser', function(u) {
		window.open(u);
		console_log('Engine', u);
	}, true);
	///////////////////////////////////////////////////////////////////////////////
	// 여기서 부터 이벤트.
	engine.mock('Quit', function () {
		console_log('engine received Quit!!!!');
	});

	engine.mock('UpdateOptions', function (options) {
		console_log('engine received options');
		console_log(options);
	});

	engine.mock('StartHost', function (options) {
		console_log('engine received StartHost');
		console_log(options);
	});

	engine.mock('StartSearchJoin', function (options) {
		console_log('engine received StartSearchJoin');
		console_log(options);

		window.setTimeout(function () { engine.trigger('BeginServerSearch'); }, 1000);
	});

	engine.mock('JoinToServer', function (serverIndex) {
		console_log('engine received JoinToServer');
		console_log(serverIndex);
	});

	engine.mock('JoinToDedicatedServer', function (serverAddress) {
		console_log('engine received JoinToDedicatedServer:' + serverAddress);
	});

	engine.mock('InputFocusChange', function (isFocusIn) {
		console_log('engine received InputFocusChange:' + isFocusIn);
	});

	// functions for debugging skin in browser {{{
	var debugSkin = true;
	var slots = [];
	var update = 0;
	function resizeSlot(newSize) {
		if (newSize > slots.length) {
			while(newSize > slots.length)
				slots.push(null);
		}
	}
	function updateDebugView(slots) {
		var visible = false;
		for (var i=0; i<slots.length; ++i) {
			if (slots[i]) {
				visible = true;
			}
		}
		var txt = 'updates: ' + update + '<br/>\n';
		for (var i=0; i<slots.length; ++i) {
			if (slots[i]) {
				var s = slots[i];
				var o = slots[i].o;
				txt += '[' + i + ']:' + s.g;
				if (o) {
					txt += ':' + (o.Gender ? 'M':'F');
					var so = o.StringOptions;
					for (var j=0; j<so.length; ++j) {
						txt += ':' + so[j].Second;
					}
					if (o.ItemIds) {
						txt += '<br/>';
						for(var k=0; k<o.ItemIds.length; ++k) {
							var id = o.ItemIds[k];
							var re = /Item_(\w+)/;
							var rst = re.exec(id);
							if (rst == null) {
								txt += ':...' + o.ItemIds[k].substr(-20);
							} else {
								txt += ':' + rst[1];
							}
						}
					}
				}
				txt += '<br/>\n';
			}
		}
		var elem = document.getElementById('charDbg');
		if (elem) {
			if (visible) {
				elem.innerHTML = txt;
			} else {
				elem.innerHTML = '';
			}
		}
	}
	// functions for debugging skin in browser }}}

	engine.mock('CreateLobbyCharacter', function (slotIndex, isGenderMale, netId, nickName) {
		if (debugSkin) {
			update++;
			resizeSlot(slotIndex + 1);
			slots[slotIndex] = { g: isGenderMale == true ? 'M' : 'F', o: null };
		}
		console_log('engine received CreateLobbyCharacter:' + slotIndex + ", isGenderMale:" + isGenderMale + ", netId:" + netId + ", nickName:" + nickName);
		updateDebugView(slots);
	});

	engine.mock('UpdateLobbyCharacter', function (slotIndex, options) {
		if (debugSkin) {
			update++;
			slots[slotIndex].o = options;
			console_log('engine received UpdateLobbyCharacter:' + slotIndex, options);
		}
		updateDebugView(slots);
	});

	engine.mock('DestoryLobbyCharacter', function (slotIndex) {
		if (debugSkin) {
			update++;
			slots[slotIndex] = null;
			console_log('engine received DestoryLobbyCharacter:' + slotIndex);
		}
		updateDebugView(slots);
	});

	engine.mock('SetLobbyCamera', function (pos) {
		console_log('engine received SetLobbyCamera:', pos);
	});

	engine.mock('ShowWebPageOnPlatform', function (url) {
		window.open(url, '_blank');
	});

	engine.mock('ShowWebPopup', function (popup) {
		window.open(popup.uri, popup.popupId);
	});

	engine.mock('ReadFriendList', function () {
		console_log('engine received ReadFriendList');
		engine.trigger('ReadFriendListResult', 1, null, [
		{
			"userSerial": "76561198031450358",
			"userRealName": "absenty",
			"userDisplayName": "애브센티",
			"presence": {
				"isOnline": true,
				"isPlaying": true,
				"isPlayingThisGame": true,
				"isJoinable": false,
				"status": 0
			}
		},
		{
			"userSerial": "7656119797034868",
			"userRealName": "chkim",
			"userDisplayName": "김창한",
			"presence": {
				"isOnline": true,
				"isPlaying": true,
				"isPlayingThisGame": true,
				"isJoinable": false,
				"status": 0
			}
		},
		{
			"userSerial": "76561197997248906",
			"userRealName": "jajanga",
			"userDisplayName": "jajanga",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198033493817",
			"userRealName": "jajanga1",
			"userDisplayName": "jajanga1",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198031538317",
			"userRealName": "jajanga2",
			"userDisplayName": "jajanga2",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198039366053",
			"userRealName": "jajanga3",
			"userDisplayName": "jajanga3",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198096994119",
			"userRealName": "jajanga4",
			"userDisplayName": "jajanga4",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198008236749",
			"userRealName": "jajanga5",
			"userDisplayName": "jajanga5",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		},
		{
			"userSerial": "76561198061663619",
			"userRealName": "jajanga6",
			"userDisplayName": "jajanga6",
			"presence": {
				"isOnline": false,
				"isPlaying": false,
				"isPlayingThisGame": false,
				"isJoinable": false,
				"status": 1
			}
		}
		]);
	});


//engine.mock('GetCustomizableObjectIdForItem', function (slotIndex, itemId) {
//    console_log('engine received GetCustomizableObjectIdForItem:' + slotIndex + ", itemId:" + itemId);

//    return {
//        CustomizableObjectKey: "Torso",
//        CustomizableObjectValue: "F_Body_C_01"
//    };
//});
})();
