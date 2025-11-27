    class Node { 
      constructor(value) { 
        this.value = value; 
        this.left = null; 
        this.right = null; 
        this.x = 0; 
        this.y = 0; 
      } 
    } 
 
    class BST { 
      constructor() { 
        this.root = null; 
      } 

      insert(value) { 
        this.root = this._insert(this.root, value); 
      } 

      _insert(node, value) { 
        if (!node) 
            return new Node(value); 
        if (value < node.value) 
            node.left = this._insert(node.left, value); 
        else if (value > node.value) 
            node.right = this._insert(node.right, value); 
        return node; 
      } 

      delete(value) { 
        this.root = this._delete(this.root, value); 
      } 

      _delete(node, value) { 
        if (!node)  
            return null; 
        if (value < node.value)  
            node.left = this._delete(node.left, value); 
        else if (value > node.value)  
            node.right = this._delete(node.right, value); 
        else { 
          if (!node.left) return node.right; 
          if (!node.right) return node.left; 
          let minNode = this._min(node.right); 
          node.value = minNode.value; 
          node.right = this._delete(node.right, minNode.value); 
        } 
        return node; 
      } 

      _min(node) { 
        while (node.left) node = node.left; 
        return node; 
      } 

      search(value) { 
        return this._search(this.root, value); 
      } 

      _search(node, value) { 
        if (!node) return null; 
        if (value === node.value) return node; 
        if (value < node.value) return this._search(node.left, value); 
        return this._search(node.right, value); 
      } 

      inorder(node, list) { 
        if (!node) return; 
        this.inorder(node.left, list); 
        list.push(node); 
        this.inorder(node.right, list); 
      } 

      preorder(node, list) { 
        if (!node) return; 
        list.push(node); 
        this.preorder(node.left, list); 
        this.preorder(node.right, list); 
      } 

      postorder(node, list) { 
        if (!node) return; 
        this.postorder(node.left, list); 
        this.postorder(node.right, list); 
        list.push(node); 
      } 

      levelorder(node, list) { 
        if (!node) return; 
        let queue = [node]; 
        while (queue.length) { 
          let n = queue.shift(); 
          list.push(n); 
          if (n.left) queue.push(n.left); 
          if (n.right) queue.push(n.right); 
        } 
      } 
    } 
 
    let bst; 
    let svg = document.getElementById("tree"); 
    let messageBox = document.getElementById("message"); 
 
    function resetTree() { 
      bst = new BST(); 
      [50,30,70,20,40,60,80].forEach(v => bst.insert(v)); 
      drawTree(); 
      messageBox.textContent = ""; 
      messageBox.className = ""; 
    } 
 
    function insertNode() { 
      let value = parseInt(document.getElementById("value").value); 
      if (!isNaN(value)) { 
        bst.insert(value); 
        drawTree(value); 
        showMessage(`Inserted ${value}`, "success"); 
      } 
    } 
 
    function deleteNode() { 
      let value = parseInt(document.getElementById("value").value); 
      if (!isNaN(value)) { 
        bst.delete(value); 
        drawTree(); 
        showMessage(`Deleted ${value} (if present)`, "info"); 
      } 
    } 
 
    function searchNode() { 
      let value = parseInt(document.getElementById("value").value); 
      let node = bst.search(value); 
      if (node) { 
        animateTraversal([node]); 
        showMessage(`Element ${value} found`, "success"); 
      } else { 
        showMessage(`The element ${value} is not in the tree`, "error"); 
      } 
    } 
 
    function traverseTree() { 
      let order = document.getElementById("traversal").value; 
      let list = []; 
      if (order === "inorder") bst.inorder(bst.root, list); 
      if (order === "preorder") bst.preorder(bst.root, list); 
      if (order === "postorder") bst.postorder(bst.root, list); 
      if (order === "levelorder") bst.levelorder(bst.root, list); 
      animateTraversal(list); 
      showMessage(`${order} traversal executed`, "info"); 
    } 
 
    function animateTraversal(list) { 
      let i = 0; 
      function step() { 
        if (i > 0) unhighlightNode(list[i-1]); 
        if (i < list.length) { 
          highlightNode(list[i]); 
          i++; 
          setTimeout(step, 800); 
        } 
      } 
      step(); 
    } 
 
    function highlightNode(node) { 
      let el = document.getElementById("node-" + node.value); 
      if (el) el.classList.add("highlight"); 
    } 
    
    function unhighlightNode(node) { 
      let el = document.getElementById("node-" + node.value); 
      if (el) el.classList.remove("highlight"); 
    } 
 
    function drawTree(insertedValue=null) { 
      svg.innerHTML = ""; 
      if (!bst.root) return; 
      function setCoords(node, depth, x1, x2) { 
        if (!node) return; 
        node.x = (x1+x2)/2; 
        node.y = depth*80+40; 
        setCoords(node.left, depth+1, x1, node.x); 
        setCoords(node.right, depth+1, node.x, x2); 
      } 
      setCoords(bst.root, 0, 0, svg.clientWidth); 
 
    function drawEdges(node) { 
        if (!node) return; 
        if (node.left) { 
          drawLine(node, node.left); 
          drawEdges(node.left); 
        } 
        if (node.right) { 
          drawLine(node, node.right); 
          drawEdges(node.right); 
        } 
      } 
      function drawLine(n1, n2) { 
        let line = document.createElementNS("http://www.w3.org/2000/svg","line"); 
        line.setAttribute("x1", n1.x); 
        line.setAttribute("y1", n1.y); 
        line.setAttribute("x2", n2.x); 
        line.setAttribute("y2", n2.y); 
        line.setAttribute("stroke","#888"); 
        svg.appendChild(line); 
      } 
 
      drawEdges(bst.root); 
 
      function drawNodes(node) { 
        if (!node) return; 
        let g = document.createElementNS("http://www.w3.org/2000/svg","g"); 
        g.setAttribute("class","node" + (node.value===insertedValue?" inserted":"")); 
        g.setAttribute("id","node-"+node.value); 
 
        let circle = document.createElementNS("http://www.w3.org/2000/svg","circle"); 
        circle.setAttribute("cx", node.x); 
        circle.setAttribute("cy", node.y); 
        circle.setAttribute("r",20); 
        g.appendChild(circle); 
 
        let text = document.createElementNS("http://www.w3.org/2000/svg","text"); 
        text.setAttribute("x", node.x); 
        text.setAttribute("y", node.y+5); 
        text.setAttribute("text-anchor","middle"); 
        text.setAttribute("fill","#e0e0e0"); 
        text.textContent = node.value; 
        g.appendChild(text); 
        svg.appendChild(g); 
        drawNodes(node.left); 
        drawNodes(node.right); 
        } 
        drawNodes(bst.root); 
    } 

    function showMessage(text, type) { 
        messageBox.textContent = text; 
        messageBox.className = type; 
    } 

    resetTree();
