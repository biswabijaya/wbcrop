// get full height of window
// will be used to make sure that the modal container is atleast as tall as the height of the webpage
window.windowHeight = $(window).outerHeight();
// hide modal by default so that it will be opened by .show() when required
window.wbcropModalCover = $('#wbcrop-modal-cover');
$(wbcropModalCover).hide();
// get hidden canvas by id, setup context and initialize hidden canvas image object
const wbcropHiddenCanvas = document.getElementById('wbcrop-hidden-canvas');
const wbcropHiddenCanvasContext = wbcropHiddenCanvas.getContext('2d');
window.wbcropHiddenCanvasImageObject = new Image();
// make sure to put data-wbcrop="" attribute to the input element that is next or previous (sibling) to the image-previewer
// the image-previewer is a <div> that will display the final output of the photo for the user's accord
window.wbcropTargetDisplay = $('*[data-wbcrop=""]');
// get display-picture container, its (inner) height and width
window.wbcropDisplayContainer = document.getElementById('wbcrop-modal-display-container');
window.wbcropDisplayContainerHeight = $(wbcropDisplayContainer).innerHeight();
window.wbcropDisplayContainerWidth = $(wbcropDisplayContainer).innerWidth();
// get the picture-display in the modal
window.wbcropModalDisplay = $('.wbcrop-modal-display');
// get the dashed outline in the picture-display
window.wbcropOutline = document.getElementById('wbcrop-cropper-outline');
// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
window.wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
// get position of wbcrop-cropper-outline
window.wbcropOutlinePosition = $(wbcropOutline).position();
// list of cropper outline handles (holders for the user to use in resizing the cropping view)
// there are 8 handles in total representing points at the top, bottom, left, right, top-left, top-right, bottom-left and bottom-right
window.wbcropOutlineHandles = 
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-nw" id="nw-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-ne" id="ne-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-sw" id="sw-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-se" id="se-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-n" id="n-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-s" id="s-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-e" id="e-outline-handle"></div>' +
	'<div class="wbcrop-outline-handle ui-resizable-handle ui-resizable-w" id="w-outline-handle"></div>'
