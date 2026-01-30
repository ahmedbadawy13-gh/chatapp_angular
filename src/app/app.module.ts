import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { App } from './app';
import { ChatComponent } from './chat/chat.component';

@NgModule({
  declarations: [App, ChatComponent],
  imports: [BrowserModule, HttpClientModule, FormsModule],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}