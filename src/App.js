import * as cv from "@techstark/opencv-js";
import * as S from './App.module.css';
import {useEffect, useRef, useState} from "react";
import {detectHaarFace, loadHaarFaceModels} from "./utils/haarFaceDetection";



function App() {
    const [imgUrl, setImgUrl] = useState(null);
    const [faceSize, setFaceSize] = useState(0);
    const [r, setR] = useState(0);
    const [g, setG] = useState(0);
    const [b, setB] = useState(0);
    const [a, setA] = useState(0);
    const [colorStyle, setColorStyle] = useState({ backgroundColor: `rgba(${r}, ${g}, ${b}, ${a}` });

    const haarFaceImgRef = useRef();

    useEffect(() => {
        loadHaarFaceModels().catch((e) => { console.error("Model loading has been failed") });
    }, []);

    useEffect(() => {
        setColorStyle(() => {
            return {backgroundColor: `rgba(${r}, ${g}, ${b}, ${a})`}
        });
    }, [r,g,b,a]);

    useEffect(() => {
        console.log("colorStyle", colorStyle);
    }, [colorStyle]);

    const processImage = (imgSrc) => {
        const img = cv.imread(imgSrc);

        // detect faces using Haar-cascade Detection
        const haarFaces = detectHaarFace(img);
        cv.imshow(haarFaceImgRef.current, haarFaces.newImg);
        setFaceSize(() => haarFaces.facesSize);

        setR(haarFaces.r);
        setG(haarFaces.g);
        setB(haarFaces.b);
        setA(haarFaces.a);

        // need to release them manually
        // img.delete();
        // haarFaces.delete();
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
            {imgUrl ? <img
                className={S['img-canvas']}
                alt="Original input"
                src={imgUrl}
                onLoad={(e) => {
                    processImage(e.target);
                }}
            /> : <img className={S['img-canvas']} src={'default.png'} />}
            <canvas ref={haarFaceImgRef} />
            {!faceSize && <h2>얼굴이 검출되지 않습니다</h2>}
            {Boolean(faceSize) &&
                <div className={S['color-container']}>
                    <div className={S['color-box']} style={{...colorStyle}}/>
                    <h2>피부색: rgba(${r}, ${g}, ${b}, ${a})</h2>
                </div>
            }
        </div>
    );
}

export default App;
