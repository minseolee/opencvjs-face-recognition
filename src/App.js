import * as cv from "@techstark/opencv-js";
import * as S from './App.module.css';
import {useEffect, useState} from "react";


const processImage = (src) => {
    cv.imread(src);
}

// cv.imread("/nklee.jpeg");
function App() {
    const [imgUrl, setImgUrl] = useState(null);

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
                        console.log(e.target.files);
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
        </div>
    );
}

export default App;
