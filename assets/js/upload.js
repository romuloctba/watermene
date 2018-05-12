(function() {

    'use strict';

    /**
     * Quick and dirty upload script to demonstrate uploading
     * a watermarked image.
     */

    /**
     * A variable for storing the cached target image
     */
    var original;

    /**
     * Given a file input, set the value of the readonly text input associated with it
     */
    function setText(input) {
        var group = input.parentNode.parentNode.parentNode;
        group.querySelector('.form-control').value = input.files[0].name;
    }

    function toggleSendImage () {
        document.querySelector('#targetForm').setAttribute('style', 'display: none');

		var elementsToShow = document.getElementsByClassName('show-after-upload');

		for (var i = 0; i < elementsToShow.length; i++) {
		  elementsToShow[i].setAttribute('style', 'display: block');
		}
    }
    /**
     * A listener that fires when the target image is selected
     */
    function setTarget(file) {
        enableWaterMene();
        toggleSendImage();
        Array.prototype.forEach.call(document.querySelectorAll('input[name=position]'), function (radio) {
            radio.removeAttribute('disabled');
        });
        watermark([file])
            .image(function(target) { return target;  })
            .then(function (img) {
                document.getElementById('preview').appendChild(img);
            });
    }
    function enableWaterMene () {
        document.querySelectorAll('input[name=watermene]').forEach(function(item){ item.removeAttribute('disabled') });
    }
    /**
     * A listener that fires when the watermark image has been selected
     */
    function setWatermark(file) {
        var preview = document.getElementById('preview'),
            img = preview.querySelector('img'),
            position = document.querySelector('input[name=position]:checked').value,
            posX,
            posY,
            alpha;

        if (! original) {
            original = img;
        }

        if (position === "custom") {
            posX = document.querySelector('input[name=horizontal]').value;
            posY = document.querySelector('input[name=vertical]').value;
        }
        alpha = document.querySelector('input[name=alpha]').value;
        watermark([original, file])
            .image(watermark.image[position](alpha, posX, posY))
            .then(function(marked) {
                preview.replaceChild(marked, img);
            });
    }

    /**
     * Check if the watermark has been selected
     */
    function isWatermarkSelected() {
        var watermark = document.querySelector("input[name='watermene']:checked");
        return !!watermark.value;
    }

    /**
     * Run the sample app once dom content has loaded
     */
    document.addEventListener('DOMContentLoaded', function () {

        /**
         * Handle file selections and position choice
         */
        document.addEventListener('change', function (e) {
            var input = e.target;

            if (input.type === 'file') {
                setText(input);
                input.id === 'target' ? setTarget(input.files[0]) : setWatermark(input.files[0]);
            }

            if (input.type === 'radio' && isWatermarkSelected()) {
                var pos_range = document.getElementById("range");
                pos_range.style.display = (input.value === 'custom') ? 'block' : 'none';
                setWatermark(document.querySelector("input[name='watermene']:checked").value);
            }

            if (input.type === 'range' && isWatermarkSelected()) {
                document.getElementById("horizontal-span").innerHTML = document.querySelector("input[name='horizontal']").value;
                document.getElementById("vertical-span").innerHTML = document.querySelector("input[name='vertical']").value;
                setWatermark(document.querySelector("input[name='watermene']:checked").value);
            }
        });

        /**
         * Handle form submission - i.e actually do the upload
         */
        var form = document.getElementById('uploadForm');
        form.addEventListener('submit', function (e) {
            var progress = document.getElementById('progress'),
                bar = progress.querySelector('.progress-bar'),
                complete = document.getElementById('complete'),
                err = document.getElementById('error');

            progress.style.visibility = 'visible';

            upload(function(e) {
                if (e.lengthComputable) {
                    var percent = (e.loaded / e.total) * 100;
                    bar.style.width = percent + "%";
                }
            }, function () {
                complete.style.display = 'block';
                err.style.display = 'none';
            }, function () {
                err.style.display = 'block';
                complete.style.display = 'none';
            });

            e.preventDefault();
        });

    });

})();
