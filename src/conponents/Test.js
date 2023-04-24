
import { useEffect, useRef, useState } from "react";
import usePosenet from "../utils/usePosenet"
import { FileUploader } from "react-drag-drop-files";

export default function Test() {
  const [file, setFile] = useState(null)
  const vidRef = useRef(null)
  const posenet = usePosenet()
  const [svgData, setSvgData] = useState(null)

  const selectFile = (videoFile) => {
    setFile(videoFile)
    vidRef.current.src = URL.createObjectURL(videoFile)
    vidRef.current.onloadedmetadata = processVideo
  }

  const processVideo = () => {
    const vid = vidRef.current
    vid.width = vid.videoWidth
    vid.height = vid.videoHeight
    vid.requestVideoFrameCallback(frame)
  }

  const frame = async () => {
    const vid = vidRef.current
    const pose = await posenet.detect(vid)

    const lines = []
    lines.push(...getLines(pose, ['left_shoulder','left_elbow','left_wrist']))
    lines.push(...getLines(pose, ['right_shoulder','right_elbow','right_wrist']))
    lines.push(...getLines(pose, ['left_hip','left_knee','left_ankle']))
    lines.push(...getLines(pose, ['right_hip','right_knee','right_ankle']))
    lines.push(...getLines(pose, ['left_shoulder','right_shoulder','right_hip','left_hip','left_shoulder']))
    setSvgData({width:vid.width, height:vid.height, lines})

    vid.currentTime += 1/30
    vid.requestVideoFrameCallback(frame)
  }

  return (
    <div>
      {!file && <FileUploader handleChange={selectFile} name="file" label="סרטון מהמצלמה מאחורה" />}
      <video ref={vidRef} />
      {svgData && (
        <svg width={svgData.width} height={svgData.height} style={{position:'absolute',left:0,top:0}}>
          {svgData.lines.map((line, i) => (
            <line key={i}
              x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
              stroke="red" strokeWidth="2" />
          ))}
        </svg>
      )}
    </div>
  );
}

function getLines(pose,parts){
  const points = []
  const lines = []
  if (!pose) return lines
  for (const part of parts) {
    const point = pose.keypoints.find(p => p.name === part)
    points.push(point)
  }
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i]
    const p2 = points[i+1]
    lines.push({x1:p1.x,y1:p1.y,x2:p2.x,y2:p2.y})
  }
  return lines
}