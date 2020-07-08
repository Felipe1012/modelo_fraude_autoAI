import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { discardPeriodicTasks } from '@angular/core/testing';



@Component({
  selector: 'app-covid',
  templateUrl: './covid.component.html',
  styleUrls: ['./covid.component.css']
})
export class CovidComponent implements OnInit {

  uploadForm: FormGroup;

  loading

  private URL = 'http://localhost:3000/api/';

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
        
        console.log(res)
      },
      (err) => {

        console.log(err)
      },
    );

  }


}
