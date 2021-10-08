import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app-camara';
  public showWebcam: boolean;
  public allowSwitchingCameras: boolean; //permite el cambio de la camrara
  public multipleCamerasAvailable: boolean; //multiples camaras disponibles
  public device: string; //id dispositivo
  public base64: string = localStorage.getItem("image")!; //image base64
  public videoOptions: MediaTrackConstraints = {
    // width: { ideal: 1024 },
    // height: { ideal: 576 }
  }; //opciones de video

  public errors: WebcamInitError[] = []; //errores al cargar la camara
  public imageWebcam!: WebcamImage; //ultima captura de foto
  public trigger: Subject<void> = new Subject<void>(); //cada trigger para una captura o foto
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>(); //cambiar a la camara siguiente o anterior

  constructor(private _sanitizer: DomSanitizer) {
    this.showWebcam = true;
    this.allowSwitchingCameras = true;
    this.multipleCamerasAvailable = false;
    this.device = "";
  }


  public ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs()
      .then((mediaDevice: MediaDeviceInfo[]) => {
        this.multipleCamerasAvailable = mediaDevice && mediaDevice.length > 1
      }
      )
  }

  //Moverse a la siguiente pagina
  public triggerSnapshot(): void {
    this.trigger.next()
  }

  //verifica si no hay camara pasa a la siguiente
  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitialError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public handleImage(imageWebcam: WebcamImage): void {
    console.info('Imagen de la webcam recibido');
    this.imageWebcam = imageWebcam;
    localStorage.setItem('image', imageWebcam.imageAsDataUrl)
  }

  public showNextWebcam(directionOnDeviceId: boolean): void {
    this.nextWebcam.next(directionOnDeviceId);
  }

  public cameraSwitched(device: string): void {
    console.log(`dispositivo actual: ${device}`);
    this.device = device;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam;
  }
}
