const readline =require('readline');

//Result class
class all {
  constructor() {
    this.status = 204;
    this.line1 = [];
    this.line2 = [];
    this.interchange = [];
    this.lineEnds = [];
    this.path;
    this.time;
  }
}
//QUEUE CLASS
class PriorityQueue {
  constructor() {
    this.collection = [];
  }
  enqueue(element) {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;
      for (let i = 1; i <= this.collection.length; i++) {
        if (element[1] < this.collection[i - 1][1]) {
          this.collection.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.collection.push(element);
      }
    }
  };
  dequeue() {
    let value = this.collection.shift();
    return value;
  };
  isEmpty() {
    return (this.collection.length === 0)
  };
}

//GRAPH CLASS
class Graph {
  constructor() {
    this.nodes = [];
    this.adjacencyList = {};
    this.colorN={};
  }

  addNode(node,col) {
    if(!this.nodes.includes(node)){
      this.nodes.push(node);
      //console.log(node,"inserted");
      this.adjacencyList[node] = [];
      this.colorN[node]=col;
    }
  }

  addEdge(node1, node2, weight, color,transport) {
    
    this.adjacencyList[node1].push({ node: node2, weight: weight, line: color,via:transport });
    this.adjacencyList[node2].push({ node: node1, weight: weight, line: color,via:transport });
    
  }

  addEdgeSingle(node1, node2, weight, color,transport) {
    this.adjacencyList[node1].push({ node: node2, weight: weight, line: color,via:transport });
  }

