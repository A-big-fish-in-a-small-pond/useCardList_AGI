const agi = require("./eagi/eagi_server/index.js");
const fs = require("fs");
const logger = require("./logger.js");
const handler = (context) => {
    context.onEvent("variables").then(async (vars) => {
		let channel = vars.agi_channel
	   let cardNumber = vars.agi_extension.slice(0, 10)
		let phoneNumber = vars.agi_extension.slice(10, vars.agi_extension.length)
		let calledListPath = '/home/jongsun/prepay-script/calledList'

		logger.info(`------------------------------------------------------------------`)
		logger.info(`[${channel}] - user has in server. vars : ${JSON.stringify(vars)}`)
		logger.info(`[${channel}] - server start to detect sound`)
				
      await context.audioFork("read", 0, async (res) => {
          //console.log(res);
      });

		logger.info(`[${channel}] - server detected sound. and write phone number in calledList`)
		logger.info(`[${channel}] - cardNumber : ${cardNumber} phoneNumber : ${phoneNumber}`)
		logger.info(`[${channel}] - process success gracefully`)

      context.end();
    });
};

agi(handler).start(3600);
logger.info('eagi 서버가 실행되었습니다. portNumber - 3600')

const mysql      = require('mysql');
const connection = mysql.createConnection({
		    host     : 'localhost',
		    user     : 'root',
		    password : 'vkvkdltm',
		    database : 'JONG'
});

connection.connect((err) => {
    if(err) logger.error(err)
	 logger.info('mysql 이 성공적으로 등록되었습니다.');
});

const agi2 = require("ding-dong")
const handler2 = (context) => {
    context.onEvent("variables").then(async (vars) => {
      let channel = vars.agi_channel
	   let exten = await context.getVariable("CardNum");
      exten = exten.value
	
      let cardNumber = exten.slice(0, 10)
      let phoneNumber = exten.slice(10, exten.length)
 
      let duration = await context.getVariable("CDuration")
	   duration = duration.value
      
      logger.info(`------------------------------------------------------------------`)
      logger.info(`[${channel}] - user has in server. and hangup comming. vars : ${JSON.stringify(vars)}`)
      logger.info(`[${channel}] - duration : ${duration} cardNumber : ${cardNumber} , phoneNumber : ${phoneNumber} `)

      let cardSQL = `INSERT INTO CARDLIST (cardNumber) VALUES ('${cardNumber}')`;
	   let phoneSQL = `INSERT INTO CALLEDLIST (calledNumber) VALUES ('${phoneNumber}')`;

      if (Number(duration) <= 80) {
          // mysql 에 phoneNumber 만 등록 
          connection.query(phoneSQL, function (err, result) {
			     if (err) throw err;
			     logger.info(`[${channel}] - phone number : ${phoneNumber} 를 등록하는데 성공하였습니다.`)
			 });
      } else if(Number(duration) > 80) {
          // mysql 에 cardNumber 등록
          connection.query(cardSQL, function (err, result) {
              if (err) throw err;
              logger.info(`[${channel}] - card number : ${cardNumber} 를 등록하는데 성공하였습니다.`)

          });
          // mysql 에 phoneNumber 등록 
          connection.query(phoneSQL, function (err, result) {
              if (err) throw err;
                 logger.info(`[${channel}] - phone number : ${phoneNumber} 를 등록하는데 성공하였습니다.`)
          });
      }

      context.end();
    });
};

agi2(handler2).start(3601);
logger.info('agi 서버가 실행되었습니다. portNumber - 3601')
