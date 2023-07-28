import React from 'react';
import * as nearAPI from "near-api-js";
import { sendNear } from '../../utils/sendNear';

const Home = () => {
    const { keyStores } = nearAPI;
    const myKeyStore = new keyStores.BrowserLocalStorageKeyStore();


    const connectionConfig = {
        networkId: "testnet",
        keyStore: myKeyStore, // first create a key store 
        nodeUrl: "https://rpc.testnet.near.org",
        walletUrl: "https://wallet.testnet.near.org",
        helperUrl: "https://helper.testnet.near.org",
        explorerUrl: "https://explorer.testnet.near.org",
    };

    const connectWallet = async () => {

        const nearConnection = await nearAPI.connect(connectionConfig);

        const walletConnection = new nearAPI.WalletConnection(nearConnection);
        console.log(walletConnection)

        walletConnection.requestSignIn({
            contractId: "jubastriker2.testnet",
            methodNames: [], // optional
            successUrl: "http://localhost:3000/", // optional redirect URL on success
            failureUrl: "http://localhost:3000/home/failure" // optional redirect URL on failure
        });

        if (walletConnection.isSignedIn()) {
            console.log("User is already signed in", walletConnection.account)
        }

        console.log("User is already signed in", walletConnection.account)
        const walletAccountObj = walletConnection.account();
        console.log(walletAccountObj)
    }

    const getAccount = async () => {

        const obj = myKeyStore.localStorage.undefined_wallet_auth_key;

        const retrievedObj = JSON.parse(obj);
        console.log(retrievedObj.accountId)
    }

    const sendNearHandler = () => {
        sendNear()
    }
    return (
        <div>
            <button onClick={connectWallet}>Connect Near</button>
            <br />
            <button onClick={getAccount}>Get Account</button>
            <br />
            <button onClick={sendNearHandler}>Send Near</button>
        </div>
    );
};

export default Home;