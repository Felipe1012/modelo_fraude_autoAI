var Controller = function(title) {

    //Carga de modulos
    var util = require('util');
    const sleep = util.promisify(setTimeout);
    const IBMCloudEnv = require("ibm-cloud-env");
    IBMCloudEnv.init();
    const s3function = require('./S3func');

    var obtenerfile = async function(req,res){
        console.log('Obteniendo object');
        console.log(`Bucket: ${req.body.bucket}, Key: ${req.body.key}`);
        var texto = await s3function.getfile(`${req.body.bucket}`, `${req.body.name}`);
        console.log(`${texto}`);
        res.send(`${texto}`);
    }

    return {
        obtenerfile: obtenerfile,
    };
};

module.exports = Controller;
