import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ChatMessage, ChatRequest, ChatResponse } from '../models/chat.models';

/**
 * ChatService
 * - Injects HttpClient
 * - Reads API configuration from environment files
 * - Sends the full conversation to the configured GPT endpoint
 * - Normalizes responses so the component can remain simple
 *
 * Assumptions:
 * - The GPT-compatible endpoint accepts a JSON like:
 *   {
 *     "messages": [{ role: "user"|"assistant"|"system", content: "..." }, ...],
 *     "model": "optional-model-or-deployment-name"
 *   }
 *
 * - The response may look like various providers. We attempt to parse:
 *   - data.reply (custom/demo)
 *   - data.choices[0].message.content (OpenAI/Azure OpenAI chat)
 *   - data.choices[0].text (completion-like)
 *   - data.output_text (some OSS providers)
 * Adjust as needed for your provider or add more parsing branches.
 */
@Injectable({ providedIn: 'root' })
export class ChatService {
  constructor(private http: HttpClient) {}

  sendMessage(history: ChatMessage[]): Observable<ChatResponse> {
    const url = environment.apiUrl;
    if (!url) {
      return throwError(() => 'API URL is not configured. Set environment.apiUrl.');
    }

    const body: ChatRequest = {
      messages: history,
      model: environment.modelName || undefined, // optional
    };

    // Some providers require 'Authorization: Bearer <token>',
    // others (like Azure OpenAI with key auth) use 'api-key: <key>'.
    // We set both from the same value for flexibility. Use what your endpoint expects.
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: environment.apiKey ? `Bearer ${environment.apiKey}` : '',
      'api-key': environment.apiKey || '', // harmless if unused; remove if not desired
    });

    return this.http.post<any>(url, body, { headers }).pipe(
      map((data: any) => {
        const reply = this.extractReply(data);
        if (!reply) {
          throw new Error('Empty response from model.');
        }
        const response: ChatResponse = { reply, raw: data };
        return response;
      }),
      catchError((err: HttpErrorResponse) => {
        // Produce a user-friendly message without leaking internals.
        if (err.error && typeof err.error === 'object' && 'error' in err.error) {
          const message = (err.error.error?.message || err.message || 'Request failed').toString();
          return throwError(() => `API error: ${message}`);
        }
        return throwError(() => err.message || 'Network error contacting the model API.');
      })
    );
  }

  private extractReply(data: any): string | null {
    if (!data) return null;

    // 1) Custom/demo format: { reply: "..." }
    if (typeof data.reply === 'string' && data.reply.trim()) {
      return data.reply.trim();
    }

    // 2) OpenAI/Azure OpenAI Chat: { choices: [ { message: { content: "..." } } ] }
    const choiceMessage = data?.choices?.[0]?.message?.content;
    if (typeof choiceMessage === 'string' && choiceMessage.trim()) {
      return choiceMessage.trim();
    }

    // 3) Text completion style: { choices: [ { text: "..." } ] }
    const choiceText = data?.choices?.[0]?.text;
    if (typeof choiceText === 'string' && choiceText.trim()) {
      return choiceText.trim();
    }

    // 4) OSS / alternative fields
    if (typeof data.output_text === 'string' && data.output_text.trim()) {
      return data.output_text.trim();
    }

    return null;
  }
}
