# chatapp_angular
Project Description
A minimal ChatGPT‑like Angular app that:

Renders a simple chat interface (user/assistant bubbles, scrollable history).
Calls a configurable GPT endpoint (e.g., Azure OpenAI / Microsoft Foundry / your proxy) directly from the browser using Angular HttpClient.
Shows loading state and friendly error messages.
Preserves conversation history across messages (basic in-memory memory).
Keeps code small and readable for demos/teaching.

Prerequisites

Node.js (LTS recommended) and npm
Angular CLI (v17+):

npm install -g @angular/cli

Create the Angular Project (if you don’t have one yet)

ng new ng-gpt-chat --style=css --routing=false
cd ng-gpt-chat

Copy the provided files into the respective paths:

src/app/app.module.ts
src/app/chat/chat.component.ts
src/app/chat/chat.component.html
src/app/chat/chat.component.css
src/app/services/chat.service.ts
src/app/models/chat.models.ts
src/environments/environment.ts
src/environments/environment.development.ts
(Optional) src/app/app.component.html


If the folders don’t exist, create them (chat, services, models, environments).

