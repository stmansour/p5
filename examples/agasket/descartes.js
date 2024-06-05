/**
 * descartes - compute the curvatures of the descartes circles
 *             for the provided triplet of descartes circles.
 * 
 * The rule essentially boils down to this:
 * 
 *      The sum of the squares of all four bends is equal to
 *      half the square of their sum.
 * 
 * Note: bend = 1/radius,  bend can be negative
 * 
 * Translation:  (k1 + k2 + k3 + k4)^2 = 2(k1*k2 + k2*k2 + k3*k3 + k4*k4)
 * 
 * Then, solving for k4:
 *      k4 = k1 + k2 + k3 ± sqrt(k1*k2 + k2*k3 + k3*k1)
 * 
 * See: https://en.wikipedia.org/wiki/Apollonian_gasket
 * 
 * @param {*} c1 - a circle object
 * @param {*} c2 - a circle object
 * @param {*} c3 - a circle object
 * 
 * @return an array of 2 curvatures for the descartes circle
 */
function descartes(c1, c2, c3) {
    let k1 = c1.bend;
    let k2 = c2.bend;
    let k3 = c3.bend;
  
    let sum = k1 + k2 + k3;
    let prod = Math.abs(k1 * k2 + k2 * k3 + k3 * k1);
    let root = 2 * Math.sqrt(prod);
    return [sum + root, sum - root];
  }
  
  /**
   * complexDescartes - creates 4 descartes circles for the provided triplet of existing
   * descartes circles.
   * 
   * This one is much uglier to derive but essentially if you look at the x,y coords of
   * the circle centers as complex numbers (a + bi) then the same basic formula for computing
   * the curvatures of the new circles can be applied to get the center locations.  So if we
   * say that the circle centers are z1, z2, z3 and the bends are k1, k2, k3 then we get the
   * formula:
   * 
   *     z1*z1*k1*k1 + ... z4*z4*k4*k4 = 0.5 * (z1*k1 + ... + z4*k4)^2 
   * and solving for z4 we get:
   * 
   *     z4 = (z1*k1 + z2*k2 + z3*k3 ± 2*sqrt(k1*z1*k2*z2 + k2*z2*k3*z3 + k1*z1*k3*z3)/k4
   *     z4 = (zk1   + zk2   + zk3   ± 2*sqrt(zk1*zk2 + zk2*zk3 + zk1*zk3)/k4)
   *           --------sum--------             ------------root------------
   * @param {*} c1 - a circle object
   * @param {*} c2 - a circle object
   * @param {*} c3 - a circle object
   * 
   * @return four descartes circles
   */
  function complexDescartes(c1, c2, c3, k4) {
    let k1 = c1.bend;
    let k2 = c2.bend;
    let k3 = c3.bend;
  
    let z1 = c1.center;
    let z2 = c2.center;
    let z3 = c3.center;
  
    let zk1 = z1.scale(k1);
    let zk2 = z2.scale(k2);
    let zk3 = z3.scale(k3);
  
    let sum = zk1.add(zk2).add(zk3);
    let root = zk1.multiply(zk2).add(zk2.multiply(zk3)).add(zk1.multiply(zk3));
    root = root.sqrt().scale(2);
  
    let center1 = sum.add(root).scale(1 / k4[0]);
    let center2 = sum.sub(root).scale(1 / k4[0]);
    let center3 = sum.add(root).scale(1 / k4[1]);
    let center4 = sum.sub(root).scale(1 / k4[1]);
  
    return [
      new Circle(k4[0], center1.a, center1.b),
      new Circle(k4[0], center2.a, center2.b),
      new Circle(k4[1], center3.a, center3.b),
      new Circle(k4[1], center4.a, center4.b)
    ];
  }
  
  /**
   * validate - the descartes formula does produce circles that are not mutually tangent.
   *            We actually need to check several things to make sure that we only keep
   *            the valid ones.
   * @param {*} c4 - the new circle
   * @param {*} c1 -- the triplet set to which c4 must be tangent
   * @param {*} c2 
   * @param {*} c3 
   * @returns true if the new circle is valid
   */
  function validate(c4, c1, c2, c3) {
    //----------------------------------
    // stop if circle gets too small
    //----------------------------------
    let c4radius = Math.abs(1 / c4.bend);
    if (c4radius < 2) {
      return false;
    }
  
    for (let other of allCircles) {
      let d = c4.dist(other);  // this is the p5 dist function
      let radius = Math.abs(1 / other.bend);
      let radiusDiff = Math.abs(c4radius - radius);
      if (d < epsilon && radiusDiff < epsilon) {
        return false;  // basically, within rounding error distance
      }
    }
  
    // c4 must be tangent to all other circles
    if (!isTangent(c4, c1)) return false;
    if (!isTangent(c4, c2)) return false;
    if (!isTangent(c4, c3)) return false;
  
    return true;
  }
  
  /**
   * isTangent - check if two circles are tangent
   * @param {*} c1 - the first circle
   * @param {*} c2 - the second circle
   * 
   * @returns true if the circles are tangent
   *
   */
  function isTangent(c1, c2) {
    let d = c1.dist(c2);
    let r1 = Math.abs(1 / c1.bend);
    let r2 = Math.abs(1 / c2.bend);
    // Tangency check based on distances and radii
    let a = abs(d - (r1 + r2)) < epsilon;
    let b = abs(d - abs(r2 - r1)) < epsilon;
    return a || b;
  }
  

  function areTangential(c1, c2, c3) {
    const tolerance = .01;

    const d12 = c1.dist(c2);
    const d13 = c1.dist(c3);
    const d23 = c2.dist(c3);
  
    const r1 = c1.radius;
    const r2 = c2.radius;
    const r3 = c3.radius;
  
    // Check tangency conditions for internal and external tangency
    const tangent12 = Math.abs(d12 - (r1 - r2)) < tolerance || Math.abs(d12 - (r1 + r2)) < tolerance;
    const tangent13 = Math.abs(d13 - (r1 - r3)) < tolerance || Math.abs(d13 - (r1 + r3)) < tolerance;
    const tangent23 = Math.abs(d23 - (r2 - r3)) < tolerance || Math.abs(d23 - (r2 + r3)) < tolerance;
  
    return tangent12 && tangent13 && tangent23;
  }

  function areCirclesTangent(circle1, circle2, circle3) {
    const distanceTolerance = 0.1; // Adjust tolerance as needed
  
    // Check for radius positivity to avoid division by zero
    if (circle1.radius <= 0 || circle2.radius <= 0 || circle3.radius <= 0) {
      console.error("Circles must have positive radii.");
      return false;
    }
  
    // Calculate and log circle radii
    console.log('Circle 1 Radius:', circle1.radius);
    console.log('Circle 2 Radius:', circle2.radius);
    console.log('Circle 3 Radius:', circle3.radius);
  
    const d12 = circle1.dist(circle2);
    const d13 = circle1.dist(circle3);
    const d23 = circle2.dist(circle3);
  
    // Log calculated distances
    console.log('Distance between circle 1 and 2:', d12);
    console.log('Distance between circle 1 and 3:', d13);
    console.log('Distance between circle 2 and 3:', d23);
  
    // Absolute difference check with tolerance
    return (Math.abs(circle1.radius - circle2.radius) <= distanceTolerance + d12 &&
            Math.abs(circle1.radius - circle3.radius) <= distanceTolerance + d13 &&
            Math.abs(circle2.radius - circle3.radius) <= distanceTolerance + d23);
  }
  
  function getMutuallyTangentCirclesFromTwoPoints(x1,y1, x2,y2, maxX, maxY) {
    // Calculate distance between the two points
    const distance = Math.hypot(x2 - x1, y2 - y1);
  
    // Minimum and maximum distance for the third point (ensure valid triangle)
    const minDistance = distance / 2;
    const maxDistance = distance * 2;
  
    // Generate random coordinates for the third point within a valid range
    let x3, y3;
    do {
      const angle = Math.random() * 2 * Math.PI; // Random angle between 0 and 2*PI
      const randomDistance = Math.random() * (maxDistance - minDistance) + minDistance;
      x3 = x1 + randomDistance * Math.cos(angle);
      y3 = y1 + randomDistance * Math.sin(angle);
    } while (!isTriangleValid(x1, y1, x2, y2, x3, y3) || x3 < 0 || x3 > maxX || y3 < 0 || y3 > maxY); // Repeat until valid triangle and within bounds
  
    // Calculate circumradius (radius of circumscribed circle)
    const a = Math.hypot(x2 - x1, y2 - y1);
    const b = Math.hypot(x3 - x2, y3 - y2);
    const c = Math.hypot(x3 - x1, y3 - y1);
    const s = (a + b + c) / 2;
    const area = Math.sqrt(s * (s - a) * (s - b) * (s - c));
    const circumradius = a * b * c / (4 * area);
  
    // Inradius is half the circumradius for a equilateral triangle (guaranteed with this approach)
    const inradius = circumradius / 2;
  
    // Create circles centered at each point with the calculated inradius
    const circle1 = new Circle(-1 / inradius, x1, y1);
    const circle2 = new Circle(-1 / inradius, x2, y2);
    const circle3 = new Circle(-1 / inradius, x3, y3);
  
    return [circle1, circle2, circle3];
  }
  
  // Helper function to check if three points form a valid triangle
  function isTriangleValid(x1, y1, x2, y2, x3, y3) {
    const a = Math.hypot(x2 - x1, y2 - y1);
    const b = Math.hypot(x3 - x2, y3 - y2);
    const c = Math.hypot(x3 - x1, y3 - y1);
    return a + b > c && a + c > b && b + c > a;
  }
  