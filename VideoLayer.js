class VideoLayer{
    constructor(_name,_color,_pos){
        this.inputBtn = createFileInput(file=>{
            if (file.type=='video'){
                this.vid = createVideo(file.data, ()=>{
                    this.vid.volume(0)
                    this.vid.loop()
                    this.vid.hide(0)
                    this.vid.elt.currentTime = mainVideo.elt.currentTime
                    this.size.x = this.vid.width
                    this.size.y = this.vid.height
                })
                this.inputBtn.remove()
            }
        })
        this.inputBtn.hide()

        
        this.pos = _pos
        this.name = _name
        this.color = _color
        this.data = null
        this.dragging = false
        this.size = createVector(150,150)
    }

    loadVideo(file){
        this.vid = createVideo(file, ()=>{
            this.vid.volume(0)
            this.vid.loop()
            this.vid.hide(0)
            this.vid.elt.currentTime = mainVideo.elt.currentTime
            this.size.x = this.vid.width
            this.size.y = this.vid.height
        })
    }

    update(){
        if (this.data) {
            this.data.update()
        }
        if (this.dragging) {
            this.pos.x = mouseX-this.dragOffset.x
            this.pos.y = mouseY-this.dragOffset.y
        }            
    }

    mousePressed(){
        if (mouseX > this.pos.x && mouseX < this.pos.x + this.size.x &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.size.y){
            this.dragging = true
            this.dragOffset = createVector(mouseX-this.pos.x,mouseY-this.pos.y)
        }
    }
    mouseReleased(){
        this.dragging = false
    }
    mouseClicked(){
        if (mouseX > this.pos.x && mouseX < this.pos.x + this.size.x &&
            mouseY > this.pos.y && mouseY < this.pos.y + this.size.y **
            !this.vid){
            this.inputBtn.elt.click()
        }
    }

    draw(){
        translate(this.pos.x,this.pos.y)

        const ts = 20
        noFill()
        stroke(this.color)
        strokeWeight(3)
        rect(0,0,this.size.x+2,this.size.y+2)
        if (this.vid){
            const img = this.vid.get()
            image(img,0,0)
        } else {
            line(0,0,this.size.x,this.size.y)
            line(0,this.size.y,this.size.x,0)
        }
        fill(this.color)
        noStroke()
        rect(0,0,textWidth(this.name)+10,ts)
        fill(0)
        textSize(ts)
        textAlign(LEFT,TOP)
        text(this.name,5,0)

        if (this.data) {
            this.data.draw()
        }

        resetMatrix()
    }
}