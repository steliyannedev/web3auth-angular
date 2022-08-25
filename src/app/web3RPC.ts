import type { SafeEventEmitterProvider } from '@web3auth/base';
import Web3 from 'web3';
import ECPairFactory from 'ecpair';
import * as bitcoin from 'bitcoinjs-lib';
import * as ecc from 'tiny-secp256k1';
import * as Client from 'bitcoin-core-ts';
import * as bip39 from 'bip39';
import { ethers } from 'ethers';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import SeedPhraseModule, { MetamaskSeedPhraseFormat } from '@tkey/seed-phrase';
import { BN } from 'bn.js';
import ThresholdKey from '@tkey/core';
import { ServiceProviderBase } from '@tkey/service-provider-base';
import TorusStorageLayer from '@tkey/storage-layer-torus';

// let bitcoin_rpc = require('node-bitcoin-rpc');

export default class EthereumRpc {
  private provider: SafeEventEmitterProvider;
  private ECPair;

  constructor(provider: SafeEventEmitterProvider) {
    this.provider = provider;
    this.ECPair = ECPairFactory(ecc);
  }

  async getChainId(): Promise<string> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get the connected Chain's ID
      const chainId = await web3.eth.getChainId();

      return chainId.toString();
    } catch (error) {
      return error as string;
    }
  }

  async getAccounts(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const address = (await web3.eth.getAccounts())[0];

      return address;
    } catch (error) {
      return error;
    }
  }

  async getBalance(): Promise<any> {
    try {
      const keyPair = this.ECPair.makeRandom();
      // this.ECPair.fromPrivateKey()
      const { address } = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey });
      console.log(address);
      var RpcClient = require('bitcoind-rpc');

      let config = 'http://user:123@127.0.0.1:18332';
      let rpc = new RpcClient(config);
      rpc.getBalance((err: any, res: any) => {
        if (err) {
          console.log(err);
        }
        console.log(res);
      });

      // const web3 = new Web3(this.provider as any);

      // // Get user's Ethereum public address
      // const address = (await web3.eth.getAccounts())[0];

      // // Get user's balance in ether
      // const balance = web3.utils.fromWei(
      //   await web3.eth.getBalance(address) // Balance is in wei
      // );

      // return balance;
    } catch (error) {
      return error as string;
    }
  }

  async sendTransaction(): Promise<any> {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const destination = fromAddress;

      const amount = web3.utils.toWei('0.001'); // Convert 1 ether to wei

      // Submit transaction to the blockchain and wait for it to be mined
      const receipt = await web3.eth.sendTransaction({
        from: fromAddress,
        to: destination,
        value: amount,
        maxPriorityFeePerGas: '5000000000', // Max priority fee per gas
        maxFeePerGas: '6000000000000', // Max fee per gas
      });

      return receipt;
    } catch (error) {
      return error as string;
    }
  }

  async signMessage() {
    try {
      const web3 = new Web3(this.provider as any);

      // Get user's Ethereum public address
      const fromAddress = (await web3.eth.getAccounts())[0];

      const originalMessage = 'YOUR_MESSAGE';

      // Sign the message
      const signedMessage = await web3.eth.personal.sign(
        originalMessage,
        fromAddress,
        'test password!' // configure your own password here.
      );

      return signedMessage;
    } catch (error) {
      return error as string;
    }
  }

  async getPrivateKey(): Promise<any> {
    try {
      const privateKey = await this.provider.request({
        method: 'private_key',
      });
      const defaultSP = new ServiceProviderBase({
        postboxKey:
          '10e051a4fe0312ca8b01cec18aef131ffe92d9920f8cb055204cbe443073dea7',
      });
      const storageLayer = new TorusStorageLayer({
        hostUrl: 'https://metadata.tor.us',
      });
      let tkey = new ThresholdKey({ serviceProvider: defaultSP, storageLayer });
      let metamaskSeedPhraseFormat = new MetamaskSeedPhraseFormat(
        'https://mainnet.infura.io/v3/69dd7cde1cc74a0cb9e30b06b1b28792'
      );
      const tkeyApi = tkey.getApi();
      await tkeyApi.initialize({});
      const seedPhraseModule = new SeedPhraseModule([metamaskSeedPhraseFormat]);
      await seedPhraseModule.initialize();
      seedPhraseModule.setModuleReferences(tkeyApi);
      const asd = await seedPhraseModule.getSeedPhrases();
      console.log(asd);
      // const mnemonic = bip39.generateMnemonic();
      // console.log(mnemonic);
      // const seed = bip39.mnemonicToSeedSync(mnemonic).toString('hex');
      // // const hdNode = ethers.utils.HDNode.fromMnemonic(mnemonic);
      // const wallet = ethers.Wallet.fromMnemonic(mnemonic, "m/44'/1'/1'/1/1");
      // console.log(wallet.address);
      // let result = this.ECPair.fromPublicKey(
      //   Buffer.from(String(wallet.publicKey.substring(2)), 'hex'),
      //   { network: bitcoin.networks.testnet }
      // );

      // // console.log(result.privateKey);
      // const { address } = bitcoin.payments.p2pkh({
      //   pubkey: result.publicKey,
      //   network: bitcoin.networks.testnet,
      // });
      // console.log(address);

      // var RpcClient = require('bitcoind-rpc');

      // let config = 'http://user:123@127.0.0.1:18332';
      // let rpc = new RpcClient(config);

      // rpc.listAddressGroupings((err: any, res: any) => {
      //   if (err) {
      //     console.log(err);
      //   }
      //   // rpc.dumpPrivKey(address, (err: any, res: any) => {
      //   //   console.log(res);
      //   // });
      //   console.log(res.result);
      // });

      return privateKey;
    } catch (error) {
      return error as string;
    }
  }
}
