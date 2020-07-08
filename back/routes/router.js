const router = require("express").Router();
const callNLUnderstanding = require("../utils/watsonNL");
const proDataNL = require("../utils/proDataNL");

const params = require("../params");
const fs = require("fs");
const apiPost = require("../utils/watsonNL");

// Watson NLU Route for analize text
router.post("/upload-text", async function (req, res) {
  const inputText = req.body.text;

 const hola = JSON.stringify(inputText)
  console.log(inputText);
  try {
    if (!inputText) {
      res.send({
        status: false,
        message: "No text uploaded",
      });
    } else {
              const wmlToken = "Bearer " + "eyJraWQiOiIyMDIwMDYyNDE4MzAiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJpYW0tU2VydmljZUlkLTNjZTZjNDEyLTRjZmMtNGMzMS1iZDg0LWUxYjdmZjZmYWMyNCIsImlkIjoiaWFtLVNlcnZpY2VJZC0zY2U2YzQxMi00Y2ZjLTRjMzEtYmQ4NC1lMWI3ZmY2ZmFjMjQiLCJyZWFsbWlkIjoiaWFtIiwiaWRlbnRpZmllciI6IlNlcnZpY2VJZC0zY2U2YzQxMi00Y2ZjLTRjMzEtYmQ4NC1lMWI3ZmY2ZmFjMjQiLCJuYW1lIjoid2RwLXdyaXRlciIsInN1YiI6IlNlcnZpY2VJZC0zY2U2YzQxMi00Y2ZjLTRjMzEtYmQ4NC1lMWI3ZmY2ZmFjMjQiLCJzdWJfdHlwZSI6IlNlcnZpY2VJZCIsImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6ImQ1ZDdiOThkNTVlODRjZWFiYmMxYjEzYTlkOWQ3Yjc4In0sImlhdCI6MTU5NDI0OTUzMiwiZXhwIjoxNTk0MjUzMTMyLCJpc3MiOiJodHRwczovL2lhbS5jbG91ZC5pYm0uY29tL2lkZW50aXR5IiwiZ3JhbnRfdHlwZSI6InVybjppYm06cGFyYW1zOm9hdXRoOmdyYW50LXR5cGU6YXBpa2V5Iiwic2NvcGUiOiJpYm0gb3BlbmlkIiwiY2xpZW50X2lkIjoiZGVmYXVsdCIsImFjciI6MSwiYW1yIjpbInB3ZCJdfQ.1q4qLHT9fLJIcSfpfMkf2F5IJPI1ZXCPzD5uxnBqoVmkfvm5rGpqmj3A24o34qpQSuqseu4kRkP_4h_3kYLEhZqUP2S7CKrnr2qU383UPRcZhp0vB--DAY9mNvisDK7qZgxXRwu7OXMh1emno-SxNacIACVKwlIi0mIOjuuTazYcWqyQinKaAUxNkK8WYKgU6QY6KWTgKAkRG_ZjStnVwOwZ0d-AwbhjBHWifF926I-nYLEub7IvP6l-W71ioalCBBl8du_MeeJxD0MqzH5TtuXtUtP9MejjKo4peh_3RHgJVAjeVBoJ6IzHu8YlEVZ5B7MH12N4kdIHacJ0aJX0jQ";
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


module.exports = router;
