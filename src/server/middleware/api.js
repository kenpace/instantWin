import express from 'express';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export default function(app) {
  const router = express.Router();
  const proxy = httpProxy.createProxyServer();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: true}));

  router.use('/proxy', (req, res) => { 
  	proxy.web(req, res, {target:req.query.url});
  });
  router.use('/send', (req, res, next) => {
  	console.log(req.body);
  	var transporter = nodemailer.createTransport(smtpTransport({
      host: 'mailhost.valpak.com'
    }));
    var jobs = (req.body);
    var selectedJobs = jobs.jobs.filter(function(job) {
      return job.INSTANT_WIN == 'X';
    }).
    map(function(job) {
      return job.JOB_NBR;
    });
  	var mailOptions = {
  		from: 'requestor@coxtarget.com', // sender email address
  		to: 'ken_pace@valpak.com,jim_gaines@valpak.com', // list of receivers
  		subject: 'Instant Win Registration', // subject line  		
  		html: '<p>The following job(s) were selected for Instant Win...</p><ul><li>Jobs: ' + JSON.stringify(selectedJobs) + '</li></ul>'
  	};

  	transporter.sendMail(mailOptions, function(error, info){
  		if(error){
  			console.log(error);
  			res.sendStatus(500);
  		} else {
  			console.log('Message Sent: ' + info.response);
  			res.sendStatus(200);        
  		}
  	});
  })
  return router;
}
