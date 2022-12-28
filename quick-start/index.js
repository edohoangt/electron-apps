const imageReceived = document.getElementById("image-received");

window.electronAPI.renderImage((event, data) => {
  //   console.log(event, data);
  imageReceived.src = data;
  window.electronAPI.closeCameraWindow();
});
