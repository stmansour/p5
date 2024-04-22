let positionsCalculated = false; // Flag to check if positions are already calculated

function drawNetwork(ctx, network) {
    let xPosition = 50; // Start x-position for the first layer

    // Calculate node positions if not already done
    if (!positionsCalculated) {
        for (let layerIndex = 0; layerIndex < network.layers.length; layerIndex++) {
            let layer = network.layers[layerIndex];
            let yPosition = (ctx.canvas.height - (layer.nodesToShow * (layer.radius * 2 + layer.spacing) - layer.spacing)) / 2;
            for (let i = 0; i < layer.nodesToShow; i++) {
                layer.pos.push({ x: xPosition, y: yPosition + layer.radius });
                yPosition += layer.radius * 2 + layer.spacing;
            }
            xPosition += network.horizontalSpacing + layer.radius * 2; // Move xPosition for the next layer
        }
        positionsCalculated = true;
    }

    // Draw lines first to avoid overlapping with nodes
    for (let layerIndex = 0; layerIndex < network.layers.length - 1; layerIndex++) {
        let layer = network.layers[layerIndex];
        let nextLayer = network.layers[layerIndex + 1];
        for (let i = 0; i < layer.pos.length; i++) {
            let pos = layer.pos[i];
            for (let j = 0; j < nextLayer.pos.length; j++) {
                let nextPos = nextLayer.pos[j];
                if (network.weights[layerIndex] && network.weights[layerIndex][i] && network.weights[layerIndex][i][j] !== undefined) {
                    let weight = network.weights[layerIndex][i][j];
                    ctx.strokeStyle = `rgba(0, 0, 0, ${Math.abs(weight)})`;
                    ctx.beginPath();
                    ctx.moveTo(pos.x, pos.y);
                    ctx.lineTo(nextPos.x, nextPos.y);
                    ctx.stroke();
                }
            }
        }
    }

    // Draw nodes on top of the lines
    for (let layerIndex = 0; layerIndex < network.layers.length; layerIndex++) {
        let layer = network.layers[layerIndex];
        for (let i = 0; i < layer.pos.length; i++) {
            let pos = layer.pos[i];
            ctx.fillStyle = layer.color;
            ctx.beginPath();
            ctx.arc(pos.x, pos.y, layer.radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
