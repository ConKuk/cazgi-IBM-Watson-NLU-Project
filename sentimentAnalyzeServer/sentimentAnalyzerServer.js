const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const app = new express();

function getNLUInstance(){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');

    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding;
}

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

app.get("/url/emotion", (req,res) => {

    getNLUInstance().analyze({
        url: req.query.url,
        features:{
          entities:{
            emotion: true
          }
        }
      })
      .then(analysisResults => {
        let result = analysisResults.result.entities[0].emotion;
        let emotions = [];
        for (let emot in result){
          if (result.hasOwnProperty(emot)){
            emotions.push({type: emot, value: result[emot]});
          }
        }
        res.send(JSON.stringify(emotions, null, 2))
      })
      .catch(err => {
          console.log('error:', err);
          res.send('error:', err);
      });
});

app.get("/url/sentiment", (req,res) => {
  getNLUInstance().analyze({
      url: req.query.url,
      features:{
        entities:{
          sentiment: true
        }
      }
    })
    .then(analysisResults => {
      let response = analysisResults.result.entities[0].sentiment.label;

      res.send(response);
    })
    .catch(err => {
      console.log('error:', err);
      res.send('error:', err);
    });

    // return res.send("url sentiment for "+req.query.url);
});

app.get("/text/emotion", (req,res) => {
  getNLUInstance().analyze({
      text: req.query.text,
      features:{
        entities:{
          emotion: true
        }
      }
    })
    .then(analysisResults => {
      if (analysisResults.result.entities[0]) {
        let result = analysisResults.result.entities[0].emotion;
        let emotions = [];
        for (let emot in result) {
          if (result.hasOwnProperty(emot)) {
            emotions.push({type: emot, value: result[emot]});
          }
        }
       return res.send(JSON.stringify(emotions, null, 2))
      }
      res.send("No results");
    })
    .catch(err => {
      console.log('error:', err);
      res.send('error:', err);
    });
});

app.get("/text/sentiment", (req,res) => {
  getNLUInstance().analyze({
      text: req.query.text,
      features:{
        entities:{
          sentiment: true
        }
      }
    })
    .then(analysisResults => {

      if (analysisResults.result.entities[0]) {
        let response = analysisResults.result.entities[0].sentiment.label;
        return res.send(response);
      }
      res.send("No results");
    })
    .catch(err => {
      console.log('error:', err);
      res.send('error:', err);
    });

  // return res.send("text sentiment for "+req.query.text);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

