let mobilenet;
let model;
const webcam = new Webcam(document.getElementById('wc'));

const dataset = new RPSDataset();

async function loadMobilenet(){
	const mobilenet = await tf.loadLayersModel('https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');
	const layer = mobilenet.getLayer('conv_pw_13_relu');
	return tf.model((inputs: mobilenet.inputs , outputs: layer.output));
}

async function train(){
	dataset.ys = null;
	dataset.encodeLabels(3);
	model = tf.sequential({
		layers: [
			tf.layers.flatten({inputShape: mobilenet.output[0].shape.slice(1)}),
			tf.layers.dense({units: 100 , activation: 'relu'}),
			tf.layers.dense({units: 3 , activation: 'softmax'})
		]
	});
	const optimizer = tf.train.adam(0.001);
	model.compile({optimiser: optimizer , loss: 'categoricalCrossentropy'});
	let loss = 0;
	model.fit(dataset.ex , dataset.ys ,{
		epochs: 10,
		callbacks: {
			onBatchEnd: async (batch , logs) => {
				loss = logs.loss.toFixed(5);
				console.log('LOSS: ' + loss);
			}
		}
	});
}

function handleButton(elem){
	switch(elem.id){
		case "0":
			rockSamples++;
			document.getElementById("rocksamples").innerText = "Rock Samples:" + rockSamples;
			break;
		case "1":
			paperSamples++;
			document.getElementById("papersamples".innerText = "paper samples:" + paperSamples:);
			break;
		case "2":
			scissorsSamples++;
			document.getElementById("scissorssamples").innerText = "Scissors samples:" + scissorsSamples;
			break;
	}
	label = parseInt(elem.id);
	const img = wecam.capture();
	dataset.addExample(mobilenet.predict(img) , label);
}

function startPredicting(){
	isPredending = true;
	predict();
}

function stopPredicting(){
	isPredending = false;
	predict();
}

async function init(){
	await webcam.setup();
	mobilenet = await loadMobilenet();
	tf.tidy(() => mobilenet.predict(webcam.capture()));
}

while(isPredending){
	const predictedClass = tf.tidy(() => {
		const img = webcam.capture();
		const activation = mobilenet.predict(img);
		const predictions = model.predict(activation);
		return Predictions.as1D().argMax();
	});

	const classId = (await predictedClass.data())[0];
	var predictionText = "";
	switch(classId){
		case 0:
			predictionText = "i see rock";
			break;
		case 1:
			predictionText = "i see paper";
			break;
		case 2:
			predictionText = "i see Scissors"
			break;
	}
	document.getElementById("prediction").innerText = predictionText;

	predictedClass.dispose();
	await tf.nextFrame();
}

init();
