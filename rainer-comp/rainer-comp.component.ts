import { Component, OnInit, Injectable } from '@angular/core';
import { analyzeAndValidateNgModules } from '@angular/compiler';
//import { CallMeService } from './../service/callMe.service'
import { VUService } from './../service/VU.service'
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'app-rainer-comp',
  templateUrl: './rainer-comp.component.html',
  styleUrls: ['./rainer-comp.component.css'],
  providers: [VUService]

})
export class RainerCompComponent implements OnInit {

  subscription: Subscription;
  source = interval(30000);
  text = 'Your Text Here';
  userAccount: string;
  userBalance: number;
  currentContract: any;
  vUContract: any;
  contractAddress: string;
  vUContractAddress: string;
  owner= false;
  imagePerson:string="img/person.jpg";
  Me={
    geburtsjahr: 0,
    address: "not available",
    status: 0,
    statusToString: "not available"
  } ;


  vertrag={
    deckungskapital: [0],
    statusVertrag:[0],
    rentenhoehe:[0],
    statusVertragToString:[""]
  };
  balanceOfAllnum=0;  
  thesaurierung=0; 
  thesaurierungToString=""; 
  balanceOfnum=0;
  anzahlMitglieder=0;
  timeToinitializeYearnum=0;
  timeToinitializeVertragnum=0;
  timeNextEvent=0;
  timeNextEventTage=0;
  timeNextEventStunden=0;
  timeNextEventMinuten=0;
  timeNextEventToString="";



  isEmpty: boolean;
  isLoading=false;
  etherToSend: number;
  faucetBalance: number;
 

  
  values2 = "";
  values3 = 0;
  values4 = 0;

  

