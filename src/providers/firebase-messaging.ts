import { Injectable } from "@angular/core";
import { FirebaseApp } from 'angularfire2';
import { GrupoService } from "./grupo/grupo.service";
import { Grupo } from "../model/grupo.model";

@Injectable()
export class FirebaseMessagingProvider {
    
    private messaging;
    private config_key_name = 'fcmTokenCelRel';
    private unsubscribeOnTokenRefresh = () => { };

    constructor(
        private app: FirebaseApp,
        private grupo: GrupoService) {}

    public createSubscribe(code: string): void {
        this.messaging = this.app.messaging();
        navigator.serviceWorker.register('service-worker.js').then((registration) => {
            this.messaging.useServiceWorker(registration);
            //this.disableNotifications()
            let grupo = new Grupo();
            grupo.code = code;
            this.enableNotifications(grupo);
        });
    }    

    public enableNotifications(grupo: Grupo) {
        //console.log('Requesting permission...');
        return this.messaging.requestPermission().then(() => {
            //console.log('Permission granted');
            // token might change - we need to listen for changes to it and update it
            this.setupOnTokenRefresh(grupo);
            return this.updateToken(grupo);
        });
    }

    public disableNotifications() {
        this.unsubscribeOnTokenRefresh();
        this.unsubscribeOnTokenRefresh = () => { };
        return localStorage.clear();
    }

    private updateToken(grupo: Grupo) {
        return this.messaging.getToken().then((currentToken) => {
            if (currentToken) {
                // we've got the token from Firebase, now let's store it in the database

                if(localStorage.getItem(this.config_key_name)){
                    return;
                }
               
                grupo.tk = currentToken;
                this.grupo.save(grupo);

                return localStorage.setItem(this.config_key_name,currentToken);
            } else {
                //console.log('No Instance ID token available. Request permission to generate one.');
            }
        });
    }

    private setupOnTokenRefresh(grupo: Grupo): void {
        this.unsubscribeOnTokenRefresh = this.messaging.onTokenRefresh(() => {
            //console.log("Token refreshed");
            localStorage.setItem(this.config_key_name,'');
            this.updateToken(grupo); 
        });
    }

}