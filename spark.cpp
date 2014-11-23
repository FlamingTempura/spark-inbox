#include "SparkButton/SparkButton.h"

// Create a Button named b. It will be your friend, and you two will spend lots of time together.
// You may be wondering about those two slashes and this gray text- they're called comments, and
// don't affect the code. Think of this as the voice of the narrator.
SparkButton b = SparkButton();
int brightness = 60; // up to 255

// The code in setup() runs once when the device is powered on or reset. Used for setting up states, modes, etc
void setup() {
    // Tell b to get everything ready to go
    b.begin();
    Spark.function("setProgress", setProgress);
}

void loop() {}

int setProgress(String command) {
    int val = atoi(command.c_str());
    int i;
    for (i = 0; i <= 11; i++) {
        if (i > val) {
            b.ledOff(i);
        } else if (i > 8) {
            b.ledOn(i, brightness, 0, 0);
        } else if (i > 4) {
            b.ledOn(i, brightness, brightness, 0);
        } else {
            b.ledOn(i, 0, brightness, 0);
        }
    }
}
