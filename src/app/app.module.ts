import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';

import { StompConfig, StompService } from '@stomp/ng2-stompjs';
import * as SockJS from 'sockjs-client';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LeafletModule.forRoot()
  ],
  providers: [StompService, {provide: StompConfig, useValue: AppModule.getStompConfig()}],
  bootstrap: [AppComponent]
})
export class AppModule {

  public static getStompConfig(): StompConfig {
    return {
      url : socketProvider,
      headers : {},
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

          // Wait in milliseconds before attempting auto reconnect
          // Set to 0 to disable
          // Typical value 5000 (5 seconds)
      reconnect_delay: 5000,

          // Will log diagnostics on console
      debug: true
    };
  }
}
export function socketProvider() {
  return new SockJS('http://localhost:8080/gs-guide-websocket');
}


