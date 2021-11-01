class PoseEstimation extends CsvReader{

    constructor(_lines, _vid){
        super(_lines)
        this.vid = _vid
    }

    update(){
        this.syncTime(this.vid.elt.currentTime)
    }

    draw(){
        stroke(255,0,0)
        strokeWeight(3)
        // this.multiLine([31,29,27,31]) // right foot
        // this.multiLine([30,32,28,30]) // left foot
        this.multiLine([28,26,24,12,14,16,22])
        this.multiLine([27,25,23,11,13,15,21])
        this.multiLine([16,20,18,16])
        this.multiLine([15,19,17,15])
        this.multiLine([11,12])
        this.multiLine([23,24])
    }

    multiLine(ps){
        for (let i=0;i<ps.length-1;i++){
            this.myLine(ps[i],ps[i+1])
        }
    }

    myLine(i1,i2){
        const x1 = this.currLine[i1*2] * this.vid.width
        const y1 = this.currLine[i1*2+1] * this.vid.height
        const x2 = this.currLine[i2*2] * this.vid.width
        const y2 = this.currLine[i2*2+1] * this.vid.height
        line(x1,y1,x2,y2)
    }
}