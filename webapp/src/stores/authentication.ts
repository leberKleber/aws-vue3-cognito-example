import { defineStore } from 'pinia';
import { CognitoIdentityProviderClient, InitiateAuthCommand, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { CognitoIdentityClient } from "@aws-sdk/client-cognito-identity";

// Define the state interface
interface AuthenticationState {
  credentials: any | null;
  cognitoUser: any | null;
}

const region = 'eu-central-1';
const userPoolId = 'eu-central-1_IkkWGO43K';
const clientId = '7fqgppuj672kml4qnf1f4070i1';
const identityPoolId = 'eu-central-1:2dcd9a5a-979e-4bce-8aa1-fad00c666883';

const cognitoClient = new CognitoIdentityProviderClient({ region });

export const useAuthenticationStore = defineStore('authentication', {
  state: (): AuthenticationState => ({
    credentials: null,
    cognitoUser: null,
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

          // Step 2: Set credentials using AWS SDK v3
          that.credentials = fromCognitoIdentityPool({
            client: new CognitoIdentityClient({ region }),
            identityPoolId,
            logins: {
              [`cognito-idp.${region}.amazonaws.com/${userPoolId}`]: idToken,
            },
          });

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
      this.cognitoUser = null;
      console.log('User signed out');
    },
  },

  getters: {
    isAuthenticated: (state: AuthenticationState): boolean => {
      if (state.credentials === null) {
        return false;
      }
      // Check if the credentials are valid (AWS SDK v3 doesn't use `expired` like v2)
      // You might need to implement custom logic here for validity checking
      return true;
    },
  },
});
