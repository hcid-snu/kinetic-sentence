var Inputs= function() {
  var self = this;
  this.width = 1000;
  this.height = 600;
  this.font = "Helvetica";
  this.message = "Words cannot express my feeling for you."
  this.words_energy = new Object();
  this.words_type = new Object();
  this.emotion = "Positive"//"Neutral";
  this.types = {Negative:['fadeIn', 'scaleDown', 'raining', 'jitter', 'jitter2'], Positive:['fadeIn', 'scaleUp', 'wigglyScale', 'bounce']}
  this.neuTypes = ['fadeIn']//['dropIn', 'fadeIn', 'fadeOut', 'spinIn']
  this.negTypes = ['fadeIn', 'scaleDown', 'raining', 'jitter', 'jitter2']
  this.posTypes = ['fadeIn', 'scaleUp', 'wigglyScale', 'bounce']
  this.fill = d3.scale.category20();


  this.update = function() {
     this.words = this.message.split(" ");
     this.updateEnergy();
     this.updateType();
  }

  this.updateEnergy = function() {
    for (k in this.words_energy) delete this.words_energy[k]
    this.words.forEach(function(w,i) {
       self.words_energy[i + ' - ' + w] = 5;
     });
  }

  this.updateType = function() {
    for (k in this.words_type) delete this.words_type[k]
    this.words.forEach(function(w,i) {
       self.words_type[i + ' - ' + w] = 'fadeIn'
     });
  }
  

  this.getType = function(i) {
    /*
    if(emotion==='Positive') return self.posTypes[Math.floor(Math.random() * self.posTypes.length)]
    else if(emotion==='Negative') return self.negTypes[Math.floor(Math.random() * self.negTypes.length)]
    else return self.neuTypes[Math.floor(Math.random() * self.neuTypes.length)]
      */
    return self.words_type[i + ' - ' + self.words[i]]
  }

  this.getEnergy = function(i) {
    return self.words_energy[i + ' - ' + self.words[i]]
  }



  this.generate = function() {
    this.words = this.message.split(" ");
    d3.layout.cloud().size([this.width, this.height])
      .words(self.words.map(function(d,i) {
        return {text: d, energy:self.getEnergy(i) ,size: 36 + self.getEnergy(i) * 8, type:self.getType(i)}
      }))
      .padding(-.5)
      .rotate(function() { return 0;/*~~(Math.random() * 2) * 90;*/ })
      .font(this.font)
      .fontSize(function(d) { return d.size; })
      .spiral(newRectangularSpiral)
      .on("end", this.draw)
      .start();
  }

  function getDuration(base, unit, energy) {
    return base + (5-energy) * unit;
  }

  this.setMotion = (function() {
    return function (self,d, delays) {
      if (d.type === 'dropIn') {
        var duration = getDuration(200, 20, d.energy)
        d3.select(self).dropIn(1000, duration, delays, duration);
        return delays += duration*(d.letters.length+1);
      } else if (d.type === 'fadeIn'){
        var duration = 600//getDuration(600, 40, d.energy)
        var delayLetter = 0; 
        d3.select(self).fadeIn(duration, delays, delayLetter);
        return delays += duration//delayLetter*(d.letters.length)
      } else if (d.type ==='fadeOut') {
        var duration = getDuration(400, 40, d.energy);
        var delayLetter = 200; 
        d3.select(self).fadeOut(duration, delays, delayLetter); 
        return delays += delayLetter*(d.letters.length+1);
      } else if(d.type === 'spinIn') {
        var duration = getDuration(400, 40, d.energy);
        d3.select(self).spinIn(-120, 1000-d.x, -d.y, duration, delays, 300);
        return delays += duration*(d.letters.length+1); 
      } else if (d.type ==='raining') {
        var duration = getDuration(200, 20, d.energy);
        var delayLetter = getDuration(200, 20, d.energy);
        d3.select(self).raining(d.size*0.7, duration, delays, delayLetter); 
        return delays += duration * d.letters.length + delayLetter * .25 * d.letters.length + 500;
      } else if (d.type === 'scaleUp') {
        var duration = getDuration(900, 120, d.energy);
        d3.select(self).scaleUp(duration, delays, 0); 
        return delays += duration + 500;
      } else if (d.type === 'scaleDown') {
        var duration = getDuration(1000, 120, d.energy);
        d3.select(self).scaleDown(duration, delays, 0); 
        return delays += duration + 500;
      } else if (d.type === 'jitter') {
        var duration = getDuration(100, 10, d.energy);
        d3.select(self).jitter(getDuration(1.2, -.04, d.energy), getDuration(60, -8, d.energy), 4, 8, duration, delays);
        return delays += duration * 12 + 800;
      } else if (d.type === 'bounce') {
        var duration = getDuration(200, 20, d.energy);
        d3.select(self).bounce(duration, delays); 
        return delays += (duration * d.letters.length) + 500 ;
      } else if (d.type === 'wigglyScale') {
        var duration = getDuration(150, 10, d.energy);
        d3.select(self).wigglyScale(getDuration(30, -4, d.energy), getDuration(-60, 8, d.energy), duration, delays, 200); 
        return delays += duration * d.letters.length*3;
      } else if (d.type === 'jitter2') {
        var duration = getDuration(40, 4, d.energy);
        d3.select(self).jitter(getDuration(1.3, -.05, d.energy), getDuration(16, -2, d.energy), .05, 12, duration, delays);
        return delays += duration * 12 + 800;
      }
    }
  })();

  this.draw = function (words) {
    var delays = 1000;
    $('#canvas>svg').remove();
    d3.select("#canvas").append("svg")
        .attr("width", self.width)
        .attr("height", self.height)
      .append("g")
        .attr("transform", "translate("+ [self.width/2, self.height/2 + 10] + ")")
      .selectAll("g")
        .data(words)
      .enter().append("g")
        .attr("class", function(d,i) {return "word " + i;})
        .each(function(d,i) {
          lettering(d);
          d3.select(this)
            .selectAll("text")
              .data(d.letters)
            .enter().append("text")
              .attr("id", function(l, li) {return "text-" + i + "-" + li})
              .text(function(l) {return l.letter})
              .style("font-family", self.font)
              .style("fill", function(l) { return '#111';})//return self.fill(i); })
              .attr("text-anchor", "middle")
          d.delays = self.setMotion(this,d,delays);
          delays = d.delays;
        })
        .each(function(d,i) {
          d.totalDelays = delays;
          self.setMotion(this, d, d.delays);
        })

      
      //translate(" + [,] + ")rotate(" + (d.rotate +) + ")scale(" + [scale, scale] + ")"
  }

  function linearSpiral(size) {
    var dy = 4,
        dx = dy * size[0] / size[1];
        x = 0;
        y = 0;
    return function(t) {
      x += dx *t;
      y += dy *t;
      return [x,y];
    };
    /*
    noise(t)
    x = noise(t) % width
    y = noise(t) / width
    */
  }

  function newRectangularSpiral(size) {
    var dy = 2,
        dx = dy * size[0] / size[1] * 2.5 , // width/height * dy
        x = 0,
        y = 0;
    return function(t) {
      var sign = t < 0 ? -1 : 1;
      // See triangular numbers: T_n = n * (n + 1) / 2.
      switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
        case 0:  x += dx; break;
        case 1:  y += dy; break;
        case 2:  x -= dx; break;
        default: y -= dy; break;
      }
      return [x, y];
    };
  }


  function quarterArchimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function(t) {
      //var theta = t % (2*Math.PI);
      //t = t % (2*Math.PI);
      //theta = Math.max(Math.min(Math.PI*0.1, theta), Math.PI*0.35);
      return [Math.abs(e * (t *= .1) * Math.cos(t)), Math.abs(t * Math.sin(t))];
    };
  }

  
  function rectangularSpiral(size) {
    var dy = 4,
        dx = dy * size[0] / size[1], // width/height * dy
        x = 0,
        y = 0;
    return function(t) {
      var sign = t < 0 ? -1 : 1;
      // See triangular numbers: T_n = n * (n + 1) / 2.
      switch ((Math.sqrt(1 + 4 * sign * t) - sign) & 3) {
        case 0:  x += dx; break;
        case 1:  y += dy; break;
        case 2:  x -= dx; break;
        default: y -= dy; break;
      }
      return [x, y];
    };
  }

  function archimedeanSpiral(size) {
    var e = size[0] / size[1];
    return function(t) {
      return [e * (t *= .1) * Math.cos(t), t * Math.sin(t)];
    };
  }

  function lerp(a, b, f){
      return a + f * (b - a);
  }
  
  function lettering(word) {
    var word_letters = [], word_letter_objs = [];
    if (word.text) {
      word_letters = word.text.split('');
    }
    word_letters.forEach(function(l) {
      word_letter_objs.push({letter:l})
    });
    word.letters = word_letter_objs;
  }
}