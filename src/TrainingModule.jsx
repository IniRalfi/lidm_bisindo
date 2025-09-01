import React, { useState, useRef } from "react";
import * as tf from "@tensorflow/tfjs";

const TrainingModule = () => {
  const [logs, setLogs] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [modelAccuracy, setModelAccuracy] = useState(null);
  const fileInputRef = useRef(null);

  const [trainedModel, setTrainedModel] = useState(null);
  const [trainedLabels, setTrainedLabels] = useState([]);

  const addLog = (message) => {
    console.log(message);
    setLogs((prev) => [...prev.slice(-10), message]); // Hanya simpan 10 log terakhir
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 0) {
      trainModel(files);
    }
  };

  const trainModel = async (files) => {
    addLog("Mulai proses training...");
    setModelAccuracy(null);
    setTrainingProgress(0);

    // 1. Baca dan gabungkan semua file JSON
    addLog(`Membaca ${files.length} file dataset...`);
    let allData = [];
    const filePromises = Array.from(files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(JSON.parse(e.target.result));
        reader.onerror = reject;
        reader.readAsText(file);
      });
    });

    try {
      const results = await Promise.all(filePromises);
      allData = results.flat();
    } catch (error) {
      addLog(`Error membaca file: ${error}`);
      return;
    }

    addLog(`Total ${allData.length} frame data terkumpul.`);
    if (allData.length === 0) return;

    // 2. Preprocessing Data
    addLog("Preprocessing data...");
    tf.util.shuffle(allData);

    const uniqueLabels = [...new Set(allData.map((d) => d.letter))].sort();
    const numClasses = uniqueLabels.length;

    if (numClasses < 2) {
      addLog(
        "Pelatihan Dibatalkan: Anda harus mengunggah dataset untuk minimal 2 huruf yang berbeda."
      );
      return;
    }

    const features = allData.map((d) => d.landmarks);
    const labels = allData.map((d) => uniqueLabels.indexOf(d.letter));

    const tensorFeatures = tf.tensor2d(features);
    const tensorLabels = tf.oneHot(tf.tensor1d(labels, "int32"), numClasses);

    // 3. Split Data (80% training, 20% validation)
    const numSamples = tensorFeatures.shape[0];
    const numTrainSamples = Math.floor(numSamples * 0.8);

    addLog(
      `Membagi data: ${numTrainSamples} untuk training, ${
        numSamples - numTrainSamples
      } untuk testing.`
    );

    const trainFeatures = tf.slice(
      tensorFeatures,
      [0, 0],
      [numTrainSamples, -1]
    );
    const testFeatures = tf.slice(
      tensorFeatures,
      [numTrainSamples, 0],
      [-1, -1]
    );
    const trainLabels = tf.slice(tensorLabels, [0, 0], [numTrainSamples, -1]);
    const testLabels = tf.slice(tensorLabels, [numTrainSamples, 0], [-1, -1]);

    // 4. Buat Model Neural Network
    addLog("Membangun arsitektur model...");
    const model = tf.sequential();
    model.add(
      tf.layers.dense({
        inputShape: [features[0].length],
        units: 64,
        activation: "relu",
      })
    );
    model.add(tf.layers.dense({ units: 32, activation: "relu" }));
    model.add(tf.layers.dense({ units: numClasses, activation: "softmax" }));

    model.compile({
      optimizer: tf.train.adam(),
      loss: "categoricalCrossentropy",
      metrics: ["accuracy"],
    });

    // 5. Latih Model
    addLog("Memulai pelatihan model...");
    await model.fit(trainFeatures, trainLabels, {
      epochs: 50,
      validationData: [testFeatures, testLabels],
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const progress = ((epoch + 1) / 50) * 100;
          setTrainingProgress(progress);
          addLog(
            `Epoch ${epoch + 1}: Loss = ${logs.loss.toFixed(
              4
            )}, Acc = ${logs.acc.toFixed(4)}`
          );
        },
      },
    });

    // 6. Evaluasi Model
    addLog("Evaluasi model dengan data tes...");
    const evalResult = model.evaluate(testFeatures, testLabels);
    const accuracy = (await evalResult[1].data())[0] * 100;
    setModelAccuracy(accuracy.toFixed(2));
    setTrainedModel(model);
    setTrainedLabels(uniqueLabels);

    addLog(`Pelatihan Selesai! Akurasi Model: ${accuracy.toFixed(2)}%`);
  };

  const saveModel = async () => {
    if (!trainedModel) {
      addLog("Tidak ada model untuk disimpan.");
      return;
    }
    // Simpan model (akan mengunduh 2 file: .json dan .bin)
    await trainedModel.save("downloads://bisindo-model");

    // Simpan label sebagai file JSON terpisah
    const labelsStr = JSON.stringify(trainedLabels);
    const labelsUri =
      "data:application/json;charset=utf-8," + encodeURIComponent(labelsStr);
    const linkElement = document.createElement("a");
    linkElement.setAttribute("href", labelsUri);
    linkElement.setAttribute("download", "bisindo-labels.json");
    linkElement.click();

    addLog("Model dan Label berhasil disimpan!");
  };

  return (
    <div className="w-full max-w-4xl p-4 bg-gray-700 rounded-lg flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4 text-center">
        Langkah 4: Pelatihan Model
      </h1>
      <p className="mb-4 text-center text-gray-300">
        Unggah semua file `dataset_HURUF.json` yang sudah Anda rekam untuk
        memulai.
      </p>

      <input
        type="file"
        multiple
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept=".json"
      />
      <div className="flex gap-4">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept=".json"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="btn-primary text-lg"
        >
          Pilih File & Latih Model
        </button>

        <button
          onClick={saveModel}
          disabled={!trainedModel}
          className="btn-primary bg-green-600 hover:bg-green-700 text-lg"
        >
          Simpan Model
        </button>
      </div>

      {trainingProgress > 0 && (
        <div className="w-full mt-4">
          <p className="text-center">
            Progress: {Math.round(trainingProgress)}%
          </p>
          <div className="w-full bg-gray-600 rounded-full h-4">
            <div
              className="bg-cyan-500 h-4 rounded-full"
              style={{ width: `${trainingProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {modelAccuracy && (
        <div className="mt-4 text-center">
          <h2 className="text-2xl font-bold text-green-400">
            Akurasi Model: {modelAccuracy}%
          </h2>
        </div>
      )}

      <div className="w-full h-48 bg-gray-900 rounded-lg mt-4 p-2 font-mono text-sm overflow-y-auto">
        {logs.map((log, i) => (
          <p key={i} className="whitespace-pre-wrap">{`> ${log}`}</p>
        ))}
      </div>
    </div>
  );
};

export default TrainingModule;
