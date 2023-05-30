import cv from "@techstark/opencv-js";
import { loadDataFile } from "./cvDataFile";
import {findMostFrequentNumber} from "./findMostFrequentNumber";

export async function loadHaarFaceModels() {
    try {
        console.log("=======start downloading Haar-cascade models=======");
        await loadDataFile(
            "haarcascade_frontalface_default.xml",
            "models/haarcascade_frontalface_default.xml"
        );
        await loadDataFile("haarcascade_eye.xml", "models/haarcascade_eye.xml");
        console.log("=======downloaded Haar-cascade models=======");
    } catch (error) {
        console.error(error);
    }
}

/**
 * Detect faces from the input image.
 * See https://docs.opencv.org/master/d2/d99/tutorial_js_face_detection.html
 * @param {cv.Mat} img Input image
 * @returns a new image with detected faces drawn on it.
 */
export function detectHaarFace(img) {
    const newImg = img.clone();

    const gray = new cv.Mat();
    cv.cvtColor(newImg, gray, cv.COLOR_RGBA2GRAY, 0);

    const faces = new cv.RectVector();
    const eyes = new cv.RectVector();
    const faceCascade = new cv.CascadeClassifier();
    const eyeCascade = new cv.CascadeClassifier();
    // load pre-trained classifiers
    faceCascade.load("haarcascade_frontalface_default.xml");
    eyeCascade.load("haarcascade_eye.xml");
    // detect faces
    const msize = new cv.Size(0, 0);
    faceCascade.detectMultiScale(gray, faces, 1.1, 3, 0, msize, msize);

    const r = [];
    const g = [];
    const b = [];
    const a = [];

    const roiGray = gray.roi(faces.get(0));
    const roiSrc = newImg.roi(faces.get(0));
    const point1 = new cv.Point(faces.get(0).x, faces.get(0).y);
    const point2 = new cv.Point(
        faces.get(0).x + faces.get(0).width,
        faces.get(0).y + faces.get(0).height
    );
    cv.rectangle(newImg, point1, point2, [255, 0, 0, 255]);

    // detect eyes in face ROI
    eyeCascade.detectMultiScale(roiGray, eyes);
    for (let j = 0; j < eyes.size(); ++j) {
        const point1 = new cv.Point(eyes.get(j).x, eyes.get(j).y);
        const point2 = new cv.Point(
            eyes.get(j).x + eyes.get(j).width,
            eyes.get(j).y + eyes.get(j).height
        );
        cv.rectangle(roiSrc, point1, point2, [0, 0, 255, 255]);
    }

    const x = faces.get(0).x;
    const y = faces.get(0).y;

    for (let j = x; j < x + faces.get(0).width; j++) {
        for (let k = y; k < y + faces.get(0).height; k++) {
            r.push(newImg.ucharPtr(j, k)[0]);
            g.push(newImg.ucharPtr(j, k)[1]);
            b.push(newImg.ucharPtr(j, k)[2]);
            a.push(newImg.ucharPtr(j, k)[3])
        }
    }

    return {
        newImg: newImg,
        facesSize: faces.size(),
        r: findMostFrequentNumber(r),
        g: findMostFrequentNumber(g),
        b: findMostFrequentNumber(b),
        a: findMostFrequentNumber(a),
    };
}
