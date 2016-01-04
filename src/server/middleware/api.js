import express from 'express';
import bodyParser from 'body-parser';
import httpProxy from 'http-proxy';
import nodemailer from 'nodemailer';

export default function(app) {
  const router = express.Router();
  const proxy = httpProxy.createProxyServer();

  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({extended: true}));

  router.use('/proxy', (req, res) => { 
  	proxy.web(req, res, {target:req.query.url});
  });
  router.use('/send', (req, res) => {
  	console.log(req.body);
  	var transporter = nodemailer.createTransport({
  		service: "Gmail",
  		auth: {
  			user: "kenpace1970@gmail.com",
  			pass: "S3m1n0l3s"
  		}
  	});

  	var mailOptions = {
  		from: 'example@gmail.com', // sender email address
  		to: 'ken_pace@valpak.com', // list of receivers
  		subject: 'Hello', // subject line
  		text: 'You have a new submission with the following details... Jobs: ' + req.body,
  		html: '<p>You got a new submission with the following details...</p><ul><li>Jobs: ' + req.body + '</li></ul>'
  	};

  	transporter.sendMail(mailOptions, function(error, info){
  		if(error){
  			console.log(error);
  			res.redirect('/');
  		} else {
  			console.log('Message Sent: ' + info.response);
  			res.redirect('/');
  		}
  	})
  	res.sendStatus(200);
  })
  return router;
}
