const request = require("sync-request");
const path = require('path');
const cfg = JSON.parse(NIL.IO.readFrom(path.join(__dirname, 'config.json')));
const cmd = cfg.cmd;
const motd_api = cfg.motd_api;

function getText(e) {
    var rt = '';
    for (i in e.message) {
        switch (e.message[i].type) {
            case "text":
                rt += e.message[i].text;
                break;
        }
    }
    return rt;
}

function motd(u){
	let obj = request('GET',u);
        if(obj.statusCode == 200){
            let data = JSON.parse(obj.getBody('utf8'));
            if(data.status == 'online'){
                return [
                    `[MCBE服务器信息]\n\n`,
                    `协议版本：${data.agreement}\n`,
                    `游戏版本：${data.version}\n`,
					`游戏模式：${data.gamemode}\n`,
                    `描述文本：${data.motd}\n`,
                    `在线人数：${data.online}/${data.max}\n`,
                    `网络延迟：${data.delay}ms`,
					`API 由 api.iqia.fun 提供`
                ]
            }else{
                return '服务器离线';
            }
        }else{
            return 'api连接失败，经检查api是否可以访问';
        }
}

class Motdpe extends NIL.ModuleBase{
    onStart(api){
        api.listen('onMainMessageReceived',(e)=>{
            let text = getText(e);
            let pt = text.split(' ');
            if(pt[0]==cmd){
                switch(pt.length){
                    case 2:
                        var u_api = `${motd_api}ip=${pt[1]}&port=19132`;
                        break;
                    case 3:
                        var u_api = `${motd_api}ip=${pt[1]}&port=${pt[2]}`;
                        break;
                }
                let str = motd(u_api);
                e.reply(str);
            }
        });
    }
    onStop(){}    
}

module.exports = new Motdpe;