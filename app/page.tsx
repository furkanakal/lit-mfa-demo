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
  AuthMethod
} from '@lit-protocol/types';

export default function Home() {
  const [status, setStatus] = useState('');

  const litNodeClient = new LitNodeClient({
    network: "cayenne"
  });

  const litAuthClient = new LitAuthClient({
    litRelayConfig: {
      relayApiKey: "furkan"
    },
    litNodeClient
  });

  const googleProvider = litAuthClient.initProvider<GoogleProvider>;
  const webAuthnProvider = litAuthClient.initProvider<WebAuthnProvider>;

  async function register() {


  }

  async function login() {


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
        <button onClick={register} className="lit-button">Sign up!</button>
      </div>

      <div className="flex justify-center mt-10">
        <button onClick={login} className="lit-button">Log in!</button>
      </div>

      <div className="flex justify-center mt-10 text-white">
        <p>{status}</p>
      </div>

    </main>
  )
}