  //Djikstra
  shortestRouteDjikstra(startNode, endNode) {
    console.log("--Directions from " + startNode + " to " + endNode + "--\n");
    let times = {};
    var change = [];
    let backtrace = {};
    var foundS =0, foundD =0 ;
    let pq = new PriorityQueue();
    times[startNode] = 0;
    this.nodes.forEach(node => {
      if(node==startNode) {
        foundS=1
      }
      if(node==endNode) {
        foundD =1
      }
      if (node !== startNode) {
        times[node] = Infinity
      }
    });
    if(foundS == 0 && foundD ==0)
      return {'status' : 406}
    else if(foundS == 0){
      return {'status' : 4061}
    }
    else if(foundD == 0){
      return {'status' : 4062}
    }
    pq.enqueue([startNode, 0]);
    while (!pq.isEmpty()) {
      let shortestStep = pq.dequeue();
      let currentNode = shortestStep[0];
      this.adjacencyList[currentNode].forEach(neighbor => {
        let time = times[currentNode] + neighbor.weight;
        if (currentNode != startNode) {
          if (this.getline(currentNode, neighbor.node) != this.getline(currentNode, backtrace[currentNode])) {
            //Yamuna Bank Handler
            if (currentNode == 'Yamuna Bank' && neighbor.node == 'Indraprastha' && backtrace[currentNode] == 'Laxmi Nagar') {
              time = time + 0;
            }
            else if (currentNode == 'Yamuna Bank' && neighbor.node == 'Laxmi Nagar' && backtrace[currentNode] == 'Indraprastha') {
              time = time + 0;
            }
            //Dhaula Kuan - Durgabai Deshmukh South Campus Handler
            else if (this.getline(currentNode, neighbor.node) == "1.2km Skywalk" || this.getline(currentNode, backtrace[currentNode]) == "1.2km Skywalk")
              time = time + 0;
            //Noida Sector 51 - Noida Sector 52 Handler
            else if (this.getline(currentNode, neighbor.node) == "300m Walkway/Free e-Rickshaw" || this.getline(currentNode, backtrace[currentNode]) == "300m Walkway/Free e-Rickshaw")
              time = time + 0;
            //Ashok Park Main handler
            else if (currentNode == 'Ashok Park Main' && neighbor.node == 'Punjabi Bagh' && backtrace[currentNode] == 'Satguru Ram Singh Marg') {
              time = time + 0;
            }
            else if (currentNode == 'Ashok Park Main' && neighbor.node == 'Satguru Ram Singh Marg' && backtrace[currentNode] == 'Punjabi Bagh') {
              time = time + 0;
            }
            //Interchange Time Penalty
            else
              time = time + 9;
          }
        }

        if (time < times[neighbor.node]) {
          times[neighbor.node] = time;
          backtrace[neighbor.node] = currentNode;
          pq.enqueue([neighbor.node, time]);
        }
      });
    }
    let path = [endNode];
    let lastStep = endNode;

    //Class to send as result
    
    var result = new all();
    while (lastStep !== startNode) {
      if (this.getline(lastStep, backtrace[lastStep]) != this.getline(backtrace[lastStep], backtrace[backtrace[lastStep]]))
        if (backtrace[lastStep] == startNode)
          ;
        //Yamuna Bank Handler
        else if (backtrace[lastStep] == 'Yamuna Bank' && lastStep == 'Indraprastha' && backtrace[backtrace[lastStep]] == 'Laxmi Nagar') {
          ;
        }
        else if (backtrace[lastStep] == 'Yamuna Bank' && lastStep == 'Laxmi Nagar' && backtrace[backtrace[lastStep]] == 'Indraprastha') {
          ;
        }
        //Ashok Park Main Handler
        else if (backtrace[lastStep] == 'Ashok Park Main' && lastStep == 'Punjabi Bagh' && backtrace[backtrace[lastStep]] == 'Satguru Ram Singh Marg') {
          ;
        }
        else if (backtrace[lastStep] == 'Ashok Park Main' && lastStep == 'Satguru Ram Singh Marg' && backtrace[backtrace[lastStep]] == 'Punjabi Bagh') {
          ;
        }
        else {
          var line1Send = this.getline(backtrace[lastStep], backtrace[backtrace[lastStep]]);
          var line2Send = this.getline(lastStep, backtrace[lastStep]);
          var interchangeSend = backtrace[lastStep];
          result.line1.unshift(line1Send);
          result.line2.unshift(line2Send);
          result.interchange.unshift(interchangeSend);
        }
      path.unshift(backtrace[lastStep])
      lastStep = backtrace[lastStep]
    }
    result.path = path;
    result.time = times[endNode];

    if (result.interchange.length == 0)
      result.line1[0] = this.getline(result.path[0], result.path[1]);
    result.lineEnds = getLast(result.path, result.interchange, result.line1, result.line2)
    console.log(result.time)

    if(path.length != 1)
      result.status = 200
    return result;
  }
  shortestRouteBidirectionalDijkstra(startNode, endNode) {
    console.log("--Directions from " + startNode + " to " + endNode + "--\n");
    var foundS =0, foundD =0 ;
    let times = {};
    let timesBackward = {};
    let backtrace = {};
    let backtraceBackward = {};
    let pqForward = new PriorityQueue();
    let pqBackward = new PriorityQueue();
    const visitedFromStart= new Map();
    const visitedFromGoal= new Map();
    times[startNode] = 0;
    timesBackward[endNode] = 0;
    visitedFromStart.set(startNode,null);
    visitedFromGoal.set(endNode,null);

    this.nodes.forEach(node => {
      if(node==startNode) {
        foundS=1
      }
      if(node==endNode) {
        foundD =1
      }
      if (node !== startNode) {
        times[node] = Infinity;
      }
      if (node !== endNode) {
        timesBackward[node] = Infinity;
      }
    });
    if(foundS == 0 && foundD ==0)
      return {'status' : 406}
    else if(foundS == 0){
      return {'status' : 4061}
    }
    else if(foundD == 0){
      return {'status' : 4062}
    }
    pqForward.enqueue([startNode, 0]);
    pqBackward.enqueue([endNode, 0]);
    var result=new all();
    while (!pqForward.isEmpty() && !pqBackward.isEmpty()) {
      let shortestStepForward = pqForward.dequeue();
      let shortestStepBackward = pqBackward.dequeue();
  
      let currentNodeForward = shortestStepForward[0];
      let currentNodeBackward = shortestStepBackward[0];
      
      let intersectionNode = this.findIntersection(visitedFromStart, visitedFromGoal,currentNodeForward,currentNodeBackward);
      
      if (intersectionNode) {
        // Combine the distances from both directions
        // console.log("Intersection Node:",intersectionNode);
        // console.log("currentNodeForward:",currentNodeForward);
        // console.log("currentNodeBackward:",currentNodeBackward)
        // console.log("visitedFromStart:",visitedFromStart);
        // console.log("visitedFromGoal:",visitedFromGoal);
        let shortestPath = this.combinePathsBIDjik(visitedFromStart, visitedFromGoal,currentNodeForward,currentNodeBackward);
        result.status=200;
        result.path=shortestPath;
        result.time=times[intersectionNode]+timesBackward[intersectionNode];
        
        let n=shortestPath.length;
        
        for(let i=n-1;i>=1;i--){
          backtrace[shortestPath[i]]=shortestPath[i-1];
        }
        let lastStep=endNode;
        while (lastStep !== startNode) {
          if (this.getline(lastStep, backtrace[lastStep]) != this.getline(backtrace[lastStep], backtrace[backtrace[lastStep]]))
            if (backtrace[lastStep] == startNode)
              ;
            //Yamuna Bank Handler
            else if (backtrace[lastStep] == 'Yamuna Bank' && lastStep == 'Indraprastha' && backtrace[backtrace[lastStep]] == 'Laxmi Nagar') {
              ;
            }
            else if (backtrace[lastStep] == 'Yamuna Bank' && lastStep == 'Laxmi Nagar' && backtrace[backtrace[lastStep]] == 'Indraprastha') {
              ;
            }
            //Ashok Park Main Handler
            else if (backtrace[lastStep] == 'Ashok Park Main' && lastStep == 'Punjabi Bagh' && backtrace[backtrace[lastStep]] == 'Satguru Ram Singh Marg') {
              ;
            }
            else if (backtrace[lastStep] == 'Ashok Park Main' && lastStep == 'Satguru Ram Singh Marg' && backtrace[backtrace[lastStep]] == 'Punjabi Bagh') {
              ;
            }
            else {
              var line1Send = this.getline(backtrace[lastStep], backtrace[backtrace[lastStep]]);
              var line2Send = this.getline(lastStep, backtrace[lastStep]);
              var interchangeSend = backtrace[lastStep];
              result.line1.unshift(line1Send);
              result.line2.unshift(line2Send);
              result.interchange.unshift(interchangeSend);
            }
          
          lastStep = backtrace[lastStep]
        }
        if(result.interchange.length==0){
          result.line1[0]=this.getline(result.path[0],result.path[1]);
        }
        result.lineEnds = getLast(result.path, result.interchange, result.line1, result.line2)
        return result;
      }
      this.adjacencyList[currentNodeForward].forEach(neighbor => {
        let time = times[currentNodeForward] + neighbor.weight;
  
        if (time < times[neighbor.node]) {
          times[neighbor.node] = time;
          visitedFromStart.set(neighbor.node,currentNodeForward);
          pqForward.enqueue([neighbor.node, time]);
        }
      });
  
      this.adjacencyList[currentNodeBackward].forEach(neighbor => {
        let time = timesBackward[currentNodeBackward] + neighbor.weight;
  
        if (time < timesBackward[neighbor.node]) {
          timesBackward[neighbor.node] = time;
          visitedFromGoal.set(neighbor.node,currentNodeBackward);
          pqBackward.enqueue([neighbor.node, time]);
        }
      });
  
      
    }
  
    return { 'status': 204 }; // No path found
  }
  
