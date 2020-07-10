const router = require("express").Router();
const callNLUnderstanding = require("../utils/watsonNL");
const proDataNL = require("../utils/proDataNL");

const params = require("../params");
const fs = require("fs");
const apiPost = require("../utils/watsonNL");

// Watson NLU Route for analize text
router.post("/upload-text", async function (req, res) {
  const inputText = req.body.text;
  var btoa = require("btoa");
  var request = require('request');
  console.log("hola")

  // Paste your Watson Machine Learning service apikey here
  var apikey = "8c_588CSFnrCAhslkRTBL4Mv4aeOFPIHJ3yl-NoEPcE3";

  // Use this code as written to get an access token from IBM Cloud REST API
  //
  var IBM_Cloud_IAM_uid = "bx";
  var IBM_Cloud_IAM_pwd = "bx";

  var options = {
    url: "https://iam.bluemix.net/oidc/token",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Authorization": "Basic " + btoa(IBM_Cloud_IAM_uid + ":" + IBM_Cloud_IAM_pwd)
    },
    body: "apikey=" + apikey + "&grant_type=urn:ibm:params:oauth:grant-type:apikey"
  };


  request.post(options, function (error, response, body) {
    var iam_token = JSON.parse(body)["access_token"];
    console.log("iam_token")
    const hola = JSON.stringify(inputText)
    console.log(inputText);
    try {
      if (!inputText) {
        res.send({
          status: false,
          message: "No text uploaded",
        });

      } else {
        const wmlToken = "Bearer " + iam_token;
        const mlInstanceId = "ef6690c5-963d-417f-bc6c-0b134690ad8a";
        const payload = inputText;
        const scoring_url = "https://us-south.ml.cloud.ibm.com/v4/deployments/7c26ff08-315f-433f-86e2-54bc60c037b3/predictions";

        apiPost(scoring_url, wmlToken, mlInstanceId, payload, function (resp) {
          let parsedPostResponse;
          try {
            parsedPostResponse = JSON.parse(this.responseText);
            var respuesta = JSON.stringify(parsedPostResponse);
            res.send(respuesta)
          } catch (ex) {
            // TODO: handle parsing exception
          }
          console.log("Scoring response");
          console.log(respuesta);
        }, function (error) {
          console.log(error);
        });
        console.log("\nDone!");
      }
    } catch (err) {
      res.status(500).json({ message: "No se pudo analizar el texto ingresado" });
    }
  });
});



module.exports = router;
