const mineflayer = require('mineflayer');
const { autoVersionForge } = require('minecraft-protocol-forge');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const { pathfinder, Movements, goals: { GoalNear } } = require('mineflayer-pathfinder');
const request = require('request');

let bot;

async function moveToPos(x, y, z) {
  console.log('开始寻路');
  const res = await bot.pathfinder.goto(new GoalNear(x, y, z, 1));
  console.log(res);
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
    console.log('出生');
    mineflayerViewer(bot, { port: 3000, firstPerson: false });
    const mcData = require('minecraft-data')(bot.version);
    const defaultMove = new Movements(bot, mcData);
    bot.pathfinder.setMovements(defaultMove);
    request('https://v1.hitokoto.cn/?encode=json', {}, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        const obj = JSON.parse(body);
        bot.chat(`${obj.hitokoto}——${obj.from_who}`);
      }
    });
    // bot.setControlState('forward', true);
    // setTimeout(() => {
    //   bot.setControlState('forward', false);
    // }, 1000);
    gotoSleep();
  });

  bot.on('chat', ({ message }) => {
    console.log(message);
    if (message === '回家') {
      moveToPos(bot, 113, 64, -520);
    }
  });

  bot.on('health', () => {
    console.log(bot.health);
  });

  bot.on('move', () => {
    // const curPos = bot.entity.position;
    // const prePos = bot.entity.position.minus(bot.entity.velocity);
    // console.log(curPos, prePos);
    // if (curPos.x !== prePos.x || curPos.y !== prePos.y || curPos.z !== prePos.z) {
    //   console.log(bot.entity.position);
    // }
    console.log(bot.entity.position);
  });

  bot.on('entityHurt', () => {
    bot.chat('保护我');
    console.log('保护我');
  });

  bot.on('error', (err) => {
    console.log(err);
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
      case 0:
        bot.chat('日出');
        console.log('日出');
        break;
      case 6000:
        bot.chat('中午');
        console.log('中午');
        break;
      case 12000:
        bot.chat('日落');
        console.log('日落');
        break;
      case 18000:
        bot.chat('午夜');
        console.log('午夜');
        break;
      default: break;
    }
  });
}

startServe();
