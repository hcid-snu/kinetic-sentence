/*
# positive
[v] scale up : x0 = x1 ; s0 = 0 -> s1 = 1
[] wiggly scale : scale up(1.5 - 2.0) and down() repeatedly 2-4 times then scale back(1.0)
[] happy : rotate -10 10 and go up and down sequentially, repeated

# neutral
[v] Drop in characters 
[v] Fade out by characters 
[v] Fade up characters
[v] Spin in

# negative
[v] Raining characters out
[v] scale down
[] angry : move zigzag, repeated

*/
(function() {

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

    d3.selection.prototype.rotate 
    = d3.selection.enter.prototype.rotate 
    = function(from, to) {
        var self = this;
        self.each(function(d,i) {
            d.rot = {from:from, to:to}
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
    
    d3.selection.prototype.dropIn 
    = d3.selection.enter.prototype.dropIn
    = function(from, duration, delayWord, delayLetter) {
        var self = this;
        self.move(0, -from, 0, 0)
        .run(duration, delayWord, delayLetter );
    }

    d3.selection.prototype.fadeOut
    = d3.selection.enter.prototype.fadeOut
    = function(duration, delayWord, delayLetter) {
        var self = this;
        self.fade(1,0)
        .run(duration, delayWord, delayLetter);
    }

    d3.selection.prototype.fadeIn
    = d3.selection.enter.prototype.fadeIn
    = function(duration, delayWord, delayLetter) {
        var self = this;
        self.fade(0,1)
        .run(duration, delayWord, delayLetter);
    }


    d3.selection.prototype.spinIn
    = d3.selection.enter.prototype.spinIn
    = function(degree, x0, y0, duration, delayWord, delayLetter) {
        var self = this;
        self.rotate(-degree, 0).move(x0, -y0, 0, 0)
        .run(duration, delayWord, delayLetter);
    }

    d3.selection.prototype.scaleDown
    = d3.selection.enter.prototype.scaleDown
    = function(duration, delayWord, delayLetter) {
        var self = this;
        self.scale(1.0, 0)
        .run(duration, delayWord, delayLetter);
    }

    d3.selection.prototype.scaleUp
    = d3.selection.enter.prototype.scaleUp
    = function(duration, delayWord, delayLetter) {
        var self = this;
        self.scale(0, 1)
        .run(duration, delayWord, delayLetter);
    }

    d3.selection.prototype.run 
    = d3.selection.enter.prototype.scale 
    = function(duration, delayWord, delayLetter) {
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

            var rot = 0;
            if (d.rot != undefined) {
                rot = d.rot.from;
            }
            return "translate(" + [(d.x - totalW * 0.5 + l.posX + x ), d.y + y] + ")rotate(" + (d.rotate + rot) + ")scale(" + [scale, scale] + ")";
            //return "translate(" + [(d.x - totalW * 0.5 + l.posX* scale + x ), d.y + y] + ")rotate(" + (d.rotate + rot) + ")scale(" + [scale, scale] + ")";
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

            var rot = 0;
            if (d.rot != undefined) {
                rot = d.rot.to;
            }
            return "translate(" + [(d.x - totalW * 0.5 + l.posX + x), d.y + y] + ")rotate(" + d.rotate  + ")scale(" + [scale, scale] + ")"
        })
        .duration(duration)
        .delay(function(l, li) {
            return delayWord + delayLetter * li ;
        });
        return self;
    };

    function chain() {
        
    }
})();