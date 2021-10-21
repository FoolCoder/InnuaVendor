import PushNotification from 'react-native-push-notification'

const showNotification =(title,message)=>{
  PushNotification.createChannel(
    {
      channelId: "default-channel-id", // (required)
      channelName: `Default channel`, // (required)
      channelDescription: "A default channel", // (optional) default: undefined.
      soundName: 'sound.mp3', // (optional) See `soundName` parameter of `localNotification` function
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    repeatTime: 5,
    playSound:true

    },
    (created) => console.log(`createChannel 'default-channel-id' returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
  );
  PushNotification.localNotification({
    channelId:"default-channel-id",
    title:title,
    message:message,
    showWhen:true,
    when:new Date().getTime(),
    soundName:'sound.mp3',
    repeatTime: 5,
    playSound:true
    

  })
}

export {showNotification}