export class DataContainer {
    constructor(data = []) {
        this.data = data
        this.index = 1;
        this.lastGet = null
    }
    insert(data, time) {
        this.data.push({ time, data })
        this.index = this.data.length - 1;
    }
    setData(data) {
        this.data = data ?? null;
        this.index = 1;
    }
    setTime(time) {
        if (this.data.length === 0) return this

        if (time < this.data[0].time) this.index = 0;
        else if (time > this.data[this.data.length - 1].time) this.index = this.data.length - 1
        else {
            while (this.index < this.data.length - 1 && this.data[this.index].time < time) {
                this.index++;
            }
            while (this.index > 0 && this.data[this.index].time > time) {
                this.index--;
            }
        }
        return this
    }
    get(lerpVal = 1) {
        return this.data[this.index].data
        // if (lerpVal == 1) return this.data[this.index].data
        
        // if (!this.lastGet)
        //     this.lastGet = this.data[this.index].data
        // else
        //     this.lastGet = lerpGeneral(this.lastGet, this.data[this.index].data, lerpVal)
        // return this.lastGet
    }
    fillGaps() {
        const filteredData = this.data.map((d, index) => { return { time: d.time, data: d.data, index } }).filter(d => d.data)
        for (let i = 0; i < filteredData.length - 1; i++) {
            const d1 = filteredData[i];
            const d2 = filteredData[i + 1];
            const diff = d2.index - d1.index;
            if (diff > 1) {
                for (let j = 1; j < diff; j++) {
                    this.data[d1.index + j].data = lerpGeneral(d1.data, d2.data, j / diff)
                }
            }
        }
    }
    lowPassFilter(alpha = .5) {
        let last = null
        for (let i = 1; i < this.data.length; i++) {
            if (this.data[i].data) {
                if (!last) last = this.data[i].data
                else {
                    last = lerpGeneral(last, this.data[i].data, alpha)
                    this.data[i].data = last;
                }
            }
        }
    }
    resizer(val, newMin, newMax) {
        let minVal = Infinity;
        let maxVal = -Infinity;
        for (let i = 1; i < this.data.length; i++) {
            if (this.data[i].data) {
                const d = this.data[i].data[val]
                if (d < minVal) minVal = d;
                if (d > maxVal) maxVal = d;
            }
        }
        for (let i = 1; i < this.data.length; i++) {
            if (this.data[i].data) {
                const d = this.data[i].data[val]
                this.data[i].data[val] = newMin + (d - minVal) / (maxVal - minVal) * (newMax - newMin)
            }
        }
    }
}

const lerpGeneral = (a, b, t) => {
    if (Array.isArray(a)) return a.map((d, i) => lerpGeneral(d, b[i], t))
    if (typeof a === 'object') return Object.keys(a).reduce((acc, key) => ({ ...acc, [key]: lerpGeneral(a[key], b[key], t) }), {})
    return a + (b - a) * t
}

export function getPath(drawPos, positions) {
    return positions.map(i => `${drawPos[i].x},${drawPos[i].y}`).join(' ')
}