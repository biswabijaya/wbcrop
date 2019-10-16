# Wbcrop | Image Cropper
Load the following supporting libraries on page.

```
    <!-- wbcrop CSS bundle -->
    <link rel="stylesheet" href="assets/css/ripple.css">
    <link rel="stylesheet" href="assets/css/normalize.css">
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
    <link rel="stylesheet" href="assets/css/wbcrop.css">
    <!-- wbcrop JS bundle -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="assets/js/jquery.ui.touch-punch.min.js" defer></script>
    <script src="assets/js/ripple.js" defer></script>
    <script src="assets/js/wbcrop.js" defer></script>
```

## HTML
Create file upload box with image preview container which will display final image preview.
```
 <div>
        <div id="" class="image-previewer" data-wbcrop=""></div>
        <input id="wbcrop-input" type="file" name="">
</div>
```

Create a modal window in which you can resize/rotate/crop the image.
```
<!-- Modal content -->
        <div id="wbcrop-modal" class="wbcrop-modal">
            <div id="wbcrop-close" class="wbcrop-close">&times;</div>
            <div id="wbcrop-modal-display-container" class="wbcrop-modal-display-container">
                <div id="wbcrop-modal-display" class="wbcrop-modal-display"></div>
                <div id="wbcrop-modal-cropper" class="wbcrop-modal-cropper"></div>
                <div id="wbcrop-modal-display2" class="wbcrop-modal-display" style="clip: rect(46px, 205px, 205px, 46px);"></div>
                <div id="wbcrop-cropper-outline" class="wbcrop-cropper-outline" style="left:45px; top:45px; width: 160px; height: 160px;"></div>
            </div>
            <div class="wbcrop-modal-buttons-container">
                <a id="wbcrop-download-button" class="wbcrop-modal-button" data-ripple="">
                        <img class="wbcrop-svg" src="assets/icons/feather/download.svg">
                </a>
                <a id="wbcrop-rotate-button" class="wbcrop-modal-button" data-ripple="">
                    <!-- <svg class="feather">
                        <use xlink:href="assets/icons/feather/feather-sprite.svg#circle"/>
                    </svg> -->
                    <img class="wbcrop-svg" src="assets/icons/feather/rotate-ccw.svg">
                </a>
                <a id="wbcrop-crop-button" class="wbcrop-modal-button" data-ripple="">
                    <img class="wbcrop-svg" src="assets/icons/feather/crop.svg">
                </a>
                <a id="wbcrop-save-button" class="wbcrop-modal-button" data-ripple="">
                    <img class="wbcrop-svg" src="assets/icons/feather/check-square.svg">
                </a>
            </div>
</div>
```

Create canvas element to preview the cropped image in the modal.

```
<div class="wbcrop-cropping-canvas-container">
            <canvas id="wbcrop-cropping-canvas"></canvas>
</div>
```

## JS
Finally Initialize the image cropper by calling the function on the file input.

```javascript
$(function() {   
  wbcrop("#wbcrop-input");
});
```
See live demo - https://www.biswabijaya.com/wbcrop/

