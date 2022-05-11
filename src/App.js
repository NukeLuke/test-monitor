import React, { useEffect, useState, useRef, useCallback } from 'react'
import style from './App.less'

const Page = props => {
    const canvas = useRef(null)
    const canvasDesk = useRef(null)
    const videoRef = useRef(null)
    const video2Ref = useRef(null)
    const video3Ref = useRef(null)
    const instance = useRef({
        timer: 0,
        recordedBlobs: []
    })
    const [s, setS] = useState(0)
    const [cameraUrl, setCameraUrl] = useState(null)
    const [deskUrl, setDeskUrl] = useState(0)

    const clearTimer = () => {
        clearInterval(instance.current.timer)
        setS(0)
    }

    const startRecording = useCallback(() => {
        const { mediaRecorder } = instance.current
        if (mediaRecorder && mediaRecorder.state === 'inactive') {
            console.log('MediaRecorder started', mediaRecorder)
            instance.current.recordedBlobs = []
            mediaRecorder.ondataavailable = (event) => {
                instance.current.recordedBlobs.push(event.data)
            }
            clearTimer()
            instance.current.timer = window.setInterval(() => {
                setS(i => i + 1)
            }, 1000)
            // start(timeslice): 设置 timeslice 可将媒体记录分割，无设置则只有单个 Blob
            mediaRecorder.start(1000)
        }
    }, [])

    const stopRecording = useCallback(() => {
        const { mediaRecorder, recordedBlobs } = instance.current
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            console.log('MediaRecorder stop')
            clearTimer()
            mediaRecorder.stop()
            console.log('Recorded Blobs: ', recordedBlobs)
        }
    }, []);

    const download = async () => {
        const { recordedBlobs } = instance.current

        if (recordedBlobs.length) {
            const blob = new Blob(recordedBlobs, { type: 'video/webm;codecs=vp9' })
            const url = window.URL.createObjectURL(blob)

            // const prober = await Prober.spawn()
            // console.log(prober)

            const a = document.createElement('a')
            a.style.display = 'none'
            a.href = url
            // 文件名 通过方法传进来 检测是否合法？
            a.download = 'bridge-plus.webm'
            document.body.appendChild(a)
            a.click()
            setTimeout(() => {
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }, 100)
        }
    };

    const upload = () => {
        const { recordedBlobs } = instance.current
        if (recordedBlobs.length) {
            const blob = new Blob(recordedBlobs, { type: 'video/webm;codecs=vp9' })
            const data = new FormData()
            data.append('vodeo', blob)
        }
    }

    const play = () => {
        const { recordedBlobs } = instance.current
        if (recordedBlobs.length) {
            const superBuffer = new Blob(recordedBlobs, { type: 'video/webm' })
            if (video2Ref.current) video2Ref.current.src = window.URL.createObjectURL(superBuffer)
        }
    };

    useEffect(() => {

        const options = { mimeType: 'video/webm;codecs=vp9', BitsPerSecond: 100 }
        navigator.mediaDevices
            .getUserMedia({ video: true, audio: true })
            .then(mediaStream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream
                    instance.current.mediaRecorder = new MediaRecorder(
                        mediaStream,
                        options
                    )
                    console.log('Created MediaRecorder', instance.current.mediaRecorder)
                }
            })
    }, [])

    const cameraShot = () => {
        const ctx = canvas.current.getContext('2d')
        ctx.drawImage(videoRef.current, 0, 0, 500, 400)
        const imgURL = canvas.current.toDataURL('image/jpeg', 0.9)
        const imgContainer = document.createElement('div')
        const img = new Image()
        img.src = imgURL
        imgContainer.appendChild(img)
        setCameraUrl(imgURL)

        // 计算base64大小
        const fileLength = parseInt(imgURL.length - (imgURL.length / 8) * 2);
        console.log((fileLength / 1024).toFixed(2));
    }

    const startCapture = async () => {
        let captureStream = null;

        try {
            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
            // @ts-ignore
            // 捕获屏幕
            captureStream = await navigator.mediaDevices.getDisplayMedia();
            // 将MediaStream输出至video标签
        } catch (err) {
            throw "浏览器不支持webrtc" + err;
        }
        return captureStream;
    }

    const desktopShot = () => {
        startCapture().then(captureStream => {
            video3Ref.current.srcObject = captureStream;
            setTimeout(() => {
                const ctx = canvasDesk.current.getContext('2d')
                ctx.drawImage(video3Ref.current, 0, 0, 500, 400)
                const imgURL = canvasDesk.current.toDataURL('image/jpeg', 0.9)
                const imgContainer = document.createElement('div')
                const img = new Image()
                img.src = imgURL
                imgContainer.appendChild(img)
                setDeskUrl(imgURL)
            }, 300)
        })
    }

    const imgDownload = () => {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = cameraUrl
        // 文件名 通过方法传进来 检测是否合法？
        a.download = 'camera.jpeg'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
            document.body.removeChild(a)
        }, 100)
    }

    const deskDownload = () => {
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = deskUrl
        // 文件名 通过方法传进来 检测是否合法？
        a.download = 'desktop.jpeg'
        document.body.appendChild(a)
        a.click()
        setTimeout(() => {
            document.body.removeChild(a)
        }, 100)
    }

    return (
        <div className="Container">
            <div className={style.videos}>
                <div style={{ display: 'flex' }}>
                    <div className="VideoCard" title="录制窗口">
                        <video width={500} height={400} ref={videoRef} autoPlay controls />
                        <div>时间: {s}</div>
                    </div>
                    <div className="VideoCard" title="录制内容">
                        <video width={500} height={400} ref={video2Ref} autoPlay controls />
                    </div>
                    <div className="VideoCard" title="截取桌面">
                        <video width={500} height={400} ref={video3Ref} autoPlay controls />
                    </div>
                </div>

                <div className={style.buttons}>
                    <button onClick={startRecording}>
                        开始录制
                    </button>
                    <button ghost onClick={stopRecording}>
                        结束录制
                    </button>
                    <button onClick={play}>播放</button>
                </div>
                <div className={style.buttons}>
                    <button onClick={cameraShot}>
                        截取摄像头
                    </button>
                    <button ghost onClick={desktopShot}>
                        截取桌面
                    </button>
                </div>
                <div className={style.buttons}>
                    <button ghost onClick={download}>
                        视频下载(需录制视频)
                    </button>
                    <button ghost onClick={imgDownload}>
                        摄像头截图下载
                    </button>
                    <button ghost onClick={deskDownload}>
                        桌面截图下载
                    </button>
                    {/* <button onClick={upload}>上传至服务器</button> */}
                </div>
                <canvas ref={canvas} width={500} height={400} ></canvas>
                <canvas ref={canvasDesk} width={500} height={400} ></canvas>
            </div>
        </div>
    )
}

export default Page
