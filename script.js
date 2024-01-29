let audioClips = 0;
let clips = [];
let isClipSelected = true;
let nameFilled = false;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is supported.");

    navigator.mediaDevices.getUserMedia({
        audio: true,
    })
    
    // Success callback
    .then((stream) => {
        const mediaRecorder = new MediaRecorder(stream);

        let recording = false;                       
        let audioBlobs = [];
        
        $("#record-button").on("click", StartRecording);
        $("#stop-button").on("click", StopRecording);
        
        // is async
        mediaRecorder.ondataavailable = (e) => {
            audioBlobs.push(e.data);
            console.log("pushed")
        }

        // is async
        mediaRecorder.onstop = () => {
            const blob = new Blob(audioBlobs, { type: "audio/ogg; codecs=opus" });
            const audioURL = window.URL.createObjectURL(blob);
        
            srcElement = document.createElement("source");
            srcElement.src = audioURL;
            srcElement.type = "audio/ogg";

            $('.audio-container').append(srcElement);
        }
        
        function StartRecording() {
            if (!recording && nameFilled) {
                recording = true;
                mediaRecorder.start();
                console.log(mediaRecorder.state)
            }
        }
        
        function StopRecording() {
            if (recording) {
                recording = false;
                audioClips++;
                mediaRecorder.stop();
                
                console.log(mediaRecorder.state)
            }
        }
    })
    
    // Error callback
    .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
    console.log("getUserMedia is not supported.");
}

function CreateClip(clipName, url) {
    let clip = {
        name: clipName,
        url: url,
    };

    return clip;l
}

$("#clip-name-input").on("input", () => {
    if ($("#clip-name-input").val() == "") {
        nameFilled = false;
    } else {
        nameFilled = true;
    }

    if (nameFilled) {
        $("#record-button").css('disabled', true);
    }
})