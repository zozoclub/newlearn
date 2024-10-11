importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyBwSePpbwxALHlejMVOjKZLW-y1qokHS6s",
  authDomain: "newlearn-66b2c.firebaseapp.com",
  projectId: "newlearn-66b2c",
  storageBucket: "newlearn-66b2c.appspot.com",
  messagingSenderId: "542353120723",
  appId: "1:542353120723:web:1ec5ed90d47e5732546326",
});

const messaging = firebase.messaging();

// 푸시 이벤트 처리 (초기 로드 시 바로 등록)
self.addEventListener("push", function (event) {
  console.log("푸시 메시지 수신:", event);

  let data;
  try {
    // 이벤트 데이터가 JSON 형식인지 확인
    data = event.data ? event.data.json() : {};
  } catch (e) {
    console.error("푸시 메시지 데이터 파싱 오류:", e);
    // 데이터가 JSON이 아닌 경우 기본값 설정
    data = {
      notification: {
        title: "기본 제목",
        body: "기본 메시지 내용",
        icon: "/firebase-logo.png",
      },
    };
  }

  const notificationTitle = data.notification?.title || "알림 제목";
  const notificationOptions = {
    body: data.notification?.body || "알림 내용",
    icon: data.notification?.icon || "/firebase-logo.png",
  };

  // 알림 표시
  event.waitUntil(
    self.registration.showNotification(notificationTitle, notificationOptions)
  );
});

// 백그라운드 상태에서 메시지를 수신할 때
messaging.onBackgroundMessage(function (payload) {
  console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신 ", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
