function loadScribble($canvasWrapper) {
  $canvasWrapper.jqScribble();
}

function listenForSubmission($canvasWrapper) {
  $("#submit").on("click", function (event) {
    handleSubmission($canvasWrapper);
  });
}

function handleSubmission($canvasWrapper) {
  var $formField = $("#s3-file");
  fillS3Data($canvasWrapper, $formField);
  postToServerAndS3();
}

function fillS3Data($formField) {
  if (!!$canvasWrapper.length) {
    var canvas = $canvasWrapper.data("jqScribble").canvas;
    var dataURL = canvas.toDataURL('image/png');
    $s3FormField.val(dataURL);
  } else {
    var description = $("#sentence_field").val();
    $s3FormField.val(description);
  }
}

function postToServerAndS3() {
  var formInput = $("#server-form").serializeJSON();
  $.post("contributions", formInput);
  $("#s3-form").submit();
}