  findIntersection(visitedFromStart, visitedFromGoal,currentNodeForward,currentNodeBackward) {
    if (visitedFromStart.has(currentNodeBackward)) {
      // Found a meeting point
      return currentNodeBackward;
    }

    if (visitedFromGoal.has(currentNodeForward)) {
      // Found a meeting point
      return currentNodeForward;
    }
    return null;
  }
  
  combinePathsBIDjik(visitedFromStart, visitedFromGoal, intersectionNode) {
    const path = [];

    // Reconstruct path from start to meeting point
    let current=intersectionNode;
    while (current !== null) {
      path.unshift(current);
      current = visitedFromStart.get(current);
    }

    // Reconstruct path from goal to meeting point (excluding the meeting point)
    current = visitedFromGoal.get(intersectionNode);
    while (current !== null) {
      path.push(current);
      current = visitedFromGoal.get(current);
    }

    return path;
  }
  
  shortestRouteBFS(startNode, endNode) {
    const visited = {};
    const queue = [[startNode]];
    visited[startNode] = true;

    while (queue.length > 0) {
      const path = queue.shift();
      const currentNode = path[path.length - 1];

      if (currentNode === endNode) {
        return path;
      }
      this.adjacencyList[currentNode].forEach(neighbor => {
        if (!visited[neighbor.node]) {
          visited[neighbor.node] = true;
          queue.push([...path, neighbor.node]);
        }
      });
    }

    // If no path is found
    return [];
  }
  

