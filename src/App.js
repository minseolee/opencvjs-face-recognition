import * as cv from "@techstark/opencv-js";
import * as S from './App.module.css';
import {useEffect, useRef, useState} from "react";
import {detectHaarFace, loadHaarFaceModels} from "./utils/haarFaceDetection";



function App() {
    const [imgUrl, setImgUrl] = useState(null);
    const [faceSize, setFaceSize] = useState(0);
    const haarFaceImgRef = useRef();

    useEffect(() => {
        loadHaarFaceModels().catch((e) => { console.error("Model loading has been failed") });
    }, []);

    const processImage = (imgSrc) => {
        const img = cv.imread(imgSrc);

        // detect faces using Haar-cascade Detection
        const haarFaces = detectHaarFace(img);
        cv.imshow(haarFaceImgRef.current, haarFaces.newImg);
        setFaceSize(() => haarFaces.facesSize);

        // need to release them manually
        img.delete();
        haarFaces.delete();
    }

    return (
        <div className={S["container"]}>
            <h1 className={'mb-32'}>퍼스널 컬러 진단</h1>
            <div className={'mb-32'}>
                <label className={S['input-label']} htmlFor="ex_file">업로드</label>
                <input
                    className={S['input-button']}
                    type="file"
                    name="file"
                    id={"ex_file"}
                    onChange={(e) => {
                        if (e.target.files) {
                            setImgUrl(() => URL.createObjectURL(e.target.files[0]));
                        }
                    }}
                />
            </div>
            <img
                className={S['img-canvas']}
                alt="Original input"
                src={imgUrl}
                onLoad={(e) => {
                    processImage(e.target);
                }}
            />
            <canvas ref={haarFaceImgRef} />
            {!faceSize.length && <h2>얼굴이 검출되지 않습니다</h2>}
        </div>
    );
}

export default App;