  //createName="";
  //createGeburtsjahr="";
  constructor(private vUservice: VUService) {

  }
  async ngOnInit(): Promise<void>{
try {
 await this.getVUContract("0xf87ECF39BeA0d286957bD13E6018F21cBEDBBE5c"); // VU CONTRACT    
  
 await  this.getAcountAndBalance();
} catch (error) {
  alert(error);
}finally{
  this.getNumber();
}
//await this.getVUContract("0x04F087342577282D6aA65Bc499cC989530D81D3E"); // VU CONTRACT  alt
    //this.getContract("0x20B41C02e7760B0F8C2924BbA427Fa74fC82310c");
    //this.getContract("0x16125378da3eeCBA5207Aff8A070607871c4EF72");   0x16c2215A5115CC06e6D71cF88a619890297Df002
  //this.getContract("0x28b816e8Cba01aA5b4c7e8b1c1Cb42C38833D254");
  //this.getTestContract("0x3Aa1Ac84EEeC6F4b80198dd6753985734876ed9D"); ----Torsten
  //this.getTestContract("0x1614cb1c0488B262048B2Ce4505f2d7A81ef02C5");

  
 
  }
 
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }




  OnInit(){
    
  }

  /*public getTestContract(address: string){
    this.callMEservice.getCallMeContract(address).then( (response) => {
      this.testContract = response;
      this.testContractAddress = this.testContract.options.address;
    }, (response) => {
       console.log(response);
       alert("Contract not found: " + response);
    } );
   }*/
   private async getAcountAndBalance(){

    await this.vUservice.getUserBalance().then( (retAccount) => {
      this.userAccount = retAccount.account;
      this.userBalance = retAccount.balance / 1e18;
    }, (retAccount) => {
      this.userAccount = "No Account loaded!"
    } 
    ).catch();

  }
   public async getVUContract(address: string){
   await this.vUservice.getContract(address).then( (response) => {
      this.vUContract = response;
      this.vUContractAddress = this.vUContract.options.address;
    }, (response) => {
       console.log(response);
    } );
   }
   

   public getbalanceOfAll(){
    this.vUContract.methods.getbalanceOfAll().call().then( (result) => {
      this.balanceOfAllnum = result/1e18; 
    });
   }

 
   public async getOwner(){
    try{
     await this.vUContract.methods.getOwner().call({ from: this.userAccount}).then( (result) => {
       this.owner = result;
     });
    }catch(ex){
     alert(ex);
    }
  }
   public async getVertragsdaten(){
     try{
      await this.vUContract.methods.getVertragsdaten().call({ from: this.userAccount}).then( (result) => {
        this.Me.address= result[0] 
        this.Me.geburtsjahr= result[1]
        this.balanceOfnum =result[2]
        this.thesaurierung = result[3] 
        this.Me.status= result[4] 
          if(this.Me.status==0){
          this.Me.statusToString= "am Leben";
        }else if(this.Me.status==1){
          this.Me.statusToString= "gestorben";
          }else{
            this.Me.statusToString= "bitte reichen Sie einen LN ein";
          }
          if(this.thesaurierung==0){
            this.thesaurierungToString="aktiviert";
          }else{
            this.thesaurierungToString="deaktiviert";
          }
      });
     }catch(ex){
       alert(ex);
     }
   }
   public getVertraege(){
    this.vUContract.methods.getVertraege().call({ from: this.userAccount}).then( (result) => {
      this.vertrag.deckungskapital= [0];
      this.vertrag.rentenhoehe=[0];
      this.vertrag.statusVertrag=[0];
      this.vertrag.statusVertragToString=[""];
      for(let i =0;i<result.length;i++){
        this.vertrag.deckungskapital[0] += result[i][0]/1e18;
        this.vertrag.deckungskapital.push(result[i][0]/1e18) ;
        this.vertrag.rentenhoehe[0]+= result[i][1]/1e18;
        this.vertrag.rentenhoehe.push(result[i][1]/1e18) ;
        this.vertrag.statusVertrag[0] = result[i][2];
        this.vertrag.statusVertrag.push(result[i][2]); 
      }
      if(this.vertrag.statusVertrag[0]==0){
        this.vertrag.statusVertragToString[0]+= "Vertrag wird vorbereitet";
        this.vertrag.statusVertragToString.push( "Vertrag wird vorbereitet");
      }else if(this.vertrag.statusVertrag[0]==1){
        this.vertrag.statusVertragToString[0]+= "Vertrag ist aktiv ohne Beteiligung";
        this.vertrag.statusVertragToString.push("Vertrag ist aktiv ohne Beteiligung") ;
        }else if(this.vertrag.statusVertrag[0]==2){
          this.vertrag.statusVertragToString[0]+= "Vertrag ist aktiv mit Beteiligung";
          this.vertrag.statusVertragToString.push("Vertrag ist aktiv mit Beteiligung");
        }else{
          this.vertrag.statusVertragToString[0]+= "Vertrag ist beendet";
          this.vertrag.statusVertragToString.push("Vertrag ist beendet");
        }    
    });
   }
   public async getTime(){
    await this.vUContract.methods.timeToinitializeYear().call({ from: this.userAccount}).then( (result) => {
      this.timeToinitializeYearnum =result;
      });
    await this.vUContract.methods.timeToinitializeVertrag().call({ from: this.userAccount}).then( (result) => {
      this.timeToinitializeVertragnum =result;
      });
    if (this.timeToinitializeVertragnum>0){
      this.timeNextEvent = this.timeToinitializeVertragnum;
      this.timeNextEventTage=Math.floor(this.timeNextEvent/60/60/24) ;
      this.timeNextEventStunden=  (this.timeNextEvent/60/60)%24;
      this.timeNextEventMinuten =(this.timeNextEvent/60)%24;
      this.timeNextEventToString ="Zeit bis der Vertrag initialisiert wird: ";
    } else{
      this.timeNextEvent = this.timeToinitializeYearnum;
      this.timeNextEventTage=Math.floor(this.timeNextEvent/60/60/24) ;
      this.timeNextEventStunden=  (this.timeNextEvent/60/60)%24;
      this.timeNextEventMinuten =(this.timeNextEvent/60)%24;
      this.timeNextEventToString ="Zeit bis das Jahr vorrüber ist: ";
    }
   }
   public async switchThesaurierung(){
    this.vUContract.methods.switchThesaurierung().send({ from: this.userAccount});
    console.log("switchthesaurierung");
   }
   public async anlegenPerson(){
     try {
      this.vUContract.methods.anlegenPerson(this.values2 ).send({ from: this.userAccount});
     } catch (error) {
       alert(error);
     }finally{
      this.getNumber();
     }
    
    console.log("create");
   }
    public async withdraw(){
    this.vUContract.methods.withdraw(this.values4).send({ from: this.userAccount});
    console.log("withdraw");
   }
 public async invest(){
    this.vUContract.methods.invest().send({ from: this.userAccount,value: this.values3});
    console.log("invest");
   }
  
  onKey2(event: any) { 
    this.values2 = event.target.value ;
  }
  onKey3(event: any) { 
    this.values3 = event.target.value*1e18 ;
  }
   onKey4(event: any) { 
    this.values4 = event.target.value*1e18 ;
  }
  
   
   
   public getVersicherungsnehmerLength(){
    this.vUContract.methods.getVersicherungsnehmerLength().call({ from: this.userAccount}).then( (result) => {
      this.anzahlMitglieder = result.length;
    });
   }

    public async giveLebendsnachweis(){
    this.vUContract.methods.giveLebendsnachweis().send({ from: this.userAccount});
    console.log("giveLebendsnachweis");
   }
   public async initializeVertrag(){
    this.vUContract.methods.initializeVertrag().send({ from: this.userAccount});
    console.log("giveLebendsnachweis");
   }
      public async initializeYear(){
    this.vUContract.methods.initializeYear().send({ from: this.userAccount});
    console.log("giveLebendsnachweis");
   }
 
   public displayOwnerTool() {
     if(this.owner){
      document.getElementById("initializeYear-btn").style.display="inline";
      document.getElementById("initializeVertrag-btn").style.display="inline";
     }
    }
    public displayVNTool(){
      if(this.Me.geburtsjahr>1900){
        document.getElementById("div-createPerson").style.display="none";
      }
   }

     public async getNumber() {
       try{
        await this.getOwner();
        await  this.getVersicherungsnehmerLength();
        await this.getTime();
        await  this.getVertraege();
      
        await  this.getbalanceOfAll(); 
       await this.getVertragsdaten();
        console.log("test");
       }catch(ex){

       }finally{
        this.displayOwnerTool();
        this.displayVNTool();
       }
     
   
  
     
      console.log("Hallo");
    
      /*if(this.owner && !this.isLoading){
        this.isLoading=true;
        this.subscription = this.source.subscribe(val => this.initializeVertrag());
      }*/
    
  }
 
  personUrl="./assets/img/person-1824144_1280.png";
  kollektivUrl="./assets/img/group-1824145_1280.png";
  vertragUrl="./assets/img/contract-1481587_1280.png";
  kompassUrl="./assets/img/Kompass.png";

}