  printGraph(sta) {
    console.log("--Adjacency List Of " + sta + "--")
    for (var i = 0; i < this.adjacencyList[sta].length; i++)
      console.log(this.adjacencyList[sta][i].line);
  }

  //Returns line between two adjacent stations
  getline(sta1, sta2) {
    var a = this.adjacencyList[sta1]
    var b = this.adjacencyList[sta2]
    if( a == undefined || b == undefined)
      return -2
    for (var i = 0; i < this.adjacencyList[sta1].length; i++) {
      if (this.adjacencyList[sta1][i].node == sta2)
        return (this.adjacencyList[sta1][i].line)
    }
    for (var j = 0; j < this.adjacencyList[sta2].length; j++) {
      if (this.adjacencyList[sta2][j].node == sta1)
        return (this.adjacencyList[sta2][j].line)
  }
  return -1
}
getStationLine(stationName){
  return this.colorN[stationName];
}
}

//Chooses station array based on input
function lineChoose(linein) {
  var line = []
  if (linein == 'blue')
    line = blueline;
  else if (linein == 'bluebranch')
    line = bluebranchline;
  else if (linein == 'magenta')
    line = magentaline;
  else if (linein == 'yellow')
    line = yellowline;
  else if (linein == 'violet')
    line = violetline;
  else if (linein == 'red')
    line = redline;
  else if (linein == 'green')
    line = greenline;
  else if (linein == 'greenbranch')
    line = greenbranchline;
  else if (linein == 'pink')
    line = pinkline;
  else if (linein == 'pinkbranch')
    line = pinkbranchline;
  else if (linein == 'orange')
    line = orangeline;
  else if (linein == 'aqua')
    line = aqualine;
  else if (linein == 'grey')
    line = greyline;
  else if (linein == 'rapid')
    line = rapidline
  else if (linein == 'rapidloop')
    line = rapidloopline
  else
    line = 0;
  return line;
}

