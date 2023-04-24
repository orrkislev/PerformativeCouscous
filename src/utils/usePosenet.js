import * as tf from "@tensorflow/tfjs"
import * as poseDetection from "@tensorflow-models/pose-detection"
import { useRef } from "react"

export default function usePosenet(props) {
    const detector = useRef(null)
    const pose = useRef(null)
    const width = useRef(null)
    const height = useRef(null)
    const lastPos = useRef(null)

    const init = async (w, h) => {
        if (detector.current) return
        width.current = w
        height.current = h
        const model = poseDetection.SupportedModels.MoveNet;
        detector.current = await poseDetection.createDetector(model);
    }

    const detect = async (video) => {
        if (!detector.current) await init(video.videoWidth, video.videoHeight)

        if (pose.current) lastPos.current = pose.current
        const newPose = await detector.current.estimatePoses(video, {
            maxPoses: 1,
            flipHorizontal: false,
            detectionType: 'single',
            scoreThreshold: 0.5,
        })
        pose.current = newPose[0]
        return newPose[0]
    }

    const getPart = (partName, normalized = false) => {
        if (!pose.current) return null
        const part = pose.current.keypoints.find(k => k.name === partName)
        if (normalized) {
            part.x = part.x / width.current
            part.y = part.y / height.current
        }
        return {x:part.x, y:part.y}
    }

    const getMovement = (partName) => {
        if (!pose.current || !lastPos.current) return 0
        const currPart = pose.current.keypoints.find(k => k.name === partName)
        const x1 = currPart.x * width.current
        const y1 = currPart.y * height.current
        const lastPart = lastPos.current.keypoints.find(k => k.name === partName)
        const x2 = lastPart.x * width.current
        const y2 = lastPart.y * height.current
        const movement = Math.sqrt((x1-x2)**2 + (y1-y2)**2)
        return movement
    }

    return {
        init, detect, getPart, getMovement,
    }
}