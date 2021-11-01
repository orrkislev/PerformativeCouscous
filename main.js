let mainVideo = null
let layers = []

function setup() {
    createCanvas(windowWidth,windowHeight);

    input = createFileInput(file=>{
        if (file.type=='video'){
            mainVideo = createVideo(file.data, ()=>{
                mainVideo.volume(0)
                mainVideo.loop()
                mainVideo.hide(0)
            })
        } else if (file.name.includes('pose')){
            loadStrings(file.data, (data)=>{
                layers.push(new PoseEstimation(data,mainVideo))
            })
        } else if (file.name.includes('emotions')){
            loadStrings(file.data, (data)=>{
                a = new VideoLayer("STATE-OF-MIND",color(255,255,0),createVector(600,200))
                a.data = new Emotion(data,mainVideo)
                layers.push(a)
            })
        } else if (file.name.includes('gestures')){
            loadStrings(file.data, (data)=>{
                a = new VideoLayer("GESTURES",color(0,255,0),createVector(300,200))
                a.data = new Gyro(data,mainVideo)
                layers.push(a)
            })
        }
    })
    input.hide()

    $('#browse').on('click',()=>{
        input.elt.click()
    })

    $('#load').on('click',(e)=>{
        mainVideo = createVideo('data/test.mp4', ()=>{
            mainVideo.volume(0)
            mainVideo.loop()
            mainVideo.hide(0)
        })
        loadStrings("data/test.emotions",(data)=>{
            a = new VideoLayer("STATE-OF-MIND",color(255,255,0),createVector(600,200))
            a.data = new Emotion(data,mainVideo)
            a.loadVideo("data/test_face.mp4")
            layers.push(a)
        })
        loadStrings('data/test.pose', (data)=>{
            layers.push(new PoseEstimation(data,mainVideo))
        })
        loadStrings('data/test.gestures', (data)=>{
            a = new VideoLayer("GESTURES",color(0,255,0),createVector(300,200))
            a.data = new Gyro(data,mainVideo)
            a.loadVideo('data/top_track.mp4')
            layers.push(a)
        })
        $('#load').on('click',()=>{
            mainVideo = null
            layers = []
            background(255)
        })
        $('#load').text("clear")
    })
}

function draw(){
    if (mainVideo){
        img = mainVideo.get()
        image(img,0,0)

        for (layer of layers){
            layer.update()
            layer.draw()
        }
    }
}

function mousePressed(){
    for (layer of layers){
        layer.mousePressed()
    }
}
function mouseReleased(){
    for (layer of layers){
        layer.mouseReleased()
    }
}
function mouseClicked(){
    for (layer of layers){
        layer.mouseClicked()
    }
}