//Gets last station on line in direction of traversal
function getLast(path, interchange, line1, line2) {
  var line
  var linein
  var out = [];
  linein = line1[0]

  //Bluebranch at Yamuna Bank Handler
  if (linein == 'bluebranch' && interchange[0] == 'Yamuna Bank') {
    out.push('Dwarka Sector 21');
  }
  //Greenbranch at Ashok Park Main Handler
  else if (linein == 'greenbranch' && interchange[0] == 'Ashok Park Main') {
    out.push('Brigadier Hoshiyar Singh');
  }
  else if (linein == 'rapid') {
    var startLoop=1
    var endLoop=1
    
    for(var i=0; i<rapidline.length; i++){
      if(rapidline[i]==path[0]) {
        startLoop=0
      }
      if(rapidline[i]==path[path.length-1]) {
        endLoop=0
      }
    }
    console.log("S:" + startLoop + " E:" + endLoop)
    if(startLoop==1) {
      if(endLoop ==1) {
        out.push(getLastCalcStart(rapidloopline, path, interchange));
      }
      else
        out.push("Sector 55–56")
    }

    else if(startLoop==0 && endLoop ==1) {
      out.push("Phase 3")
    }
    else {
      line = lineChoose(linein)
    out.push(getLastCalcStart(line, path, interchange));
    }

  }

  else {
    line = lineChoose(linein)
    out.push(getLastCalcStart(line, path, interchange));
  }
  if (line2.length == 0)
    return out
  for (var i = 0; i < (line2.length); i++) {
    linein = line2[i]

    line = lineChoose(linein)
    out.push(getLastCalc(line, path, interchange[i], interchange[i + 1]))
  }
  return out
}

//Last station calculator first line
function getLastCalcStart(line, path, interchange) {
  var startPos = 1000
  var endPos = 1000
  if (line == 0)
    return 0
  for (var i = 0; i <= line.length; i++) {
    //startpos
    if (line[i] == path[0])
      startPos = i;
    //endpos
    if (interchange.length == 0) {
      if (line[i] == path[path.length - 1])
        endPos = i
    }
    else if (line[i] == interchange[0])
      endPos = i;
  }
  console.log("start:" + startPos + " end:" + endPos)
  return comparePos(startPos, endPos, line)
}

//Last station calculator for all lines except first
function getLastCalc(line, path, interchange, nextInterchange) {
  var startPos = 1000
  var endPos = 1000
  if (line == 0)
    return 0
  for (var j = 0; j <= line.length; j++) {
    //startpos
    if (line[j] == interchange)
      startPos = j;
    //endpos
    if (nextInterchange == undefined) {
      if (line[j] == path[path.length - 1])
        endPos = j;
    }
    else if (line[j] == nextInterchange) {
      endPos = j;
    }
  }
  return comparePos(startPos, endPos, line)
}

//Returns station based on comparisons
function comparePos(startPos, endPos, line) {
  //Out of line start handler
  if (startPos == 1000) {
    if (line == blueline)
      return 'Dwarka Sector 21'
    else if (line == bluebranchline)
      return 'Vaishali'
    else if (line == greenline)
    return 'Brigadier Hoshiyar Singh'
  else if (line == greenbranchline)
    return 'Kirti Nagar'
  }
  //Out of line end handler
  if (endPos == 1000) {
    if (line == blueline)
      return 'Vaishali';
    else if (line == bluebranchline)
      return 'Dwarka Sector 21'
      else if (line == greenline)
    return 'Kirti Nagar'
  else if (line == greenbranchline)
    return 'Brigadier Hoshiyar Singh'
  }
  if (endPos < startPos) {
    if(line == bluebranchline)
        return 'Dwarka Sector 21'
      if(line == greenbranchline)
        return 'Brigadier Hoshiyar Singh'
    return line[0]
  }
  else
    return line[line.length - 1];

}


var lines = [
  "blue",
  "bluebranch",
  "magenta",
  "yellow",
  "violet",
  "red",
  "green",
  "greenbranch",
  "pink",
  "pinkbranch",
  "orange",
  "aqua",
  "grey",
  "rapid",
  "rapidloop",
  "bus"
]

for(var i = 0; i<lines.length; i++)
{
  eval("var "  + lines[i] + "line=[]")
}



