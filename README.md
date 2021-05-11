# VizSound

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.5.

## About

This is sort of a demo project, mostly to show how I use Observables to handle events and incoming datas that have to be shown in a real time dynamic graph.

In order to mock an API I decided to get some mp3 live streaming and use the Web Audio API to generate changing datas : I just needed to programaticaly call the `getByteFrequencyData()` method of an AnalyserNode created in an instance of AudioContext to simulate the arrival of new datas from a stream.

I choose not to use a `<canvas>` element to draw the graphics repeatedly and prefered to manage everything with my Angular template and bindings because it was more related to my subject.

In the same vein, I didn't use NgRx voluntarily – in fact I hadn't planned to take so much care of the UX and by dint of adding things for the management of the audio flow... I now tell myself that in the end it would have been better to use it for the audio.service, but the subject was initially about how to handle events in the broad sense, so I did that also with eventListeners in this service.

## Use the app

You can find the app at the following address :  
    https://viz-sound.netlify.app

If you want to be sure not to have CORS policy or mixed content issues, you can use this track :
    https://res.cloudinary.com/cbpicstore/video/upload/v1620157467/Music/Firecrackers-Inside.mp3

If your browser have a strict autoplay policy, you may have to click on "Play" after the initial animation, otherwise it will read the stream automatically. Then... Enjoy your little musical rest !

## Development server

To have it working on your computer, enter the following commands in your terminal :
1. Clone the repository :  
	`git clone https://github.com/ChristopheBouriel/Viz-Sound-Streaming.git`
2. Enter inside the root folder of the app :  
	`cd Viz-Sound-Streaming`
3. Install the app :  
    `npm install`
3. Start the Angular server :  
	`ng serve`

You can then navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.



![Screenshots](./Picture.png)