import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { discardPeriodicTasks } from '@angular/core/testing';
import { ElementSchemaRegistry } from '@angular/compiler';



@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css']
})
export class CovidComponent implements OnInit {

  uploadForm: FormGroup;

  loading

  private URL = 'http://back1-project-x.openshift-43-ea9753cca330b7f05a99ad5b2c8b5da1-0000.us-east.containers.appdomain.cloud/api/';

  txt
  textModelo
  nl
  texto: any[] = [];







  public form = {

    input_data: [{
      fields: ["Gender", "Married", "Dependents", "Education", "Self_Employed", "ApplicantIncome", "CoapplicantIncome", "LoanAmount", "Loan_Term", "Credit_History_Available", "Housing", "Locality"],
      values: [[]]
    }]


  }


  constructor(private httpClient: HttpClient, private formBuilder: FormBuilder) { }

  ngOnInit(): void {
  }
  x="";
  respuesta = [];
  fraude="";
  probabilidad=""
  probabilidad_number=0;
  PostAutoIA() {

    var a = this.texto.map(function (item) {
      return parseInt(item, 10);

    });
    this.form.input_data[0].values[0] = (a)
    console.log(this.form);
    var datos = JSON.stringify(this.form)


    var salida = {
      "text": datos
    }

    console.log(datos);
    this.httpClient.post<any>(`${this.URL}upload-text`, salida).subscribe(
      (res) => {

        this.textModelo = res
        this.respuesta.push(res)
        this.x =JSON.stringify(res.predictions[0].values)
        console.log("respuesta "+this.x)


        this.fraude =res.predictions[0].values[0][0]

        if(this.fraude="1"){
          this.fraude="Hay fraude"
        }else{
          this.fraude="No hay fraude"
        }
        console.log(this.fraude)
        


        this.probabilidad = res.predictions[0].values[0][1][1]
        this.probabilidad_number=parseFloat(this.probabilidad)*100
        this.probabilidad=this.probabilidad_number.toFixed(2) + '%'
          
        console.log("probabilidad "+this.probabilidad_number)

        
      },
      (err) => {

        console.log(err)
      },
    );

  }


}
