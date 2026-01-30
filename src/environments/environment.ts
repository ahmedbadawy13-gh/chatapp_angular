export const environment = {
  production: true,

  /**
   * URL of your GPT-compatible endpoint.
   * Examples:
   * - Azure OpenAI (chat): https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=2024-06-01
   * - Generic proxy you own: http://localhost:7071/api/chat
   */
  apiUrl: 'https://YOUR_GPT_ENDPOINT_URL',

  /**
   * API key or token used in Authorization or api-key headers.
   * DO NOT COMMIT REAL SECRETS.
   */
  apiKey: '',

  /**
   * Optional model / deployment name.
   * For Azure OpenAI, the deployment name is usually part of the URL path, so this might not be used.
   */
  modelName: 'gpt-4o-mini',
};