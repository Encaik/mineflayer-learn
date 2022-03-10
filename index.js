const mineflayer = require('mineflayer');
const { autoVersionForge } = require('minecraft-protocol-forge');
const mineflayerViewer = require('prismarine-viewer').mineflayer;
const { pathfinder, Movements, goals: { GoalBlock } } = require('mineflayer-pathfinder');

let bot;

async function moveToPos(x, y, z) {
  try {
    console.log('开始寻路');
    await bot.pathfinder.goto(new GoalBlock(x, y, z));
    console.log('到达');
  } catch (error) {
    console.log(error);
  }
}

function startServe() {
  bot = mineflayer.createBot({
    host: '172.23.91.6',
    username: '[bot]救我一命',
  });
  autoVersionForge(bot._client);
  bot.loadPlugin(pathfinder);
  const mcData = require('minecraft-data')(bot.version);
  const defaultMove = new Movements(bot, mcData);

  bot.once('login', () => {
    console.log('登陆成功');
  });

  bot.once('spawn', () => {
    console.log('出生');
    mineflayerViewer(bot, { port: 3000, firstPerson: false });
    // eslint-disable-next-line global-require
    // const mcData = require('minecraft-data')(bot.version);
    // const defaultMove = new Movements(bot, mcData);
    // bot.pathfinder.setMovements(defaultMove);
    // moveToPos(bot, 113, 64, -520);
  });

  bot.once('chat', ({ message }) => {
    console.log(message);
    if (message === '回家') {
      // eslint-disable-next-line global-require

      bot.pathfinder.setMovements(defaultMove);
      moveToPos(bot, 113, 64, -520);
    }
  });

  bot.once('health', () => {
    console.log(bot.health);
  });

  bot.once('move', () => {
    console.log(bot.entity.position);
  });

  bot.once('entityHurt', () => {
    bot.chat('保护我');
    console.log('保护我');
  });
}

startServe();
