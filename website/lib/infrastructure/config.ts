/**
 * PatientPilot AI
 * Infrastructure Layer
 * Configuration
 *
 * Centralized application configuration.
 */

export interface ApplicationConfig {
  readonly appName: string;
  readonly appUrl: string;
  readonly environment: string;

  readonly supabase: {
    readonly url: string;
    readonly anonKey: string;
    readonly serviceRoleKey?: string;
  };

  readonly openai: {
    readonly apiKey?: string;
  };

  readonly twilio: {
    readonly accountSid?: string;
    readonly authToken?: string;
    readonly phoneNumber?: string;
  };
}

function required(
  value: string | undefined,
  name: string,
): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}`,
    );
  }

  return value;
}

export function loadConfiguration(): ApplicationConfig {
  return {
    appName:
      process.env.NEXT_PUBLIC_APP_NAME ??
      "PatientPilot AI",

    appUrl: required(
      process.env.NEXT_PUBLIC_APP_URL,
      "NEXT_PUBLIC_APP_URL",
    ),

    environment:
      process.env.NODE_ENV ?? "development",

    supabase: {
      url: required(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        "NEXT_PUBLIC_SUPABASE_URL",
      ),

      anonKey: required(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      ),

      serviceRoleKey:
        process.env.SUPABASE_SERVICE_ROLE_KEY,
    },

    openai: {
      apiKey:
        process.env.OPENAI_API_KEY,
    },

    twilio: {
      accountSid:
        process.env.TWILIO_ACCOUNT_SID,

      authToken:
        process.env.TWILIO_AUTH_TOKEN,

      phoneNumber:
        process.env.TWILIO_PHONE_NUMBER,
    },
  };
}

/**
 * Shared application configuration.
 */
export const configuration =
  loadConfiguration();

export default configuration;