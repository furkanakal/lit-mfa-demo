import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useAuthenticate from '../hooks/useAuthenticate';
import useSession from '../hooks/useSession';
import useAccounts from '../hooks/useAccounts';
import {
  ORIGIN,
  registerWebAuthn,
  signInWithDiscord,
  signInWithGoogle,
} from '../utils/lit';
import { AuthMethodType } from '@lit-protocol/constants';
import SignUpMethods from '../components/SignUpMethods';
import Dashboard from '../components/Dashboard';
import Loading from '../components/Loading';

export default function SignUpView() {
  const redirectUri = ORIGIN;

  const {
    authMethod,
    authWithEthWallet,
    authWithWebAuthn,
    authWithStytch,
    loading: authLoading,
    error: authError,
  } = useAuthenticate(redirectUri);
  const {
    createAccount,
    setCurrentAccount,
    currentAccount,
    loading: accountsLoading,
    error: accountsError,
  } = useAccounts();
  const {
    initSession,
    sessionSigs,
    loading: sessionLoading,
    error: sessionError,
  } = useSession();
  const router = useRouter();

  const error = authError || accountsError || sessionError;

  async function handleGoogleLogin() {
    await signInWithGoogle(redirectUri);
  }

  async function handleDiscordLogin() {
    await signInWithDiscord(redirectUri);
  }

  async function registerWithWebAuthn() {
    const newPKP = await registerWebAuthn();
    if (newPKP) {
      setCurrentAccount(newPKP);
    }
  }

  useEffect(() => {
    // If user is authenticated, create an account
    // For WebAuthn, the account creation is handled by the registerWithWebAuthn function
    if (authMethod && authMethod.authMethodType !== AuthMethodType.WebAuthn) {
      router.replace(window.location.pathname, undefined, { shallow: true });
      createAccount(authMethod);
    }
  }, [authMethod, createAccount]);

  useEffect(() => {
    // If user is authenticated and has at least one account, initialize session
    if (authMethod && currentAccount) {
      initSession(authMethod, currentAccount);
    }
  }, [authMethod, currentAccount, initSession]);

  if (authLoading) {
    console.log("Auth loading...");
    return (
      <Loading copy={'Authenticating your credentials...'} error={error} />
    );
  }
  if (accountsLoading) {
    console.log("Accounts loading...");
    return <Loading copy={'Creating your account...'} error={error} />;
  }

  if (sessionLoading) {
    console.log("Session loading...");
    return <Loading copy={'Securing your session...'} error={error} />;
  }
  
  console.log("MFA sessionSigs", sessionSigs);

  if (currentAccount && sessionSigs) {
    console.log("Current account && session sigs...");
    return (
      <Dashboard currentAccount={currentAccount} sessionSigs={sessionSigs} />
    );
  } else {
    console.log("else");
    return (
      <SignUpMethods
        handleGoogleLogin={handleGoogleLogin}
        handleDiscordLogin={handleDiscordLogin}
        authWithEthWallet={authWithEthWallet}
        registerWithWebAuthn={registerWithWebAuthn}
        authWithWebAuthn={authWithWebAuthn}
        authWithStytch={authWithStytch}
        goToLogin={() => router.push('/login')}
        error={error}
      />
    );
  }
}
