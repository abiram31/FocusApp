import { Component, ViewChild } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http'
import { IpcRenderer } from 'electron';
import {FormControl, FormGroup} from '@angular/forms';
import {apps} from './app.model'
import { CountdownConfig, CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private ipc: IpcRenderer
  public submitButton = "Submit"
  timeLeft: number = 0;
  interval;
  public TimeToRun;
  public flag=0;
  FocusValueForm = new FormGroup({
    apps: new FormControl(''),
    time: new FormControl(''),
  });
  apps = new FormControl();

  public selected;
  appList: apps[] = [{name: 'League of Legends', "exe": 'RiotClientServices.exe'}, {name: 'Notepad', "exe": 'notepad.exe'}, {name: 'Valorant', "exe": 'RiotClientServices.exe'},
  {name: 'Genshin Impact', "exe": 'launcher.exe'},
  {name: 'Counter Strike: Global Offensive', "exe": 'GlobalOffensive.exe'},
  {name: 'Fortnite', "exe": 'fortnite.exe'},
  {name: 'Call of Duty: Modern Warfare', "exe": 'modern_warfare.exe'},

]
  constructor(private http: HttpClient) { 
    if ((<any>window).require) {
      try {
        this.ipc = (<any>window).require('electron').ipcRenderer;
      } catch (e) {
        throw e;
      }
    } else {
      console.warn('App not running inside Electron!');
    }
  }
  httpOption = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  Cancel(){
    var restartApps= {"executables": this.selected}
    console.log("Restart Apps")
    console.log(restartApps)
    this.timeLeft = 0;
    clearInterval(this.interval);
    this.http.post<any>('http://127.0.0.1:5000/restart', restartApps, this.httpOption).subscribe(data=>{
     console.log(data)
 })
 }
  submit(){
    var formValues=this.FocusValueForm.value;
    console.log(formValues.apps)
    console.log(formValues.time)
    var time =  Number(formValues.time);
    this.selected = formValues.apps;
    this.timeLeft = time;
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timeLeft--;
      } else if (this.timeLeft ==0){
        this.timeLeft = 0;
        clearInterval(this.interval);
      } else {
        this.timeLeft = time;
      }
    },1000)



    var shutOffapps = {"executables": this.selected, "time": time}
    console.log(shutOffapps)
    this.http.post<any>('http://127.0.0.1:5000/shutoff', shutOffapps, this.httpOption).subscribe(data=>{
        console.log(data)
    })
  }
  

  onChange(event){
    console.log(event);
  }

}
