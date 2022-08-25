import { Component } from '@angular/core';
import { Web3Auth } from '@web3auth/web3auth';
import { CHAIN_NAMESPACES, SafeEventEmitterProvider } from '@web3auth/base';
import RPC from './web3RPC';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';

const clientId =
  'BOcmMwOLuj27yl2yEs9US_NGimu89yrIhw_Wn4z9oVA5I7l2ffQ3KswgUofRuMqLo8khZEI-drx4iX79pi_VCoY';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'my-auth-app';
  web3auth: Web3Auth | null = null;
  provider: SafeEventEmitterProvider | null = null;
  isModalLoaded = false;

  async ngOnInit() {
    this.web3auth = new Web3Auth({
      clientId,
      chainConfig: {
        chainNamespace: CHAIN_NAMESPACES.OTHER,
        displayName: 'Bitcoin',
        rpcTarget: 'http://user:123@127.0.0.1:18332', // This is the public RPC we have added, please pass on your own endpoint while creating an app
        ticker: 'BTC',
        tickerName: 'bitcoin',
      },
    });

    const adapter = new OpenloginAdapter({
      adapterSettings: {
        network: 'testnet',
        clientId,
        uxMode: 'popup', // other option: popup
        loginConfig: {
          google: {
            name: 'any name',
            verifier: 'weichain-google-verifier',
            typeOfLogin: 'google',
            clientId:
              '308188786588-8g0gsi29dqsolquiaullgou4k0vmjkcd.apps.googleusercontent.com',
          },
        },
      },
    });
    const web3auth = this.web3auth;
    web3auth.configureAdapter(adapter);
    await web3auth.initModal();
    if (web3auth.provider) {
      this.provider = web3auth.provider;
      // console.log(await this.provider);
    }
    this.isModalLoaded = true;
  }

  login = async () => {
    if (!this.web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const web3auth = this.web3auth;
    this.provider = await web3auth.connect();
    console.log('logged in');
  };

  getUserInfo = async () => {
    if (!this.web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    const user = await this.web3auth.getUserInfo();
    console.log(user);
  };

  getChainId = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const chainId = await rpc.getChainId();
    console.log(chainId);
  };

  getAccounts = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const address = await rpc.getAccounts();
    console.log(address);
  };

  getBalance = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const balance = await rpc.getBalance();
    console.log(balance);
  };

  sendTransaction = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const receipt = await rpc.sendTransaction();
    console.log(receipt);
  };

  signMessage = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const signedMessage = await rpc.signMessage();
    console.log(signedMessage);
  };

  getPrivateKey = async () => {
    if (!this.provider) {
      console.log('provider not initialized yet');
      return;
    }
    const rpc = new RPC(this.provider);
    const privateKey = await rpc.getPrivateKey();
    console.log(privateKey);
  };

  logout = async () => {
    if (!this.web3auth) {
      console.log('web3auth not initialized yet');
      return;
    }
    await this.web3auth.logout();
    this.provider = null;
    console.log('logged out');
  };
}