//Imports station details from JSON to line arrays
function importlines() {
  //
  //METRO LINES
  //



  //Blue Line


  blue = require("./lines/blue.json");

  for (var i = 0; i < blue.length; i++) {
    blueline[i] = blue[i]["Hindi"].toLowerCase();
  }

  for (var i = 0; i < blueline.length; i++) {
    g.addNode(blueline[i],"blue");
  }

  for (var i = 0; i < (blueline.length - 1); i++) {
    g.addEdge(blueline[i], blueline[i + 1], 2.02, "blue","metro");
  }



  //BlueBranch
  bluebranch = require("./lines/bluebranch.json");

  for (var i = 0; i < bluebranch.length; i++) {

    bluebranchline[i] = bluebranch[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < bluebranchline.length; i++) {
    //Skip Interchange
    if (bluebranchline[i] == 'yamuna bank')
      continue;
    else
      g.addNode(bluebranchline[i],"bluebranch");
  }

  for (var i = 0; i < (bluebranchline.length - 1); i++) {
    g.addEdge(bluebranchline[i], bluebranchline[i + 1], 1.875, "bluebranch","metro");
  }

  //Magenta 
  magenta = require("./lines/magenta.json");

  for (var i = 0; i < magenta.length; i++) {
    magentaline[i] = magenta[i]["25"].toLowerCase();
  }
  for (var i = 0; i < magentaline.length; i++) {
    //Skip Interchange
    if (magentaline[i] == 'janakpuri west')
      continue;
    if (magentaline[i] == 'botanical garden')
      continue;
    else
      g.addNode(magentaline[i],"magenta");
  }
  for (var i = 0; i < (magentaline.length - 1); i++) {
    g.addEdge(magentaline[i], magentaline[i + 1], 2.36, "magenta","metro");
  }

  //Yellow Line
  yellow = require("./lines/yellow.json");

  for (var i = 0; i < yellow.length; i++) {
    yellowline[i] = yellow[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < yellowline.length; i++) {
    if (yellowline[i] == 'hauz khas' || yellowline[i] == 'rajiv chowk')
      continue;
    else
      g.addNode(yellowline[i], "yellow");
  }
  for (var i = 0; i < (yellowline.length - 1); i++) {
    g.addEdge(yellowline[i], yellowline[i + 1], 2.22, "yellow","metro");
  }


  //Violet Line
  violet = require("./lines/violet.json");

  for (var i = 0; i < violet.length; i++) {

    violetline[i] = violet[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < violetline.length; i++) {
    if (violetline[i] == 'kashmere gate' || violetline[i] == 'mandi house' || violetline[i] == 'central secretariat' || violetline[i] == 'kalkaji mandir')
      continue;
    else
      g.addNode(violetline[i], "violet");
  }
  for (var i = 0; i < (violetline.length - 1); i++) {
    g.addEdge(violetline[i], violetline[i + 1], 2.24, "violet","metro");
  }



  //red Line
  red = require("./lines/red.json");

  for (var i = 0; i < red.length; i++) {

    redline[i] = red[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < redline.length; i++) {
    if (redline[i] == 'kashmere gate')
      continue;
    else
      g.addNode(redline[i], "red");
  }
  for (var i = 0; i < (redline.length - 1); i++) {
    g.addEdge(redline[i], redline[i + 1], 2.03, "red","metro");
  }



  //green Line
  green = require("./lines/green.json");

  for (var i = 0; i < green.length; i++) {
    greenline[i] = green[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < greenline.length; i++) {
    if (greenline[i] == 'inderlok')
      continue;
    else
      g.addNode(greenline[i], "green");
  }
  for (var i = 0; i < (greenline.length - 1); i++) {
    g.addEdge(greenline[i], greenline[i + 1], 2.49, "green","metro");
  }


  //greenbranch Line
  greenbranch = require("./lines/greenbranch.json");

  for (var i = 0; i < greenbranch.length; i++) {
    greenbranchline[i] = greenbranch[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < greenbranchline.length; i++) {
    if (greenbranchline[i] == 'kirti nagar' || greenbranchline[i] == 'ashok park main')
      continue;
    else
      g.addNode(greenbranchline[i], "greenbranch");
  }
  for (var i = 0; i < (greenbranchline.length - 1); i++) {
    g.addEdge(greenbranchline[i], greenbranchline[i + 1], 1.33, "greenbranch","metro");
  }

  //pink Line
  pink = require("./lines/pink.json");

  for (var i = 0; i < pink.length; i++) {
    pinkline[i] = pink[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < pinkline.length; i++) {
    if (pinkline[i] == 'azadpur' || pinkline[i] == 'netaji subhash place' || pinkline[i] == 'rajouri garden' || pinkline[i] == 'ina' || pinkline[i] == 'lajpat nagar' || pinkline[i] == 'mayur vihar – i')
      continue;
    else
      g.addNode(pinkline[i], "pink");
  }
  for (var i = 0; i < (pinkline.length - 1); i++) {
    g.addEdge(pinkline[i], pinkline[i + 1], 2.69, "pink","metro");
  }

  //pinkbranch Line
  pinkbranch = require("./lines/pinkbranch.json");

  for (var i = 0; i < pinkbranch.length; i++) {
    pinkbranchline[i] = pinkbranch[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < pinkbranchline.length; i++) {
    if (pinkbranchline[i] == 'anand vihar' || pinkbranchline[i] == 'karkarduma' || pinkbranchline[i] == 'welcome')
      continue;
    else
      g.addNode(pinkbranchline[i], "pinkbranch");
  }
  for (var i = 0; i < (pinkbranchline.length - 1); i++) {
    g.addEdge(pinkbranchline[i], pinkbranchline[i + 1], 2.43, "pinkbranch","metro");
  }

  //Orange
  orange = require("./lines/orange.json");

  for (var i = 0; i < orange.length; i++) {
    orangeline[i] = orange[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < orangeline.length; i++) {
    if (orangeline[i] == 'new delhi' || orangeline[i] == 'dwarka sector 21')
      continue;
    else
      g.addNode(orangeline[i], "orange");
  }
  for (var i = 0; i < (orangeline.length - 1); i++) {
    g.addEdge(orangeline[i], orangeline[i + 1], 5.2, "orange","metro");
  }

  




  //Aqua Line

  aqua = require("./lines/aqua.json");

  for (var i = 0; i < aqua.length; i++) {
    aqualine[i] = aqua[i]["Hindi"].toLowerCase();
  }

  for (var i = 0; i < aqualine.length; i++) {
    g.addNode(aqualine[i], "aqua");
  }

  for (var i = 0; i < (aqualine.length - 1); i++) {
    g.addEdge(aqualine[i], aqualine[i + 1], 2.86, "aqua","metro");
  }



  //Grey Line

  grey = require("./lines/grey.json");

  for (var i = 0; i < grey.length; i++) {
    greyline[i] = grey[i]["2"].toLowerCase();
  }


  for (var i = 0; i < greyline.length; i++) {
    if (greyline[i] == 'dwarka')
      continue;
    else
    g.addNode(greyline[i], "grey");
  }

  for (var i = 0; i < (greyline.length - 1); i++) {
    g.addEdge(greyline[i], greyline[i + 1], 2.10, "grey","metro");
  }

  //rapid
  rapid = require("./lines/rapid.json");

  for (var i = 0; i < rapid.length; i++) {
    rapidline[i] = rapid[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < rapidline.length; i++) {
    if (rapidline[i] == 'sikanderpur')
      continue;
    else
      g.addNode(rapidline[i], "rapid","darkblue");
  }
  for (var i = 0; i < (rapidline.length - 1); i++) {
    g.addEdge(rapidline[i], rapidline[i + 1], 5.2, "rapid","metro");
  }

  //rapidloop
  rapidloop = require("./lines/rapidloop.json");
  for (var i = 0; i < rapidloop.length; i++) {
    rapidloopline[i] = rapidloop[i]["Hindi"].toLowerCase();
  }
  for (var i = 0; i < rapidloopline.length; i++) {
      g.addNode(rapidloopline[i],"rapidloop");
  }



  for (var i = 0; i < (rapidloopline.length - 1); i++) {
    g.addEdgeSingle(rapidloopline[i], rapidloopline[i + 1], 5.2, "rapid","metro");
  }

  
  //Dhaula Kuan - South Campus Connection
  g.addEdge("dhaula kuan", "durgabai deshmukh south campus", 18, "1.2km Skywalk","metro");

  //Noida Sec 52 - Noida Sec 51
  g.addEdge("noida sector 52", "noida sector 51", 12, "300m Walkway/Free e-Rickshaw","metro");

  //Aqua Line Looper

  g.addEdgeSingle("phase 3", "phase 2", 5.2, "rapid","metro");
  g.addEdgeSingle("phase 2", "vodafone belvedere towers", 5.2, "rapid","metro");

  let bus = require("./lines/bus.json");

  for (var i = 0; i < bus.length;i++) {
    busline[i] = bus[i]["Bus_Stop"].toLowerCase();
  }


  for (var i = 0; i < busline.length; i++) {
    g.addNode(busline[i], "black");
  }

  for (var i = 0; i < (bus.length - 1); i++) {
    if(bus[i]["Bus_Name"]==bus[i+1]["Bus_Name"]){
      g.addEdge(busline[i], busline[i + 1], 4.10, "black","bus");
    }
  }

}


//Create new graph
let g = new Graph();
//Import lines   
importlines();


//Firebase function exporter



//shortestRouteBidirectionalDjikstraCall
start = performance.now();
// Call your algorithm here
console.log("\nShortest Path using BidirectionalDjikstra "+"\n",g.shortestRouteBidirectionalDijkstra("faridabad old", "khan market"));
end = performance.now();
executionTime = end - start;
console.log(`Algorithm execution time: ${executionTime} milliseconds`);



// //shortestRouteBFS
// var start = performance.now();
// // Call your algorithm here
// console.log("Shortest Path using BFS "+"\n",g.shortestRouteBFS("faridabad old", "khan market"));
// var end = performance.now();
// var executionTime = end - start;
// console.log(`Algorithm execution time: ${executionTime} milliseconds`);


//shortestRouteDjikstraCall
start = performance.now();
// Call your algorithm here
console.log("\nShortest Path using Djikstra "+"\n",g.shortestRouteDjikstra("faridabad old", "khan market"));
end = performance.now();
executionTime = end - start;
console.log(`Algorithm execution time: ${executionTime} milliseconds`);




// const rl = readline.createInterface({
//   input: process.stdin,
//   output: process.stdout
// });
// function getUserInput(question){
//   return new Promise((resolve)=>{
//     rl.question(question,(answer)=>{
//       resolve(answer.trim());
//     });
//   });
// }

// async function main(){
//   const source=await getUserInput('Enter the source place: ');
//   const destination=await getUserInput('Enter the destination place: ');
//   console.log("\nShortest Path using BidirectionalDjikstra "+"\n",g.shortestRouteBidirectionalDijkstra(source, destination));
//   rl.close();
// }
// main();
//console.log("Shortest Path using BFS "+"\n",g.shortestRouteBFS("aiims", "netaji subhash institute of technology"));
//console.log("\nShortest Path using Djikstra "+"\n",g.shortestRouteDjikstra("aiims", "netaji subhash institute of technology").path);
//console.log("\nShortest Path using bidirectionalSearch "+"\n",g.bidirectionalSearch("aiims", "netaji subhash institute of technology"));
//AdjList of Station
//g.printGraph("Rajouri Garden");

//Order of Lining:
//Blue
//BlueBranch
//Magenta
//Yellow
//Violet
//Red
//Green
//Green Branch
//Pink
//Pink Branch
//Orange
//Aqua
//Grey