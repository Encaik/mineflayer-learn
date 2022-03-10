const mineflayer = require('mineflayer');
const { autoVersionForge } = require('minecraft-protocol-forge');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const request = require('request');

let bot;

async function moveToPos(x, y, z) {
  await bot.pathfinder.goto(new GoalNear(x, y, z, 1));
}

function gotoSleep() {
  if (!bot.time.isDay) {
    const bed = bot.findBlock({
      matching: 26,
    });
    console.log(bed.position);
    moveToPos(bed.position).then(() => {
      bot.sleep(bed);
    });
  }
}

function startServe() {
  /* 初始化机器人 */
  bot = mineflayer.createBot({
    host: '172.23.91.6',
    username: '[bot]救我一命',
  });
  /* 自动添加Forge */
  autoVersionForge(bot._client);
  /* 机器人添加自动寻路插件 */
  bot.loadPlugin(pathfinder);

  bot.on('spawn', () => {
    mineflayerViewer(bot, { port: 3000, firstPerson: false });
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    // request('https://v1.hitokoto.cn/?encode=json', {}, (error, response, body) => {
    //   if (!error && response.statusCode === 200) {
    //     const obj = JSON.parse(body);
    //     let str = obj.hitokoto;
    //     if (obj.from_who || obj.from) {
    //       str = `${str}——`;
    //       if (obj.from_who) {
    //         str = `${str}${obj.from_who}`;
    //       }
    //       if (obj.from) {
    //         str = `${str}《${obj.from}》`;
    //       }
    //     }
    //     bot.chat(str);
    //   }
    // });
    // bot.setControlState('forward', true);
    // setTimeout(() => {
    //   bot.setControlState('forward', true);
    // }, 500);
    // gotoSleep();
  });

  bot.on('chat', (username, message) => {
    console.log('消息：', username, message);
    if (message === '回家') {
      moveToPos(bot, 113, 64, -520);
    }
  });

  bot.on('health', () => {
    console.log('当前血量：', bot.health);
  });

  bot.on('move', () => {
    // const curPos = bot.entity.position;
    // const prePos = bot.entity.position.minus(bot.entity.velocity);
    // console.log(curPos, prePos);
    // if (curPos.x !== prePos.x || curPos.y !== prePos.y || curPos.z !== prePos.z) {
    //   console.log(bot.entity.position);
    // }
    // console.log('当前位置：', bot.entity.position);
  });

  bot.on('entityHurt', () => {
    bot.chat('&6附近有实体受伤，保护我！');
    console.log('附近有实体受伤，保护我！');
  });

  bot.on('sleep', () => {
    console.log('睡觉了');
  });

  bot.on('wake', () => {
    console.log('起来了');
  });

  bot.on('time', () => {
    const timestamp = bot.time.timeOfDay;
    switch (timestamp) {
      case 10:
        bot.chat('&4日出');
        console.log('日出');
        break;
      case 6010:
        bot.chat('&4中午');
        console.log('中午');
        break;
      case 12010:
        bot.chat('&4日落');
        console.log('日落');
        break;
      case 18010:
        bot.chat('&4午夜');
        console.log('午夜');
        break;
      default: break;
    }
  });
}

startServe();
