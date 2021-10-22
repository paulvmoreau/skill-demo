import { Component } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBi0LvdNZleOvpPpZv9EXsQ9YqQ-aZRcaM",
  authDomain: "skill-demo-41dd3.firebaseapp.com",
  projectId: "skill-demo-41dd3",
  storageBucket: "skill-demo-41dd3.appspot.com",
  messagingSenderId: "542168834515",
  appId: "1:542168834515:web:c15a2bdc27c200675ccf26",
  measurementId: "G-VRYPK69560"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'skill-demo';
}
