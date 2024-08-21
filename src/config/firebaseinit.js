import { initializeApp, applicationDefault, cert } from "firebase-admin/app"
import { getMessaging } from 'firebase-admin/messaging'
import serviceAccoount from './../../play999-app-firebase-adminsdk-fx99b-9adc435c81.json' assert { type: 'json'}

function initializeFirebase() {
    console.log(serviceAccoount)
    initializeApp({
        credential: cert(serviceAccoount)
    })
}

export { initializeFirebase, getMessaging }