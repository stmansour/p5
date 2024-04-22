let positionsCalculated = false; // Flag to check if positions are already calculated

function drawNetwork(ctx, network) {
    let xPosition = 50; // Start x-position for the first layer

    // Calculate node positions if not already done
    if (!positionsCalculated) {
        network.layers.forEach((layer) => {
            let yPosition = (ctx.canvas.height - (layer.nodesToShow * (layer.radius * 2 + layer.spacing) - layer.spacing)) / 2;
            for (let i = 0; i < layer.nodesToShow; i++) {
                layer.pos.push({ x: xPosition, y: yPosition + layer.radius });
                yPosition += layer.radius * 2 + layer.spacing;
            }
            xPosition += network.horizontalSpacing + layer.radius * 2; // Move xPosition for the next layer
        });
        positionsCalculated = true;
    }

    // Draw lines first to avoid overlapping with nodes
    network.layers.forEach((layer, layerIndex) => {
        if (layerIndex < network.layers.length - 1) {
            let nextLayer = network.layers[layerIndex + 1];
            layer.pos.forEach((pos, i) => {
                nextLayer.pos.forEach((nextPos, j) => {
                    if (network.weights[layerIndex] && network.weights[layerIndex][i] && network.weights[layerIndex][i][j] !== undefined) {
                        let weight = network.weights[layerIndex][i][j];
                        ctx.strokeStyle = `rgba(0, 0, 0, ${Math.abs(weight)})`;
                        ctx.beginPath();
                        ctx.moveTo(pos.x, pos.y);
                        ctx.lineTo(nextPos.x, nextPos.y);
                        ctx.stroke();
                    }
                });
            });
        }
    });

    // Draw nodes on top of the lines
    network.layers.forEach((layer) => {
        layer.pos.forEach((pos) => {
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, layer.radius, 0, Math.PI * 2);
            ctx.fill();
        });
    });
}

// Initialize weights randomly for demonstration (this should be outside drawNetwork if not reset every call)
if (!weightsInitialized) {
    neuralNetwork.layers.forEach((layer, index) => {
        if (index < neuralNetwork.layers.length - 1) {
            let nextLayer = neuralNetwork.layers[index + 1];
            neuralNetwork.weights[index] = new Array(layer.nodeCount).fill(null).map(() => new Array(nextLayer.nodeCount).fill(null).map(() => Math.random() * 2 - 1));
        }
    });
    weightsInitialized = true;
}
