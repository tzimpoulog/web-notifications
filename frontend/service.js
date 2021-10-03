// encode the base64 public key
// to Array buffer which is needed by the subscription option
const urlB64ToUint8Array = (base64String) => {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");
    const rawData = atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  };
  
  const saveSubscription = async (subscription) => {
    const SERVER_URL = "https://45f1270df0f9.ngrok.io/save-subscription";
    const response = await fetch(SERVER_URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscription),
    });
    return response.json();
  };
  
  self.addEventListener("install", async () => {
    // This will be called only once when the service worker is installed for first time.
    try {
      const applicationServerKey = urlB64ToUint8Array(
        "BDr7n2-WOOM9uQ4cwxVvVov6gLzUtCROcHIDQGR_dUwep7O0rPLD0vAdeYzckYoCx0wLkwMtdLgq4XEtPtQe3A8"
      );
      const options = { applicationServerKey, userVisibleOnly: true };
      const subscription = await self.registration.pushManager.subscribe(options);
      console.log(subscription);
      const response = await saveSubscription(subscription);
      console.log(response);
    } catch (err) {
      console.log("Error", err);
    }
  });
  
  self.addEventListener("push", function (event) {
    try { 
      if (event.data) {
        console.log("Push event!!!! ", event.data.text());
        if ("actions" in Notification.prototype) {
          console.log("Action buttons are supported.");
        } else {
          console.log("Action buttons are NOT supported.");
        }
        const options = {
          body: event.data.text(),
          icon: "./logo.png",
          image:
            "./logo.png",
          requireInteraction: true,
          actions: [
            {
              action: "action-one",
              title: "Action One",
              icon: "./action-one",
            },
            {
              action: "action-two",
              title: "Action Two",
              icon: "./action-two",
            },
          ],
        };
        self.registration.showNotification("Wappier Notification", options);
      } else {
        console.log("Push event but no data");
      }
      
    } catch (error) {
      console.log(error);
    }
  });
  
  const showLocalNotification = (title, body, swRegistration) => {
    const options = {
      body,
      // here you can add more properties like icon, image, vibrate, etc.
    };
    console.log("showLocalNotification", options);
    swRegistration.showNotification(title, options);
  };
  