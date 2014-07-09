/*

scale up : x0 = x1 ; s0 = 0 -> s1 = 1
wiggly scale : scale up(1.5 - 2.0) and down() repeatedly 2-4 times then scale back(1.0)

*/
(function() {

    function setPosition(selection, self) {
        var totalW = -1;
        var posX = 0;
        var i = self.attr("class").split(" ")[1]
        var d = self.datum();
        
        selection.each(function(l, li) {
            var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
            totalW += thisW;
        })
        .attr("transform", function(l, li) {
            
            if (totalW < 0 ) {
              d.letters.forEach(function(d,i) {
                var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              })
            }
            if (li > 0) {
              var lastW = document.getElementById("text-" + i + "-" + (li-1)).getBBox().width;
              var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              posX += (lastW + thisW) * 0.5 ;  
            } else {
              var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              posX += thisW * 0.5  ;  
            }
            return "translate(" + [(d.x - totalW * 0.5 + posX), d.y] + ")rotate(" + d.rotate + ")";
          })
    }

    d3.selection.prototype.fade 
    = d3.selection.enter.prototype.fade 
    = function(from, to) {
        var self = this;
        self.each(function(d,i) {
            d.fade = {from:from, to:to}
        })
        return self;
    };
    
    d3.selection.prototype.scale 
    = d3.selection.enter.prototype.scale 
    = function(from, to) {
        var self = this;
        self.each(function(d,i) {
            d.scale = {from:from, to:to}
        })
        return self;
    };

    d3.selection.prototype.move 
    = d3.selection.enter.prototype.move 
    = function(x0, y0, x1, y1) {
        var self = this;
        self.each(function(d,i) {
            d.move = {x0:x0, y0:y0, x1:x1, y1:y1};
        })
        return self;
    };
    

    d3.selection.prototype.run 
    = d3.selection.enter.prototype.scale 
    = function(duration, delay) {
        var self = this;
        var i = self.attr("class").split(" ")[1]
        var d = self.datum();
        var totalW = -1;
        var posX = 0;

        self
        .style("font-size", function(d){
            return d.size + "px";
        })
        .selectAll("text")
        .style("opacity", function(l){
            if (d.fade != undefined) return d.fade.from
            else return 1.0
        })
        .each(function(l, li) {
            var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
            totalW += thisW;
        })
        .attr("transform", function(l, li) {
            
            if (totalW < 0 ) {
              d.letters.forEach(function(d,i) {
                var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              })
            }
            if (li > 0) {
              var lastW = document.getElementById("text-" + i + "-" + (li-1)).getBBox().width;
              var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              posX += (lastW + thisW) * 0.5 ;  
            } else {
              var thisW = document.getElementById("text-" + i + "-" + li).getBBox().width;
              posX += thisW * 0.5  ;  
            }

            l.posX = posX;

            var x = y = 0;
            if (d.move !== undefined) {
                x = d.move.x0;
                y = d.move.y0;
            }
            var scale = 1.0;
            if (d.scale !== undefined) {
                scale = d.scale.from;
            }
            return "translate(" + [(d.x - totalW * 0.5 + l.posX* scale + x ), d.y + y] + ")rotate(" + d.rotate + ")scale(" + [scale, scale] + ")";
        })
        .transition()
        .style("opacity", function(l){
            if (d.fade != undefined) return d.fade.to
            else return 1.0
        })
        .attr("scale", function(l){
            if (d.scale != undefined) return d.scale.to;
            else return 1.0
        })
        .attr("transform", function(l, li) {
            var x = y = 0;
            if (d.move !== undefined) {
                x = d.move.x1;
                y = d.move.y1;
            }
            var scale = 1.0;
            if (d.scale !== undefined) {
                scale = d.scale.to;
            }
            return "translate(" + [(d.x - totalW * 0.5 + l.posX* scale + x), d.y + y] + ")rotate(" + d.rotate  + ")scale(" + [scale, scale] + ")"
        })
        .duration(duration)
        .delay(function(l, li) {
            return delay *i ;
        });

      
        /*
        self.style("opacity", function(d){
            if (d.fade != undefined) return d.fade.from
            else return 1.0
        })
        .style("font-size", function(d){
            if (d.scale != undefined) return d.scale.from + "px";
            else return d.size + "px";
        })
        .call(function(selection) {
            setPosition(selection,self);
        })
        
        .transition()
        .style("opacity", function(d){
            if (d.fade != undefined) return d.fade.to
            else return 1.0
        })
        .style("font-size", function(d){
            if (d.scale != undefined) return d.scale.to + "px";
            else return d.size+ "px";
        })
        .call(function(selection) {
            setPosition(selection,self);
        })
        .duration(duration)
        .delay(delay)
        return self;
        */
        return self;
    };
})();