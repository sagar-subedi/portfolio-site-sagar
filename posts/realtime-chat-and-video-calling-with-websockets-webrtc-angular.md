---

title: "Creating Real-Time Chat and Video Calling Applications with WebSockets, WebRTC, and Angular"  
date: "2024-11-25"  
author: "Sagar Subedi"  
tags: ["WebSockets", "Angular", "WebRTC", "Real-Time Communication", "Web Development", "Video Calling"]  
category: "Web Development"  
description: "Learn how to build a scalable real-time chat and video calling application using WebSockets, WebRTC, and Angular. This guide provides a hands-on approach to implementing bi-directional communication and video calling features."

---

Real-time communication is an essential feature for modern web applications, enabling instant messaging, notifications, and collaborative tools. In this guide, we’ll explore how to build a **real-time chat** and **video calling** application using **WebSockets**, **WebRTC**, **Spring Boot** as a signaling server, and **Angular** for the front-end.

## Understanding WebSockets

WebSockets provide a full-duplex communication channel over a single TCP connection, making them ideal for real-time interactions. Unlike traditional HTTP, which requires a request-response cycle, WebSockets allow the server and client to exchange data freely without repeated requests. This is particularly useful for applications like messaging and notifications, where real-time performance is critical.

## Why Angular and WebSockets?

Angular is a popular front-end framework that provides powerful tools for building dynamic, single-page applications. With features like two-way data binding and RxJS, Angular makes it easy to integrate real-time communication via WebSockets, ensuring a smooth and scalable user experience.

WebSockets allow the application to push messages from the server to the client instantly, ensuring that the chat and video calling experience feels immediate and engaging. 

## Setting Up Angular with WebSockets

Let’s first set up the chat functionality with WebSockets before moving to the video calling part.

### 1. Create a New Angular Project

Start by creating a new Angular project using the Angular CLI:

```bash
ng new real-time-chat-video
cd real-time-chat-video
```

### 2. Install WebSocket Dependencies

We’ll use the native JavaScript `WebSocket` API to integrate WebSockets into our Angular application. 

### 3. Implement WebSocket Service for Chat

Create a service that will handle communication between the client and the server. For simplicity, let’s call it `websocket.service.ts`:

```typescript
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket: WebSocket;

  constructor() {
    // Connect to WebSocket server
    this.socket = new WebSocket('ws://localhost:8080/chat');
  }

  sendMessage(message: string) {
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(message);
    }
  }

  receiveMessages() {
    return new Observable<string>((observer) => {
      this.socket.onmessage = (event) => {
        observer.next(event.data);
      };
      this.socket.onerror = (error) => {
        observer.error(error);
      };
    });
  }

  closeConnection() {
    if (this.socket) {
      this.socket.close();
    }
  }
}
```

### 4. Creating the Chat Component

Create the `chat.component.ts` component for chat functionality:

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  message: string = '';
  messages: string[] = [];
  private socketSubscription: any;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.socketSubscription = this.webSocketService.receiveMessages().subscribe((message: string) => {
      this.messages.push(message);
    });
  }

  ngOnDestroy(): void {
    if (this.socketSubscription) {
      this.socketSubscription.unsubscribe();
    }
    this.webSocketService.closeConnection();
  }

  sendMessage(): void {
    if (this.message.trim()) {
      this.webSocketService.sendMessage(this.message);
      this.messages.push(this.message);
      this.message = '';
    }
  }
}
```

### 5. Setting Up the HTML Template for Chat

In `chat.component.html`, set up the basic structure of the chat interface:

```html
<div class="chat-container">
  <h1>Real-Time Chat</h1>
  <div class="messages">
    <div *ngFor="let msg of messages">{{ msg }}</div>
  </div>
  <input [(ngModel)]="message" placeholder="Type a message" />
  <button (click)="sendMessage()">Send</button>
</div>
```

### 6. Run the Angular Application

To start the Angular development server:

```bash
ng serve
```

Your real-time chat application should now be running on `http://localhost:4200/`.

## Implementing WebRTC for Video Calling

WebRTC (Web Real-Time Communication) enables peer-to-peer video, voice, and data sharing between browser clients. It's a powerful API that works natively in modern browsers without needing additional plugins. To integrate WebRTC into our chat application, we'll set up video calling functionality and use **Spring Boot** as the signaling server.

### 1. WebRTC Video Calling – Front-End (Angular)

#### Setting Up Video Elements

In your `chat.component.html`, add video elements for local and remote video streams:

