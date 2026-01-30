import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ChatService } from '../services/chat.service';
import { ChatMessage, ChatResponse } from '../models/chat.models';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  messages: ChatMessage[] = [];
  userInput = '';
  isLoading = false;
  errorMsg: string | null = null;

  constructor(private chatService: ChatService) {}

  ngOnInit(): void {
    // Optional: Add a friendly first assistant message for UX.
    this.messages.push({
      role: 'assistant',
      content: 'Hi! Ask me anything. I will call the configured GPT endpoint.',
      timestamp: new Date(),
    });
  }

  send(): void {
    const content = this.userInput.trim();
    if (!content || this.isLoading) return;

    // Add the user's message to the conversation
    const userMsg: ChatMessage = {
      role: 'user',
      content,
      timestamp: new Date(),
    };
    this.messages.push(userMsg);

    // Reset state
    this.errorMsg = null;
    this.isLoading = true;
    this.userInput = '';

    // Send the full conversation history to maintain context
    this.chatService
      .sendMessage(this.messages)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (resp: ChatResponse) => {
          const replyContent = resp.reply ?? '(No content returned)';
          const assistantMsg: ChatMessage = {
            role: 'assistant',
            content: replyContent,
            timestamp: new Date(),
          };
          this.messages.push(assistantMsg);
          // Optionally keep resp.raw around for debugging or a dev panel
        },
        error: (err: unknown) => {
          // User-friendly message
          this.errorMsg =
            typeof err === 'string'
              ? err
              : 'Sorry, something went wrong. Please try again.';
        },
      });
  }

  clearChat(): void {
    this.messages = [];
    this.errorMsg = null;
    this.userInput = '';
  }

  onKeyDownEnter(event: KeyboardEvent): void {
    // Allow Shift+Enter to create a newline; Enter alone to send.
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.send();
    }
  }

  trackByIndex(index: number): number {
    return index;
  }
}