let activeClipHash;
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
            const clipName = String($("#name-input").val());
        
            let clip = CreateClip(clipName, audioURL);
            activeClipHash = clip.hash;

            let audioElement = document.createElement("source");
            audioElement.src = clip.url;
            audioElement.type = "audio/ogg";

            $("#audio-name").val(clip.name);
            $(".audio-container").empty();
            $(".audio-container").append(audioElement);

            let clipElement = document.createElement("button");
            clipElement.innerHTML = clip.name
            clipElement.classList.add("clip");
            clipElement.setAttribute("audioURL", clip.url);
            clipElement.setAttribute("hash", clip.hash);
            clipElement.removeEventListener('click', SelectClip);
            clipElement.addEventListener('click', SelectClip);
            $(".clip-section").append(clipElement);
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

function StringToHash(string) {
    let hash = 0;
 
    if (string.length == 0) return hash;
 
    for (i = 0; i < string.length; i++) {
        char = string.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
 
    return hash;
}

function CreateClip(clipName, url) {
    let hash = StringToHash(clipName);

    let clip = {
        name: clipName,
        url: url,
        hash: hash
    };
    
    clips.push(clip);
    return clip;
}

function GetActiveClip(hash = null) {
    let foundClip = false;
    let returnClip;

    if (hash == null) {
        clips.forEach((clip) => {
            if (activeClipHash == clip.hash) {
                foundClip = true;
                returnClip = clip;
            }
        })
    } else {
        clips.forEach((clip) => {
            if (activeClipHash == hash) {
                foundClip = true;
                returnClip = clip;
            }
        })
    }

    if (foundClip) {
        return returnClip;
    } else {
        console.log("could not find clip");
        return null;
    }
}

function UpdateActiveClip(clipName) {
    clips.forEach((clip) => {
        if (activeClipHash == clip.hash) {
            clip.name = clipName;
            return;
        }
    })
}

function SelectClip(event) {
    console.log(event.target);

    clipHash = event.target.getAttribute("hash");
    activeClipHash = clipHash;

    let clip = GetActiveClip(clipHash);

    console.log(clip);

    audioElement = document.createElement("source");
    audioElement.src = clip.url;
    audioElement.type = "audio/ogg";

    $("#audio-name").val(clip.name);
    $(".audio-container").empty();
    $(".audio-container").append(audioElement);
}

// make the record button AND stop button disabled by default
if (!nameFilled) {
    $("#record-button").addClass("disabled-button");
    $("#stop-button").addClass("disabled-button");
}

$("#name-input").on("input", () => {
    if ($("#name-input").val() == "") {
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

$("#audio-name").on("input", () => {
    if ($("#audio-name").val() == "") {
        // do nothing
    } else {
        UpdateActiveClip($("#audio-name").val());
        console.log(clips);
    }
})

$("#rename-button").on("click", () => {
    $("#audio-name").focus();
})

