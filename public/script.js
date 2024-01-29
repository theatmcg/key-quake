let audioClips = 0;
let clips = [];
let nameFilled = false;

if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia is supported.");

    navigator.mediaDevices.getUserMedia({
        audio: true,
    })
    
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
            const clipName = String($('#clip-name-input').val());
        
            audioElement = document.createElement("source");
            audioElement.src = audioURL;
            audioElement.type = "audio/ogg";

            $('#audio-name').html(clipName);
            $('.audio-container').append(audioElement);

            clips.append(CreateClip(clipName, audioURL));
            audioClips = clips.length;

            clipElement = document.createElement("div");
            clipElement.innerHTML = clipName
            clipElement.classList.add("clip");
            clipElement.setAttribute('audioURL', audioURL);

            $('.clip-section').append(clipElement);
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
    
    .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
    });
} else {
    console.log("getUserMedia is not supported.");
}

function AddClip(clipName, url) {
    let clip = {
        name: clipName,
        url: url,
    };

    return clip;
}

// make the record button AND stop button disabled by default
if (!nameFilled) {
    $("#record-button").addClass("disabled-button");
    $("#stop-button").addClass("disabled-button");
}

$("#clip-name-input").on("input", () => {
    if ($("#clip-name-input").val() == "") {
        nameFilled = false;
    } else {
        nameFilled = true;
    }

    if (!nameFilled) {
        $("#record-button").addClass("disabled-button");
        $("#stop-button").addClass("disabled-button");
    } else {
        $("#record-button").removeClass("disabled-button");
        $("#stop-button").removeClass("disabled-button");
    }
})