import SVGPathCommander from "svg-path-commander";
import uuid from "react-uuid";

export const findRotatedBox = (allItems, rotation) => {
    let left = Math.min(
        ...allItems.map((item) =>
            Math.min(
                item.corners.a.x,
                item.corners.b.x,
                item.corners.c.x,
                item.corners.d.x
            )
        )
    );
    let right = Math.max(
        ...allItems.map((item) =>
            Math.max(
                item.corners.a.x,
                item.corners.b.x,
                item.corners.c.x,
                item.corners.d.x
            )
        )
    );
    let top = Math.min(
        ...allItems.map((item) =>
            Math.min(
                item.corners.a.y,
                item.corners.b.y,
                item.corners.c.y,
                item.corners.d.y
            )
        )
    );
    let bottom = Math.max(
        ...allItems.map((item) =>
            Math.max(
                item.corners.a.y,
                item.corners.b.y,
                item.corners.c.y,
                item.corners.d.y
            )
        )
    );
    let x = left;
    let y = top;
    let width = right - left;
    let height = bottom - top;
    if (rotation !== 0) {
        let cos = Math.cos((rotation * Math.PI) / 180);
        let sin = Math.sin((rotation * Math.PI) / 180);
        let newWidth = width * cos + height * sin;
        let newHeight = width * sin + height * cos;
        x = left - (newWidth - width) / 2;
        y = top - (newHeight - height) / 2;
        width = newWidth;
        height = newHeight;
    }
    return { top, bottom, left, right, width, height, x, y };
};
export const rotatePoint = (dims, ref, angle) => {
    let rotationInRadians = (Math.PI / 180) * angle,
        xFin =
            (dims.x - ref.x) * Math.cos(rotationInRadians) -
            (dims.y - ref.y) * Math.sin(rotationInRadians) +
            ref.x,
        yFin =
            (dims.x - ref.x) * Math.sin(rotationInRadians) +
            (dims.y - ref.y) * Math.cos(rotationInRadians) +
            ref.y;

    return { x: xFin, y: yFin };
};
export const rotateBox = (item, rotation, previousRotation, origin) => ({
    ...item,
    x:
        origin.x +
        (item.x + item.width / 2 - origin.x) *
            Math.cos(((rotation - previousRotation) * Math.PI) / 180) -
        (item.y + item.height / 2 - origin.y) *
            Math.sin(((rotation - previousRotation) * Math.PI) / 180) -
        item.width / 2,
    y:
        origin.y +
        (item.x + item.width / 2 - origin.x) *
            Math.sin(((rotation - previousRotation) * Math.PI) / 180) +
        (item.y + item.height / 2 - origin.y) *
            Math.cos(((rotation - previousRotation) * Math.PI) / 180) -
        item.height / 2,
    rotation: item.rotation + (rotation - previousRotation),
});
export const refreshCorners = (item) => {
    let { x, y, width, height, rotation } = item;
    let center = {
        x: x + width / 2,
        y: y + height / 2,
    };
    let newA = { x, y };
    let newB = { x: x + width, y };
    let newC = { x: x + width, y: y + height };
    let newD = { x, y: y + height };
    let a = rotatePoint(newA, center, rotation);
    let b = rotatePoint(newB, center, rotation);
    let c = rotatePoint(newC, center, rotation);
    let d = rotatePoint(newD, center, rotation);
    let newItem = { ...item, corners: { a, b, c, d } };
    return newItem;
};
export const repositionRotatedBox = (
    oldDims,
    newDims,
    rotation,
    staticCorner
) => {
    let oldRotatedPoint,
        newRotatedPoint,
        oldCheckPoint = Object.assign({}, oldDims),
        newCheckPoint = Object.assign({}, newDims),
        //specifies the central points of zero-rotated items
        oldItemCenter = {
            x: oldDims.x + oldDims.w / 2,
            y: oldDims.y + oldDims.h / 2,
        },
        newItemCenter = {
            x: newDims.x + newDims.w / 2,
            y: newDims.y + newDims.h / 2,
        };

    switch (staticCorner) {
        case "n":
            //check the position of the point in the center of the y edge
            oldCheckPoint.x = oldDims.x + oldDims.w / 2;
            newCheckPoint.x = newDims.x + newDims.w / 2;
            break;
        case "ne":
            //check the position of the right y corner
            oldCheckPoint.x = oldDims.x + oldDims.w;
            newCheckPoint.x = newDims.x + newDims.w;
            break;
        case "se":
            //check the position of the right bottom corner
            oldCheckPoint.x = oldDims.x + oldDims.w;
            oldCheckPoint.y = oldDims.y + oldDims.h;
            newCheckPoint.x = newDims.x + newDims.w;
            newCheckPoint.y = newDims.y + newDims.h;
            break;
        case "sw":
            //check the position of the x bottom corner
            oldCheckPoint.y = oldDims.y + oldDims.h;
            newCheckPoint.y = newDims.y + newDims.h;
            break;
        default:
            oldCheckPoint = oldDims;
            newCheckPoint = newDims;
            break;
    }
    oldRotatedPoint = rotatePoint(oldCheckPoint, oldItemCenter, rotation);
    newRotatedPoint = rotatePoint(newCheckPoint, newItemCenter, rotation);
    //calculate offset of two points and correct the new item's position
    return {
        x: newDims.x + (oldRotatedPoint.x - newRotatedPoint.x),
        y: newDims.y + (oldRotatedPoint.y - newRotatedPoint.y),
    };
};
export const convertToPath = (item) => {
    const rotatePath = (item) => {
        let d = new SVGPathCommander(item.d)
            .toCurve()
            .transform({
                rotate: item.rotation,
                origin: [item.x + item.width / 2, item.y + item.height / 2],
            })
            .toString();
        return { ...item, d };
    };
    const convertEllipseToPath = (ellipse) => {
        let kappa = 0.5522847498;
        let rx = item.width / 2;
        let ry = item.height / 2;
        let cx = item.x + rx;
        let cy = item.y + ry;
        let ox = rx * kappa; // x offset for the control point
        let oy = ry * kappa; // y offset for the control point
        let d = `M${cx - rx} ${cy}`;
        d += `C${cx - rx} ${cy - oy} ${cx - ox} ${cy - ry} ${cx} ${cy - ry} C${
            cx + ox
        } ${cy - ry} ${cx + rx} ${cy - oy} ${cx + rx} ${cy} C${cx + rx} ${
            cy + oy
        } ${cx + ox} ${cy + ry} ${cx} ${cy + ry} C${cx - ox} ${cy + ry} ${
            cx - rx
        } ${cy + oy} ${cx - rx} ${cy}`;
        return rotatePath({ ...ellipse, d, type: "path" });
    };
    const convertRectToPath = (rect) => {
        let d = `M ${rect.x} ${rect.y} C ${rect.x} ${rect.y} ${
            rect.x + rect.width
        } ${rect.y} ${rect.x + rect.width} ${rect.y} 
        C ${rect.x + rect.width} ${rect.y} ${rect.x + rect.width} ${
            rect.y + rect.height
        } ${rect.x + rect.width} ${rect.y + rect.height} 
        C ${rect.x + rect.width} ${rect.y + rect.height} ${rect.x} ${
            rect.y + rect.height
        } ${rect.x} ${rect.y + rect.height} 
        C ${rect.x} ${rect.y + rect.height} ${rect.x} ${rect.y} ${rect.x} ${
            rect.y
        }`;
        return rotatePath({ ...rect, d, type: "path" });
    };
    let shape = { ...item };
    switch (shape.type) {
        case "ellipse":
            shape = convertEllipseToPath(item);
            break;
        case "rect":
            shape = convertRectToPath(item);
            break;
        default:
            break;
    }
    return shape;
};
export const refreshPathBox = (item) => {
    let bBox = new SVGPathCommander(item.d).getBBox();
    if (item.rotation > 0) {
        let rotatedBBox = new SVGPathCommander(item.d)
            .transform({
                rotate: -item.rotation,
                origin: [bBox.cx, bBox.cy],
            })
            .getBBox();
        let newPoint = rotatePoint(
            { x: rotatedBBox.cx, y: rotatedBBox.cy },
            { x: bBox.cx, y: bBox.cy },
            item.rotation
        );
        let newRotatedBBox = new SVGPathCommander(item.d)
            .transform({
                rotate: -item.rotation,
                origin: [newPoint.x, newPoint.y],
            })
            .getBBox();
        return {
            ...item,
            x: newRotatedBBox.x,
            y: newRotatedBBox.y,
            width: newRotatedBBox.width,
            height: newRotatedBBox.height,
        };
    } else {
        return {
            ...item,
            x: bBox.x,
            y: bBox.y,
            width: bBox.width,
            height: bBox.height,
        };
    }
};
export const pointsToPath = (points) => {
    let path = `M ${points[0].coord.x} ${points[0].coord.y}`;
    for (let i = 1; i < points.length; i++) {
        path += ` C ${points[i - 1].startHandle.x} ${
            points[i - 1].startHandle.y
        } ${points[i].endHandle.x} ${points[i].endHandle.y} ${
            points[i].coord.x
        } ${points[i].coord.y}`;
    }
    path += ` C ${points[points.length - 1].startHandle.x} ${
        points[points.length - 1].startHandle.y
    }  ${points[0].endHandle.x} ${points[0].endHandle.y} ${points[0].coord.x} ${
        points[0].coord.y
    }`;
    return path;
};
export const getLengthForPoint = (p, thePath) => {
    const dist = (p1, p2) => {
        let dx = p2.x - p1.x;
        let dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    };
    let pathLength = thePath.getTotalLength();
    let precision = 100;
    let division = pathLength / precision;
    let theRecord = pathLength;
    let theSegment;
    for (let i = 0; i < precision; i++) {
        // get a point on the path for thia distance
        let _p = thePath.getPointAtLength(i * division);
        // get the distance between the new point _p and the point p
        let theDistance = dist(_p, p);
        if (theDistance < theRecord) {
            // if the distance is smaller than the record set the new record
            theRecord = theDistance;
            theSegment = i;
        }
    }
    return theSegment * division;
};
export const splitCurveAt = (position, x1, y1, x2, y2, x3, y3, x4, y4) => {
    let v1, v2, v3, v4, quad, retPoints, i, c;
    if (position <= 0 || position >= 1) {
        throw RangeError("spliteCurveAt requires position > 0 && position < 1");
    }

    retPoints = []; // array of coordinates
    i = 0;
    quad = false; // presume cubic bezier
    v1 = {};
    v2 = {};
    v4 = {};
    v1.x = x1;
    v1.y = y1;
    v2.x = x2;
    v2.y = y2;
    if (!x4) {
        quad = true; // this is a quadratic bezier
        v4.x = x3;
        v4.y = y3;
    } else {
        v3 = {};
        v3.x = x3;
        v3.y = y3;
        v4.x = x4;
        v4.y = y4;
    }
    c = position;
    retPoints[i++] = v1.x; // start point
    retPoints[i++] = v1.y;

    if (quad) {
        // split quadratic bezier
        retPoints[i++] = v1.x += (v2.x - v1.x) * c; // new control point for first curve
        retPoints[i++] = v1.y += (v2.y - v1.y) * c;
        v2.x += (v4.x - v2.x) * c;
        v2.y += (v4.y - v2.y) * c;
        retPoints[i++] = v1.x + (v2.x - v1.x) * c; // new end and start of first and second curves
        retPoints[i++] = v1.y + (v2.y - v1.y) * c;
        retPoints[i++] = v2.x; // new control point for second curve
        retPoints[i++] = v2.y;
        retPoints[i++] = v4.x; // new endpoint of second curve
        retPoints[i++] = v4.y;
        return retPoints;
    }
    retPoints[i++] = v1.x += (v2.x - v1.x) * c; // first curve first control point
    retPoints[i++] = v1.y += (v2.y - v1.y) * c;
    v2.x += (v3.x - v2.x) * c;
    v2.y += (v3.y - v2.y) * c;
    v3.x += (v4.x - v3.x) * c;
    v3.y += (v4.y - v3.y) * c;
    retPoints[i++] = v1.x += (v2.x - v1.x) * c; // first curve second control point
    retPoints[i++] = v1.y += (v2.y - v1.y) * c;
    v2.x += (v3.x - v2.x) * c;
    v2.y += (v3.y - v2.y) * c;
    retPoints[i++] = v1.x + (v2.x - v1.x) * c; // end and start point of first second curves
    retPoints[i++] = v1.y + (v2.y - v1.y) * c;
    retPoints[i++] = v2.x; // second curve first control point
    retPoints[i++] = v2.y;
    retPoints[i++] = v3.x; // second curve second control point
    retPoints[i++] = v3.y;
    retPoints[i++] = v4.x; // endpoint of second curve
    retPoints[i++] = v4.y;
    //=======================================================
    // return array with 2 curves
    return retPoints;
};
export const pathToPoints = (path, id) => {
    let pathNode = document.getElementById(id);
    let segments = SVGPathCommander.pathToCurve(path);
    let firstSegment;
    let points = [];
    for (let i = 0; i < segments.length; i++) {
        if (segments[i][0] === "C") {
            if (!firstSegment) {
                firstSegment = segments[i];
            }
            let segment = segments[i];
            points = [
                ...points,
                {
                    id: uuid(),
                    simetric: false,
                    coord: { x: segment[5], y: segment[6] },
                    length: getLengthForPoint(
                        { x: segment[5], y: segment[6] },
                        pathNode
                    ),
                    endHandle: {
                        x: segment[3],
                        y: segment[4],
                        enabled: true,
                    },
                    startHandle:
                        segments[i + 1] && segments[i][0] === "C"
                            ? {
                                  x: segments[i + 1][1],
                                  y: segments[i + 1][2],
                                  enabled: true,
                              }
                            : {
                                  x: firstSegment[1],
                                  y: firstSegment[2],
                                  enabled: true,
                              },
                },
            ];
        }
    }
    return points.sort((a, b) => a.length - b.length);
};
export const getBox = (item) => {
    let width =
        item.width * Math.abs(Math.cos(item.rotation)) +
        item.height * Math.abs(Math.sin(item.rotation));
    let height =
        item.width * Math.abs(Math.sin(item.rotation)) +
        item.height * Math.abs(Math.cos(item.rotation));
    return {
        x: item.x + item.width / 2 - width / 2,
        y: item.y + item.height / 2 - height / 2,
        width,
        height,
    };
};
export const closestPoint = (pathNode, point) => {
    const distance2 = (p) => {
        var dx = p.x - point.x,
            dy = p.y - point.y;
        return dx * dx + dy * dy;
    };
    var pathLength = pathNode.getTotalLength(),
        precision = 8,
        best,
        bestLength,
        bestDistance = Infinity;

    // linear scan for coarse approximation
    for (
        let scan, scanLength = 0, scanDistance;
        scanLength <= pathLength;
        scanLength += precision
    ) {
        if (
            (scanDistance = distance2(
                (scan = pathNode.getPointAtLength(scanLength))
            )) < bestDistance
        ) {
            best = scan;
            bestLength = scanLength;
            bestDistance = scanDistance;
        }
    }

    // binary search for precise estimate
    precision /= 2;
    while (precision > 0.5) {
        let before,
            after,
            beforeLength,
            afterLength,
            beforeDistance,
            afterDistance;
        if (
            (beforeLength = bestLength - precision) >= 0 &&
            (beforeDistance = distance2(
                (before = pathNode.getPointAtLength(beforeLength))
            )) < bestDistance
        ) {
            best = before;
            bestLength = beforeLength;
            bestDistance = beforeDistance;
        } else if (
            (afterLength = bestLength + precision) <= pathLength &&
            (afterDistance = distance2(
                (after = pathNode.getPointAtLength(afterLength))
            )) < bestDistance
        ) {
            best = after;
            bestLength = afterLength;
            bestDistance = afterDistance;
        } else {
            precision /= 2;
        }
    }

    best = {
        x: best.x,
        y: best.y,
        distance: Math.sqrt(bestDistance),
    };
    return best.distance < 5 ? best : null;
};
export const doPolygonsIntersect = (a, b) => {
    var polygons = [a, b];
    var minA, maxA, projected, i, i1, j, minB, maxB;

    for (i = 0; i < polygons.length; i++) {
        // for each polygon, look at each edge of the polygon, and determine if it separates
        // the two shapes
        var polygon = polygons[i];
        for (i1 = 0; i1 < polygon.length; i1++) {
            // grab 2 vertices to create an edge
            var i2 = (i1 + 1) % polygon.length;
            var p1 = polygon[i1];
            var p2 = polygon[i2];

            // find the line perpendicular to this edge
            var normal = { x: p2.y - p1.y, y: p1.x - p2.x };

            minA = maxA = undefined;
            // for each vertex in the first shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            for (j = 0; j < a.length; j++) {
                projected = normal.x * a[j].x + normal.y * a[j].y;
                if (!maxA || projected < minA) {
                    minA = projected;
                }
                if (!maxA || projected > maxA) {
                    maxA = projected;
                }
            }

            // for each vertex in the second shape, project it onto the line perpendicular to the edge
            // and keep track of the min and max of these values
            minB = maxB = undefined;
            for (j = 0; j < b.length; j++) {
                projected = normal.x * b[j].x + normal.y * b[j].y;
                if (!maxB || projected < minB) {
                    minB = projected;
                }
                if (!maxB || projected > maxB) {
                    maxB = projected;
                }
            }

            // if there is no overlap between the projects, the edge we are looking at separates the two
            // polygons, and we know there is no overlap
            if (maxA < minB || maxB < minA) {
                return false;
            }
        }
    }
    return true;
};
export const findChildren = (groupId, items, groups) => {
    let childItems = items.filter((item) => item.parent === groupId);
    let childGroups = groups.filter((group) => group.parent === groupId);
    childGroups.forEach((childGroup) => {
        let children = findChildren(childGroup.id);
        childItems = [...childItems, ...children.items];
        childGroups = [...childGroups, ...children.groups];
    });
    return { items: childItems, groups: childGroups };
};
