import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {

  const [wallets, setWallets] = useState([]);
  const [savedWallets, setSavedWallets] = useState([]);
  const [selectedWallet, setSelectedWallet] = useState('');
  const [usdToEth, setUsdToEth] = useState(0);
  const [eurToEth, setEurToEth] = useState(0);
  var selectedWallet_2 = "";
  var ethereum_usd = 1811;
  var ethereum_eur = 1684;  
  

  //GET wallets from API
  useEffect(() => {

      fetch('https://api.etherscan.io/api?module=account&action=balancemulti&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a,0x63a9975ba31b0b9626b34300f7f627147df1f526,0x198ef1ec325a96cc354c7266a038be8b5c558f67&tag=latest&apikey=NSZCD6S4TKVWRS13PMQFMVTNP6H7NAGHUY', {mode:'cors'})
      .then(response => response.json())
      .then(data => showWallets(data.result));
       
  }, []);

  //GET saved wallets from DB
  useEffect(() => {
  getSavedWallets();
  }, []);

  function showWallets(wallets_2){
    setWallets(wallets_2);
  }

  function SelectWallet(event){

    selectedWallet_2=event.target.value;
    setSelectedWallet(event.target.value);

    var balance = wallets.find(obj => {
      return obj.account == selectedWallet_2;
    });

    //POST selected wallet to save in db
      axios({
        method: 'post',
        url: 'http://localhost:8000/save_wallet',
        data: [{Wallet:selectedWallet_2,Balance:balance.balance}],
        config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then(function (response) {
        if(response=true){
          alert("Wallet was added!");
          getSavedWallets();
        }
    })
    .catch(function (response) {
        //handle error
    });

  
  }

  function getSavedWallets(){

  axios({
      method: 'get',
      url: 'http://localhost:8000/get_wallets',
      config: { headers: {'Content-Type': 'multipart/form-data' }}
  })
  .then(function (response) {
      console.log(response.data);
      setSavedWallets(response.data);
  })
  .catch(function (response) {
      alert(response);
  });

  }

  function eth_usd(event){
    const amount_usd=event.target.value;
    const eth_value_usd = 1810*amount_usd;
    setUsdToEth(eth_value_usd);
  }
  function eth_eur(event){
    const amount_eur=event.target.value;
    const eth_value_eur = 1683*amount_eur;
    setEurToEth(eth_value_eur);
  }
  

  return (
  <div className="App">

    <div style={{padding:"55px"}}>
       <b>Select wallet to add </b> 
       <select  className="wallet" onChange={SelectWallet}>
       {wallets.map((wallet) => (
        <option key={wallet.account} value={wallet.account}>{wallet.account} Balance {wallet.balance}</option>
       ))}
       </select>
    </div>

    <div style={{padding:"55px"}}>
      <b>Saved wallets </b>
     
      {savedWallets.map((wallet) => (
        <div key={wallet.account} value={wallet.account} style={{backgroundColor:"yellow",padding:"5px",marginTop:"5px"}}>
          {wallet.account} <b>Balance</b> {wallet.balance}
        </div>
       ))}
    </div>
    <div style={{padding:"55px"}}>
     <div>ETH<input onChange={eth_usd} /> USD {usdToEth}</div> 
     <div>ETH<input onChange={eth_eur}/> EUR {eurToEth}</div> 
    </div>

  </div>
  );
}

export default App;
