const IBMCloudEnv = require("ibm-cloud-env");
var IBM_COS = require('ibm-cos-sdk');
const request = require('request-promise');
var multer = require('multer');
const util = require('util');
const sleep = util.promisify(setTimeout);
var multerS3 = require('multer-s3');
const stream = require('stream');
const pass = new stream.PassThrough();


//Credenciales del servicio de object storage
var config = {
    endpoint: IBMCloudEnv.getString("cos_endpoint"),
    apiKeyId: IBMCloudEnv.getString("cos_api_key"),
   // ibmAuthEndpoint: 'https://iam.ng.bluemix.net/oidc/token',
    serviceInstanceId: IBMCloudEnv.getString("cos_service_instance_id"),
    credentials: new IBM_COS.Credentials(IBMCloudEnv.getString("access_key_id"), IBMCloudEnv.getString("secret_access_key"), sessionToken = null),
    signatureVersion: 'v4'
};

var s3 = new IBM_COS.S3(config);

module.exports = {
    async  fromData(params,res) {
        var descriptioninput,namefile = '';
        var data = multer().single('file');
        console.log('funcion ejecutandose');
        data(params,res, function(err){
            descriptioninput = params.body.description[0];
            namefile = params.file.originalname;
            })
            await sleep(100);
            return {
                descripcion: descriptioninput,
                namefile: namefile
            }
    },

    uploadOnBucket(namebucket,req,res){
    const carga = multer({
        storage: multerS3({
            s3: s3,
            bucket: namebucket,
            key: function (req, file, cb) {
                cb(null, file.originalname);
            }
        })
        }).single('file');

        console.log('ejecutando la carga');
        carga(req,res,function(err) {
            if(err) {
                return res.end("Error uploading file.");
            }
            res.end("File is uploaded");
        });
    },

    getURL: function(bucket, key){
        console.log('nombre del bucket'+bucket);
        return s3.getSignedUrl('getObject',{Bucket: bucket, Key: key}).promise()
        .then(function(url){
            console.log('get realizado correctamente');
            console.log(url);
        })
        .catch(function(err){
            console.log(err);
        })
    },

    createBucket: function(bucketName)  {
    console.log(`Creating new bucket: ${bucketName}`);
    return s3.createBucket({
        Bucket: bucketName,
        CreateBucketConfiguration: {
            LocationConstraint: 'us-south'
        },        
    }).promise()
    .then((() => {
        console.log(`Bucket: ${bucketName} created!`);
    }))
    .catch((e) => {
        console.error(`ERROR: ${e.code} - ${e.message}\n`);
    });
    },

    deleteItem: function(bucketName, itemName) {
        console.log(`Deleting item: ${itemName}`);
        return s3.deleteObject({
            Bucket: bucketName,
            Key: itemName
        }).promise()
        .then(() =>{
            console.log(`Item: ${itemName} deleted!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
    },

    copyItem: function(bucketDest, bucketOrigin, itemName) {
        console.log(`copy item: ${itemName}`);
        parametros = {Bucket: bucketDest,CopySource:  bucketOrigin+'/'+itemName,Key: itemName}
        console.log(parametros);
        return s3.copyObject(parametros).promise()
        .then(() =>{
            console.log(`Item: ${itemName} copied!`);
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });
    },

    getfile: function(bucket, key){
        return s3.getObject({Bucket: `${bucket}`, Key: `${key}`}).promise()
        .then((data) =>{
            console.log(`dato obtenido`);
            return data.Body;
        })
        .catch((e) => {
            console.error(`ERROR: ${e.code} - ${e.message}\n`);
        });;
    }
}