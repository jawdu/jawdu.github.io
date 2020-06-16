// sounds

// PeriodicWave




var sBool  = 0;            //  on/off button
var context = new AudioContext();
var s1, s2, s3, s4;
var f1 = 400, f2 = 53, f3 = 6, f4 = 14; 

function sound1() {

        if (sBool == 0) {

            s1 = context.createOscillator(); 
            s2 = context.createOscillator();
            s3 = context.createOscillator();
            s4 = context.createOscillator();

            g1 = context.createGain();
            g2 = context.createGain();
            g3 = context.createGain();
            g4 = context.createGain();
              
            //s1.detune.value  = 500;  
            s1.detune.value = f1;        
            s2.detune.value = f2;        
            s3.detune.value = f3;        
            s4.detune.value = f4;        

            s1.connect(g1);
            s2.connect(g2);
            s3.connect(g3);
            s4.connect(g4);
   
            g1.connect(context.destination);  // s1.type = "sine";
            g2.connect(context.destination);  // s2.type = "square";
            g3.connect(context.destination);  // s3.type = "triangle";
            g4.connect(context.destination);  // s4.type = "sawtooth";
       
            //s1.frequency.value = f1;        
            //s2.frequency.value = f2;        
            //s3.frequency.value = f3;        
            //s4.frequency.value = f4;        

            s1.start(0); s2.start(0); s3.start(0); s4.start(0);


            for  (let n = 0;  n < 100; n++) {

            // just gonna have to start writing numbers out
            // basically for loop is really shitty way to do this

                a = Math.random() + 0.0000001;
                b = Math.random() + 0.0000001;
                c = Math.random() + 0.0000001;
                d = Math.random() + 0.0000001;

                s1.detune.value = s1.detune.value + 20 * (Math.random() - 0.5);
                s2.detune.value = s2.detune.value + 20 * (Math.random() - 0.5);
                s3.detune.value = s3.detune.value + 20 * (Math.random() - 0.5);
                s4.detune.value = s4.detune.value + 20 * (Math.random() - 0.5);

                t = Math.random() * 10 + 1;

                document.getElementById("tVal").innerHTML = t + " and n " + n;

                g1.gain.exponentialRampToValueAtTime(a, context.currentTime + t);
                g2.gain.exponentialRampToValueAtTime(b, context.currentTime + t);
                g3.gain.exponentialRampToValueAtTime(c, context.currentTime + t);
                g4.gain.exponentialRampToValueAtTime(d, context.currentTime + t);

                setTimeout(tOut, t*1000)

            }

            sBool = 1;

        }  else {

            s1.stop();
            s2.stop();
            s3.stop();
            s4.stop();

            sBool = 0;

        }   

}  



function tOut() {

    // empty function

}