;
// get left, top, right, bottom, x, y, width, height of wbcrop-modal-display-container
window.wbcropDisplayContainerDimensions = wbcropDisplayContainer.getBoundingClientRect();
// get the modal close button
window.wbcropCloseButton = $('#wbcrop-close');
// get the modal crop button
window.wbcropCropButton = $('#wbcrop-crop-button');
// get the modal rotate button
window.wbcropRotateButton = $('#wbcrop-rotate-button');
// get the modal save button
window.wbcropSaveButton = $('#wbcrop-save-button');
// get anchor <a> around download button which will be used in downloading cropped image
window.wbcropDownloadButton = $("#wbcrop-download-button");
// initialize wbcrop by calling wbcrop("#id"); with "#id" being the id of the input type=file that promps the user for the image
function wbcrop(inputID) {
	$(inputID).click(function() {
		// reset input value to allow same file selection and manipulation
		resetFileInput(inputID);
		// take in input id, check for changes in user input which must be true since it is reset (above)
		wbcropTakeInput(inputID);
	});
}
// function to reset input (value) of input
// resets input value of wbcrop input type=file so that same file can be selected twice
function resetFileInput(inputID) {
  $(inputID).val(null);
}
// function that triggers other functions through file-input's onchange event
function wbcropTakeInput(inputID) {
	$(inputID).change(function(event) {
		// display the selected image on the image previewer
		readURL(this, $(this).siblings(wbcropTargetDisplay));
	});
}
// function to display the selected image on the image previewer
function readURL(input, targetDisplay) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();

		reader.onload = function(e) {
		    $(input).siblings(wbcropTargetDisplay).css("background-image", "url(" + e.target.result + ")");
			wbcropOpenModal(e.target.result);
		}

        reader.readAsDataURL(input.files[0]);
    }
}
// function to draw image on hidden canvas when image is first selected (via input type=file). This canvas is used as a model to produce the final cropped image on another canvas
function drawimg(imageData) {
	wbcropHiddenCanvasImageObject.onload = function(){
	    // setup canvas width and height
	    wbcropHiddenCanvasImageObject.width = wbcropDisplayContainerWidth;
	    wbcropHiddenCanvasImageObject.height = wbcropDisplayContainerHeight;
	    wbcropHiddenCanvas.width = wbcropDisplayContainerWidth;
	    wbcropHiddenCanvas.height = wbcropDisplayContainerHeight;
		// draw image data on canvas
	    wbcropHiddenCanvasContext.drawImage(wbcropHiddenCanvasImageObject, 0, 0, wbcropDisplayContainerWidth, wbcropDisplayContainerHeight);
	};
	wbcropHiddenCanvasImageObject.src = imageData;
	wbcropHiddenCanvas.toDataURL("image/png");
}
// function to draw image on canvas whenever executed. This is used to draw image on a dynamic canvas (canvas created on each execution)
function drawNewImage(imageData) {
	// setup the output canvas
    const wbcropCroppingCanvas = document.getElementById('wbcrop-cropping-canvas');
    const wbcropCroppingCanvasContext = wbcropCroppingCanvas.getContext('2d');
    // initialize output image object
    var wbcropCroppedCanvasImage = new Image();
    // setup canvas width
    wbcropCroppedCanvasImage.width = $(wbcropOutline).outerWidth();
    wbcropCroppedCanvasImage.height = $(wbcropOutline).outerHeight();
    wbcropCroppingCanvas.width = $(wbcropOutline).outerWidth();
    wbcropCroppingCanvas.height = $(wbcropOutline).outerHeight();
    // put image data on canvas
    wbcropCroppingCanvasContext.putImageData(imageData, 0, 0);
    // get dataUrl value of canvas
    var wbcropCroppingCanvasImageUrl = wbcropCroppingCanvas.toDataURL();
    // display cropped image on image-previewer (element with data-wbcrop="" attribute)
    wbcropTargetCastCroppedImage(wbcropCroppingCanvasImageUrl);
    // link cropped image dataUrl to anchor so that user can download it by clicking on anchor
    wbcropLinkImageToAnchor(wbcropCroppingCanvasImageUrl);
}
// function to rotate hidden canvas by specified (input) degrees
function drawRotated(degrees){
	// clearRect() method clears the specified pixels within a given rectangle
	wbcropHiddenCanvasContext.clearRect(0,0,wbcropHiddenCanvas.width,wbcropHiddenCanvas.height);
	// save the unrotated context of the canvas so we can restore it later
	// the alternative is to untranslate & unrotate after drawing
	wbcropHiddenCanvasContext.save();
	// move to the center of the canvas
	wbcropHiddenCanvasContext.translate(wbcropHiddenCanvas.width/2,wbcropHiddenCanvas.height/2);
	// rotate the canvas to the specified degrees
	wbcropHiddenCanvasContext.rotate(degrees*Math.PI/180);
	// draw the image
	// since the context is rotated, the image will be rotated also
	wbcropHiddenCanvasContext.translate(-wbcropHiddenCanvas.width / 2, -wbcropHiddenCanvas.height / 2);
	wbcropHiddenCanvasContext.drawImage(wbcropHiddenCanvasImageObject, 0, 0, wbcropHiddenCanvas.width, wbcropHiddenCanvas.height);
	// we’re done with the rotating so restore the unrotated context
	wbcropHiddenCanvasContext.restore();
}
// function to get the current angle of rotation of an element, taking in element-object
function getRotateValue (element) {                   
	var st = window.getComputedStyle(element, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
			 st.getPropertyValue("-moz-transform") ||
			 st.getPropertyValue("-ms-transform") ||
			 st.getPropertyValue("-o-transform") ||
			 st.getPropertyValue("transform") ||
			 "FAIL";

	// With rotate(30deg)... // matrix(0.866025, 0.5, -0.5, 0.866025, 0px, 0px)
	// console.log('Matrix: ' + tr);
	// rotation matrix - http://en.wikipedia.org/wiki/Rotation_matrix

	var values = tr.split('(')[1].split(')')[0].split(',');
	var a = values[0];
	var b = values[1];
	var c = values[2];
	var d = values[3];

	var scale = Math.sqrt(a*a + b*b);
	// console.log('Scale: ' + scale);
	// arc sin, convert from radians to degrees, round
	var sin = b/scale;
	// next line works for 30deg but not 130deg (returns 50);
	// var angle = Math.round(Math.asin(sin) * (180/Math.PI));
	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
	// console.log('Rotate: ' + angle + 'deg');
	return angle;
}
// function to match cropper-outline dimensions with wbcrop-modal-display2 clip-rect dimensions when resizing cropper-outline
function wbcropOutlineResizing(e, ui) {
	// get width and height
	var width = ui.size.width,
	height = ui.size.height;
	// get position of wbcrop-cropper-outline
	var wbcropOutlinePosition = $(wbcropOutline).position();
	// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
	var wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
	// get wbcrop-modal-display-container height and width
	var wbcropDisplayContainerHeight = $(wbcropDisplayContainer).innerHeight();
	var wbcropDisplayContainerWidth = $(wbcropDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('wbcrop-modal-display'));
	// clip wbcrop-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
	  case -90:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.left + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropOutlinePosition.left + wbcropOutlineDimensions.width) + "px," + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px)");
	    break;
	  case -180:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropDisplayContainerWidth - (wbcropOutlineDimensions.width + wbcropOutlinePosition.left)) + "px)");
	    break;
	  case 90:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerWidth - (wbcropOutlinePosition.left + wbcropOutlineDimensions.width)) + "px," + (wbcropOutlinePosition.top + wbcropOutlineDimensions.height) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + wbcropOutlinePosition.top + "px)");
	    break;
	  default:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.top + "px," + (wbcropOutlineDimensions.width + wbcropOutlinePosition.left) + "px," + (wbcropOutlineDimensions.height + wbcropOutlinePosition.top) + "px," + wbcropOutlinePosition.left + "px)");
	}
}
// function to match cropper-outline dimensions with wbcrop-modal-display2 clip-rect dimensions when dragging cropper-outline
function wbcropOutlineDraging() {
	// get position of wbcrop-cropper-outline
	var wbcropOutlinePosition = $(wbcropOutline).position();
	// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
	var wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
	// get wbcrop-modal-display-container height and width
    var wbcropDisplayContainerHeight = $(wbcropDisplayContainer).innerHeight();
	var wbcropDisplayContainerWidth = $(wbcropDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('wbcrop-modal-display'));
	// clip wbcrop-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
	  case -90:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.left + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropOutlinePosition.left + wbcropOutlineDimensions.width) + "px," + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px)");
	    break;
	  case -180:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropDisplayContainerWidth - (wbcropOutlineDimensions.width + wbcropOutlinePosition.left)) + "px)");
	    break;
	  case 90:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerWidth - (wbcropOutlinePosition.left + wbcropOutlineDimensions.width)) + "px," + (wbcropOutlinePosition.top + wbcropOutlineDimensions.height) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + wbcropOutlinePosition.top + "px)");
	    break;
	  default:
	    $('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.top + "px," + (wbcropOutlineDimensions.width + wbcropOutlinePosition.left) + "px," + (wbcropOutlineDimensions.height + wbcropOutlinePosition.top) + "px," + wbcropOutlinePosition.left + "px)");
	}
}
// function to rotate the modal picture-displays and their children to counter-clockwise direction by 90 degrees
function rotateCounterClockwise(angle) {
	// get the current angle value and minus 90
	angle = angle - 90;
	// rotate the modal picture-displays and their children by the new angle
	$(wbcropModalDisplay).css("transform", "rotate(" + angle + "deg)");
	$(wbcropModalDisplay).children().css("transform", "rotate(" + angle + "deg)");
	// execute function to neutralize the offset on the cropper-outline with respect to the clip-rect dimensions of wbcrop-modal-display2
	wbcropOutlineRotateOffset(angle);
	return angle;
}
// function to neutralize the offset on the cropper-outline with respect to the clip-rect dimensions of wbcrop-modal-display2
function wbcropOutlineRotateOffset(angle) {
	// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
	var wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
	// get position of wbcrop-cropper-outline
	var wbcropOutlinePosition = $(wbcropOutline).position();
	// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
	var wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
	// get wbcrop-modal-display-container height and width
	var wbcropDisplayContainerHeight = $(wbcropDisplayContainer).innerHeight();
	var wbcropDisplayContainerWidth = $(wbcropDisplayContainer).innerWidth();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('wbcrop-modal-display'));
	// clip wbcrop-modal-display2 to match the dimensions and position of the cropper outline
	// each rotation changes the clipped image position and has to be dealt with accordingly
	// see https://tympanus.net/codrops/2013/01/16/understanding-the-css-clip-property/ to learn more
	switch(rotationAngle) {
		case -90:
			$('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.left + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropOutlinePosition.left + wbcropOutlineDimensions.width) + "px," + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px)");
				break;
		case -180:
			$('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerHeight - (wbcropOutlinePosition.top + wbcropOutlineDimensions.height)) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + (wbcropDisplayContainerHeight - wbcropOutlinePosition.top) + "px," + (wbcropDisplayContainerWidth - (wbcropOutlineDimensions.width + wbcropOutlinePosition.left)) + "px)");
				break;
		case 90:
			$('#wbcrop-modal-display2').css('clip', "rect(" + (wbcropDisplayContainerWidth - (wbcropOutlinePosition.left + wbcropOutlineDimensions.width)) + "px," + (wbcropOutlinePosition.top + wbcropOutlineDimensions.height) + "px," + (wbcropDisplayContainerWidth - wbcropOutlinePosition.left) + "px," + wbcropOutlinePosition.top + "px)");
				break;
		default:
			$('#wbcrop-modal-display2').css('clip', "rect(" + wbcropOutlinePosition.top + "px," + (wbcropOutlineDimensions.width + wbcropOutlinePosition.left) + "px," + (wbcropOutlineDimensions.height + wbcropOutlinePosition.top) + "px," + wbcropOutlinePosition.left + "px)");
	}
}
// function to rotate the modal picture-displays and the hidden canvas to counter-clockwise direction by 90 degrees
function wbcropRotateImage() {
	// get the current angle of rotation of one of the modal picture-displays and execute rotateCounterClockwise() which will rotate them both
	rotateCounterClockwise(getRotateValue(document.getElementById('wbcrop-modal-display')));
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('wbcrop-modal-display'));
	// rotate hidden canvas to counter-clockwise direction by 90 degrees
	drawRotated(rotationAngle);
}
// function to crop the hidden canvas image and display it on the dynamic canvas
function wbcropCropImage() {
	// get left, top, right, bottom, x, y, width, height of wbcrop-cropper-outline
	var wbcropOutlineDimensions = wbcropOutline.getBoundingClientRect();
	// get position of wbcrop-cropper-outline
	var wbcropOutlinePosition = $(wbcropOutline).position();
	// get angle of rotation of the modal display-pictures
	var rotationAngle = getRotateValue(document.getElementById('wbcrop-modal-display'));
	// get/copy hidden-canvas image data on the areas inside the cropper-outline
	var imageData = wbcropHiddenCanvasContext.getImageData(wbcropOutlinePosition.left, wbcropOutlinePosition.top, wbcropOutlineDimensions.width, wbcropOutlineDimensions.height);
	// draw image on a dynamic canvas (canvas created on each execution)
	drawNewImage(imageData);
}
// function to open modal taking in the image-url of the input image
function wbcropOpenModal(imageUrl) {
	// function to capture click event on rotate button and execute other functions (rotate image)
	$(wbcropRotateButton).click(function(){
		wbcropRotateImage();
	});
	// function to capture click event on crop button and execute other functions (crop image)
	$(wbcropCropButton).click(function(){
		wbcropCropImage();
	});
	// capture document onclick event and hide modal if user clicks on close button, save button or outside the modal
	$(document).click(function(modalClickEvent) {
		if (modalClickEvent.target.id == $(wbcropCloseButton).attr("id")) {
			// hide modal if document click event is targeted on the close button
			$(wbcropModalCover).hide();
		} else if (modalClickEvent.target.parentNode.id == $(wbcropSaveButton).attr("id")) {
			// hide modal if document click event is targeted on the save/check button
			// parent node is used as the target since data-ripple="" object will override the object making it unaccessible
			// we therefore target the ripple <span> and redirect to its parent (the save button)
			$(wbcropModalCover).hide();
		} else if (modalClickEvent.target.id == $(wbcropModalCover).attr("id")) {
			// hide modal if document click event is targeted on the modal cover (outside the modal and outside the cropping canvas)
			$(wbcropModalCover).hide();
		}
	});
	// function to show modal and then make cropper-outline both draggable and resizable
	$(wbcropModalCover).show("medium", function() {
		// perform other tasks after modal is shown
		// make sure that the height of the modal cover is at least the height of the window
		$(wbcropModalCover).css("min-height", windowHeight);
		// append handles to cropper outline
		// handles act as holders for the user to use in resizing the cropping view
		$(wbcropOutline).append(wbcropOutlineHandles);
		// make the crop-outline make draggable and resizeable to its parent (the display)
		$(wbcropOutline).draggable({
			containment: "parent",
			drag: wbcropOutlineDraging,
			stop: wbcropOutlineDraging,
		}).resizable({
			handles: {
				'nw': '#nw-outline-handle',
				'ne': '#ne-outline-handle',
				'sw': '#sw-outline-handle',
				'se': '#se-outline-handle',
				'n': '#n-outline-handle',
				'e': '#e-outline-handle',
				's': '#s-outline-handle',
				'w': '#w-outline-handle',
			},
			containment: "parent",
			resize: wbcropOutlineResizing,
			stop: wbcropOutlineResizing,
			// aspectRatio: 16 / 16,
		});
	});
	// display inputed image on the modal picture-displays
	$(wbcropModalDisplay).css("background-image", "url(" + imageUrl + ")");
	// draw image on hidden canvas (only executed once)
	drawimg(imageUrl);
}
// function to display cropped image on image-previewer
// it takes in the cropped canvas dataUrl
function wbcropTargetCastCroppedImage(wbcropCroppingCanvasImageUrl) {
	$(wbcropTargetDisplay).css("background-image", "url(" + wbcropCroppingCanvasImageUrl + ")");
}
// function to link cropped image dataUrl to anchor so that user can download it by clicking on anchor
// it takes in the cropped canvas dataUrl
function wbcropLinkImageToAnchor(wbcropCroppingCanvasImageUrl) {
	// set download attribute of anchor with specified name of image to be downloaded
	$(wbcropDownloadButton).attr("download", "wbcrop-cropped-image.png");
	// set href value to dataUrl value of dynamic canvas (canvas that changes on events)
	$(wbcropDownloadButton).attr("href", wbcropCroppingCanvasImageUrl);
}