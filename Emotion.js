class Emotion extends CsvReader{

    constructor(_lines, _vid){
        super(_lines)
        this.vid = _vid
    }

    update(){
        this.syncTime(this.vid.elt.currentTime)
    }

    draw(){
        // let px = this.currLine[8]-50
        // const py = this.currLine[9]
        const px = 150
        const py = 150
        stroke(255,255,0)
        strokeWeight(3)
        fill(255,255,0,100)
        circle(px,py,100)
        noStroke()
        fill(255,150)
        const s = parseFloat(this.currLine[4]) + parseFloat(this.currLine[6])
        circle(px,py,100 * (1-s))
    }
}