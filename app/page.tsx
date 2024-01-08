'use client';
import { LitLogo } from '@/components/LitLogo'
import { useState } from 'react';

import { LitNodeClient } from '@lit-protocol/lit-node-client';
import {
  LitAuthClient,
  GoogleProvider,
  WebAuthnProvider
} from '@lit-protocol/lit-auth-client';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import {
  AuthMethodScope,
  AuthMethodType,
  ProviderType
} from '@lit-protocol/constants';
import {
  AuthMethod,
  IRelayPKP
} from '@lit-protocol/types';

export default function Home() {
  const [status, setStatus] = useState('');

  const DOMAIN = 'localhost';
  const ORIGIN = process.env.NEXT_PUBLIC_VERCEL_ENV === 'production'
    ? `https://${DOMAIN}`
    : `http://${DOMAIN}:3000`;
  const redirectUri = ORIGIN;

  const litNodeClient = new LitNodeClient({
    network: "cayenne"
  });

  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: "furkan"
    },
    litNodeClient
  });

  const googleProvider = litAuthClient.initProvider<GoogleProvider>(
    ProviderType.Google,
    { redirectUri }
  );
  const webAuthnProvider = litAuthClient.initProvider<WebAuthnProvider>(
    ProviderType.WebAuthn
  );

  async function mintPKP() {
    const options = {
      permittedAuthMethodScopes: [[AuthMethodScope.SignAnything]]
    };

    let txHash: string;

    // const webAuthnInfo = webAuthnProvider.register();

    txHash = litAuthClient.mintPKPThroughRelayer({
      authMethods: [
        AuthMethodType.Google,
        AuthMethodType.WebAuthn
      ]
    });

    const response = await litAuthClient.relay.pollRequestUntilTerminalState(txHash);
    if (response.status !== 'Succeeded') {
      throw new Error('Minting failed');
    }
    
    const newPKP: IRelayPKP = {
      tokenId: response.pkpTokenId!,
      publicKey: response.pkpPublicKey!,
      ethAddress: response.pkpEthAddress!,
    };
    
    return newPKP;
  }

  async function handleRegister() {
    const newUser = await googleProvider.signIn();
    
    console.log("newUser: ", newUser);
    

  }

  async function handleLogin() {
    const user = await googleProvider.signIn();

    console.log("user: ", user);


  }

  return (
    <main>
      <div className="flex justify-center mt-10">
        <LitLogo />
      </div>

      <div className="flex justify-center mt-10">
        <h1 className="text-5xl font-bold">
          Lit Protocol
        </h1>
      </div>

      <div className="flex justify-center mt-10">
        <button onClick={handleRegister} className="lit-button">Sign up!</button>
      </div>

      <div className="flex justify-center mt-10">
        <button onClick={handleLogin} className="lit-button">Log in!</button>
      </div>

      <div className="flex justify-center mt-10 text-white">
        <p>{status}</p>
      </div>

    </main>
  )
}
