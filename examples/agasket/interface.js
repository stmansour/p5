function createInterface() {
    colorCheckbox = createCheckbox("Color", false);
    colorCheckbox.parent('colorCheckbox-container');
    colorCheckbox.changed(colorChangedEvent);
    buttonElement = document.getElementById("pattern1");
    buttonElement.addEventListener("click", buttonHandler);
    buttonElement = document.getElementById("pattern2");
    buttonElement.addEventListener("click", buttonHandler);
    buttonElement = document.getElementById("pattern3");
    buttonElement.addEventListener("click", buttonHandler);
    buttonElement = document.getElementById("randomPattern");
    buttonElement.addEventListener("click", buttonHandler);
}

function colorChangedEvent() {
    draw();
  }
  
  function buttonHandler(event) {
    switch (event.target.id) {
      case "pattern1":
        setCirclesTo(0);
        break;
      case "pattern2":
        setCirclesTo(1);
        break;
      case "pattern3":
        setCirclesTo(2);
        break;
      case "randomPattern":
        console.log("random");
        break;
      default:
        console.log("unknown button clicked");
        break;
    }
  }
  