class APP extends React.Component{
  	videoRef = React.createRef();
  	canvasRef = React.createRef();
  	

  	styles = {
  	position : 'fixed',
  	top : 150,
  	left:150
  	};

  	detectFromVideoFrame = (model , video) =>{
  		model.detect(video).then(predictions => {
  			this.showDetections(predictions);

  			requestAnimationFrame(() => {
  				this.detectFromVideoFrame(model , video);
  			});
  		}, (error) => {
  			console.log("Could not start the webcam")
  			console.error(error)
  		});
  	};

  	showDetections = predictions => {
  		const ctx = this.canvasRef.current.getContext("2d");
  		ctx.clearRect(0 , 0 , ctx.convas.width , ctx.canvas.length);
  		const font = "24px helvetica";
  		ctx.font = font;
  		ctx.textBaseline = top;

  		predictions.forEach(prediction => {
  			const x = prediction.bbox[0];
  			const y = prediction.bbox[1];
  			const width = prediction.bbox[2];
  			const height = prediction.bbox[3];

  			//draw
  			ctx.strokeStyle = "#2fff00";
  			ctx.lineWidth = 1;
  			ctx.strokeRect( x , y , width , height);

  			//label background
  			ctx.fillStyle = "#2fff00";
  			const testWidth = ctx.measureText(prediction.class).width;
  			const textHeight = parseInt(font , 10);

  			//draw top left rectangle
  			ctx.fillRect(x , y , testWidth + 10 , textHeight + 10);

  			//draw bottom left rectangle
  			ctx.fillRect(x , y+height - textHeight , testWidth +15 , textHeight +10);

  			//draw the text last to ensure its on top
  			ctx.fillStyle = "#000000";
  			ctx.fillText(prediction.class , x , y);
  			ctx.fillText(prediction.score.toFixed(2) , x , y + height - textHeight);


  		});
  	};
  }