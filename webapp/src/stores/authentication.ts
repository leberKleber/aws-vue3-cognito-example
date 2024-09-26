import {defineStore} from 'pinia';
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  RespondToAuthChallengeCommand
} from "@aws-sdk/client-cognito-identity-provider";
import {fromCognitoIdentityPool} from "@aws-sdk/credential-providers";
import {CognitoIdentityClient} from "@aws-sdk/client-cognito-identity";
import {CognitoIdentityCredentialProvider} from "@aws-sdk/credential-provider-cognito-identity";

// Define the state interface
interface AuthenticationState {
  credentials: CognitoIdentityCredentialProvider | null;
}

const region = 'eu-central-1';
const userPoolId = 'eu-central-1_IkkWGO43K';
const clientId = '7fqgppuj672kml4qnf1f4070i1';
const identityPoolId = 'eu-central-1:2dcd9a5a-979e-4bce-8aa1-fad00c666883';

const localStorageIDToken = `cognito-idp.${region}.amazonaws.com/${userPoolId}`

const cognitoClient = new CognitoIdentityProviderClient({region});

const parseIDToken = (idToken: string) => {
  if (!idToken) {
    return null;
  }
  return fromCognitoIdentityPool({
    client: new CognitoIdentityClient({region}),
    identityPoolId,
    logins: {
      [localStorageIDToken]: idToken,
    },
  });
}

export const useAuthenticationStore = defineStore('authentication', {
  state: (): AuthenticationState => ({
    credentials: parseIDToken(localStorage.getItem(localStorageIDToken)),
  }),
  actions: {
    async login(username: string, password: string): Promise<void> {
      const that = this;

      try {
        // Step 1: Initiate authentication
        const authResult = await cognitoClient.send(
          new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: clientId,
            AuthParameters: {
              USERNAME: username,
              PASSWORD: password,
            },
          })
        );

        if (authResult.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
          // Handle new password challenge
          const challengeResponse = await cognitoClient.send(
            new RespondToAuthChallengeCommand({
              ChallengeName: 'NEW_PASSWORD_REQUIRED',
              ClientId: clientId,
              ChallengeResponses: {
                USERNAME: username,
                NEW_PASSWORD: 'Test1234!',
              },
              Session: authResult.Session,
            })
          );
          console.log('Successfully completed new password challenge', challengeResponse);
        }

        if (authResult.AuthenticationResult) {
          // Extract token
          const idToken = authResult.AuthenticationResult.IdToken;

          // persist ID token
          localStorage.setItem(localStorageIDToken, idToken)

          // Step 2: Set credentials using AWS SDK v3
          that.credentials = parseIDToken(idToken);

          console.log('Credentials set:', that.credentials);
        }
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout(): void {
      // Sign out logic (you may need to implement additional actions)
      this.credentials = null;
      console.log('User signed out');
    },
  },

  getters: {
    isAuthenticated: (state: AuthenticationState): boolean => {
      return state.credentials !== null;
    },
  },
});
