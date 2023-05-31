
// Get the canvas element and its 2D context
const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

// Set initial values for drawing
let isDrawing = false;
let isResizing = false;
let isDragging = false;
let shapeType = "rectangle";
let currentShape = null;
let startX = 0;
let startY = 0;

// Event listeners for mouse actions
canvas.addEventListener("mousedown", handleMouseDown);
canvas.addEventListener("mousemove", handleMouseMove);
canvas.addEventListener("mouseup", handleMouseUp);

// Event listener for shape selection
const shapeSelector = document.getElementById("shapeSelector");
shapeSelector.addEventListener("change", (event) => {
  shapeType = event.target.value;
});

// Function to handle mouse down event
function handleMouseDown(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  // Check if the click is inside any existing shape
  for (let i = shapes.length - 1; i >= 0; i--) {
    const shape = shapes[i];

    if (shape.type === "rectangle") {
      if (isPointInsideRectangle(x, y, shape)) {
        currentShape = shape;
        startX = x;
        startY = y;
        isDragging = true;
        return;
      }
    } else if (shape.type === "circle") {
      if (isPointInsideCircle(x, y, shape)) {
        currentShape = shape;
        startX = x;
        startY = y;
        isDragging = true;
        return;
      }
    }
  }

  // Start drawing a new shape
  isDrawing = true;
  startX = x;
  startY = y;

  if (shapeType === "rectangle") {
    currentShape = {
      type: "rectangle",
      x: startX,
      y: startY,
      width: 0,
      height: 0
    };
  } else if (shapeType === "circle") {
    currentShape = {
      type: "circle",
      x: startX,
      y: startY,
      radius: 0
    };
  }
}

// Function to handle mouse move event
function handleMouseMove(event) {
  const x = event.clientX - canvas.offsetLeft;
  const y = event.clientY - canvas.offsetTop;

  if (isDrawing) {
    if (shapeType === "rectangle") {
      currentShape.width = x - startX;
      currentShape.height = y - startY;
    } else if (shapeType === "circle") {
      const dx = x - startX;
      const dy = y - startY;
      currentShape.radius = Math.sqrt(dx * dx + dy * dy);
    }
  }

  if (isDragging) {
    const dx = x - startX;
    const dy = y - startY;

    if (currentShape.type === "rectangle") {
      currentShape.x += dx;
      currentShape.y += dy;
    } else if (currentShape.type === "circle") {
      currentShape.x += dx;
      currentShape.y += dy;
    }

    startX = x;
    startY = y;
  }

  if (isResizing) {
    if (currentShape.type === "rectangle") {
        currentShape.x += dx;
      currentShape.y += dy;
    } else if (currentShape.type === "circle") {
      const dx = x - currentShape.x;
      const dy = y - currentShape.y;
      currentShape.radius = Math.sqrt(dx * dx + dy * dy);
    }
  }

  clearCanvas();
  drawShapes();
  drawCurrentShape();
}


// Function to handle mouse up event
function handleMouseUp(event) {
  if (isDrawing || isDragging || isResizing) {
    if (!isDragging) {
      shapes.push(currentShape);
    }

    isDrawing = false;
    isDragging = false;
    isResizing = false;
    currentShape = null;
  }
}
// const clearButton = document.getElementById("clearButton");
// clearButton.addEventListener("click", clearCanvas);
// Function to clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Function to draw the shapes
function drawShapes() {
  shapes.forEach((shape) => {
    if (shape.type === "rectangle") {
      ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
    } else if (shape.type === "circle") {
      ctx.beginPath();
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
}

// Function to draw the current shape
function drawCurrentShape() {
  if (!currentShape) return;

  ctx.fillStyle = "rgba(0, 0, 0, 0.3)";

  if (currentShape.type === "rectangle") {
    ctx.fillRect(
      currentShape.x,
      currentShape.y,
      currentShape.width,
      currentShape.height
    );
  } else if (currentShape.type === "circle") {
    ctx.beginPath();
    ctx.arc(
      currentShape.x,
      currentShape.y,
      currentShape.radius,
      0,
      2 * Math.PI
    );
    ctx.fill();
  }
}

// Function to check if a point is inside a rectangle
function isPointInsideRectangle(x, y, rectangle) {
  return (
    x >= rectangle.x &&
    x <= rectangle.x + rectangle.width &&
    y >= rectangle.y &&
    y <= rectangle.y + rectangle.height
  );
}

// Function to check if a point is inside a circle
function isPointInsideCircle(x, y, circle) {
  const dx = x - circle.x;
  const dy = y - circle.y;
  return dx * dx + dy * dy <= circle.radius * circle.radius;
}

// Array to store the shapes
const shapes = [];