```html
<div class="video-container">
  <video #localVideo autoplay muted></video>
  <video #remoteVideo autoplay></video>
</div>
```

#### WebRTC Setup in Component

In `chat.component.ts`, initialize the WebRTC API:

```typescript
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { WebSocketService } from './websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, OnDestroy {
  @ViewChild('localVideo') localVideo!: ElementRef;
  @ViewChild('remoteVideo') remoteVideo!: ElementRef;
  private peerConnection: RTCPeerConnection | undefined;
  private localStream: MediaStream | undefined;

  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.initializeWebRTC();
    this.webSocketService.receiveMessages().subscribe(message => {
      // Handle signaling messages (offer/answer/ICE candidates)
      this.handleSignalingMessage(JSON.parse(message));
    });
  }

  ngOnDestroy(): void {
    if (this.peerConnection) {
      this.peerConnection.close();
    }
  }

  initializeWebRTC() {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => {
      this.localStream = stream;
      this.localVideo.nativeElement.srcObject = stream;
    });
  }

  // Handle signaling messages
  handleSignalingMessage(message: any) {
    switch (message.type) {
      case 'offer':
        this.handleOffer(message);
        break;
      case 'answer':
        this.handleAnswer(message);
        break;
      case 'candidate':
        this.handleCandidate(message);
        break;
    }
  }

  // Sending signaling data to server
  sendSignalingMessage(message: any) {
    this.webSocketService.sendMessage(JSON.stringify(message));
  }

  // Create and send an offer
  createOffer() {
    this.peerConnection = new RTCPeerConnection();
    this.localStream?.getTracks().forEach(track => this.peerConnection!.addTrack(track, this.localStream!));

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({ type: 'candidate', candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };

    this.peerConnection.createOffer().then(offer => {
      return this.peerConnection!.setLocalDescription(offer);
    }).then(() => {
      this.sendSignalingMessage({ type: 'offer', offer: this.peerConnection!.localDescription });
    });
  }

  // Handle an offer message
  handleOffer(message: any) {
    this.peerConnection = new RTCPeerConnection();
    this.localStream?.getTracks().forEach(track => this.peerConnection!.addTrack(track, this.localStream!));

    this.peerConnection.setRemoteDescription(new RTCSessionDescription(message.offer));
    this.peerConnection.createAnswer().then(answer => {
      return this.peerConnection!.setLocalDescription(answer);
    }).then(() => {
      this.sendSignalingMessage({ type: 'answer', answer: this.peerConnection!.localDescription });
    });

    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignalingMessage({ type: 'candidate', candidate: event.candidate });
      }
    };

    this.peerConnection.ontrack = (event) => {
      this.remoteVideo.nativeElement.srcObject = event.streams[0];
    };
  }

  // Handle an answer message
  handleAnswer(message: any) {
    this.peerConnection!.setRemoteDescription(new RTCSessionDescription(message.answer));
  }

  // Handle ICE candidates
  handleCandidate(message: any) {
    const candidate = new RTCIceCandidate(message.candidate);
    this.peerConnection!.addIceCandidate(candidate);
  }
}
```

### 2. Spring Boot as a Signaling Server

We’ll use **Spring Boot** as the signaling server for WebRTC. The signaling server is responsible for exchanging messages like **offer**, **answer**, and **ICE candidates** between peers.

#### Setting Up Spring Boot Project

Use Spring Initializr or your preferred method to create a Spring Boot project with the necessary dependencies: `WebSocket` and `Spring Web`.

```bash
spring init --dependencies=websocket,web data-springboot-signaling-server
```

#### Implementing Signaling Server

In your Spring Boot application, create a WebSocket controller to handle signaling messages:

```java
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
public class WebRTCController {

    @MessageMapping("/chat")
    public void handleSignalingMessage(String message) {
        // Broadcast message to all connected clients
        messagingTemplate.convertAndSend("/topic/messages", message);
    }
}
```

#### Running the Server

Run the Spring Boot application:

```bash
mvn spring-boot:run
```

This will start the WebSocket server that will handle the signaling for WebRTC connections.

---

## Conclusion

By combining **WebSockets**, **WebRTC**, **Spring Boot**, and **Angular**, you can create powerful real-time communication applications. From text messaging with WebSockets to video calling with WebRTC, this guide provides a hands-on approach to building a robust, interactive platform for your users. 

With the included chat and video calling functionality, your application will offer a seamless experience with both audio/video support and messaging—all powered by real-time communication technologies.

Happy coding!