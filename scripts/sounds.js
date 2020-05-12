// sounds

var s1bool  = 0;            //  is s1 on or off
var context = new AudioContext();
var s1; 

function sound1() {

        if (s1bool == 0) {

            s1 = context.createOscillator();
            s1.type = "sine";
            s1.connect(context.destination);
            s1.start();
            s1bool = 1;

        }  else {

            s1.stop();  
            s1bool = 0;

        }   

}  





