import { StringSession } from "telegram/sessions/index.js";
import { CONNECTION_RETRIES, apiCred, } from "../config.js";
import { TelegramClient, Api } from "telegram";
import { saveStringSession } from "../model/db.js";

export const sendCodeHandler = async (req, res,next) => {
    try {
        const phoneNumber = req.body.user.phoneNo
        const stringSession = new StringSession("")
        const teleClient = new TelegramClient(stringSession, apiCred.apiId, apiCred.apiHash, { connectionRetries: CONNECTION_RETRIES, })
        await teleClient.connect()
        const { phoneCodeHash, timeout } = await teleClient.invoke(new Api.auth.SendCode({
            ...apiCred,
            phoneNumber,
            settings: new Api.CodeSettings({
                allowFlashcall: true,
                currentNumber: true,
                allowAppHash: true,
            })
        }))
        const sess = teleClient.session.save()
        await saveStringSession(phoneNumber,sess);
        res.json({ phoneCodeHash })
    } catch (error) {
        next(error)
    }
}

export const teleLoginHandler = async (req, res,next) => {
    try {
        const { phoneCode, phoneCodeHash } = req.body
        const phoneNumber = req.body.user.phoneNo
        const m = req.body.user.session
        console.log(phoneCode, phoneCodeHash, phoneNumber,m)
        const stringSession = new StringSession(m)
        const teleClient = new TelegramClient(stringSession, apiCred.apiId, apiCred.apiHash, { connectionRetries: CONNECTION_RETRIES, testServers:false})
        await teleClient.connect()
        const signIn = await teleClient.invoke(new Api.auth.SignIn({
            phoneNumber, phoneCode, phoneCodeHash
        }))
        const session = teleClient.session.save()
        await saveStringSession(phoneNumber, session)
        res.send("Success")
    } catch (error) {
        next(error)
    }
}